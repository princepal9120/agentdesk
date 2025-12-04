import { createFileRoute } from '@tanstack/react-router'
import Help from '@/pages/Help'

export const Route = createFileRoute('/_authenticated/_layout/help')({
  component: Help,
})
