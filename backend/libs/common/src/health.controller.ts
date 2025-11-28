import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { PrismaService } from '@app/database';
import { RedisService } from './redis/redis.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
    constructor(
        private prisma: PrismaService,
        private redis: RedisService,
    ) { }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Health check endpoint' })
    async check() {
        const health = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: 'unknown',
            redis: 'unknown',
        };

        // Check database
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            health.database = 'connected';
        } catch (error) {
            health.database = 'disconnected';
            health.status = 'degraded';
        }

        // Check Redis
        try {
            await this.redis.getClient().ping();
            health.redis = 'connected';
        } catch (error) {
            health.redis = 'disconnected';
            health.status = 'degraded';
        }

        return health;
    }
}
