/**
 * Clinical Minimalism Analytics Page
 * Minimal charts with pastel color palette, rounded chart containers.
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import {
    TrendingUp, TrendingDown, Phone, Calendar, Clock,
    Users, BarChart2, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

const Analytics: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.analytics-card', {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const metrics = [
        { label: 'Total Calls', value: '2,847', change: '+12.5%', trending: 'up', icon: Phone, color: 'bg-[#D7EAFB]' },
        { label: 'Appointments Booked', value: '486', change: '+8.2%', trending: 'up', icon: Calendar, color: 'bg-[#ECFDF5]' },
        { label: 'Avg Call Duration', value: '2m 34s', change: '-15s', trending: 'down', icon: Clock, color: 'bg-[#FFF7ED]' },
        { label: 'Patient Satisfaction', value: '98.2%', change: '+1.5%', trending: 'up', icon: Users, color: 'bg-[#FAF5FF]' },
    ];

    // Simulated chart data
    const chartData = [40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95];
    const weeklyData = [
        { day: 'Mon', calls: 45, appointments: 12 },
        { day: 'Tue', calls: 52, appointments: 15 },
        { day: 'Wed', calls: 48, appointments: 10 },
        { day: 'Thu', calls: 61, appointments: 18 },
        { day: 'Fri', calls: 55, appointments: 14 },
        { day: 'Sat', calls: 30, appointments: 8 },
        { day: 'Sun', calls: 22, appointments: 5 },
    ];

    return (
        <div ref={containerRef} className="max-w-7xl mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-semibold text-grey-900 tracking-tight">Analytics</h1>
                    <p className="text-grey-500 mt-2">Track your practice performance and insights.</p>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-grey-100">
                    {['7D', '30D', '90D', '1Y'].map((period, i) => (
                        <button
                            key={period}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                i === 0 ? "bg-grey-900 text-white" : "text-grey-500 hover:text-grey-900"
                            )}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {metrics.map((metric, i) => {
                    const Icon = metric.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="analytics-card p-5 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", metric.color)}>
                                        <Icon className="w-5 h-5 text-grey-600" />
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                                        metric.trending === 'up'
                                            ? "bg-success-light text-success"
                                            : "bg-grey-100 text-grey-600"
                                    )}>
                                        {metric.trending === 'up' ? (
                                            <ArrowUpRight className="w-3 h-3" />
                                        ) : (
                                            <ArrowDownRight className="w-3 h-3" />
                                        )}
                                        {metric.change}
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-grey-900">{metric.value}</div>
                                <div className="text-sm text-grey-500 mt-1">{metric.label}</div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <Card className="analytics-card lg:col-span-2 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-grey-900">Call Volume Trend</h3>
                            <p className="text-sm text-grey-500">Last 12 months performance</p>
                        </div>
                        <Badge variant="softBlue">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +24% YoY
                        </Badge>
                    </div>

                    {/* Bar Chart */}
                    <div className="h-64 flex items-end justify-between gap-3 px-2">
                        {chartData.map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${value}%` }}
                                transition={{ duration: 0.8, delay: i * 0.05 }}
                                className="flex-1 bg-[#D7EAFB] rounded-t-xl relative group cursor-pointer hover:bg-[#2BB59B] transition-colors"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-grey-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    {value}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-grey-400">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                            <span key={i}>{m}</span>
                        ))}
                    </div>
                </Card>

                {/* Weekly Breakdown */}
                <Card className="analytics-card p-6">
                    <h3 className="font-semibold text-grey-900 mb-6">Weekly Breakdown</h3>

                    <div className="space-y-4">
                        {weeklyData.map((day, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 text-sm font-medium text-grey-500">{day.day}</div>
                                <div className="flex-1 flex items-center gap-2">
                                    <div
                                        className="h-2 bg-[#2BB59B] rounded-full"
                                        style={{ width: `${(day.calls / 70) * 100}%` }}
                                    />
                                </div>
                                <div className="text-sm font-medium text-grey-900">{day.calls}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-grey-100">
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#2BB59B]" />
                                <span className="text-grey-500">Calls</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#D7EAFB]" />
                                <span className="text-grey-500">Appointments</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Top Insights */}
                <Card className="analytics-card lg:col-span-2 p-6">
                    <h3 className="font-semibold text-grey-900 mb-6">Key Insights</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { title: 'Peak Hours', value: '9AM - 11AM', desc: 'Best time for patient calls', icon: Clock },
                            { title: 'Conversion Rate', value: '78%', desc: 'Calls leading to bookings', icon: TrendingUp },
                            { title: 'Top Specialty', value: 'General Check-up', desc: 'Most booked appointment type', icon: Activity },
                            { title: 'Avg Wait Time', value: '< 30s', desc: 'Time before AI answers', icon: Phone },
                        ].map((insight, i) => {
                            const Icon = insight.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex items-start gap-4 p-4 bg-grey-50 rounded-2xl"
                                >
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Icon className="w-5 h-5 text-[#2BB59B]" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-grey-500">{insight.title}</div>
                                        <div className="text-lg font-semibold text-grey-900">{insight.value}</div>
                                        <div className="text-xs text-grey-400 mt-1">{insight.desc}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Sentiment Analysis */}
                <Card className="analytics-card p-6">
                    <h3 className="font-semibold text-grey-900 mb-6">Patient Sentiment</h3>

                    <div className="space-y-4">
                        {[
                            { label: 'Positive', value: 85, color: 'bg-success' },
                            { label: 'Neutral', value: 12, color: 'bg-grey-300' },
                            { label: 'Negative', value: 3, color: 'bg-error' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-grey-600">{item.label}</span>
                                    <span className="font-medium text-grey-900">{item.value}%</span>
                                </div>
                                <div className="h-2 bg-grey-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                                        className={cn("h-full rounded-full", item.color)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
