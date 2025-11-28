import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsController', () => {
  let appointmentsController: AppointmentsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [AppointmentsService],
    }).compile();

    appointmentsController = app.get<AppointmentsController>(AppointmentsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appointmentsController.getHello()).toBe('Hello World!');
    });
  });
});
