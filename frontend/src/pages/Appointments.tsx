import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyAppointments } from '@/store/slices/appointmentSlice';
import { AppointmentList } from '@/components/features/appointments/AppointmentList/AppointmentList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

const Appointments: React.FC = () => {
    const dispatch = useAppDispatch();
    const { appointments, loading } = useAppSelector((state) => state.appointments);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch =
            apt.doctor?.last_name.toLowerCase().includes(search.toLowerCase()) ||
            apt.doctor?.specialization.toLowerCase().includes(search.toLowerCase());

        const aptDate = new Date(apt.start_time);
        const now = new Date();

        let matchesFilter = true;
        if (filter === 'upcoming') {
            matchesFilter = aptDate >= now && ['scheduled', 'confirmed'].includes(apt.status);
        } else if (filter === 'past') {
            matchesFilter = aptDate < now || ['completed', 'cancelled', 'no_show'].includes(apt.status);
        }

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
                    <p className="text-muted-foreground mt-1">Manage your scheduled visits and history.</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
                    <Button
                        variant={filter === 'upcoming' ? 'default' : 'ghost'}
                        onClick={() => setFilter('upcoming')}
                        size="sm"
                    >
                        Upcoming
                    </Button>
                    <Button
                        variant={filter === 'past' ? 'default' : 'ghost'}
                        onClick={() => setFilter('past')}
                        size="sm"
                    >
                        Past
                    </Button>
                    <Button
                        variant={filter === 'all' ? 'default' : 'ghost'}
                        onClick={() => setFilter('all')}
                        size="sm"
                    >
                        All
                    </Button>
                </div>

                <div className="flex-1 w-full md:w-auto relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search doctor or specialty..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Button variant="outline" size="icon" className="shrink-0">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            <AppointmentList
                appointments={filteredAppointments}
                loading={loading}
                emptyMessage={
                    filter === 'upcoming'
                        ? "No upcoming appointments found."
                        : "No appointment history found."
                }
            />
        </div>
    );
};

export default Appointments;
