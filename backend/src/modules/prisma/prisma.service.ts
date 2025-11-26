import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'event', level: 'error' },
                { emit: 'event', level: 'warn' },
            ],
        });
    }

    async onModuleInit() {
        // @ts-ignore
        this.$on('query', (e) => {
            if (process.env.NODE_ENV === 'development') {
                this.logger.debug(`Query: ${e.query} - Params: ${e.params} - Duration: ${e.duration}ms`);
            }
        });

        // @ts-ignore
        this.$on('error', (e) => {
            this.logger.error(`Prisma Error: ${e.message}`);
        });

        // @ts-ignore
        this.$on('warn', (e) => {
            this.logger.warn(`Prisma Warning: ${e.message}`);
        });

        await this.$connect();
        this.logger.log('✅ Database connected successfully');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Database disconnected');
    }

    async cleanDatabase() {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Cannot clean database in production');
        }

        const models = Reflect.ownKeys(this).filter(
            (key) => typeof key === 'string' && key[0] !== '_' && key[0] !== '$',
        );

        return Promise.all(
            models.map((modelKey) => {
                // @ts-ignore
                return this[modelKey].deleteMany();
            }),
        );
    }
}
