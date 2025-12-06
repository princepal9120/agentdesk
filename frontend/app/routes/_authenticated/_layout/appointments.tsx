import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { getStoredUser } from '@/utils/auth-utils'
import { isRole } from '@/utils/rbac'
import { format } from 'date-fns'

export const Route = createFileRoute('/_authenticated/_layout/appointments')({
    component: AppointmentsPage,
})

async function fetchAppointments() {
    const response = await api.get('/appointments')
    return response.data.appointments
}

function AppointmentsPage() {
    const user = getStoredUser()
    const { data: appointments = [], isLoading, error } = useQuery({
        queryKey: ['appointments'],
        queryFn: fetchAppointments,
    })

    const canBook = isRole(user, 'patient', 'receptionist', 'admin')

    if (isLoading) {
        return <div className="flex justify-center p-8 text-grey-500">Loading appointments...</div>
    }

    if (error) {
        return <div className="p-8 text-center text-error">Failed to load appointments. Please try again.</div>
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-grey-900">Appointments</h1>
                {canBook && (
                    <Link
                        to="/appointments/book"
                        className="bg-[#2BB59B] text-white px-4 py-2 rounded-xl hover:bg-[#249A84] transition-colors font-medium shadow-sm"
                    >
                        Book Appointment
                    </Link>
                )}
            </div>

            {appointments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-grey-100">
                    <p className="text-grey-500">No appointments found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {appointments.map((appointment: any) => (
                        <div
                            key={appointment.id}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-grey-100 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-grey-900">
                                        {user?.role === 'patient' ? `Dr. ${appointment.doctor_name || 'Unknown'}` : appointment.patient_name || 'Patient'}
                                    </h3>
                                    <p className="text-grey-500 text-sm">{appointment.reason_for_visit || 'General Checkup'}</p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${appointment.status === 'confirmed'
                                            ? 'bg-green-100 text-green-800'
                                            : appointment.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                            </div>
                            <div className="mt-3 text-sm text-grey-500 flex items-center gap-2">
                                <span className="font-medium text-grey-700">
                                    {format(new Date(appointment.start_time), 'PPP p')}
                                </span>
                                <span>•</span>
                                <span>{appointment.appointment_type}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
