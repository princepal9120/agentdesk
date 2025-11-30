'use client';

import { useState } from 'react';
import { Phone, Clock, ChevronRight, Flag } from 'lucide-react';
import type { Call } from '@/types/models';
import { formatDuration, formatRelativeTime } from '@/lib/utils/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CallsTableProps {
    calls: Call[];
    onCallClick: (call: Call) => void;
}

export function CallsTable({ calls, onCallClick }: CallsTableProps) {
    const getSentimentEmoji = (sentiment: string) => {
        const emojis: Record<string, string> = {
            positive: '😊',
            neutral: '😐',
            negative: '😞',
        };
        return emojis[sentiment] || '😐';
    };

    const getOutcomeBadge = (outcome: string) => {
        const variants: Record<string, { variant: any; label: string }> = {
            booked: { variant: 'default', label: 'Booked' },
            rescheduled: { variant: 'secondary', label: 'Rescheduled' },
            cancelled: { variant: 'outline', label: 'Cancelled' },
            'info-only': { variant: 'secondary', label: 'Info Only' },
            escalated: { variant: 'destructive', label: 'Escalated' },
        };

        const config = variants[outcome] || variants['info-only'];
        return <Badge variant={config.variant as any}>{config.label}</Badge>;
    };

    if (calls.length === 0) {
        return (
            <div className="text-center py-12">
                <Phone className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No calls yet</h3>
                <p className="mt-2 text-sm text-gray-500">
                    AI call logs will appear here
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Outcome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sentiment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Transcript
                        </th>
                        <th className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {calls.map((call) => (
                        <tr
                            key={call.id}
                            onClick={() => onCallClick(call)}
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-900">
                                        {formatRelativeTime(call.timestamp)}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {call.patientName || 'Unknown'}
                                </div>
                                <div className="text-sm text-gray-500">{call.patientPhone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900">
                                    {formatDuration(call.duration)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getOutcomeBadge(call.outcome)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">
                                        {getSentimentEmoji(call.sentiment)}
                                    </span>
                                    <span className="text-sm text-gray-600 capitalize">
                                        {call.sentiment}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-sm text-gray-600 truncate max-w-xs">
                                    {call.transcriptPreview}
                                </p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center gap-2 justify-end">
                                    {call.isFlagged && (
                                        <Flag className="h-4 w-4 text-red-500" />
                                    )}
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
