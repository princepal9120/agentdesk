import { PartialType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
    @ApiProperty({ description: 'Appointment Status', enum: AppointmentStatus, required: false })
    @IsEnum(AppointmentStatus)
    @IsOptional()
    status?: AppointmentStatus;
}
