import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { VoiceAgentModule } from './voice-agent/voice-agent.module';
import { SERVICE_PORTS } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(VoiceAgentModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: SERVICE_PORTS.VOICE_AGENT,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3002);
}
bootstrap();
