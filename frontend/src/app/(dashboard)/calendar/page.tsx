import CalendarComponent from '@/components/calendar/calendar-view';

export default function CalendarPage() {
    return (
        <div className="h-full space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
            </div>
            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <CalendarComponent />
            </div>
        </div>
    );
}
