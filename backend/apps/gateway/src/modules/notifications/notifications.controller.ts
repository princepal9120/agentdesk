import { Controller, Post, Body, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICE_NAMES, CurrentUser } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SendEmailDto, SendSmsDto } from './dto/notifications.dto';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
    constructor(
        @Inject(SERVICE_NAMES.NOTIFICATIONS) private notificationsClient: ClientProxy,
    ) { }

    @Post('email')
    @ApiOperation({ summary: 'Send email notification' })
    @ApiResponse({ status: 200, description: 'Email sent' })
    async sendEmail(@Body() sendEmailDto: SendEmailDto, @CurrentUser() user: any) {
        return await firstValueFrom(
            this.notificationsClient.send('notifications.send_email', { ...sendEmailDto, userId: user.id })
        );
    }

    @Post('sms')
    @ApiOperation({ summary: 'Send SMS notification' })
    @ApiResponse({ status: 200, description: 'SMS sent' })
    async sendSms(@Body() sendSmsDto: SendSmsDto, @CurrentUser() user: any) {
        return await firstValueFrom(
            this.notificationsClient.send('notifications.send_sms', { ...sendSmsDto, userId: user.id })
        );
    }
}
