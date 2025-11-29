import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    to: string;

    @ApiProperty({ example: 'Welcome' })
    @IsString()
    @IsNotEmpty()
    subject: string;

    @ApiProperty({ example: '<h1>Hello</h1>' })
    @IsString()
    @IsNotEmpty()
    content: string;
}

export class SendSmsDto {
    @ApiProperty({ example: '+1234567890' })
    @IsString()
    @IsNotEmpty()
    to: string;

    @ApiProperty({ example: 'Hello from MedVoice' })
    @IsString()
    @IsNotEmpty()
    message: string;
}
