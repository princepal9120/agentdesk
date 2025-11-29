import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
    @ApiProperty({ example: 'provider-uuid' })
    @IsString()
    providerId: string;

    @ApiProperty({ example: 'practice-uuid' })
    @IsString()
    practiceId: string;

    @ApiProperty({ example: '2024-01-01T10:00:00Z' })
    @IsDateString()
    startTime: string;

    @ApiProperty({ example: '2024-01-01T11:00:00Z' })
    @IsDateString()
    endTime: string;

    @ApiProperty({ example: 'Regular checkup', required: false })
    @IsString()
    @IsOptional()
    notes?: string;
}
