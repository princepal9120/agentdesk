/**
 * Billing Page
 * Clinical Minimalism design for billing history and payment methods.
 */

import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { CreditCard, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/_authenticated/_layout/billing')({
  component: BillingPage,
})

function BillingPage() {
  const invoices = [
    { id: 'INV-2024-001', date: 'Dec 01, 2024', amount: '$150.00', status: 'paid', description: 'General Consultation' },
    { id: 'INV-2024-002', date: 'Nov 15, 2024', amount: '$75.00', status: 'paid', description: 'Follow-up Visit' },
    { id: 'INV-2024-003', date: 'Oct 28, 2024', amount: '$200.00', status: 'paid', description: 'Lab Tests' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-grey-900">Billing & Payments</h1>
        <p className="text-grey-500">Manage your payment methods and view invoice history.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Securely managed via Stripe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-grey-200 rounded-xl flex items-center justify-between bg-grey-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-grey-900 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="font-medium text-grey-900">Visa ending in 4242</p>
                    <p className="text-sm text-grey-500">Expires 12/28</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Default</Badge>
              </div>
              <Button variant="outline" className="w-full border-dashed border-grey-300 text-grey-500 hover:text-grey-900 hover:border-grey-400">
                <CreditCard className="w-4 h-4 mr-2" />
                Add New Card
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full bg-gradient-to-br from-[#2BB59B] to-[#1B5E7A] text-white border-none">
            <CardContent className="pt-6 flex flex-col justify-between h-full">
              <div>
                <p className="text-white/80 font-medium mb-1">Outstanding Balance</p>
                <h2 className="text-4xl font-bold">$0.00</h2>
              </div>
              <div className="mt-8">
                <div className="flex items-center gap-2 text-white/90 text-sm mb-4">
                  <CheckCircle className="w-4 h-4" />
                  All invoices paid
                </div>
                <Button className="w-full bg-white text-[#1B5E7A] hover:bg-white/90 border-none">
                  View Statement
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Invoice History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {invoices.map((invoice, i) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 hover:bg-grey-50 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-grey-100 rounded-full flex items-center justify-center text-grey-500 group-hover:bg-[#D7EAFB] group-hover:text-[#1B5E7A] transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-grey-900">{invoice.description}</p>
                      <p className="text-sm text-grey-500">{invoice.date} • {invoice.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-grey-900">{invoice.amount}</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 capitalize">
                      {invoice.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="text-grey-400 hover:text-grey-900">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
