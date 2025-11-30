'use client';

import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid/index.js';
import dayGridPlugin from '@fullcalendar/daygrid/index.js';
import interactionPlugin from '@fullcalendar/interaction/index.js';
import type { EventClickArg, DateSelectArg } from '@fullcalendar/core/index.js';
import { useAppointments } from '@/lib/hooks/useAppointments';
import { toast } from 'sonner';
import type { Appointment } from '@/types/models';

interface CalendarComponentProps {
    onEventClick?: (appointment: Appointment) => void;
    onDateSelect?: (start: Date, end: Date) => void;
}

export function CalendarComponent({
    onEventClick,
    onDateSelect,
}: CalendarComponentProps) {
    const calendarRef = useRef<FullCalendar>(null);
    const { appointments, isLoading } = useAppointments();

    // Transform appointments to FullCalendar events
    const events = appointments.map((apt) => ({
        id: apt.id,
        title: `${apt.patientName} - ${apt.appointmentType}`,
        start: `${apt.date}T${apt.startTime}`,
        end: `${apt.date}T${apt.endTime}`,
        backgroundColor: getEventColor(apt.status, apt.bookingSource),
        borderColor: getEventColor(apt.status, apt.bookingSource),
        extendedProps: apt,
    }));

    const handleEventClick = (info: EventClickArg) => {
        const appointment = info.event.extendedProps as Appointment;
        if (onEventClick) {
            onEventClick(appointment);
        }
    };

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        if (onDateSelect) {
            onDateSelect(selectInfo.start, selectInfo.end);
        }
    };

    return (
        <div className="bg-white rounded-lg border p-4">
            <FullCalendar
                ref={calendarRef}
                plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={events}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                slotMinTime="08:00:00"
                slotMaxTime="18:00:00"
                slotDuration="00:15:00"
                height="auto"
                eventClick={handleEventClick}
                select={handleDateSelect}
                eventDrop={(info) => {
                    toast.success('Appointment rescheduled');
                }}
                loading={(isLoading) => {
                    // Handle loading state
                }}
            />
        </div>
    );
}

function getEventColor(
    status: string,
    source: string
): string {
    // Color coding from constants
    if (status === 'confirmed' && source === 'ai-voice') return '#10b981'; // green
    if (status === 'confirmed' && source === 'manual') return '#3b82f6'; // blue
    if (status === 'pending') return '#f59e0b'; // yellow
    if (status === 'no-show' || status === 'cancelled') return '#ef4444'; // red
    return '#64748b'; // gray
}
