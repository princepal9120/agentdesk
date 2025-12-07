import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
    Activity, Phone, Clock, AlertTriangle, CheckCircle,
    TrendingUp, Zap, BarChart3, Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { CallDebugger } from '@/components/features/debugger/CallDebugger';

interface CallRecord {
    id: string;
    patient_name: string;
    phone_number: string;
    status: string;
    duration: number;
    started_at: string;
    intent: string;
    sentiment_timeline: { turn: number; score: number; label: string }[];
}

const StatusBadge = ({ status }: { status: string }) => {
    const variants: Record<string, string> = {
        completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        failed: 'bg-red-50 text-red-700 border-red-200',
        interrupted: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return (
        <span className={cn(
            'px-2.5 py-1 rounded-full text-xs font-medium border',
            variants[status] || 'bg-slate-50 text-slate-600'
        )}>
            {status}
        </span>
    );
};

const MetricCard = ({ icon: Icon, label, value, trend, color }: {
    icon: React.ElementType;
    label: string;
    value: string;
    trend?: string;
    color: string;
}) => (
    <Card className="border-slate-100">
        <CardContent className="pt-5">
            <div className="flex items-start justify-between">
                <div className={cn('p-2 rounded-xl', color)}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <div className="mt-3">
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <div className="text-sm text-slate-500">{label}</div>
            </div>
        </CardContent>
    </Card>
);

const DeveloperDashboard: React.FC = () => {
    const [calls, setCalls] = useState<CallRecord[]>([]);
    const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCalls();
    }, []);

    const fetchCalls = async () => {
        try {
            const response = await fetch('/api/v1/calls');
            const data = await response.json();
            setCalls(data.items || []);
        } catch (error) {
            console.error('Failed to fetch calls:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCalls = calls.filter(call =>
        call.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.phone_number.includes(searchQuery)
    );

    const stats = {
        totalCalls: calls.length,
        completed: calls.filter(c => c.status === 'completed').length,
        failed: calls.filter(c => c.status === 'failed').length,
        avgDuration: calls.length > 0
            ? Math.round(calls.reduce((a, c) => a + (c.duration || 0), 0) / calls.length)
            : 0
    };

    if (selectedCallId) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => setSelectedCallId(null)}
                    className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                    ← Back to Call List
                </button>
                <CallDebugger callId={selectedCallId} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Conversation Intelligence</h1>
                    <p className="text-slate-500">Analyze call performance, debug failures, and optimize AI behavior.</p>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={Phone}
                    label="Total Calls"
                    value={stats.totalCalls.toString()}
                    trend="+12%"
                    color="bg-blue-50 text-blue-600"
                />
                <MetricCard
                    icon={CheckCircle}
                    label="Success Rate"
                    value={`${stats.totalCalls > 0 ? Math.round((stats.completed / stats.totalCalls) * 100) : 0}%`}
                    color="bg-emerald-50 text-emerald-600"
                />
                <MetricCard
                    icon={AlertTriangle}
                    label="Failed Calls"
                    value={stats.failed.toString()}
                    color="bg-red-50 text-red-600"
                />
                <MetricCard
                    icon={Clock}
                    label="Avg Duration"
                    value={`${Math.floor(stats.avgDuration / 60)}m ${stats.avgDuration % 60}s`}
                    color="bg-purple-50 text-purple-600"
                />
            </div>

            {/* Call List */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-slate-400" />
                        Recent Calls
                    </CardTitle>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search calls..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-slate-400">Loading calls...</div>
                    ) : filteredCalls.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            No calls found. Run the seed script to generate test data.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredCalls.map((call, index) => (
                                <motion.div
                                    key={call.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedCallId(call.id)}
                                    className="py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-4 px-4 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                                            {call.patient_name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800">{call.patient_name}</div>
                                            <div className="text-sm text-slate-500">{call.phone_number}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-slate-700">{call.intent}</div>
                                            <div className="text-xs text-slate-400">
                                                {call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : 'N/A'}
                                            </div>
                                        </div>
                                        <StatusBadge status={call.status} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DeveloperDashboard;
