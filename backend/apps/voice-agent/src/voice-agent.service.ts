import { Injectable } from '@nestjs/common';

@Injectable()
export class VoiceAgentService {
  getHello(): string {
    return 'Hello World!';
  }
}
