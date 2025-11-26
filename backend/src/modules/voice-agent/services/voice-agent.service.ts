import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SpeechToTextService } from './speech-to-text.service';
import { TextToSpeechService } from './text-to-speech.service';
import { AgentService } from '../../agent-core/services/agent.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Readable } from 'stream';

export interface VoiceSessionConfig {
    conversationId: string;
    practiceId?: string;
    userId?: string;
    callSid?: string;
    phoneNumber?: string;
}

export interface VoiceResponse {
    text: string;
    audioBuffer?: Buffer;
    audioStream?: Readable;
    metadata?: any;
}

@Injectable()
export class VoiceAgentService {
    private readonly logger = new Logger(VoiceAgentService.name);
    private activeSessions: Map<string, VoiceSessionConfig> = new Map();

    constructor(
        private sttService: SpeechToTextService,
        private ttsService: TextToSpeechService,
        private agentService: AgentService,
        private prisma: PrismaService,
        private eventEmitter: EventEmitter2,
    ) { }

    async startSession(config: VoiceSessionConfig): Promise<void> {
        this.logger.log(`Starting voice session: ${config.conversationId}`);

        this.activeSessions.set(config.conversationId, config);

        // Create conversation record
        await this.prisma.conversation.create({
            data: {
                id: config.conversationId,
                channel: 'VOICE_INBOUND',
                status: 'ACTIVE',
                callSid: config.callSid,
                phoneNumber: config.phoneNumber,
                userId: config.userId,
            },
        });

        // Send greeting
        const greeting = await this.getGreeting(config.practiceId);
        await this.sendVoiceResponse(config.conversationId, greeting);

        this.eventEmitter.emit('voice.session.started', config);
    }

    async processAudioInput(
        conversationId: string,
        audioBuffer: Buffer,
    ): Promise<VoiceResponse> {
        try {
            const session = this.activeSessions.get(conversationId);

            if (!session) {
                throw new Error('Session not found');
            }

            // Step 1: Transcribe audio (STT)
            this.logger.debug(`Transcribing audio for ${conversationId}`);
            const transcript = await this.sttService.transcribeAudio(audioBuffer);

            if (!transcript || transcript.trim().length === 0) {
                return {
                    text: "I'm sorry, I didn't catch that. Could you please repeat?",
                };
            }

            this.logger.log(`Transcript: ${transcript}`);

            // Save user message
            await this.agentService.saveMessage(conversationId, 'USER', transcript);

            // Store voice chunk
            await this.prisma.voiceChunk.create({
                data: {
                    conversationId,
                    type: 'audio_input',
                    data: audioBuffer,
                    transcript,
                },
            });

            // Step 2: Process with LLM Agent
            this.logger.debug(`Processing with agent for ${conversationId}`);
            const agentResponse = await this.agentService.processMessage(
                conversationId,
                transcript,
                {
                    conversationId,
                    practiceId: session.practiceId,
                    userId: session.userId,
                },
            );

            const responseText = agentResponse.output;

            // Save assistant message
            await this.agentService.saveMessage(
                conversationId,
                'ASSISTANT',
                responseText,
                { toolCalls: agentResponse.toolCalls },
            );

            // Step 3: Generate speech (TTS)
            this.logger.debug(`Generating speech for ${conversationId}`);
            const audioStream = await this.ttsService.streamSpeech(responseText);

            // Store response voice chunk
            await this.prisma.voiceChunk.create({
                data: {
                    conversationId,
                    type: 'audio_output',
                    transcript: responseText,
                },
            });

            this.eventEmitter.emit('voice.message.processed', {
                conversationId,
                transcript,
                response: responseText,
            });

            return {
                text: responseText,
                audioStream,
            };
        } catch (error) {
            this.logger.error('Error processing audio input:', error);
            throw error;
        }
    }

    async processTextInput(
        conversationId: string,
        text: string,
    ): Promise<VoiceResponse> {
        try {
            const session = this.activeSessions.get(conversationId);

            if (!session) {
                throw new Error('Session not found');
            }

            // Save user message
            await this.agentService.saveMessage(conversationId, 'USER', text);

            // Process with agent
            const agentResponse = await this.agentService.processMessage(
                conversationId,
                text,
                {
                    conversationId,
                    practiceId: session.practiceId,
                    userId: session.userId,
                },
            );

            const responseText = agentResponse.output;

            // Save assistant message
            await this.agentService.saveMessage(conversationId, 'ASSISTANT', responseText);

            return {
                text: responseText,
            };
        } catch (error) {
            this.logger.error('Error processing text input:', error);
            throw error;
        }
    }

    async endSession(conversationId: string, outcome?: string): Promise<void> {
        this.logger.log(`Ending voice session: ${conversationId}`);

        // Update conversation
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: {
                status: 'COMPLETED',
                endedAt: new Date(),
                outcome,
            },
        });

        // Clear agent memory
        await this.agentService.clearAgentMemory(conversationId);

        // Remove from active sessions
        this.activeSessions.delete(conversationId);

        this.eventEmitter.emit('voice.session.ended', { conversationId, outcome });
    }

    async sendVoiceResponse(conversationId: string, text: string): Promise<Readable> {
        const audioStream = await this.ttsService.streamSpeech(text);

        // Save message
        await this.agentService.saveMessage(conversationId, 'ASSISTANT', text);

        return audioStream;
    }

    private async getGreeting(practiceId?: string): Promise<string> {
        if (practiceId) {
            const aiScript = await this.prisma.aIScript.findFirst({
                where: {
                    practiceId,
                    isActive: true,
                    isDefault: true,
                },
            });

            if (aiScript?.greeting) {
                return aiScript.greeting;
            }
        }

        return "Hello! Thank you for calling. I'm your virtual assistant. How may I help you today?";
    }

    getActiveSessionCount(): number {
        return this.activeSessions.size;
    }

    isSessionActive(conversationId: string): boolean {
        return this.activeSessions.has(conversationId);
    }
}
