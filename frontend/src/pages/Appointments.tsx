/**
 * Clinical Minimalism Appointments Page
 * Calendar with rounded cells, teal events, soft blue hover states.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyAppointments } from '@/store/slices/appointmentSlice';
import { AppointmentList } from '@/components/features/appointments/AppointmentList/AppointmentList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

const Appointments: React.FC = () => {
    const dispatch = useAppDispatch();
    const { appointments, loading } = useAppSelector((state) => state.appointments);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    // GSAP entrance animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.appointments-element', {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power2.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

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

    const stats = [
        { label: 'Upcoming', value: appointments.filter(a => new Date(a.start_time) >= new Date() && ['scheduled', 'confirmed'].includes(a.status)).length, color: 'bg-[#2BB59B]' },
        { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, color: 'bg-info' },
        { label: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length, color: 'bg-grey-400' },
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-grey-50">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="appointments-element mb-8"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-semibold text-grey-900 tracking-tight">My Appointments</h1>
                            <p className="text-grey-500 mt-2">Manage your scheduled visits and history.</p>
                        </div>
                        <Button className="shrink-0">
                            <Calendar className="w-4 h-4 mr-2" />
                            Book New
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="appointments-element grid grid-cols-3 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -2 }}
                            className="bg-white rounded-2xl p-5 border border-grey-100 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn("w-3 h-3 rounded-full", stat.color)} />
                                <span className="text-sm text-grey-500 font-medium">{stat.label}</span>
                            </div>
                            <div className="text-2xl font-semibold text-grey-900 mt-2">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters & Search */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="appointments-element bg-white rounded-3xl p-5 border border-grey-100 shadow-sm mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Filter Tabs */}
                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto bg-grey-50 rounded-full p-1">
                            {[
                                { key: 'upcoming', label: 'Upcoming' },
                                { key: 'past', label: 'Past' },
                                { key: 'all', label: 'All' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key as typeof filter)}
                                    className={cn(
                                        "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                        filter === tab.key
                                            ? "bg-white text-grey-900 shadow-sm"
                                            : "text-grey-500 hover:text-grey-700"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="flex-1 w-full md:w-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-400" />
                            <Input
                                placeholder="Search doctor or specialty..."
                                className="pl-11 h-11 rounded-full bg-grey-50 border-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Filter Button */}
                        <Button variant="outline" size="icon" className="shrink-0 rounded-full">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </motion.div>

                {/* Mini Calendar Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="appointments-element bg-white rounded-3xl p-6 border border-grey-100 shadow-sm mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-grey-900">December 2024</h3>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full bg-grey-50 hover:bg-grey-100 flex items-center justify-center transition-colors">
                                <ChevronLeft className="w-4 h-4 text-grey-600" />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-grey-50 hover:bg-grey-100 flex items-center justify-center transition-colors">
                                <ChevronRight className="w-4 h-4 text-grey-600" />
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <div key={i} className="text-xs font-medium text-grey-400 py-2">{day}</div>
                        ))}
                        {Array.from({ length: 35 }, (_, i) => {
                            const day = i - 6 + 1; // Adjust for December starting day
                            const isValid = day > 0 && day <= 31;
                            const isToday = day === 4;
                            const hasAppointment = [5, 10, 15, 22].includes(day);

                            return (
                                <button
                                    key={i}
                                    className={cn(
                                        "aspect-square rounded-xl text-sm font-medium transition-all duration-200",
                                        !isValid && "invisible",
                                        isValid && "hover:bg-[#D7EAFB]/50",
                                        isToday && "bg-[#2BB59B] text-white hover:bg-[#249A84]",
                                        hasAppointment && !isToday && "bg-[#D7EAFB] text-[#1B5E7A]"
                                    )}
                                >
                                    {isValid ? day : ''}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Appointments List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="appointments-element"
                >
                    <AppointmentList
                        appointments={filteredAppointments}
                        loading={loading}
                        emptyMessage={
                            filter === 'upcoming'
                                ? "No upcoming appointments found."
                                : "No appointment history found."
                        }
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default Appointments;
