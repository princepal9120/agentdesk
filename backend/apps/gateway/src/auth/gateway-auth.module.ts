import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_NAMES, SERVICE_PORTS, SERVICE_HOSTS } from '@app/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { AuthController } from './auth.controller';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m'),
                },
            }),
        }),
        ClientsModule.register([
            {
                name: SERVICE_NAMES.AUTH,
                transport: Transport.TCP,
                options: {
                    host: SERVICE_HOSTS.AUTH,
                    port: SERVICE_PORTS.AUTH,
                },
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [JwtStrategy, JwtAuthGuard],
    exports: [JwtModule, JwtAuthGuard],
})
export class GatewayAuthModule { }
