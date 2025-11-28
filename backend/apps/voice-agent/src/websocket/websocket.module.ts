import { Module } from '@nestjs/common';
import { VoiceGateway } from './voice.gateway';
import { VoiceAgentModule } from '../voice-agent/voice-agent.module';

@Module({
    imports: [VoiceAgentModule],
    providers: [VoiceGateway],
    exports: [VoiceGateway],
})
export class WebsocketModule { }
