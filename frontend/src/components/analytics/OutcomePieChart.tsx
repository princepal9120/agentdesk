'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { AppointmentOutcome } from '@/types/models';

interface OutcomePieChartProps {
    data: AppointmentOutcome[];
}

const COLORS: Record<string, string> = {
    completed: '#10b981',
    confirmed: '#3b82f6',
    'no-show': '#ef4444',
    cancelled: '#6b7280',
    pending: '#f59e0b',
};

export function OutcomePieChart({ data }: OutcomePieChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    const chartData = data.map((item) => ({
        name: item.status.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        value: item.count,
        percentage: item.percentage,
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[data[index].status] || '#64748b'}
                        />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                    }}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
