import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setBookingStep, resetBooking } from '@/store/slices/appointmentSlice';
import { DoctorSelection } from '@/components/features/appointments/BookingFlow/DoctorSelection';
import { TimeSlotSelection } from '@/components/features/appointments/BookingFlow/TimeSlotSelection';
import { BookingConfirmation } from '@/components/features/appointments/BookingFlow/BookingConfirmation';
import { cn } from '@/utils/cn';

const BookAppointment: React.FC = () => {
    const dispatch = useAppDispatch();
    const { currentBooking } = useAppSelector((state) => state.appointments);
    const { step } = currentBooking;

    // Reset booking state on mount
    useEffect(() => {
        dispatch(resetBooking());
    }, [dispatch]);

    const steps = [
        { number: 1, title: 'Select Doctor' },
        { number: 2, title: 'Date & Time' },
        { number: 3, title: 'Confirm' },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Book an Appointment</h1>
                <p className="text-muted-foreground">Schedule a visit with one of our specialists.</p>
            </div>

            {/* Progress Stepper */}
            <div className="mb-10">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />

                    {steps.map((s) => {
                        const isActive = s.number === step;
                        const isCompleted = s.number < step;

                        return (
                            <div key={s.number} className="flex flex-col items-center bg-background px-4">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-200 border-2",
                                        isActive ? "bg-primary text-white border-primary" :
                                            isCompleted ? "bg-green-500 text-white border-green-500" :
                                                "bg-white text-gray-400 border-gray-200"
                                    )}
                                >
                                    {isCompleted ? '✓' : s.number}
                                </div>
                                <span className={cn(
                                    "mt-2 text-sm font-medium",
                                    isActive ? "text-primary" :
                                        isCompleted ? "text-green-600" :
                                            "text-gray-400"
                                )}>
                                    {s.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 min-h-[400px]">
                {step === 1 && <DoctorSelection />}
                {step === 2 && <TimeSlotSelection />}
                {step === 3 && <BookingConfirmation />}
            </div>
        </div>
    );
};

export default BookAppointment;
