import { Module } from '@nestjs/common';
import { VoiceAgentController } from './voice-agent.controller';
import { VoiceAgentService } from './services/voice-agent.service';
import { SpeechToTextService } from './services/speech-to-text.service';
import { TextToSpeechService } from './services/text-to-speech.service';
import { AgentCoreModule } from '../agent-core/agent-core.module';

@Module({
    imports: [AgentCoreModule],
    controllers: [VoiceAgentController],
    providers: [VoiceAgentService, SpeechToTextService, TextToSpeechService],
    exports: [VoiceAgentService, SpeechToTextService, TextToSpeechService],
})
export class VoiceAgentModule { }
