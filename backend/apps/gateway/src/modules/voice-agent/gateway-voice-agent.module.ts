import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_NAMES, SERVICE_PORTS, SERVICE_HOSTS } from '@app/common';
import { VoiceAgentController } from './voice-agent.controller';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: SERVICE_NAMES.VOICE_AGENT,
                transport: Transport.TCP,
                options: {
                    host: SERVICE_HOSTS.VOICE_AGENT,
                    port: SERVICE_PORTS.VOICE_AGENT,
                },
            },
        ]),
    ],
    controllers: [VoiceAgentController],
})
export class GatewayVoiceAgentModule { }
