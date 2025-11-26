import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { SignUpDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import { User, UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private readonly MAX_LOGIN_ATTEMPTS = 5;
    private readonly LOCKOUT_DURATION = 15 * 60; // 15 minutes in seconds

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private redisService: RedisService,
    ) { }

    async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
        const { email, password, firstName, lastName, phone, role } = signUpDto;

        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
                phone,
                role: role || 'STAFF',
                status: UserStatus.ACTIVE,
            },
        });

        this.logger.log(`New user registered: ${user.email}`);

        // Generate tokens
        return this.generateAuthResponse(user);
    }

    async login(loginDto: LoginDto, ipAddress?: string): Promise<AuthResponseDto> {
        const { email, password } = loginDto;

        // Check rate limiting
        const rateLimitKey = `login:${email}`;
        const isAllowed = await this.redisService.checkRateLimit(rateLimitKey, this.MAX_LOGIN_ATTEMPTS, this.LOCKOUT_DURATION);

        if (!isAllowed) {
            throw new UnauthorizedException('Too many login attempts. Please try again later.');
        }

        // Find user
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new UnauthorizedException('Account is temporarily locked. Please try again later.');
        }

        // Check if account is active
        if (user.status !== UserStatus.ACTIVE) {
            throw new UnauthorizedException('Account is not active');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            // Increment login attempts
            const newAttempts = user.loginAttempts + 1;
            const updateData: any = { loginAttempts: newAttempts };

            if (newAttempts >= this.MAX_LOGIN_ATTEMPTS) {
                updateData.lockedUntil = new Date(Date.now() + this.LOCKOUT_DURATION * 1000);
            }

            await this.prisma.user.update({
                where: { id: user.id },
                data: updateData,
            });

            throw new UnauthorizedException('Invalid credentials');
        }

        // Reset login attempts on successful login
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                loginAttempts: 0,
                lockedUntil: null,
                lastLoginAt: new Date(),
            },
        });

        this.logger.log(`User logged in: ${user.email}`);

        // Generate tokens
        return this.generateAuthResponse(user);
    }

    async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
        try {
            // Verify refresh token
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });

            // Check if refresh token exists in database
            const storedToken = await this.prisma.refreshToken.findUnique({
                where: { token: refreshToken },
                include: { user: true },
            });

            if (!storedToken || storedToken.isRevoked) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            if (storedToken.expiresAt < new Date()) {
                throw new UnauthorizedException('Refresh token expired');
            }

            // Revoke old refresh token
            await this.prisma.refreshToken.update({
                where: { id: storedToken.id },
                data: { isRevoked: true },
            });

            // Generate new tokens
            return this.generateAuthResponse(storedToken.user);
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(userId: string, refreshToken?: string): Promise<void> {
        // Revoke refresh token if provided
        if (refreshToken) {
            await this.prisma.refreshToken.updateMany({
                where: { token: refreshToken, userId },
                data: { isRevoked: true },
            });
        }

        // Delete all sessions for user
        await this.prisma.session.deleteMany({
            where: { userId },
        });

        this.logger.log(`User logged out: ${userId}`);
    }

    async validateUser(userId: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || user.status !== UserStatus.ACTIVE) {
            throw new UnauthorizedException('User not found or inactive');
        }

        return user;
    }

    private async generateAuthResponse(user: User): Promise<AuthResponseDto> {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        // Generate access token
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
        });

        // Generate refresh token
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
        });

        // Store refresh token in database
        const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt,
            },
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }
}
