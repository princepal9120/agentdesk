import { Injectable } from '@nestjs/common';

@Injectable()
export class AppointmentsService {
  getHello(): string {
    return 'Hello World!';
  }
}
