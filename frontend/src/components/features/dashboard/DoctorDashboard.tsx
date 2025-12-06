import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Users, Clock, Activity, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import { format, isToday } from 'date-fns';

async function fetchDoctorAppointments() {
    const response = await api.get('/appointments');
    // Filter for today's appointments
    return response.data.appointments
        .filter((appt: any) => isToday(new Date(appt.start_time)))
        .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
}

export const DoctorDashboard = () => {
    const { data: appointments = [], isLoading } = useQuery({
        queryKey: ['doctor-appointments-today'],
        queryFn: fetchDoctorAppointments,
    });

    const stats = [
        { label: 'Appointments Today', value: appointments.length.toString(), icon: Calendar, color: 'text-blue-600 bg-blue-50' },
        { label: 'Total Patients', value: '1,248', icon: Users, color: 'text-green-600 bg-green-50' },
        { label: 'Avg. Consult Time', value: '18m', icon: Clock, color: 'text-orange-600 bg-orange-50' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-grey-900">Doctor Dashboard</h1>
                    <p className="text-grey-500">Overview of your practice today.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl">View Calendar</Button>
                    <Button className="bg-[#2BB59B] hover:bg-[#249A84] text-white rounded-xl">Start Consult</Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i}>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-grey-500 font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-grey-900">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Today's Schedule</CardTitle>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreHorizontal className="w-5 h-5 text-grey-400" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8 text-grey-400">Loading schedule...</div>
                        ) : appointments.length > 0 ? (
                            <div className="space-y-0 divide-y divide-grey-100">
                                {appointments.map((appt: any) => (
                                    <div key={appt.id} className="flex items-center gap-4 py-4 hover:bg-grey-50/50 transition-colors px-2 rounded-xl">
                                        <div className="w-16 text-center">
                                            <div className="text-sm font-bold text-grey-900">{format(new Date(appt.start_time), 'h:mm')}</div>
                                            <div className="text-xs text-grey-500">{format(new Date(appt.start_time), 'a')}</div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-grey-100 flex items-center justify-center text-grey-500 font-medium">
                                            {appt.patient_name ? appt.patient_name.charAt(0) : 'P'}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-grey-900">{appt.patient_name || 'Unknown Patient'}</h4>
                                            <p className="text-xs text-grey-500">{appt.reason_for_visit || 'Consultation'}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-grey-100 text-grey-700'
                                            }`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Activity className="w-12 h-12 text-grey-200 mx-auto mb-3" />
                                <p className="text-grey-500">No appointments scheduled for today.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Patient Queue / Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Queue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-blue-200 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Next</span>
                                    <span className="text-xs text-blue-600 font-mono">10:00 AM</span>
                                </div>
                                <h4 className="font-bold text-blue-900">Sarah Johnson</h4>
                                <p className="text-xs text-blue-700 mt-1">Follow-up: Hypertension</p>
                                <div className="mt-3 flex gap-2">
                                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs rounded-lg">Call Patient</Button>
                                </div>
                            </div>

                            <div className="text-center pt-4">
                                <p className="text-xs text-grey-400">Queue is empty after this.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
