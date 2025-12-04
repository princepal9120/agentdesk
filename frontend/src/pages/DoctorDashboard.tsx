import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
    Calendar,
    Users,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    MoreHorizontal,
    Phone
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyAppointments } from '@/store/slices/appointmentSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DoctorDashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { appointments, loading } = useAppSelector((state) => state.appointments);
    const [stats, setStats] = useState({
        today: 0,
        pending: 0,
        completed: 0,
        revenue: 0
    });

    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    useEffect(() => {
        if (appointments.length) {
            const today = new Date().toISOString().split('T')[0];
            const todayAppts = appointments.filter(a => a.start_time.startsWith(today));

            setStats({
                today: todayAppts.length,
                pending: appointments.filter(a => a.status === 'scheduled').length,
                completed: appointments.filter(a => a.status === 'completed').length,
                revenue: appointments.filter(a => a.status === 'completed').length * 150 // Mock $150/visit
            });
        }
    }, [appointments]);

    const todayAppointments = appointments
        .filter(a => {
            const today = new Date().toISOString().split('T')[0];
            return a.start_time.startsWith(today) && ['scheduled', 'confirmed'].includes(a.status);
        })
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Dr. {user?.full_name?.split(' ')[1] || 'Doctor'}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here's your daily overview and schedule.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        View Calendar
                    </Button>
                    <Button>
                        <Clock className="w-4 h-4 mr-2" />
                        Manage Availability
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Appointments Today</p>
                            <h3 className="text-2xl font-bold">{stats.today}</h3>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                            <h3 className="text-2xl font-bold">{stats.pending}</h3>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                            <h3 className="text-2xl font-bold">{appointments.length}</h3>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Est. Revenue</p>
                            <h3 className="text-2xl font-bold">${stats.revenue}</h3>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Today's Schedule (Left 2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Today's Schedule</h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/appointments">View All</Link>
                        </Button>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl" />
                            ))}
                        </div>
                    ) : todayAppointments.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="p-12 text-center text-muted-foreground">
                                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No appointments scheduled for today.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {todayAppointments.map((apt) => (
                                <Card key={apt.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-50 rounded-lg text-blue-700">
                                                <span className="text-sm font-bold">
                                                    {new Date(apt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="text-xs uppercase">
                                                    {new Date(apt.start_time).toLocaleTimeString([], { hour12: true }).split(' ')[1]}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-lg">{apt.patient?.user?.full_name || 'Unknown Patient'}</h4>
                                                <div className="flex items-center text-sm text-muted-foreground gap-3">
                                                    <span className="flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        30 min
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Phone className="w-3 h-3 mr-1" />
                                                        {apt.patient?.user?.phone_number}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Start
                                            </Button>
                                            <Button size="icon" variant="ghost">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar (Right 1/3) */}
                <div className="space-y-6">
                    {/* Notifications / Alerts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Alerts & Notifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg text-sm">
                                <Clock className="w-4 h-4 text-yellow-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-yellow-800">High No-Show Risk</p>
                                    <p className="text-yellow-700">2 patients today have a history of no-shows.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg text-sm">
                                <Users className="w-4 h-4 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-blue-800">New Patient</p>
                                    <p className="text-blue-700">Sarah Connor is a first-time visitor.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">
                                <XCircle className="w-4 h-4 mr-2" />
                                Block Time Slot
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Users className="w-4 h-4 mr-2" />
                                Patient Directory
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
