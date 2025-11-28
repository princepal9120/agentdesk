import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    UseInterceptors,
    UploadedFile,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VoiceAgentService } from './services/voice-agent.service';
import { CurrentUser } from '@app/common';
import { v4 as uuidv4 } from 'uuid';

class StartSessionDto {
    practiceId?: string;
    phoneNumber?: string;
}

class TextQueryDto {
    conversationId: string;
    text: string;
}

class EndSessionDto {
    outcome?: string;
}

@ApiTags('voice-agent')
@ApiBearerAuth()
@Controller('agent')
export class VoiceAgentController {
    constructor(private readonly voiceAgentService: VoiceAgentService) { }

    @Post('start-session')
    @ApiOperation({ summary: 'Start a new voice agent session' })
    @ApiResponse({ status: 201, description: 'Session started successfully' })
    async startSession(
        @Body() dto: StartSessionDto,
        @CurrentUser() user: any,
    ): Promise<{ conversationId: string; message: string }> {
        const conversationId = uuidv4();

        await this.voiceAgentService.startSession({
            conversationId,
            practiceId: dto.practiceId,
            userId: user.userId,
            phoneNumber: dto.phoneNumber,
        });

        return {
            conversationId,
            message: 'Session started successfully',
        };
    }

    @Post('text-query')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send a text query to the agent' })
    @ApiResponse({ status: 200, description: 'Query processed successfully' })
    async textQuery(@Body() dto: TextQueryDto): Promise<{ response: string }> {
        const result = await this.voiceAgentService.processTextInput(
            dto.conversationId,
            dto.text,
        );

        return { response: result.text };
    }

    @Post('audio-query/:conversationId')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('audio'))
    @ApiOperation({ summary: 'Send an audio query to the agent' })
    @ApiResponse({ status: 200, description: 'Audio processed successfully' })
    async audioQuery(
        @Param('conversationId') conversationId: string,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<{ transcript: string; response: string }> {
        const result = await this.voiceAgentService.processAudioInput(
            conversationId,
            file.buffer,
        );

        return {
            transcript: result.metadata?.transcript || '',
            response: result.text,
        };
    }

    @Post('end-session/:conversationId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'End a voice agent session' })
    @ApiResponse({ status: 200, description: 'Session ended successfully' })
    async endSession(
        @Param('conversationId') conversationId: string,
        @Body() dto: EndSessionDto,
    ): Promise<{ message: string }> {
        await this.voiceAgentService.endSession(conversationId, dto.outcome);

        return { message: 'Session ended successfully' };
    }

    @Get('session-status/:conversationId')
    @ApiOperation({ summary: 'Check if a session is active' })
    @ApiResponse({ status: 200, description: 'Session status retrieved' })
    async getSessionStatus(
        @Param('conversationId') conversationId: string,
    ): Promise<{ isActive: boolean }> {
        const isActive = this.voiceAgentService.isSessionActive(conversationId);
        return { isActive };
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get voice agent statistics' })
    @ApiResponse({ status: 200, description: 'Statistics retrieved' })
    async getStats(): Promise<{ activeSessions: number }> {
        return {
            activeSessions: this.voiceAgentService.getActiveSessionCount(),
        };
    }
}
