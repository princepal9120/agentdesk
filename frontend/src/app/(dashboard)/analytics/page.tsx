import { MetricCards, CallVolumeChart, OutcomeChart } from '@/components/analytics/analytics-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsPage() {
    return (
        <div className="h-full space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            </div>
            <MetricCards />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Call Volume Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <CallVolumeChart />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Appointment Outcomes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OutcomeChart />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
