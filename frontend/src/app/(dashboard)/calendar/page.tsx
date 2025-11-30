'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarComponent } from '@/components/calendar/CalendarView';
import { AppointmentModal } from '@/components/calendar/AppointmentModal';
import type { Appointment } from '@/types/models';
import { useAppointments } from '@/lib/hooks/useAppointments';

export default function CalendarPage() {
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { appointments } = useAppointments();

    const handleEventClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
    };

    // Calculate stats
    const todayAppointments = appointments.filter(
        (apt) => apt.date === new Date().toISOString().split('T')[0]
    );
    const confirmedCount = todayAppointments.filter((apt) => apt.status === 'confirmed').length;
    const pendingCount = todayAppointments.filter((apt) => apt.status === 'pending').length;
    const noShowRiskCount = todayAppointments.filter((apt) => apt.noShowRisk).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your appointments and schedule
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Appointment
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Today's Appointments
                        </CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayAppointments.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Total scheduled
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Confirmed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{confirmedCount}</div>
                        <p className="text-xs text-green-600">
                            {todayAppointments.length > 0
                                ? Math.round((confirmedCount / todayAppointments.length) * 100)
                                : 0}% confirmed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingCount}</div>
                        <p className="text-xs text-yellow-600">Awaiting confirmation</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            No-Show Risk
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{noShowRiskCount}</div>
                        <p className="text-xs text-red-600">Requires follow-up</p>
                    </CardContent>
                </Card>
            </div>

            {/* Calendar */}
            <CalendarComponent
                onEventClick={handleEventClick}
                onDateSelect={(start, end) => {
                    // Handle date selection for new appointment
                    console.log('Date selected:', start, end);
                }}
            />

            {/* Appointment Detail Modal */}
            <AppointmentModal
                appointment={selectedAppointment}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onEdit={(apt) => {
                    console.log('Edit appointment:', apt);
                }}
                onCancel={(apt) => {
                    console.log('Cancel appointment:', apt);
                    handleCloseModal();
                }}
                onReschedule={(apt) => {
                    console.log('Reschedule appointment:', apt);
                }}
            />
        </div>
    );
}
