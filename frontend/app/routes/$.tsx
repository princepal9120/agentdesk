import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/$')({
    component: NotFound,
    head: () => ({
        meta: [{ title: '404 - Page Not Found' }],
    }),
})

function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
                <Link
                    to="/login"
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    )
}
