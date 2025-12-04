import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_authenticated/_layout/appointments')({
    component: AppointmentsPage,
})

// Mock function - replace with your actual API call
async function fetchAppointments() {
    // In production, call your backend API
    // const response = await fetch('/api/appointments')
    // return response.json()

    return [
        {
            id: '1',
            doctorName: 'Dr. Smith',
            specialty: 'Cardiology',
            date: '2024-12-10',
            time: '10:00 AM',
            status: 'confirmed',
        },
        {
            id: '2',
            doctorName: 'Dr. Johnson',
            specialty: 'Dermatology',
            date: '2024-12-12',
            time: '2:30 PM',
            status: 'pending',
        },
    ]
}

function AppointmentsPage() {
    const { data: appointments = [], isLoading } = useQuery({
        queryKey: ['appointments'],
        queryFn: fetchAppointments,
    })

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading...</div>
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Appointments</h1>
                <Link
                    to="/appointments/book"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Book Appointment
                </Link>
            </div>

            <div className="grid gap-4">
                {appointments.map((appointment) => (
                    <div
                        key={appointment.id}
                        className="bg-white p-4 rounded-lg shadow border"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold">{appointment.doctorName}</h3>
                                <p className="text-gray-600 text-sm">{appointment.specialty}</p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded text-xs font-medium ${appointment.status === 'confirmed'
                                        ? 'bg-green-100 text-green-800'
                                        : appointment.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {appointment.status}
                            </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                            {appointment.date} at {appointment.time}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
