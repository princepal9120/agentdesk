import React, { useEffect, useState } from 'react';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchDoctorAvailability } from '../../../../store/slices/doctorSlice';
import { setBookingStep, updateBookingData } from '../../../../store/slices/appointmentSlice';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils/cn';

export const TimeSlotSelection: React.FC = () => {
    const dispatch = useAppDispatch();
    const { selectedDoctor, availableSlots, loading } = useAppSelector((state) => state.doctors);
    const { currentBooking } = useAppSelector((state) => state.appointments);

    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
    const [selectedSlot, setSelectedSlot] = useState<string | null>(currentBooking.slot);

    // Generate next 14 days
    const dates = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

    useEffect(() => {
        if (selectedDoctor) {
            dispatch(fetchDoctorAvailability({
                doctorId: selectedDoctor.id,
                date: format(selectedDate, 'yyyy-MM-dd')
            }));
        }
    }, [dispatch, selectedDoctor, selectedDate]);

    const handleSlotSelect = (slot: string) => {
        setSelectedSlot(slot);
    };

    const handleNext = () => {
        if (selectedSlot) {
            dispatch(updateBookingData({ slot: selectedSlot }));
            dispatch(setBookingStep(3));
        }
    };

    const handleBack = () => {
        dispatch(setBookingStep(1));
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Select Date & Time</h3>
                <div className="text-sm text-muted-foreground">
                    for Dr. {selectedDoctor?.first_name} {selectedDoctor?.last_name}
                </div>
            </div>

            {/* Date Scroller */}
            <div className="relative">
                <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
                    {dates.map((date) => {
                        const isSelected = isSameDay(date, selectedDate);
                        return (
                            <button
                                key={date.toString()}
                                onClick={() => {
                                    setSelectedDate(date);
                                    setSelectedSlot(null);
                                }}
                                className={cn(
                                    "flex flex-col items-center justify-center min-w-[80px] h-20 rounded-xl border transition-all",
                                    isSelected
                                        ? "bg-primary text-white border-primary shadow-md"
                                        : "bg-white border-gray-200 hover:border-primary/50 text-neutral-dark"
                                )}
                            >
                                <span className="text-xs font-medium uppercase">{format(date, 'EEE')}</span>
                                <span className="text-xl font-bold mt-1">{format(date, 'd')}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Slots */}
            <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                    Available Slots for {format(selectedDate, 'EEEE, MMMM d')}
                </h4>

                {loading ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {Array(8).fill(0).map((_, i) => (
                            <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-md" />
                        ))}
                    </div>
                ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {availableSlots.map((slot) => {
                            const isSelected = selectedSlot === slot.start_time;
                            return (
                                <button
                                    key={slot.start_time}
                                    onClick={() => handleSlotSelect(slot.start_time)}
                                    className={cn(
                                        "flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium border transition-all",
                                        isSelected
                                            ? "bg-primary text-white border-primary shadow-sm"
                                            : "bg-white text-neutral-dark border-gray-200 hover:border-primary hover:bg-primary/5"
                                    )}
                                >
                                    {format(new Date(slot.start_time), 'h:mm a')}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
                        <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No slots available for this date.</p>
                        <Button
                            variant="link"
                            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                        >
                            Check next day
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={handleBack}>
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={!selectedSlot}
                    size="lg"
                >
                    Continue to Confirm
                </Button>
            </div>
        </div>
    );
};
