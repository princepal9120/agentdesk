import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_NAMES, SERVICE_PORTS, SERVICE_HOSTS } from '@app/common';
import { AppointmentsController } from './appointments.controller';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: SERVICE_NAMES.APPOINTMENTS,
                transport: Transport.TCP,
                options: {
                    host: SERVICE_HOSTS.APPOINTMENTS,
                    port: SERVICE_PORTS.APPOINTMENTS,
                },
            },
        ]),
    ],
    controllers: [AppointmentsController],
})
export class GatewayAppointmentsModule { }
