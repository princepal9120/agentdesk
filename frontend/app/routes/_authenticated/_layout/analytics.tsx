/**
 * Analytics Page
 * Clinical Minimalism design with voice agent metrics per PRD Section 8.
 */

import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import {
  Phone, Users, Calendar, CheckCircle, XCircle, Clock,
  TrendingUp, TrendingDown, BarChart2, PieChart, Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import api from '@/services/api'

export const Route = createFileRoute('/_authenticated/_layout/analytics')({
  component: AnalyticsPage,
  head: () => ({
    meta: [{ title: 'Analytics - HealthVoice AI' }],
  }),
})

// Mock analytics data - in production this would come from API
const mockAnalytics = {
  voiceAgent: {
    totalCalls: 1847,
    successRate: 94.2,
    avgDuration: '3:42',
    callsToday: 23,
  },
  appointments: {
    total: 3256,
    completed: 2891,
    noShows: 187,
    noShowRate: 5.7,
  },
  trends: {
    callsChange: 12.5,
    noShowChange: -18.3,
    satisfactionChange: 4.2,
  },
}

function AnalyticsPage() {
  const { data: appointments = [] } = useQuery({
    queryKey: ['all-appointments-analytics'],
    queryFn: async () => {
      try {
        const response = await api.get('/appointments?limit=100')
        return response.data.appointments || []
      } catch {
        return []
      }
    },
  })

  // Calculate real stats from appointments
  const totalAppointments = appointments.length
  const completedAppointments = appointments.filter((a: any) => a.status === 'completed').length
  const cancelledAppointments = appointments.filter((a: any) => a.status === 'cancelled').length
  const pendingAppointments = appointments.filter((a: any) => a.status === 'pending').length

  const stats = [
    {
      title: 'Total Calls',
      value: mockAnalytics.voiceAgent.totalCalls.toLocaleString(),
      change: `+${mockAnalytics.trends.callsChange}%`,
      trend: 'up',
      icon: Phone,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Call Success Rate',
      value: `${mockAnalytics.voiceAgent.successRate}%`,
      change: 'Target: 95%',
      trend: 'neutral',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Appointments',
      value: totalAppointments > 0 ? totalAppointments.toLocaleString() : mockAnalytics.appointments.total.toLocaleString(),
      change: `${completedAppointments} completed`,
      trend: 'up',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'No-Show Rate',
      value: `${mockAnalytics.appointments.noShowRate}%`,
      change: `${mockAnalytics.trends.noShowChange}%`,
      trend: 'down',
      icon: XCircle,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const performanceMetrics = [
    { label: 'Avg. Call Duration', value: mockAnalytics.voiceAgent.avgDuration, target: '< 4 min', status: 'good' },
    { label: 'First Call Resolution', value: '89%', target: '> 85%', status: 'good' },
    { label: 'Patient Satisfaction', value: '4.6/5', target: '> 4.5/5', status: 'good' },
    { label: 'System Uptime', value: '99.97%', target: '99.9%', status: 'good' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-grey-900">Analytics Dashboard</h1>
          <p className="text-grey-500">Voice agent performance and appointment metrics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl">
            Last 30 Days
          </Button>
          <Button className="bg-[#2BB59B] hover:bg-[#249A84] text-white rounded-xl">
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ color: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('green') ? '#22c55e' : stat.color.includes('purple') ? '#a855f7' : '#f97316' }} />
                    </div>
                    {stat.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
                    {stat.trend === 'down' && <TrendingDown className="w-5 h-5 text-green-500" />}
                  </div>
                  <h3 className="text-3xl font-bold text-grey-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-grey-500">{stat.title}</p>
                  <p className="text-xs text-grey-400 mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voice Agent Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#2BB59B]" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {performanceMetrics.map((metric, i) => (
                <div key={i} className="p-4 bg-grey-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-grey-500">{metric.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${metric.status === 'good'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {metric.status === 'good' ? 'On Target' : 'Needs Attention'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-grey-900">{metric.value}</div>
                  <div className="text-xs text-grey-400 mt-1">Target: {metric.target}</div>
                </div>
              ))}
            </div>

            {/* Chart Placeholder */}
            <div className="mt-6 p-6 bg-grey-50 rounded-2xl">
              <div className="flex items-center justify-center h-48 text-grey-400">
                <div className="text-center">
                  <BarChart2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Call volume trend chart</p>
                  <p className="text-xs">(Integration with analytics service)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#2BB59B]" />
              Appointment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-grey-700">Completed</span>
                </div>
                <span className="font-bold text-green-700">{completedAppointments || 2891}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm font-medium text-grey-700">Pending</span>
                </div>
                <span className="font-bold text-yellow-700">{pendingAppointments || 178}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-grey-700">Cancelled</span>
                </div>
                <span className="font-bold text-red-700">{cancelledAppointments || 187}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[#D7EAFB]/30 to-[#ECFDF5]/30 rounded-2xl">
              <h4 className="text-sm font-semibold text-grey-700 mb-3">Key Insights</h4>
              <ul className="space-y-2 text-sm text-grey-600">
                <li className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-green-500" />
                  No-shows reduced by 65%
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Patient satisfaction up 12%
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Avg. booking time: 2.3 min
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
