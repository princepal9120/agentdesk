import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@app/common';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { createLogger } from '@app/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            instance: createLogger(),
        }),
    });

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3000);
    const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');

    // Security
    app.use(helmet());
    app.enableCors({
        origin: configService.get<string>('CORS_ORIGIN')?.split(',') || '*',
        credentials: true,
    });

    // Middleware
    app.use(compression());
    app.use(cookieParser());

    // Global prefix
    app.setGlobalPrefix(apiPrefix);

    // API Versioning
    app.enableVersioning({
        type: VersioningType.URI,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Swagger Documentation
    if (configService.get<string>('NODE_ENV') !== 'production') {
        const config = new DocumentBuilder()
            .setTitle('MedVoice Backend API')
            .setDescription('Voice Intelligence Agent Backend - Production API')
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('auth', 'Authentication endpoints')
            .addTag('users', 'User management')
            .addTag('appointments', 'Appointment management')
            .addTag('voice-agent', 'Voice AI agent')
            .addTag('conversations', 'Conversation history')
            .addTag('providers', 'Healthcare providers')
            .addTag('practices', 'Medical practices')
            .addTag('notifications', 'Notifications')
            .addTag('analytics', 'Analytics and reporting')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/docs', app, document);
    }

    // Graceful shutdown
    app.enableShutdownHooks();

    await app.listen(port);

    console.log(`
    🚀 MedVoice Backend is running!
    📡 Server: http://localhost:${port}
    📚 API Docs: http://localhost:${port}/api/docs
    🌍 Environment: ${configService.get<string>('NODE_ENV')}
  `);
}

bootstrap();
