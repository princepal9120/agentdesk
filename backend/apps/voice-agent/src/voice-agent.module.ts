import { Module } from '@nestjs/common';
import { VoiceAgentController } from './voice-agent.controller';
import { VoiceAgentService } from './voice-agent.service';

@Module({
  imports: [],
  controllers: [VoiceAgentController],
  providers: [VoiceAgentService],
})
export class VoiceAgentModule {}
