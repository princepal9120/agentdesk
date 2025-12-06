import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Calendar, Plus, Bell, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import { format } from 'date-fns';

async function fetchUpcomingAppointments() {
    const response = await api.get('/appointments');
    // Filter for future appointments and sort by date
    const now = new Date();
    return response.data.appointments
        .filter((appt: any) => new Date(appt.start_time) > now)
        .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
        .slice(0, 3); // Show top 3
}

export const PatientDashboard = () => {
    const { data: appointments = [], isLoading } = useQuery({
        queryKey: ['upcoming-appointments'],
        queryFn: fetchUpcomingAppointments,
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-grey-900">My Health Dashboard</h1>
                    <p className="text-grey-500">Welcome back, here's your health overview.</p>
                </div>
                <Link to="/appointments/book">
                    <Button className="bg-[#2BB59B] hover:bg-[#249A84] text-white rounded-xl">
                        <Plus className="w-4 h-4 mr-2" />
                        Book Appointment
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Upcoming Appointments */}
                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Upcoming Appointments</CardTitle>
                            <CardDescription>Your scheduled visits with doctors</CardDescription>
                        </div>
                        <Calendar className="w-5 h-5 text-grey-400" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8 text-grey-400">Loading appointments...</div>
                        ) : appointments.length > 0 ? (
                            <div className="space-y-4">
                                {appointments.map((appt: any) => (
                                    <div key={appt.id} className="flex items-start gap-4 p-4 bg-grey-50 rounded-2xl border border-grey-100">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#2BB59B] shadow-sm">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-grey-900">Dr. {appt.doctor_name}</h4>
                                            <p className="text-sm text-grey-500">{appt.reason_for_visit || 'General Checkup'}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-grey-500 font-medium">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {format(new Date(appt.start_time), 'PPP p')}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full ${appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                        appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-grey-500 mb-4">No upcoming appointments</p>
                                <Link to="/appointments/book">
                                    <Button variant="outline" className="rounded-xl">Book Now</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Notifications / Quick Actions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-3 items-start">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-[#2BB59B]" />
                                    <div>
                                        <p className="text-sm text-grey-900 font-medium">Appointment Confirmed</p>
                                        <p className="text-xs text-grey-500">Your visit with Dr. Smith is confirmed.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                                    <div>
                                        <p className="text-sm text-grey-900 font-medium">New Health Tip</p>
                                        <p className="text-xs text-grey-500">Stay hydrated during summer.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#2BB59B] text-white border-none">
                        <CardContent className="pt-6">
                            <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                            <p className="text-white/80 text-sm mb-4">Our support team is available 24/7 to assist you.</p>
                            <Button variant="secondary" className="w-full bg-white text-[#2BB59B] hover:bg-white/90 border-none">
                                Contact Support
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
