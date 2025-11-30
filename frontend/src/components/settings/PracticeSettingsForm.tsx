'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const practiceSchema = z.object({
    name: z.string().min(2, 'Practice name is required'),
    address: z.string().min(5, 'Address is required'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    email: z.string().email('Invalid email address'),
    timezone: z.string(),
});

type PracticeFormData = z.infer<typeof practiceSchema>;

export function PracticeSettingsForm() {
    const form = useForm<PracticeFormData>({
        resolver: zodResolver(practiceSchema),
        defaultValues: {
            name: 'Dr. Smith Dental Practice',
            address: '123 Main St, New York, NY 10001',
            phone: '2125551234',
            email: 'contact@drsmith.com',
            timezone: 'America/New_York',
        },
    });

    const onSubmit = async (data: PracticeFormData) => {
        try {
            // API call would go here
            console.log('Practice settings:', data);
            toast.success('Practice settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Practice Information</CardTitle>
                <CardDescription>
                    Update your practice details and contact information
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Practice Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="2125551234" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="timezone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Timezone</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="America/New_York">Eastern Time (ET)</option>
                                            <option value="America/Chicago">Central Time (CT)</option>
                                            <option value="America/Denver">Mountain Time (MT)</option>
                                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
