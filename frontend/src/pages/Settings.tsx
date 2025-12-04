/**
 * Clinical Minimalism Settings Page
 * Segmented cards with thin dividers, toggle switches styled in teal/blue.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import {
    User, Bell, Shield, Palette, Globe, Lock,
    Mail, Phone, Building, ChevronRight, Save
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/utils/cn';

const Settings: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState('profile');

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.settings-card', {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const sections = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'preferences', label: 'Preferences', icon: Palette },
    ];

    return (
        <div ref={containerRef} className="max-w-5xl mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-semibold text-grey-900 tracking-tight">Settings</h1>
                <p className="text-grey-500 mt-2">Manage your account preferences and configurations.</p>
            </motion.div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Settings Navigation */}
                <Card className="settings-card lg:col-span-1 p-2 h-fit">
                    <nav className="space-y-1">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                                        activeSection === section.id
                                            ? "bg-[#D7EAFB]/50 text-[#1B5E7A]"
                                            : "text-grey-500 hover:bg-grey-50 hover:text-grey-900"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    {section.label}
                                </button>
                            );
                        })}
                    </nav>
                </Card>

                {/* Settings Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Profile Section */}
                    {activeSection === 'profile' && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <Card className="settings-card p-6">
                                <h3 className="text-lg font-semibold text-grey-900 mb-6">Personal Information</h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>First Name</Label>
                                        <Input placeholder="Sarah" defaultValue="Sarah" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Name</Label>
                                        <Input placeholder="Chen" defaultValue="Chen" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                                            <Input
                                                className="pl-11"
                                                placeholder="email@clinic.com"
                                                defaultValue="sarah.chen@healthvoice.ai"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                                            <Input className="pl-11" placeholder="+1 (555) 000-0000" />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="settings-card p-6">
                                <h3 className="text-lg font-semibold text-grey-900 mb-6">Practice Information</h3>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Practice Name</Label>
                                        <div className="relative">
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                                            <Input className="pl-11" placeholder="Your Clinic Name" defaultValue="Central Medical Group" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Specialty</Label>
                                        <Input placeholder="e.g., Internal Medicine" defaultValue="Internal Medicine" />
                                    </div>
                                </div>
                            </Card>

                            <div className="flex justify-end">
                                <Button>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Notifications Section */}
                    {activeSection === 'notifications' && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Card className="settings-card p-6">
                                <h3 className="text-lg font-semibold text-grey-900 mb-6">Notification Preferences</h3>

                                <div className="space-y-6">
                                    {[
                                        { title: 'Email Notifications', desc: 'Receive updates via email', enabled: true },
                                        { title: 'SMS Notifications', desc: 'Get text messages for urgent alerts', enabled: true },
                                        { title: 'Appointment Reminders', desc: 'Notify before scheduled appointments', enabled: true },
                                        { title: 'Call Transcripts', desc: 'Email call summaries automatically', enabled: false },
                                        { title: 'Weekly Reports', desc: 'Analytics digest every Monday', enabled: true },
                                    ].map((pref, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between py-4 border-b border-grey-100 last:border-0"
                                        >
                                            <div>
                                                <div className="font-medium text-grey-900">{pref.title}</div>
                                                <div className="text-sm text-grey-500">{pref.desc}</div>
                                            </div>
                                            <Switch defaultChecked={pref.enabled} />
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Security Section */}
                    {activeSection === 'security' && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <Card className="settings-card p-6">
                                <h3 className="text-lg font-semibold text-grey-900 mb-6">Password</h3>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Current Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                                            <Input type="password" className="pl-11" placeholder="••••••••" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                                            <Input type="password" className="pl-11" placeholder="••••••••" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Confirm New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                                            <Input type="password" className="pl-11" placeholder="••••••••" />
                                        </div>
                                    </div>
                                    <Button className="mt-4">Update Password</Button>
                                </div>
                            </Card>

                            <Card className="settings-card p-6">
                                <h3 className="text-lg font-semibold text-grey-900 mb-6">Two-Factor Authentication</h3>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-grey-900">Enable 2FA</div>
                                        <div className="text-sm text-grey-500">Add an extra layer of security</div>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Preferences Section */}
                    {activeSection === 'preferences' && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Card className="settings-card p-6">
                                <h3 className="text-lg font-semibold text-grey-900 mb-6">Display Preferences</h3>

                                <div className="space-y-6">
                                    {[
                                        { title: 'Compact Mode', desc: 'Reduce spacing in the interface', enabled: false },
                                        { title: 'Show Call Duration', desc: 'Display time on call cards', enabled: true },
                                        { title: 'Auto-refresh Dashboard', desc: 'Update metrics every 30 seconds', enabled: true },
                                    ].map((pref, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between py-4 border-b border-grey-100 last:border-0"
                                        >
                                            <div>
                                                <div className="font-medium text-grey-900">{pref.title}</div>
                                                <div className="text-sm text-grey-500">{pref.desc}</div>
                                            </div>
                                            <Switch defaultChecked={pref.enabled} />
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
