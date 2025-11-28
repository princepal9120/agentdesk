import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppointmentsModule } from './appointments/appointments.module';
import { SERVICE_PORTS } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppointmentsModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: SERVICE_PORTS.APPOINTMENTS,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3003);
}
bootstrap();
