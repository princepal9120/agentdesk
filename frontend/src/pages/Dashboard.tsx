import React, { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Plus, Calendar, Activity, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyAppointments } from '@/store/slices/appointmentSlice';
import { AppointmentList } from '@/components/features/appointments/AppointmentList/AppointmentList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DoctorDashboard from './DoctorDashboard';

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { appointments, loading } = useAppSelector((state) => state.appointments);

    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    // If user is a doctor, render the Doctor Dashboard
    if (user?.role === 'doctor') {
        return <DoctorDashboard />;
    }

    const upcomingAppointments = appointments
        .filter(a => ['scheduled', 'confirmed'].includes(a.status))
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
        .slice(0, 3); // Show top 3

    // Mock stats
    const stats = [
        { label: 'Upcoming', value: upcomingAppointments.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Pending', value: appointments.filter(a => a.status === 'scheduled').length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Welcome back, {user?.full_name?.split(' ')[0] || 'Patient'}!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here's what's happening with your health appointments.
                    </p>
                </div>
                <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                    <Link to="/appointments/book">
                        <Plus className="w-5 h-5 mr-2" />
                        Book Appointment
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-none shadow-md">
                        <CardContent className="p-6 flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Upcoming Appointments */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">Upcoming Appointments</h2>
                    <Button variant="link" asChild className="text-primary">
                        <Link to="/appointments">View All</Link>
                    </Button>
                </div>

                <AppointmentList
                    appointments={upcomingAppointments}
                    loading={loading}
                    emptyMessage="You have no upcoming appointments scheduled."
                />
            </div>

            {/* Quick Actions / Promo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-primary to-primary-active text-white border-none">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold mb-2">Need Urgent Care?</h3>
                        <p className="text-blue-100 mb-6">
                            Our AI Voice Agent is available 24/7 to help you find the nearest available doctor immediately.
                        </p>
                        <Button variant="secondary" className="text-primary hover:text-primary">
                            Call Voice Agent
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Mock Activity Feed */}
                            <div className="flex items-start space-x-3 text-sm">
                                <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                                <div>
                                    <p className="font-medium">Appointment Confirmed</p>
                                    <p className="text-muted-foreground">Your visit with Dr. Smith is confirmed for tomorrow.</p>
                                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 text-sm">
                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                                <div>
                                    <p className="font-medium">Login Detected</p>
                                    <p className="text-muted-foreground">New login from Chrome on Mac OS X.</p>
                                    <p className="text-xs text-gray-400 mt-1">Just now</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
