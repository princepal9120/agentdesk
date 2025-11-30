'use client';

import { Building2, Users, Calendar, Mic, Bell, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PracticeSettingsForm } from '@/components/settings/PracticeSettingsForm';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">
                    Manage your practice configuration and preferences
                </p>
            </div>

            <Tabs defaultValue="practice" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="practice" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Practice
                    </TabsTrigger>
                    <TabsTrigger value="providers" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Providers
                    </TabsTrigger>
                    <TabsTrigger value="appointments" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Appointments
                    </TabsTrigger>
                    <TabsTrigger value="ai-script" className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        AI Script
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="team" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Team
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="practice" className="space-y-4">
                    <PracticeSettingsForm />
                </TabsContent>

                <TabsContent value="providers" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Provider Management</CardTitle>
                            <CardDescription>
                                Manage healthcare providers and their schedules
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Users className="h-12 w-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No Providers Configured</h3>
                                <p className="text-gray-500 max-w-sm mt-2 mb-6">
                                    Add providers to start scheduling appointments. You can configure their availability and specialties.
                                </p>
                                <Button>Add Provider</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appointments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appointment Types</CardTitle>
                            <CardDescription>
                                Configure appointment durations and types
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Default Types Only</h3>
                                <p className="text-gray-500 max-w-sm mt-2 mb-6">
                                    You are currently using default appointment types. Customize them to match your practice needs.
                                </p>
                                <Button>Configure Types</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ai-script" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Script Configuration</CardTitle>
                            <CardDescription>
                                Customize how the AI voice agent interacts with patients
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Mic className="h-12 w-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Standard Script Active</h3>
                                <p className="text-gray-500 max-w-sm mt-2 mb-6">
                                    The AI is using the standard healthcare script. You can customize greetings, questions, and responses.
                                </p>
                                <Button>Edit Script</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                            <CardDescription>
                                Configure SMS and email notifications for patients and staff
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Bell className="h-12 w-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Notifications Enabled</h3>
                                <p className="text-gray-500 max-w-sm mt-2 mb-6">
                                    Standard appointment reminders are active. Configure timing and templates here.
                                </p>
                                <Button>Configure Notifications</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="team" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Management</CardTitle>
                            <CardDescription>
                                Invite team members and manage their permissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Shield className="h-12 w-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Team Access</h3>
                                <p className="text-gray-500 max-w-sm mt-2 mb-6">
                                    Manage who has access to the dashboard and what actions they can perform.
                                </p>
                                <Button>Invite Member</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
