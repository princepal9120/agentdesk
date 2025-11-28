import { Controller, Get } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  getHello(): string {
    return this.appointmentsService.getHello();
  }
}
