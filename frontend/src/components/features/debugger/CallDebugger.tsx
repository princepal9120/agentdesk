import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
    Clock, User, Bot, Activity, Zap, MessageSquare,
    TrendingUp, TrendingDown, Minus, Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';

interface DebugTurn {
    turn: number;
    speaker: 'user' | 'ai';
    text: string;
    intent: string;
    latency: {
        stt_ms: number;
        llm_ms: number;
        tts_ms: number;
        total_ms: number;
    };
    timestamp: string;
}

interface CallDetails {
    id: string;
    patient_name: string;
    phone_number: string;
    status: string;
    duration: number;
    started_at: string;
    transcript: string;
    debug_trace: { turns: DebugTurn[]; total_turns: number };
    latency_metrics: {
        stt: { p50: number; p95: number; p99: number };
        llm: { p50: number; p95: number; p99: number };
        tts: { p50: number; p95: number; p99: number };
        e2e: { p50: number; p95: number; p99: number };
    };
    sentiment_timeline: { turn: number; score: number; label: string }[];
    ai_model: string;
    session_id: string;
}

interface CallDebuggerProps {
    callId: string;
}

const LatencyBar = ({ label, value, max = 1000, color }: {
    label: string;
    value: number;
    max?: number;
    color: string;
}) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-10">{label}</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                    className={cn('h-full rounded-full', color)}
                />
            </div>
            <span className="text-xs font-mono text-slate-600 w-14 text-right">{value}ms</span>
        </div>
    );
};

const SentimentIndicator = ({ score }: { score: number }) => {
    const color = score > 0.6 ? 'text-emerald-500' : score < 0.4 ? 'text-red-500' : 'text-amber-500';
    const Icon = score > 0.6 ? TrendingUp : score < 0.4 ? TrendingDown : Minus;
    return <Icon className={cn('w-4 h-4', color)} />;
};

export const CallDebugger: React.FC<CallDebuggerProps> = ({ callId }) => {
    const [callDetails, setCallDetails] = useState<CallDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'transcript' | 'latency' | 'sentiment'>('transcript');

    useEffect(() => {
        fetchCallDetails();
    }, [callId]);

    const fetchCallDetails = async () => {
        try {
            const response = await fetch(`/api/v1/calls/${callId}`);
            const data = await response.json();
            setCallDetails(data);
        } catch (error) {
            console.error('Failed to fetch call details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="animate-pulse text-slate-400">Loading call data...</div>
            </div>
        );
    }

    if (!callDetails) {
        return (
            <div className="text-center py-16 text-slate-400">
                Failed to load call details.
            </div>
        );
    }

    const { debug_trace, latency_metrics, sentiment_timeline } = callDetails;

    return (
        <div className="space-y-6">
            {/* Call Header */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                {callDetails.patient_name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{callDetails.patient_name}</h2>
                                <p className="text-sm text-slate-500">{callDetails.phone_number}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium text-slate-600">
                                {new Date(callDetails.started_at).toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-1">
                                Model: {callDetails.ai_model}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tab Navigation */}
            <div className="flex gap-2">
                {(['transcript', 'latency', 'sentiment'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                            activeTab === tab
                                ? 'bg-teal-500 text-white shadow-md'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        )}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'transcript' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-slate-400" />
                            Turn-by-Turn Transcript
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {debug_trace?.turns?.map((turn, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: turn.speaker === 'user' ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={cn(
                                        'flex gap-3',
                                        turn.speaker === 'user' ? 'flex-row' : 'flex-row-reverse'
                                    )}
                                >
                                    <div className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                                        turn.speaker === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-teal-100 text-teal-600'
                                    )}>
                                        {turn.speaker === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={cn(
                                        'flex-1 p-4 rounded-2xl max-w-[80%]',
                                        turn.speaker === 'user'
                                            ? 'bg-blue-50 rounded-tl-sm'
                                            : 'bg-teal-50 rounded-tr-sm'
                                    )}>
                                        <p className="text-sm text-slate-700">{turn.text}</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                            <span>Intent: {turn.intent}</span>
                                            <span>•</span>
                                            <span className="font-mono">{turn.latency.total_ms}ms</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'latency' && (
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Per-Turn Latency */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500" />
                                Per-Turn Latency Waterfall
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {debug_trace?.turns?.map((turn, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="text-xs font-medium text-slate-600">Turn {turn.turn}</div>
                                    <LatencyBar label="STT" value={turn.latency.stt_ms} color="bg-blue-400" />
                                    <LatencyBar label="LLM" value={turn.latency.llm_ms} color="bg-purple-400" />
                                    <LatencyBar label="TTS" value={turn.latency.tts_ms} color="bg-teal-400" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Aggregate Metrics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-slate-400" />
                                Aggregate Latency (P50/P95/P99)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {latency_metrics && Object.entries(latency_metrics).map(([key, values]) => (
                                    <div key={key}>
                                        <div className="text-sm font-semibold text-slate-700 uppercase mb-2">{key}</div>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['p50', 'p95', 'p99'].map((percentile) => (
                                                <div key={percentile} className="bg-slate-50 rounded-xl p-3 text-center">
                                                    <div className="text-xs text-slate-400 uppercase">{percentile}</div>
                                                    <div className="text-lg font-bold text-slate-800 font-mono">
                                                        {values[percentile as keyof typeof values]}ms
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === 'sentiment' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Sentiment Timeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between gap-4 h-48 pt-4">
                            {sentiment_timeline?.map((point, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${point.score * 100}%` }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className={cn(
                                        'flex-1 rounded-t-lg flex flex-col items-center justify-end pb-2',
                                        point.score > 0.6 ? 'bg-emerald-400' :
                                            point.score < 0.4 ? 'bg-red-400' : 'bg-amber-400'
                                    )}
                                >
                                    <span className="text-xs font-bold text-white">{Math.round(point.score * 100)}%</span>
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-slate-400">
                            {sentiment_timeline?.map((point, index) => (
                                <span key={index} className="flex-1 text-center">Turn {point.turn}</span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
