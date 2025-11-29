import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_NAMES, SERVICE_PORTS, SERVICE_HOSTS } from '@app/common';
import { NotificationsController } from './notifications.controller';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: SERVICE_NAMES.NOTIFICATIONS,
                transport: Transport.TCP,
                options: {
                    host: SERVICE_HOSTS.NOTIFICATIONS,
                    port: SERVICE_PORTS.NOTIFICATIONS,
                },
            },
        ]),
    ],
    controllers: [NotificationsController],
})
export class GatewayNotificationsModule { }
