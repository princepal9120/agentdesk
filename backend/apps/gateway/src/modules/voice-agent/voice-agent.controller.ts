import { Controller, Post, Body, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICE_NAMES, CurrentUser } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { StartSessionDto, TextQueryDto } from './dto/voice-agent.dto';

@ApiTags('voice-agent')
@Controller('agent')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VoiceAgentController {
    constructor(
        @Inject(SERVICE_NAMES.VOICE_AGENT) private voiceAgentClient: ClientProxy,
    ) { }

    @Post('start-session')
    @ApiOperation({ summary: 'Start a voice session' })
    @ApiResponse({ status: 201, description: 'Session started' })
    async startSession(@Body() startSessionDto: StartSessionDto, @CurrentUser() user: any) {
        return await firstValueFrom(
            this.voiceAgentClient.send('agent.start_session', { ...startSessionDto, userId: user.id })
        );
    }

    @Post('text-query')
    @ApiOperation({ summary: 'Send a text query' })
    @ApiResponse({ status: 200, description: 'Query processed' })
    async textQuery(@Body() textQueryDto: TextQueryDto, @CurrentUser() user: any) {
        return await firstValueFrom(
            this.voiceAgentClient.send('agent.text_query', { ...textQueryDto, userId: user.id })
        );
    }
}
