import { createFileRoute } from '@tanstack/react-router'
import CallLogs from '@/pages/CallLogs'

export const Route = createFileRoute('/_authenticated/_layout/calls')({
  component: CallLogs,
})
