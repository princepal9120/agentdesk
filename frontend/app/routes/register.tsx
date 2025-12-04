import { createFileRoute } from '@tanstack/react-router'
import Register from '@/pages/Register'

export const Route = createFileRoute('/register')({
    component: RegisterPage,
    head: () => ({
        meta: [{ title: 'Register - Healthcare Voice Agent' }],
    }),
})

function RegisterPage() {
    return <Register />
}
