/**
 * Clinical Minimalism Call Logs Page
 * Minimal list layout, thin borders separating rows, soft highlight colors.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import {
    Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed,
    Search, Filter, Clock, Calendar, User, Play,
    ChevronRight, Download, MoreHorizontal
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

const CallLogs: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedCall, setSelectedCall] = useState<number | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.call-item', {
                y: 10,
                opacity: 0,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power2.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const calls = [
        {
            id: 1,
            caller: 'Jane Smith',
            phone: '+1 (555) 123-4567',
            type: 'incoming',
            status: 'completed',
            duration: '4m 32s',
            time: '10:30 AM',
            date: 'Today',
            summary: 'Patient called to schedule annual check-up. Appointment booked for Dec 15.',
            keywords: ['appointment', 'check-up', 'December']
        },
        {
            id: 2,
            caller: 'John Doe',
            phone: '+1 (555) 987-6543',
            type: 'incoming',
            status: 'completed',
            duration: '2m 15s',
            time: '9:45 AM',
            date: 'Today',
            summary: 'Prescription refill request for blood pressure medication.',
            keywords: ['prescription', 'refill', 'medication']
        },
        {
            id: 3,
            caller: 'Unknown',
            phone: '+1 (555) 111-2222',
            type: 'missed',
            status: 'missed',
            duration: '-',
            time: '9:12 AM',
            date: 'Today',
            summary: 'Missed call, no voicemail left.',
            keywords: []
        },
        {
            id: 4,
            caller: 'Mary Johnson',
            phone: '+1 (555) 333-4444',
            type: 'outgoing',
            status: 'completed',
            duration: '6m 48s',
            time: '4:30 PM',
            date: 'Yesterday',
            summary: 'Follow-up call regarding test results. Patient confirmed receipt.',
            keywords: ['test results', 'follow-up', 'confirmed']
        },
        {
            id: 5,
            caller: 'Robert Williams',
            phone: '+1 (555) 555-6666',
            type: 'incoming',
            status: 'completed',
            duration: '3m 22s',
            time: '2:15 PM',
            date: 'Yesterday',
            summary: 'Emergency appointment request. Scheduled same-day visit.',
            keywords: ['emergency', 'urgent', 'same-day']
        },
    ];

    const stats = [
        { label: 'Total Calls', value: '147', icon: Phone },
        { label: 'Avg Duration', value: '3m 45s', icon: Clock },
        { label: 'Missed', value: '12', icon: PhoneMissed },
    ];

    const getCallIcon = (type: string) => {
        switch (type) {
            case 'incoming': return <PhoneIncoming className="w-4 h-4 text-success" />;
            case 'outgoing': return <PhoneOutgoing className="w-4 h-4 text-info" />;
            case 'missed': return <PhoneMissed className="w-4 h-4 text-error" />;
            default: return <Phone className="w-4 h-4 text-grey-400" />;
        }
    };

    return (
        <div ref={containerRef} className="max-w-6xl mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-semibold text-grey-900 tracking-tight">Call Logs</h1>
                <p className="text-grey-500 mt-2">View and manage your call history and transcripts.</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-grey-50 rounded-xl flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-grey-500" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-grey-900">{stat.value}</div>
                                    <div className="text-sm text-grey-500">{stat.label}</div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Search & Filters */}
            <Card className="p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                        <Input
                            placeholder="Search calls by name, phone, or keywords..."
                            className="pl-11 rounded-full bg-grey-50 border-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-full">
                            <Calendar className="w-4 h-4 mr-2" />
                            Date Range
                        </Button>
                        <Button variant="outline" className="rounded-full">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Call List */}
            <Card className="overflow-hidden">
                {calls.map((call, i) => (
                    <motion.div
                        key={call.id}
                        className={cn(
                            "call-item p-5 cursor-pointer transition-all",
                            i !== calls.length - 1 && "border-b border-grey-100",
                            selectedCall === call.id ? "bg-[#D7EAFB]/20" : "hover:bg-grey-50"
                        )}
                        onClick={() => setSelectedCall(selectedCall === call.id ? null : call.id)}
                    >
                        <div className="flex items-center gap-4">
                            {/* Call Type Icon */}
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                call.type === 'incoming' && "bg-success-light",
                                call.type === 'outgoing' && "bg-info-light",
                                call.type === 'missed' && "bg-error-light"
                            )}>
                                {getCallIcon(call.type)}
                            </div>

                            {/* Caller Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-grey-900">{call.caller}</span>
                                    {call.status === 'completed' && (
                                        <Badge variant="success">Completed</Badge>
                                    )}
                                    {call.status === 'missed' && (
                                        <Badge variant="error">Missed</Badge>
                                    )}
                                </div>
                                <div className="text-sm text-grey-500">{call.phone}</div>
                            </div>

                            {/* Time & Duration */}
                            <div className="text-right">
                                <div className="text-sm font-medium text-grey-900">{call.time}</div>
                                <div className="text-xs text-grey-400">{call.date}</div>
                            </div>

                            {/* Duration */}
                            <div className="w-20 text-right">
                                <span className="text-sm font-mono text-grey-500">{call.duration}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {call.status === 'completed' && (
                                    <Button variant="ghost" size="icon-sm">
                                        <Play className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon-sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {selectedCall === call.id && call.status === 'completed' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-grey-100"
                            >
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-grey-500 mb-2">Call Summary</h4>
                                        <p className="text-sm text-grey-700 leading-relaxed">{call.summary}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-grey-500 mb-2">Keywords</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {call.keywords.map((keyword, j) => (
                                                <Badge key={j} variant="softBlue">{keyword}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button variant="outline" size="sm">
                                        <Play className="w-4 h-4 mr-2" />
                                        Play Recording
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Transcript
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </Card>
        </div>
    );
};

export default CallLogs;
