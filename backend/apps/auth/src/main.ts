import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { SERVICE_PORTS } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: SERVICE_PORTS.AUTH,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
