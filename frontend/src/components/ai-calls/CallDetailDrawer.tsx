'use client';

import { X, Phone, Clock, Flag } from 'lucide-react';
import type { CallDetail } from '@/types/models';
import { formatDateTime, formatDuration } from '@/lib/utils/helpers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CallDetailDrawerProps {
    call: CallDetail | null;
    isOpen: boolean;
    onClose: () => void;
}

export function CallDetailDrawer({ call, isOpen, onClose }: CallDetailDrawerProps) {
    if (!isOpen || !call) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="fixed inset-y-0 right-0 flex max-w-full">
                <div className="w-screen max-w-2xl">
                    <div className="flex h-full flex-col bg-white shadow-xl">
                        {/* Header */}
                        <div className="border-b px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Call Details
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {formatDateTime(call.timestamp)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Call Info */}
                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Patient</p>
                                        <p className="font-medium text-gray-900">
                                            {call.patientName || 'Unknown'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone Number</p>
                                        <p className="font-medium text-gray-900">{call.patientPhone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Duration</p>
                                        <p className="font-medium text-gray-900">
                                            {formatDuration(call.duration)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Outcome</p>
                                        <Badge className="mt-1">{call.outcome}</Badge>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Sentiment</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">
                                            {call.sentiment === 'positive' ? '😊' :
                                                call.sentiment === 'negative' ? '😞' : '😐'}
                                        </span>
                                        <span className="font-medium capitalize">{call.sentiment}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Audio Player */}
                            {call.audioUrl && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Call Recording
                                    </p>
                                    <audio controls className="w-full">
                                        <source src={call.audioUrl} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            )}

                            {/* Transcript */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Transcript
                                </h3>
                                <div className="space-y-3">
                                    {call.transcript.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`flex gap-3 ${message.speaker === 'ai' ? 'flex-row' : 'flex-row-reverse'
                                                }`}
                                        >
                                            <div
                                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${message.speaker === 'ai'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-200 text-gray-700'
                                                    }`}
                                            >
                                                {message.speaker === 'ai' ? 'AI' : 'P'}
                                            </div>
                                            <div
                                                className={`flex-1 px-4 py-2 rounded-lg ${message.speaker === 'ai'
                                                        ? 'bg-primary/10'
                                                        : 'bg-gray-100'
                                                    }`}
                                            >
                                                <p className="text-sm text-gray-900">{message.text}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDuration(message.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t px-6 py-4 flex justify-between">
                            <Button
                                variant={call.isFlagged ? 'destructive' : 'outline'}
                                onClick={() => {
                                    // Handle flag toggle
                                }}
                            >
                                <Flag className="mr-2 h-4 w-4" />
                                {call.isFlagged ? 'Unflag' : 'Flag for Review'}
                            </Button>
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
