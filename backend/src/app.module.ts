import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

// Core Modules
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

// Business Modules
import { PracticesModule } from './modules/practices/practices.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ConversationsModule } from './modules/conversations/conversations.module';

// Voice AI Modules
import { VoiceAgentModule } from './modules/voice-agent/voice-agent.module';
import { AgentCoreModule } from './modules/agent-core/agent-core.module';
import { WebsocketModule } from './modules/websocket/websocket.module';

// Integration Modules
import { NotificationsModule } from './modules/notifications/notifications.module';
import { StorageModule } from './modules/storage/storage.module';
import { EhrModule } from './modules/ehr/ehr.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

// Common
import { HealthController } from './common/health.controller';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Rate Limiting
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // 60 seconds
                limit: 100, // 100 requests per minute
            },
        ]),

        // Event System
        EventEmitterModule.forRoot({
            wildcard: true,
            delimiter: '.',
            maxListeners: 10,
        }),

        // Scheduled Tasks
        ScheduleModule.forRoot(),

        // Core Infrastructure
        PrismaModule,
        RedisModule,

        // Authentication & Users
        AuthModule,
        UsersModule,

        // Business Logic
        PracticesModule,
        ProvidersModule,
        AppointmentsModule,
        ConversationsModule,

        // Voice AI
        VoiceAgentModule,
        AgentCoreModule,
        WebsocketModule,

        // Integrations
        NotificationsModule,
        StorageModule,
        EhrModule,
        AnalyticsModule,
    ],
    controllers: [HealthController],
})
export class AppModule { }
