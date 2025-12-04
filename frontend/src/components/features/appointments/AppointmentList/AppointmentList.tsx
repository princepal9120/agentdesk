import React from 'react';
import { Appointment } from '../../../../types';
import { AppointmentCard } from '../AppointmentCard/AppointmentCard';
import { CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface AppointmentListProps {
    appointments: Appointment[];
    loading?: boolean;
    onCancel?: (id: string) => void;
    onReschedule?: (id: string) => void;
    emptyMessage?: string;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
    appointments,
    loading,
    onCancel,
    onReschedule,
    emptyMessage = "No appointments found."
}) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    if (appointments.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
                <CalendarX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Appointments</h3>
                <p className="text-muted-foreground mb-6">{emptyMessage}</p>
                <Button asChild>
                    <Link to="/appointments/book">Book New Appointment</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((apt) => (
                <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    onCancel={onCancel}
                    onReschedule={onReschedule}
                />
            ))}
        </div>
    );
};
