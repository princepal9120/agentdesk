'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const callVolumeData = [
    { date: 'Nov 20', calls: 120, aiHandled: 100 },
    { date: 'Nov 21', calls: 132, aiHandled: 110 },
    { date: 'Nov 22', calls: 101, aiHandled: 85 },
    { date: 'Nov 23', calls: 134, aiHandled: 120 },
    { date: 'Nov 24', calls: 90, aiHandled: 80 },
    { date: 'Nov 25', calls: 230, aiHandled: 200 },
    { date: 'Nov 26', calls: 210, aiHandled: 190 },
];

const outcomeData = [
    { name: 'Booked', value: 400 },
    { name: 'Rescheduled', value: 300 },
    { name: 'Cancelled', value: 300 },
    { name: 'No-show', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function CallVolumeChart() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={callVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calls" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="aiHandled" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    );
}

export function OutcomeChart() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie
                    data={outcomeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {outcomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
}

export function MetricCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">247</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">AI Handled</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">82%</div>
                    <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">No-Show Rate</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">8.5%</div>
                    <p className="text-xs text-muted-foreground">-3% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">42h</div>
                    <p className="text-xs text-muted-foreground">Estimated this month</p>
                </CardContent>
            </Card>
        </div>
    );
}
