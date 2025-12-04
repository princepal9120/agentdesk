import { createFileRoute } from '@tanstack/react-router'
import Login from '@/pages/Login'

export const Route = createFileRoute('/login')({
    component: LoginPage,
    head: () => ({
        meta: [{ title: 'Login - Healthcare Voice Agent' }],
    }),
})

function LoginPage() {
    return <Login />
}
