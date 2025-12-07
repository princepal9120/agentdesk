import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, User, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { bookAppointment, setBookingStep, resetBooking } from '@/store/slices/appointmentSlice';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useNavigate } from '@tanstack/react-router';

export const BookingConfirmation: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { selectedDoctor } = useAppSelector((state) => state.doctors);
    const { currentBooking, loading, error } = useAppSelector((state) => state.appointments);
    const { user } = useAppSelector((state) => state.auth);
    const [reason, setReason] = useState('');

    if (!selectedDoctor || !currentBooking.slot) {
        return <div>Missing booking details</div>;
    }

    if (!user?.patient_id) {
        return <div className="text-center py-8 text-error">Patient profile not found. Please contact support.</div>;
    }

    const appointmentDate = new Date(currentBooking.slot);

    const handleConfirm = async () => {
        const resultAction = await dispatch(bookAppointment({
            doctor_id: selectedDoctor.id,
            patient_id: user.patient_id!,
            start_time: currentBooking.slot!,
            reason: reason
        }));

        if (bookAppointment.fulfilled.match(resultAction)) {
            // Navigate to success page or dashboard
            navigate({ to: '/dashboard' });
        }
    };

    const handleBack = () => {
        dispatch(setBookingStep(2));
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Summary Card */}
                <Card className="p-6 space-y-6 h-fit">
                    <h3 className="text-lg font-semibold flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-primary" />
                        Appointment Summary
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Doctor</p>
                                <p className="font-medium">Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}</p>
                                <p className="text-sm text-primary">{selectedDoctor.specialization}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Date & Time</p>
                                <p className="font-medium">{format(appointmentDate, 'EEEE, MMMM d, yyyy')}</p>
                                <p className="text-sm text-primary">{format(appointmentDate, 'h:mm a')} (30 mins)</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Location</p>
                                <p className="font-medium">{selectedDoctor.clinic_address || 'Main Medical Center'}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Additional Details Form */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason for Visit (Optional)</Label>
                                <textarea
                                    id="reason"
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Briefly describe your symptoms or reason for visit..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>

                            <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
                                <p className="font-medium mb-1">Note:</p>
                                <p>Please arrive 15 minutes before your scheduled time. Bring your ID and insurance card.</p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-start text-sm">
                            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={handleBack} disabled={loading}>
                    Back
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={loading}
                    size="lg"
                    className="min-w-[150px]"
                >
                    {loading ? 'Confirming...' : 'Confirm Booking'}
                </Button>
            </div>
        </div>
    );
};
