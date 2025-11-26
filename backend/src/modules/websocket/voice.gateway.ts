import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { VoiceAgentService } from '../voice-agent/services/voice-agent.service';
import { v4 as uuidv4 } from 'uuid';

interface VoiceStreamData {
    conversationId?: string;
    audioChunk: string; // base64 encoded
    practiceId?: string;
}

interface TextMessageData {
    conversationId: string;
    text: string;
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/voice',
})
export class VoiceGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(VoiceGateway.name);
    private clientSessions: Map<string, string> = new Map(); // socketId -> conversationId

    constructor(private voiceAgentService: VoiceAgentService) { }

    async handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        client.emit('connected', { message: 'Connected to voice agent' });
    }

    async handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);

        const conversationId = this.clientSessions.get(client.id);
        if (conversationId) {
            await this.voiceAgentService.endSession(conversationId, 'disconnected');
            this.clientSessions.delete(client.id);
        }
    }

    @SubscribeMessage('start_session')
    async handleStartSession(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { practiceId?: string; userId?: string },
    ) {
        try {
            const conversationId = uuidv4();

            await this.voiceAgentService.startSession({
                conversationId,
                practiceId: data.practiceId,
                userId: data.userId,
            });

            this.clientSessions.set(client.id, conversationId);

            client.emit('session_started', {
                conversationId,
                message: 'Session started successfully',
            });

            this.logger.log(`Session started: ${conversationId} for client ${client.id}`);
        } catch (error) {
            this.logger.error('Error starting session:', error);
            client.emit('error', { message: 'Failed to start session' });
        }
    }

    @SubscribeMessage('audio_stream')
    async handleAudioStream(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: VoiceStreamData,
    ) {
        try {
            const conversationId = data.conversationId || this.clientSessions.get(client.id);

            if (!conversationId) {
                client.emit('error', { message: 'No active session' });
                return;
            }

            // Decode base64 audio
            const audioBuffer = Buffer.from(data.audioChunk, 'base64');

            // Process audio
            const response = await this.voiceAgentService.processAudioInput(
                conversationId,
                audioBuffer,
            );

            // Send response back
            client.emit('agent_response', {
                conversationId,
                text: response.text,
                timestamp: new Date().toISOString(),
            });

            // If audio stream is available, send it
            if (response.audioStream) {
                const chunks: Buffer[] = [];

                response.audioStream.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                response.audioStream.on('end', () => {
                    const audioBuffer = Buffer.concat(chunks);
                    client.emit('audio_response', {
                        conversationId,
                        audio: audioBuffer.toString('base64'),
                    });
                });
            }
        } catch (error) {
            this.logger.error('Error processing audio stream:', error);
            client.emit('error', { message: 'Failed to process audio' });
        }
    }

    @SubscribeMessage('text_message')
    async handleTextMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: TextMessageData,
    ) {
        try {
            const response = await this.voiceAgentService.processTextInput(
                data.conversationId,
                data.text,
            );

            client.emit('agent_response', {
                conversationId: data.conversationId,
                text: response.text,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            this.logger.error('Error processing text message:', error);
            client.emit('error', { message: 'Failed to process message' });
        }
    }

    @SubscribeMessage('end_session')
    async handleEndSession(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { conversationId?: string; outcome?: string },
    ) {
        try {
            const conversationId = data.conversationId || this.clientSessions.get(client.id);

            if (!conversationId) {
                client.emit('error', { message: 'No active session' });
                return;
            }

            await this.voiceAgentService.endSession(conversationId, data.outcome);
            this.clientSessions.delete(client.id);

            client.emit('session_ended', {
                conversationId,
                message: 'Session ended successfully',
            });
        } catch (error) {
            this.logger.error('Error ending session:', error);
            client.emit('error', { message: 'Failed to end session' });
        }
    }

    // Broadcast to specific conversation
    broadcastToConversation(conversationId: string, event: string, data: any) {
        this.server.emit(event, { conversationId, ...data });
    }

    // Broadcast to all clients
    broadcastToAll(event: string, data: any) {
        this.server.emit(event, data);
    }
}
