import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment, AppointmentStatus } from '@prisma/client';
import { addMinutes } from 'date-fns';

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) { }

    async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
        const { practiceId, providerId, appointmentTypeId, startTime } = createAppointmentDto;

        // 1. Get Appointment Type for duration
        const appointmentType = await this.prisma.appointmentType.findUnique({
            where: { id: appointmentTypeId },
        });

        if (!appointmentType) {
            throw new NotFoundException('Appointment type not found');
        }

        const start = new Date(startTime);
        const end = addMinutes(start, appointmentType.duration);

        // 2. Check for conflicts
        const conflicts = await this.prisma.appointment.findMany({
            where: {
                providerId,
                status: {
                    notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
                },
                OR: [
                    {
                        startTime: { lt: end },
                        endTime: { gt: start },
                    },
                ],
            },
        });

        if (conflicts.length > 0) {
            throw new BadRequestException('Provider is not available at this time');
        }

        // 3. Create Appointment
        return this.prisma.appointment.create({
            data: {
                ...createAppointmentDto,
                startTime: start,
                endTime: end,
                status: AppointmentStatus.SCHEDULED,
            },
        });
    }

    async findAll(
        practiceId: string,
        providerId?: string,
        startDate?: string,
        endDate?: string,
        status?: AppointmentStatus,
    ): Promise<Appointment[]> {
        const where: any = { practiceId };

        if (providerId) where.providerId = providerId;
        if (status) where.status = status;

        if (startDate && endDate) {
            where.startTime = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }

        return this.prisma.appointment.findMany({
            where,
            include: {
                // patient info is flat in Appointment model, so no relation to include
                provider: true,
                appointmentType: true,
            },
            orderBy: {
                startTime: 'asc',
            },
        });
    }

    async findOne(id: string): Promise<Appointment> {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
            include: {
                provider: true,
                appointmentType: true,
                conversation: true,
            },
        });

        if (!appointment) {
            throw new NotFoundException(`Appointment with ID ${id} not found`);
        }

        return appointment;
    }

    async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
        await this.findOne(id); // Ensure exists

        // If updating time, check conflicts again (simplified for now)
        // TODO: Implement robust rescheduling conflict check

        return this.prisma.appointment.update({
            where: { id },
            data: updateAppointmentDto,
        });
    }

    async remove(id: string): Promise<Appointment> {
        await this.findOne(id); // Ensure exists

        return this.prisma.appointment.delete({
            where: { id },
        });
    }

    async checkAvailability(
        providerId: string,
        date: string,
        durationMinutes: number,
    ): Promise<{ available: boolean; slots: string[] }> {
        // Simplified availability check
        // In a real app, this would check working hours, breaks, and existing appointments
        // For MVP, we'll assume 9-5 availability and just check conflicts

        // This is a placeholder for the actual slot generation logic
        return {
            available: true,
            slots: [],
        };
    }
}
