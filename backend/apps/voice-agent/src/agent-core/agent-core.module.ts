import { Module } from '@nestjs/common';
import { AgentService } from './services/agent.service';
import { AppointmentTools } from './tools/appointment.tools';

@Module({
    providers: [AgentService, AppointmentTools],
    exports: [AgentService, AppointmentTools],
})
export class AgentCoreModule { }
