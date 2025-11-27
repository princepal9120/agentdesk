'use client';

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CalendarComponent() {
    const [events, setEvents] = useState([
        { title: 'Meeting', start: new Date() }
    ]);

    const handleDateClick = (arg: any) => {
        alert('date click! ' + arg.dateStr);
    };

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Schedule</CardTitle>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Appointment
                </Button>
            </CardHeader>
            <CardContent>
                <div className="h-[600px]">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        weekends={true}
                        events={events}
                        dateClick={handleDateClick}
                        height="100%"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
