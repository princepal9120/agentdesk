import {
    createRootRoute,
    Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from '@/store'
import '@/index.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
        },
    },
})

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <div className="min-h-screen bg-background text-foreground font-sans">
                    <Outlet />
                </div>
                {import.meta.env.DEV && (
                    <TanStackRouterDevtools position="bottom-right" />
                )}
            </QueryClientProvider>
        </Provider>
    )
}
