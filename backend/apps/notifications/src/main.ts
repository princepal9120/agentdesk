import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { NotificationsModule } from './notifications/notifications.module';
import { SERVICE_PORTS } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: SERVICE_PORTS.NOTIFICATIONS,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3004);
}
bootstrap();
