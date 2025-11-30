'use client';

import { BarChart3, TrendingUp, Users, Calendar as CalendarIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CallVolumeChart } from '@/components/analytics/CallVolumeChart';
import { OutcomePieChart } from '@/components/analytics/OutcomePieChart';
import { BookingSourcesChart } from '@/components/analytics/BookingSourcesChart';
import type { CallVolumeData, AppointmentOutcome, BookingSourceData } from '@/types/models';

// Mock Data
const mockCallVolume: CallVolumeData[] = [
    { date: 'Mon', totalCalls: 45, aiHandledCalls: 38 },
    { date: 'Tue', totalCalls: 52, aiHandledCalls: 45 },
    { date: 'Wed', totalCalls: 48, aiHandledCalls: 42 },
    { date: 'Thu', totalCalls: 61, aiHandledCalls: 55 },
    { date: 'Fri', totalCalls: 55, aiHandledCalls: 48 },
    { date: 'Sat', totalCalls: 25, aiHandledCalls: 22 },
    { date: 'Sun', totalCalls: 18, aiHandledCalls: 18 },
];

const mockOutcomes: AppointmentOutcome[] = [
    { status: 'completed', count: 145, percentage: 58 },
    { status: 'confirmed', count: 45, percentage: 18 },
    { status: 'pending', count: 25, percentage: 10 },
    { status: 'cancelled', count: 20, percentage: 8 },
    { status: 'no-show', count: 15, percentage: 6 },
];

const mockBookingSources: BookingSourceData[] = [
    { source: 'ai-voice', count: 156 },
    { source: 'manual', count: 54 },
    { source: 'online', count: 40 },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
                    <p className="text-muted-foreground mt-1">
                        Track practice performance and insights
                    </p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Appointments
                        </CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">247</div>
                        <p className="text-xs text-green-600">
                            <TrendingUp className="inline h-3 w-3" /> +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            AI-Handled
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">82%</div>
                        <p className="text-xs text-green-600">
                            <TrendingUp className="inline h-3 w-3" /> +5% improvement
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            No-Show Rate
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8.5%</div>
                        <p className="text-xs text-green-600">
                            ↓ 3% improvement
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Time Saved
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18.5h</div>
                        <p className="text-xs text-muted-foreground">
                            per week average
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Call Volume Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <CallVolumeChart data={mockCallVolume} />
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Appointment Outcomes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OutcomePieChart data={mockOutcomes} />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Booking Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BookingSourcesChart data={mockBookingSources} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
                                <div className="rounded-full bg-blue-100 dark:bg-blue-950 p-2">
                                    <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">Peak Call Hours</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Highest call volume observed between 9:00 AM and 11:00 AM on Mondays.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
                                <div className="rounded-full bg-green-100 dark:bg-green-950 p-2">
                                    <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">New Patient Growth</h4>
                                    <p className="text-sm text-muted-foreground">
                                        15% increase in new patient bookings via AI voice agent this week.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
