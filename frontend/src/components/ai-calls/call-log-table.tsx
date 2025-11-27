'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, FileText } from 'lucide-react';

const calls = [
    {
        id: '1',
        patient: 'John Doe',
        phoneNumber: '+15551234567',
        duration: '2m 15s',
        outcome: 'BOOKED',
        sentiment: 'POSITIVE',
        timestamp: '2023-11-27T10:30:00Z',
    },
    {
        id: '2',
        patient: 'Jane Smith',
        phoneNumber: '+15559876543',
        duration: '1m 45s',
        outcome: 'INFO_ONLY',
        sentiment: 'NEUTRAL',
        timestamp: '2023-11-27T11:15:00Z',
    },
];

export default function CallLogTable() {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Outcome</TableHead>
                        <TableHead>Sentiment</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {calls.map((call) => (
                        <TableRow key={call.id}>
                            <TableCell className="font-medium">{call.patient}</TableCell>
                            <TableCell>{call.phoneNumber}</TableCell>
                            <TableCell>{call.duration}</TableCell>
                            <TableCell>
                                <Badge variant={call.outcome === 'BOOKED' ? 'default' : 'secondary'}>
                                    {call.outcome}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{call.sentiment}</Badge>
                            </TableCell>
                            <TableCell>{new Date(call.timestamp).toLocaleTimeString()}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                    <Play className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <FileText className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
