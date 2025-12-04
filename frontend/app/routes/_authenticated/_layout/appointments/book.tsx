import { createFileRoute } from '@tanstack/react-router'
import BookAppointment from '@/pages/BookAppointment'

export const Route = createFileRoute('/_authenticated/_layout/appointments/book')({
    component: BookAppointmentPage,
    head: () => ({
        meta: [{ title: 'Book Appointment - Healthcare Voice Agent' }],
    }),
})

function BookAppointmentPage() {
    return <BookAppointment />
}
