import CallLogTable from '@/components/ai-calls/call-log-table';

export default function AiCallsPage() {
    return (
        <div className="h-full space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">AI Calls</h2>
            </div>
            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <CallLogTable />
            </div>
        </div>
    );
}
