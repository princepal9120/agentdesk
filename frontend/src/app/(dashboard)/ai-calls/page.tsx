'use client';

import { useState } from 'react';
import { Phone, TrendingUp, Clock, CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CallsTable } from '@/components/ai-calls/CallsTable';
import { CallDetailDrawer } from '@/components/ai-calls/CallDetailDrawer';
import type { Call, CallDetail } from '@/types/models';

// Mock data for demonstration
const mockCalls: Call[] = [
    {
        id: '1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        patientName: 'John Doe',
        patientPhone: '2125551234',
        duration: 135,
        outcome: 'booked',
        sentiment: 'positive',
        transcriptPreview: 'Patient called to book a dental checkup for next week...',
        isFlagged: false,
        appointmentId: 'apt-1',
    },
    {
        id: '2',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        patientName: 'Jane Smith',
        patientPhone: '2125555678',
        duration: 92,
        outcome: 'rescheduled',
        sentiment: 'neutral',
        transcriptPreview: 'Requested to reschedule existing appointment to a later date...',
        isFlagged: false,
        appointmentId: 'apt-2',
    },
    {
        id: '3',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        patientName: 'Bob Johnson',
        patientPhone: '2125559012',
        duration: 245,
        outcome: 'escalated',
        sentiment: 'negative',
        transcriptPreview: 'Complex insurance question that required staff assistance...',
        isFlagged: true,
        appointmentId: undefined,
    },
];

export default function AICallsPage() {
    const [selectedCall, setSelectedCall] = useState<CallDetail | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleCallClick = async (call: Call) => {
        // In production, fetch full call details from API
        const mockCallDetail: CallDetail = {
            ...call,
            audioUrl: 'https://example.com/call-audio.mp3',
            transcript: [
                { speaker: 'ai', text: 'Hello! Thank you for calling Dr. Smith\'s office. How can I help you today?', timestamp: 0 },
                { speaker: 'patient', text: 'Hi, I\'d like to schedule a dental checkup.', timestamp: 5 },
                { speaker: 'ai', text: 'Of course! I can help you with that. What is your preferred date and time?', timestamp: 10 },
                { speaker: 'patient', text: 'Next Tuesday afternoon would be great.', timestamp: 15 },
                { speaker: 'ai', text: 'Perfect! I have availability at 2:00 PM on Tuesday. Would that work for you?', timestamp: 20 },
                { speaker: 'patient', text: 'Yes, that sounds perfect!', timestamp: 25 },
            ],
        };

        setSelectedCall(mockCallDetail);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedCall(null);
    };

    // Calculate stats from mock data
    const totalCalls = mockCalls.length;
    const successfulBookings = mockCalls.filter(c => c.outcome === 'booked').length;
    const avgDuration = Math.round(mockCalls.reduce((sum, c) => sum + c.duration, 0) / totalCalls);
    const escalated = mockCalls.filter(c => c.outcome === 'escalated').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">AI Voice Calls</h1>
                    <p className="text-gray-500 mt-1">
                        Monitor and review AI-handled phone calls
                    </p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Calls Today
                        </CardTitle>
                        <Phone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCalls}</div>
                        <p className="text-xs text-muted-foreground">
                            +8% from yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Successful Bookings
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{successfulBookings}</div>
                        <p className="text-xs text-green-600">
                            {Math.round((successfulBookings / totalCalls) * 100)}% success rate
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Avg Call Duration
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.floor(avgDuration / 60)}m {avgDuration % 60}s
                        </div>
                        <p className="text-xs text-muted-foreground">Optimal range</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Escalated</CardTitle>
                        <TrendingUp className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{escalated}</div>
                        <p className="text-xs text-yellow-600">
                            {Math.round((escalated / totalCalls) * 100)}% escalation rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Calls Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Calls</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <CallsTable calls={mockCalls} onCallClick={handleCallClick} />
                </CardContent>
            </Card>

            {/* Call Detail Drawer */}
            <CallDetailDrawer
                call={selectedCall}
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
            />
        </div>
    );
}
