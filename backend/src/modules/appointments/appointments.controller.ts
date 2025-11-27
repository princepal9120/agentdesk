import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new appointment' })
    create(@Body() createAppointmentDto: CreateAppointmentDto) {
        return this.appointmentsService.create(createAppointmentDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all appointments' })
    @ApiQuery({ name: 'practiceId', required: true })
    @ApiQuery({ name: 'providerId', required: false })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    @ApiQuery({ name: 'status', enum: AppointmentStatus, required: false })
    findAll(
        @Query('practiceId') practiceId: string,
        @Query('providerId') providerId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('status') status?: AppointmentStatus,
    ) {
        return this.appointmentsService.findAll(practiceId, providerId, startDate, endDate, status);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get appointment by ID' })
    findOne(@Param('id') id: string) {
        return this.appointmentsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update appointment' })
    update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
        return this.appointmentsService.update(id, updateAppointmentDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete appointment' })
    remove(@Param('id') id: string) {
        return this.appointmentsService.remove(id);
    }
}
