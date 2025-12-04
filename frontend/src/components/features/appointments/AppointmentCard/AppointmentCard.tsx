import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, Video } from 'lucide-react';
import { Appointment } from '../../../../types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface AppointmentCardProps {
    appointment: Appointment;
    onCancel?: (id: string) => void;
    onReschedule?: (id: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
    appointment,
    onCancel,
    onReschedule
}) => {
    const { doctor, start_time, status, is_telemedicine } = appointment;
    const date = parseISO(start_time);

    const statusColors = {
        scheduled: 'bg-blue-100 text-blue-700',
        confirmed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
        completed: 'bg-gray-100 text-gray-700',
        no_show: 'bg-orange-100 text-orange-700',
    };

    const isUpcoming = ['scheduled', 'confirmed'].includes(status);

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className={cn("h-1 w-full",
                status === 'confirmed' ? "bg-green-500" :
                    status === 'cancelled' ? "bg-red-500" :
                        "bg-blue-500"
            )} />

            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-semibold text-lg text-foreground">
                            Dr. {doctor?.first_name} {doctor?.last_name}
                        </h3>
                        <p className="text-sm text-primary font-medium">{doctor?.specialization}</p>
                    </div>
                    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium capitalize", statusColors[status])}>
                        {status.replace('_', ' ')}
                    </span>
                </div>

                <div className="space-y-2.5">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2.5 text-gray-400" />
                        <span>{format(date, 'EEEE, MMMM d, yyyy')}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2.5 text-gray-400" />
                        <span>{format(date, 'h:mm a')} (30 mins)</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                        {is_telemedicine ? (
                            <>
                                <Video className="w-4 h-4 mr-2.5 text-blue-500" />
                                <span className="text-blue-600 font-medium">Video Consultation</span>
                            </>
                        ) : (
                            <>
                                <MapPin className="w-4 h-4 mr-2.5 text-gray-400" />
                                <span>{doctor?.clinic_address || 'Main Medical Center'}</span>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>

            {isUpcoming && (
                <CardFooter className="bg-gray-50/50 p-4 flex justify-end space-x-3 border-t">
                    {onReschedule && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onReschedule(appointment.id)}
                        >
                            Reschedule
                        </Button>
                    )}
                    {onCancel && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onCancel(appointment.id)}
                        >
                            Cancel
                        </Button>
                    )}
                </CardFooter>
            )}
        </Card>
    );
};
