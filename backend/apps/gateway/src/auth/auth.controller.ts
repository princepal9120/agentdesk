import { Controller, Post, Body, Get, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICE_NAMES, CurrentUser } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '@app/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        @Inject(SERVICE_NAMES.AUTH) private authClient: ClientProxy,
    ) { }

    @Public()
    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    async login(@Body() loginDto: LoginDto) {
        return await firstValueFrom(
            this.authClient.send('auth.login', loginDto)
        );
    }

    @Public()
    @Post('signup')
    @ApiOperation({ summary: 'User registration' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    async signup(@Body() signupDto: SignupDto) {
        return await firstValueFrom(
            this.authClient.send('auth.signup', signupDto)
        );
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'User profile retrieved' })
    async me(@CurrentUser() user: any) {
        return user;
    }
}
