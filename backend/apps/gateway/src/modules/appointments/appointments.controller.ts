import { Controller, Get, Post, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICE_NAMES, CurrentUser } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppointmentsController {
    constructor(
        @Inject(SERVICE_NAMES.APPOINTMENTS) private appointmentsClient: ClientProxy,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get all appointments' })
    @ApiResponse({ status: 200, description: 'List of appointments' })
    async findAll(@CurrentUser() user: any) {
        return await firstValueFrom(
            this.appointmentsClient.send('appointments.findAll', { userId: user.id })
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get appointment by ID' })
    @ApiResponse({ status: 200, description: 'Appointment details' })
    async findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return await firstValueFrom(
            this.appointmentsClient.send('appointments.findOne', { id, userId: user.id })
        );
    }

    @Post()
    @ApiOperation({ summary: 'Create new appointment' })
    @ApiResponse({ status: 201, description: 'Appointment created' })
    async create(@Body() createAppointmentDto: CreateAppointmentDto, @CurrentUser() user: any) {
        return await firstValueFrom(
            this.appointmentsClient.send('appointments.create', { ...createAppointmentDto, userId: user.id })
        );
    }
}
