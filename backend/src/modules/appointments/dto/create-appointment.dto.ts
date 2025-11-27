import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
    @ApiProperty({ description: 'Practice ID' })
    @IsString()
    @IsNotEmpty()
    practiceId: string;

    @ApiProperty({ description: 'Provider ID' })
    @IsString()
    @IsNotEmpty()
    providerId: string;

    @ApiProperty({ description: 'Appointment Type ID' })
    @IsString()
    @IsNotEmpty()
    appointmentTypeId: string;

    @ApiProperty({ description: 'Patient First Name' })
    @IsString()
    @IsNotEmpty()
    patientFirstName: string;

    @ApiProperty({ description: 'Patient Last Name' })
    @IsString()
    @IsNotEmpty()
    patientLastName: string;

    @ApiProperty({ description: 'Patient Email', required: false })
    @IsString()
    @IsOptional()
    patientEmail?: string;

    @ApiProperty({ description: 'Patient Phone' })
    @IsString()
    @IsNotEmpty()
    patientPhone: string;

    @ApiProperty({ description: 'Patient Date of Birth', required: false })
    @IsDateString()
    @IsOptional()
    patientDOB?: string;

    @ApiProperty({ description: 'Start Time' })
    @IsDateString()
    @IsNotEmpty()
    startTime: string;

    @ApiProperty({ description: 'Notes', required: false })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({ description: 'Booked by AI', default: false })
    @IsBoolean()
    @IsOptional()
    bookedByAI?: boolean;

    @ApiProperty({ description: 'Conversation ID', required: false })
    @IsString()
    @IsOptional()
    conversationId?: string;
}
