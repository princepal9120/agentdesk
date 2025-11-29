import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartSessionDto {
    @ApiProperty({ example: 'practice-uuid', required: false })
    @IsString()
    @IsOptional()
    practiceId?: string;
}

export class TextQueryDto {
    @ApiProperty({ example: 'conversation-uuid' })
    @IsString()
    conversationId: string;

    @ApiProperty({ example: 'I need an appointment' })
    @IsString()
    text: string;
}
