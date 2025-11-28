import { Test, TestingModule } from '@nestjs/testing';
import { VoiceAgentController } from './voice-agent.controller';
import { VoiceAgentService } from './voice-agent.service';

describe('VoiceAgentController', () => {
  let voiceAgentController: VoiceAgentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [VoiceAgentController],
      providers: [VoiceAgentService],
    }).compile();

    voiceAgentController = app.get<VoiceAgentController>(VoiceAgentController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(voiceAgentController.getHello()).toBe('Hello World!');
    });
  });
});
