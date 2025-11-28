import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElevenLabsClient, stream } from 'elevenlabs';
import { Readable } from 'stream';

export interface TTSOptions {
    voiceId?: string;
    modelId?: string;
    stability?: number;
    similarityBoost?: number;
}

@Injectable()
export class TextToSpeechService {
    private readonly logger = new Logger(TextToSpeechService.name);
    private elevenLabsClient: ElevenLabsClient;
    private defaultVoiceId: string;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('ELEVENLABS_API_KEY');
        if (apiKey) {
            this.elevenLabsClient = new ElevenLabsClient({ apiKey });
            this.defaultVoiceId = this.configService.get<string>(
                'ELEVENLABS_VOICE_ID',
                '21m00Tcm4TlvDq8ikWAM',
            );
        }
    }

    async generateSpeech(text: string, options?: TTSOptions): Promise<Buffer> {
        try {
            const voiceId = options?.voiceId || this.defaultVoiceId;

            const audio = await this.elevenLabsClient.generate({
                voice: voiceId,
                text,
                model_id: options?.modelId || 'eleven_turbo_v2',
                voice_settings: {
                    stability: options?.stability || 0.5,
                    similarity_boost: options?.similarityBoost || 0.75,
                },
            });

            // Convert async iterable to buffer
            const chunks: Buffer[] = [];
            for await (const chunk of audio) {
                chunks.push(chunk);
            }

            return Buffer.concat(chunks);
        } catch (error) {
            this.logger.error('TTS generation error:', error);
            throw error;
        }
    }

    async streamSpeech(text: string, options?: TTSOptions): Promise<Readable> {
        try {
            const voiceId = options?.voiceId || this.defaultVoiceId;

            const audioStream = await this.elevenLabsClient.generate({
                voice: voiceId,
                text,
                model_id: options?.modelId || 'eleven_turbo_v2',
                stream: true,
                voice_settings: {
                    stability: options?.stability || 0.5,
                    similarity_boost: options?.similarityBoost || 0.75,
                },
            });

            // Convert async iterable to readable stream
            const readable = new Readable({
                async read() {
                    try {
                        for await (const chunk of audioStream) {
                            this.push(chunk);
                        }
                        this.push(null);
                    } catch (error) {
                        this.destroy(error as Error);
                    }
                },
            });

            return readable;
        } catch (error) {
            this.logger.error('TTS streaming error:', error);
            throw error;
        }
    }

    async getAvailableVoices(): Promise<any[]> {
        try {
            const voices = await this.elevenLabsClient.voices.getAll();
            return voices.voices;
        } catch (error) {
            this.logger.error('Error fetching voices:', error);
            return [];
        }
    }
}
