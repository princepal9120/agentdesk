import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '@app/database';
import { RedisModule } from '@app/common';
import { HealthController } from '@app/common/health.controller';
import { GatewayAuthModule } from './auth/gateway-auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_NAMES, SERVICE_PORTS, SERVICE_HOSTS } from '@app/common';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 100,
            },
        ]),
        EventEmitterModule.forRoot({
            wildcard: true,
            delimiter: '.',
            maxListeners: 10,
        }),
        ScheduleModule.forRoot(),
        PrismaModule,
        RedisModule,
        GatewayAuthModule,
        ClientsModule.register([
            {
                name: SERVICE_NAMES.AUTH,
                transport: Transport.TCP,
                options: {
                    host: SERVICE_HOSTS.AUTH,
                    port: SERVICE_PORTS.AUTH,
                },
            },
            {
                name: SERVICE_NAMES.VOICE_AGENT,
                transport: Transport.TCP,
                options: {
                    host: SERVICE_HOSTS.VOICE_AGENT,
                    port: SERVICE_PORTS.VOICE_AGENT,
                },
            },
            {
                name: SERVICE_NAMES.APPOINTMENTS,
                transport: Transport.TCP,
                options: {
                    host: SERVICE_HOSTS.APPOINTMENTS,
                    port: SERVICE_PORTS.APPOINTMENTS,
                },
            },
            {
                name: SERVICE_NAMES.NOTIFICATIONS,
                transport: Transport.TCP,
                options: {
                    host: SERVICE_HOSTS.NOTIFICATIONS,
                    port: SERVICE_PORTS.NOTIFICATIONS,
                },
            },
        ]),
    ],
    controllers: [HealthController],
})
export class AppModule { }
