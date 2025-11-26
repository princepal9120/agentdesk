import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface TranscriptionResult {
    transcript: string;
    confidence: number;
    isFinal: boolean;
    metadata?: any;
}

@Injectable()
export class SpeechToTextService {
    private readonly logger = new Logger(SpeechToTextService.name);
    private deepgramClient: any;

    constructor(
        private configService: ConfigService,
        private eventEmitter: EventEmitter2,
    ) {
        const apiKey = this.configService.get<string>('DEEPGRAM_API_KEY');
        if (apiKey) {
            this.deepgramClient = createClient(apiKey);
        }
    }

    async transcribeStream(audioStream: any): Promise<TranscriptionResult> {
        try {
            const connection = this.deepgramClient.listen.live({
                model: 'nova-2',
                language: 'en-US',
                smart_format: true,
                interim_results: true,
                utterance_end_ms: 1000,
                vad_events: true,
            });

            return new Promise((resolve, reject) => {
                connection.on(LiveTranscriptionEvents.Open, () => {
                    this.logger.debug('Deepgram connection opened');
                });

                connection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
                    const transcript = data.channel.alternatives[0].transcript;
                    const confidence = data.channel.alternatives[0].confidence;
                    const isFinal = data.is_final;

                    if (transcript && transcript.length > 0) {
                        const result: TranscriptionResult = {
                            transcript,
                            confidence,
                            isFinal,
                            metadata: data,
                        };

                        this.eventEmitter.emit('stt.transcript', result);

                        if (isFinal) {
                            resolve(result);
                        }
                    }
                });

                connection.on(LiveTranscriptionEvents.Error, (error: any) => {
                    this.logger.error('Deepgram error:', error);
                    reject(error);
                });

                connection.on(LiveTranscriptionEvents.Close, () => {
                    this.logger.debug('Deepgram connection closed');
                });

                // Send audio data
                audioStream.on('data', (chunk: Buffer) => {
                    connection.send(chunk);
                });

                audioStream.on('end', () => {
                    connection.finish();
                });
            });
        } catch (error) {
            this.logger.error('STT error:', error);
            throw error;
        }
    }

    async transcribeAudio(audioBuffer: Buffer): Promise<string> {
        try {
            const { result } = await this.deepgramClient.listen.prerecorded.transcribeFile(
                audioBuffer,
                {
                    model: 'nova-2',
                    language: 'en-US',
                    smart_format: true,
                },
            );

            const transcript = result.results.channels[0].alternatives[0].transcript;
            return transcript;
        } catch (error) {
            this.logger.error('Audio transcription error:', error);
            throw error;
        }
    }
}
