import { Controller, Get } from '@nestjs/common';
import { VoiceAgentService } from './voice-agent.service';

@Controller()
export class VoiceAgentController {
  constructor(private readonly voiceAgentService: VoiceAgentService) {}

  @Get()
  getHello(): string {
    return this.voiceAgentService.getHello();
  }
}
