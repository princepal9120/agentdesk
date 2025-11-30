'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CallVolumeData } from '@/types/models';

interface CallVolumeChartProps {
    data: CallVolumeData[];
}

export function CallVolumeChart({ data }: CallVolumeChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                    }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="totalCalls"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Total Calls"
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="aiHandledCalls"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="AI Handled"
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
