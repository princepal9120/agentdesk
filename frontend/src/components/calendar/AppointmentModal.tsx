'use client';

import { useState } from 'react';
import { X, Phone, Mail, Calendar, Clock, User } from 'lucide-react';
import type { Appointment } from '@/types/models';
import { formatDate, formatTime, formatPhoneNumber } from '@/lib/utils/helpers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AppointmentModalProps {
    appointment: Appointment | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (appointment: Appointment) => void;
    onCancel?: (appointment: Appointment) => void;
    onReschedule?: (appointment: Appointment) => void;
}

export function AppointmentModal({
    appointment,
    isOpen,
    onClose,
    onEdit,
    onCancel,
    onReschedule,
}: AppointmentModalProps) {
    if (!isOpen || !appointment) return null;

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any; label: string }> = {
            confirmed: { variant: 'default', label: 'Confirmed' },
            pending: { variant: 'secondary', label: 'Pending' },
            cancelled: { variant: 'outline', label: 'Cancelled' },
            completed: { variant: 'default', label: 'Completed' },
            'no-show': { variant: 'destructive', label: 'No-Show' },
        };

        const config = variants[status] || variants.confirmed;
        return <Badge variant={config.variant as any}>{config.label}</Badge>;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Appointment Details
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {formatDate(appointment.date)} at {formatTime(appointment.startTime)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status */}
                    <div className="flex items-center gap-3">
                        {getStatusBadge(appointment.status)}
                        {appointment.noShowRisk && (
                            <Badge variant="destructive">High No-Show Risk</Badge>
                        )}
                        <Badge variant="outline">
                            {appointment.bookingSource === 'ai-voice' ? '🤖 AI Booked' : '👤 Manual'}
                        </Badge>
                    </div>

                    {/* Patient Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="h-4 w-4" />
                                <span className="font-medium">Patient Name</span>
                            </div>
                            <p className="text-gray-900 font-medium">{appointment.patientName}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4" />
                                <span className="font-medium">Phone</span>
                            </div>
                            <p className="text-gray-900">
                                {formatPhoneNumber(appointment.patientPhone)}
                            </p>
                        </div>

                        {appointment.patientEmail && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="h-4 w-4" />
                                    <span className="font-medium">Email</span>
                                </div>
                                <p className="text-gray-900">{appointment.patientEmail}</p>
                            </div>
                        )}
                    </div>

                    {/* Appointment Info */}
                    <div className="border-t pt-4 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span className="font-medium">Appointment Type</span>
                                </div>
                                <p className="text-gray-900">{appointment.appointmentType}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-medium">Duration</span>
                                </div>
                                <p className="text-gray-900">{appointment.duration} minutes</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">Provider</span>
                                </div>
                                <p className="text-gray-900">{appointment.providerName}</p>
                            </div>
                        </div>

                        {appointment.notes && (
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-gray-600">Notes</div>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded">
                                    {appointment.notes}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Reminder Status */}
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Reminder Status</span>
                            <span
                                className={`text-sm font-medium ${appointment.reminderSent ? 'text-green-600' : 'text-yellow-600'
                                    }`}
                            >
                                {appointment.reminderSent ? '✓ Sent' : 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="border-t p-6 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    {appointment.status !== 'cancelled' && (
                        <>
                            {onReschedule && (
                                <Button
                                    variant="outline"
                                    onClick={() => onReschedule(appointment)}
                                >
                                    Reschedule
                                </Button>
                            )}
                            {onEdit && (
                                <Button onClick={() => onEdit(appointment)}>Edit</Button>
                            )}
                            {onCancel && (
                                <Button
                                    variant="destructive"
                                    onClick={() => onCancel(appointment)}
                                >
                                    Cancel Appointment
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
