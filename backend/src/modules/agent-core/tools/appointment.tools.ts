import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppointmentTools {
    private readonly logger = new Logger(AppointmentTools.name);

    constructor(private prisma: PrismaService) { }

    getCheckAvailabilityTool() {
        return new DynamicStructuredTool({
            name: 'check_availability',
            description: 'Check available appointment slots for a provider on a specific date',
            schema: z.object({
                providerId: z.string().describe('The ID of the healthcare provider'),
                date: z.string().describe('The date to check availability (YYYY-MM-DD)'),
                appointmentTypeId: z.string().optional().describe('Optional appointment type ID'),
            }),
            func: async ({ providerId, date, appointmentTypeId }) => {
                try {
                    const targetDate = new Date(date);
                    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
                    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

                    // Get existing appointments
                    const existingAppointments = await this.prisma.appointment.findMany({
                        where: {
                            providerId,
                            startTime: {
                                gte: startOfDay,
                                lte: endOfDay,
                            },
                            status: {
                                notIn: ['CANCELLED', 'NO_SHOW'],
                            },
                        },
                        orderBy: { startTime: 'asc' },
                    });

                    // Get provider's working hours (simplified - 9 AM to 5 PM)
                    const workStart = 9;
                    const workEnd = 17;
                    const slotDuration = 30; // minutes

                    const availableSlots: string[] = [];

                    for (let hour = workStart; hour < workEnd; hour++) {
                        for (let minute = 0; minute < 60; minute += slotDuration) {
                            const slotTime = new Date(targetDate);
                            slotTime.setHours(hour, minute, 0, 0);

                            // Check if slot is available
                            const isBooked = existingAppointments.some((apt) => {
                                return slotTime >= apt.startTime && slotTime < apt.endTime;
                            });

                            if (!isBooked && slotTime > new Date()) {
                                availableSlots.push(
                                    slotTime.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }),
                                );
                            }
                        }
                    }

                    return JSON.stringify({
                        date,
                        availableSlots,
                        totalSlots: availableSlots.length,
                    });
                } catch (error) {
                    this.logger.error('Error checking availability:', error);
                    return JSON.stringify({ error: 'Failed to check availability' });
                }
            },
        });
    }

    getBookAppointmentTool() {
        return new DynamicStructuredTool({
            name: 'book_appointment',
            description: 'Book a new appointment for a patient',
            schema: z.object({
                providerId: z.string().describe('The ID of the healthcare provider'),
                appointmentTypeId: z.string().describe('The type of appointment'),
                patientFirstName: z.string().describe('Patient first name'),
                patientLastName: z.string().describe('Patient last name'),
                patientPhone: z.string().describe('Patient phone number'),
                patientEmail: z.string().optional().describe('Patient email address'),
                startTime: z.string().describe('Appointment start time (ISO 8601 format)'),
                notes: z.string().optional().describe('Additional notes'),
            }),
            func: async ({
                providerId,
                appointmentTypeId,
                patientFirstName,
                patientLastName,
                patientPhone,
                patientEmail,
                startTime,
                notes,
            }) => {
                try {
                    // Get appointment type to determine duration
                    const appointmentType = await this.prisma.appointmentType.findUnique({
                        where: { id: appointmentTypeId },
                    });

                    if (!appointmentType) {
                        return JSON.stringify({ error: 'Invalid appointment type' });
                    }

                    const start = new Date(startTime);
                    const end = new Date(start.getTime() + appointmentType.duration * 60000);

                    // Check for conflicts
                    const conflicts = await this.prisma.appointment.findMany({
                        where: {
                            providerId,
                            status: { notIn: ['CANCELLED', 'NO_SHOW'] },
                            OR: [
                                {
                                    startTime: { lte: start },
                                    endTime: { gt: start },
                                },
                                {
                                    startTime: { lt: end },
                                    endTime: { gte: end },
                                },
                            ],
                        },
                    });

                    if (conflicts.length > 0) {
                        return JSON.stringify({ error: 'Time slot is not available' });
                    }

                    // Get provider to get practice ID
                    const provider = await this.prisma.provider.findUnique({
                        where: { id: providerId },
                    });

                    if (!provider) {
                        return JSON.stringify({ error: 'Provider not found' });
                    }

                    // Create appointment
                    const appointment = await this.prisma.appointment.create({
                        data: {
                            practiceId: provider.practiceId,
                            providerId,
                            appointmentTypeId,
                            patientFirstName,
                            patientLastName,
                            patientPhone,
                            patientEmail,
                            startTime: start,
                            endTime: end,
                            status: 'SCHEDULED',
                            bookedByAI: true,
                            notes,
                        },
                    });

                    this.logger.log(`Appointment booked: ${appointment.id}`);

                    return JSON.stringify({
                        success: true,
                        appointmentId: appointment.id,
                        startTime: appointment.startTime,
                        endTime: appointment.endTime,
                        message: `Appointment successfully booked for ${patientFirstName} ${patientLastName}`,
                    });
                } catch (error) {
                    this.logger.error('Error booking appointment:', error);
                    return JSON.stringify({ error: 'Failed to book appointment' });
                }
            },
        });
    }

    getRescheduleAppointmentTool() {
        return new DynamicStructuredTool({
            name: 'reschedule_appointment',
            description: 'Reschedule an existing appointment to a new time',
            schema: z.object({
                appointmentId: z.string().describe('The ID of the appointment to reschedule'),
                newStartTime: z.string().describe('New appointment start time (ISO 8601 format)'),
            }),
            func: async ({ appointmentId, newStartTime }) => {
                try {
                    const appointment = await this.prisma.appointment.findUnique({
                        where: { id: appointmentId },
                        include: { appointmentType: true },
                    });

                    if (!appointment) {
                        return JSON.stringify({ error: 'Appointment not found' });
                    }

                    const start = new Date(newStartTime);
                    const end = new Date(start.getTime() + appointment.appointmentType.duration * 60000);

                    // Check for conflicts
                    const conflicts = await this.prisma.appointment.findMany({
                        where: {
                            providerId: appointment.providerId,
                            id: { not: appointmentId },
                            status: { notIn: ['CANCELLED', 'NO_SHOW'] },
                            OR: [
                                { startTime: { lte: start }, endTime: { gt: start } },
                                { startTime: { lt: end }, endTime: { gte: end } },
                            ],
                        },
                    });

                    if (conflicts.length > 0) {
                        return JSON.stringify({ error: 'New time slot is not available' });
                    }

                    // Update appointment
                    const updated = await this.prisma.appointment.update({
                        where: { id: appointmentId },
                        data: {
                            startTime: start,
                            endTime: end,
                            status: 'RESCHEDULED',
                        },
                    });

                    return JSON.stringify({
                        success: true,
                        appointmentId: updated.id,
                        newStartTime: updated.startTime,
                        message: 'Appointment successfully rescheduled',
                    });
                } catch (error) {
                    this.logger.error('Error rescheduling appointment:', error);
                    return JSON.stringify({ error: 'Failed to reschedule appointment' });
                }
            },
        });
    }

    getCancelAppointmentTool() {
        return new DynamicStructuredTool({
            name: 'cancel_appointment',
            description: 'Cancel an existing appointment',
            schema: z.object({
                appointmentId: z.string().describe('The ID of the appointment to cancel'),
                reason: z.string().optional().describe('Reason for cancellation'),
            }),
            func: async ({ appointmentId, reason }) => {
                try {
                    const appointment = await this.prisma.appointment.update({
                        where: { id: appointmentId },
                        data: {
                            status: 'CANCELLED',
                            notes: reason ? `Cancelled: ${reason}` : 'Cancelled by patient',
                        },
                    });

                    return JSON.stringify({
                        success: true,
                        appointmentId: appointment.id,
                        message: 'Appointment successfully cancelled',
                    });
                } catch (error) {
                    this.logger.error('Error cancelling appointment:', error);
                    return JSON.stringify({ error: 'Failed to cancel appointment' });
                }
            },
        });
    }

    getAllTools() {
        return [
            this.getCheckAvailabilityTool(),
            this.getBookAppointmentTool(),
            this.getRescheduleAppointmentTool(),
            this.getCancelAppointmentTool(),
        ];
    }
}
