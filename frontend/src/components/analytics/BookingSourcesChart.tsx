'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { BookingSourceData } from '@/types/models';

interface BookingSourcesChartProps {
    data: BookingSourceData[];
}

const COLORS: Record<string, string> = {
    'ai-voice': '#2563eb',
    'manual': '#10b981',
    'online': '#f59e0b',
};

export function BookingSourcesChart({ data }: BookingSourcesChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    const chartData = data.map((item) => ({
        name: item.source === 'ai-voice' ? 'AI Voice' :
            item.source === 'manual' ? 'Manual' : 'Online',
        count: item.count,
        fill: COLORS[item.source] || '#64748b',
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                    }}
                />
                <Bar
                    dataKey="count"
                    radius={[8, 8, 0, 0]}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
