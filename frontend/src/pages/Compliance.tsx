/**
 * Clinical Minimalism HIPAA Compliance Page
 * Badges, logs, permissions with calm, trustworthy color palette.
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import {
    Shield, CheckCircle, Lock, FileText, Users,
    Clock, AlertTriangle, Download, ChevronRight, Key
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

const Compliance: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.compliance-card', {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const certifications = [
        { name: 'HIPAA', status: 'Compliant', icon: Shield, desc: 'Health Insurance Portability and Accountability Act' },
        { name: 'SOC 2 Type II', status: 'Certified', icon: Lock, desc: 'Service Organization Control' },
        { name: 'BAA', status: 'Signed', icon: FileText, desc: 'Business Associate Agreement' },
        { name: 'Encryption', status: 'AES-256', icon: Key, desc: 'End-to-end data encryption' },
    ];

    const auditLogs = [
        { action: 'Access Log Exported', user: 'Dr. Sarah Chen', time: '10 minutes ago', type: 'info' },
        { action: 'PHI Access', user: 'System', time: '1 hour ago', type: 'info' },
        { action: 'User Role Updated', user: 'Admin', time: '2 hours ago', type: 'warning' },
        { action: 'Backup Completed', user: 'System', time: '6 hours ago', type: 'success' },
        { action: 'Login Attempt (Failed)', user: 'Unknown', time: '12 hours ago', type: 'error' },
    ];

    const permissions = [
        { role: 'Administrator', access: 'Full Access', users: 2 },
        { role: 'Doctor', access: 'Read/Write PHI', users: 8 },
        { role: 'Staff', access: 'Limited Access', users: 15 },
        { role: 'Read-Only', access: 'View Only', users: 3 },
    ];

    return (
        <div ref={containerRef} className="max-w-6xl mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-success-light rounded-2xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-success" />
                    </div>
                    <h1 className="text-3xl font-semibold text-grey-900 tracking-tight">Compliance Center</h1>
                </div>
                <p className="text-grey-500 mt-2">Monitor your practice's security and regulatory compliance.</p>
            </motion.div>

            {/* Compliance Status Banner */}
            <Card className="compliance-card mb-8 p-6 bg-gradient-to-r from-success-light to-[#D7EAFB]/20 border-success/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                            <CheckCircle className="w-7 h-7 text-success" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-grey-900">All Systems Compliant</h3>
                            <p className="text-grey-500 text-sm">Last security audit: December 4, 2024 at 09:00 AM</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                        <Button>
                            Run Audit
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Certifications Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {certifications.map((cert, i) => {
                    const Icon = cert.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="compliance-card p-5 text-center hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-success-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Icon className="w-6 h-6 text-success" />
                                </div>
                                <h4 className="font-semibold text-grey-900 mb-1">{cert.name}</h4>
                                <Badge variant="success" className="mb-2">{cert.status}</Badge>
                                <p className="text-xs text-grey-500">{cert.desc}</p>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Audit Logs */}
                <Card className="compliance-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-grey-900">Audit Logs</h3>
                        <Button variant="ghost" size="sm">
                            View All
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {auditLogs.map((log, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 p-3 hover:bg-grey-50 rounded-xl transition-colors"
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                                    log.type === 'success' && "bg-success-light",
                                    log.type === 'info' && "bg-info-light",
                                    log.type === 'warning' && "bg-warning-light",
                                    log.type === 'error' && "bg-error-light"
                                )}>
                                    {log.type === 'success' && <CheckCircle className="w-4 h-4 text-success" />}
                                    {log.type === 'info' && <FileText className="w-4 h-4 text-info" />}
                                    {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-warning" />}
                                    {log.type === 'error' && <AlertTriangle className="w-4 h-4 text-error" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-grey-900 text-sm">{log.action}</div>
                                    <div className="text-xs text-grey-500">{log.user}</div>
                                </div>
                                <div className="text-xs text-grey-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {log.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* User Permissions */}
                <Card className="compliance-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-grey-900">User Permissions</h3>
                        <Button variant="ghost" size="sm">
                            Manage Roles
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {permissions.map((perm, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-4 bg-grey-50 rounded-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Users className="w-5 h-5 text-grey-500" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-grey-900">{perm.role}</div>
                                        <div className="text-sm text-grey-500">{perm.access}</div>
                                    </div>
                                </div>
                                <Badge variant="softBlue">{perm.users} users</Badge>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Data Protection */}
                <Card className="compliance-card p-6 lg:col-span-2">
                    <h3 className="font-semibold text-grey-900 mb-6">Data Protection Measures</h3>

                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { title: 'Encryption at Rest', status: 'AES-256', desc: 'All stored data is encrypted' },
                            { title: 'Encryption in Transit', status: 'TLS 1.3', desc: 'Secure data transmission' },
                            { title: 'Data Retention', status: '7 Years', desc: 'HIPAA compliant retention' },
                            { title: 'Access Controls', status: 'RBAC', desc: 'Role-based access control' },
                            { title: 'Backup Frequency', status: 'Every 6h', desc: 'Automated secure backups' },
                            { title: 'Disaster Recovery', status: 'Active', desc: 'Multi-region redundancy' },
                        ].map((item, i) => (
                            <div key={i} className="p-4 bg-grey-50 rounded-2xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-grey-500">{item.title}</span>
                                    <Badge variant="success">{item.status}</Badge>
                                </div>
                                <div className="text-xs text-grey-400">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Compliance;
