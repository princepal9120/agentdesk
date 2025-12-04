import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_layout/analytics')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/_layout/analytics"!</div>
}
