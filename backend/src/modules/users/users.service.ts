import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async findAll(practiceId?: string): Promise<Partial<User>[]> {
        return this.prisma.user.findMany({
            where: practiceId ? { practiceId } : undefined,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async updateUser(
        id: string,
        data: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'role' | 'status'>>,
    ): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async deleteUser(id: string): Promise<void> {
        await this.prisma.user.delete({ where: { id } });
    }
}
