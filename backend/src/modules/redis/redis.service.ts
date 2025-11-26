import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private client: Redis;
    private subscriber: Redis;

    constructor(private configService: ConfigService) { }

    async onModuleInit() {
        const redisConfig = {
            host: this.configService.get<string>('REDIS_HOST', 'localhost'),
            port: this.configService.get<number>('REDIS_PORT', 6379),
            password: this.configService.get<string>('REDIS_PASSWORD'),
            db: this.configService.get<number>('REDIS_DB', 0),
            retryStrategy: (times: number) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
        };

        this.client = new Redis(redisConfig);
        this.subscriber = new Redis(redisConfig);

        this.client.on('connect', () => {
            this.logger.log('✅ Redis connected successfully');
        });

        this.client.on('error', (err) => {
            this.logger.error('Redis connection error:', err);
        });
    }

    async onModuleDestroy() {
        await this.client.quit();
        await this.subscriber.quit();
        this.logger.log('Redis disconnected');
    }

    getClient(): Redis {
        return this.client;
    }

    getSubscriber(): Redis {
        return this.subscriber;
    }

    // Cache operations
    async get<T>(key: string): Promise<T | null> {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        const serialized = JSON.stringify(value);
        if (ttl) {
            await this.client.setex(key, ttl, serialized);
        } else {
            await this.client.set(key, serialized);
        }
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }

    async keys(pattern: string): Promise<string[]> {
        return this.client.keys(pattern);
    }

    async incr(key: string): Promise<number> {
        return this.client.incr(key);
    }

    async expire(key: string, seconds: number): Promise<void> {
        await this.client.expire(key, seconds);
    }

    // Rate limiting
    async checkRateLimit(key: string, limit: number, window: number): Promise<boolean> {
        const current = await this.incr(key);

        if (current === 1) {
            await this.expire(key, window);
        }

        return current <= limit;
    }

    // Pub/Sub
    async publish(channel: string, message: any): Promise<void> {
        await this.client.publish(channel, JSON.stringify(message));
    }

    async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
        await this.subscriber.subscribe(channel);
        this.subscriber.on('message', (ch, msg) => {
            if (ch === channel) {
                callback(JSON.parse(msg));
            }
        });
    }

    // Session management
    async setSession(sessionId: string, data: any, ttl: number = 86400): Promise<void> {
        await this.set(`session:${sessionId}`, data, ttl);
    }

    async getSession<T>(sessionId: string): Promise<T | null> {
        return this.get<T>(`session:${sessionId}`);
    }

    async deleteSession(sessionId: string): Promise<void> {
        await this.del(`session:${sessionId}`);
    }
}
