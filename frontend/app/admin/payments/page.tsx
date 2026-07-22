'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, ChevronDown, Calendar, AlertCircle, CheckCircle2, ChevronRight, FileText } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const installments = [
  { 
    id: 'PLN-001', customer: 'Tariq Mehmood', product: 'Dawlance 12 CFT Refrigerator', 
    total: 82500, paid: 25208, remaining: 57292, 
    status: 'Overdue', nextDue: '10 Jun 2026', dueAmount: 5208 
  },
  { 
    id: 'PLN-002', customer: 'Sana Javed', product: 'Haier 1.5 Ton Inverter AC', 
    total: 124000, paid: 84000, remaining: 40000, 
    status: 'Good', nextDue: '25 Jun 2026', dueAmount: 10000 
  },
  { 
    id: 'PLN-003', customer: 'Usman Ali', product: 'Samsung 43" Smart TV', 
    total: 68900, paid: 13780, remaining: 55120, 
    status: 'Due Today', nextDue: '15 Jun 2026', dueAmount: 4593 
  },
  { 
    id: 'PLN-004', customer: 'Zainab Bibi', product: 'PEL 20 Ltr Microwave', 
    total: 18500, paid: 18500, remaining: 0, 
    status: 'Completed', nextDue: '-', dueAmount: 0 
  },
  { 
    id: 'PLN-005', customer: 'Ali Hassan', product: 'Gree 1 Ton Inverter AC', 
    total: 105000, paid: 35000, remaining: 70000, 
    status: 'Overdue', nextDue: '01 Jun 2026', dueAmount: 8750 
  },
]

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const [recordingPayment, setRecordingPayment] = useState<typeof installments[0] | null>(null)
  const [paymentForm, setPaymentForm] = useState({ amount: '', date: '', method: 'Cash' })

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Good': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'Due Today': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'Overdue': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const filtered = installments.filter(item => {
    if (activeFilter !== 'All' && item.status !== activeFilter) return false
    if (searchQuery && !item.customer.toLowerCase().includes(searchQuery.toLowerCase()) && !item.id.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Installments & Payments</h1>
          <p className="text-gray-500 text-sm">Manage active installment plans and record payments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-gray-200 shadow-sm flex flex-col justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Receivables</p>
          <p className="text-2xl font-black text-gray-900">{formatPKR(2545000)}</p>
        </Card>
        <Card className="p-4 bg-white border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Due Today (12)</p>
          </div>
          <p className="text-2xl font-black text-amber-600">{formatPKR(145000)}</p>
        </Card>
        <Card className="p-4 bg-red-50 border-red-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Overdue (15)</p>
          </div>
          <p className="text-2xl font-black text-red-700">{formatPKR(450000)}</p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Collected this month</p>
          </div>
          <p className="text-2xl font-black text-green-700">{formatPKR(850000)}</p>
        </Card>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-280px)]">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {['All', 'Overdue', 'Due Today', 'Good', 'Completed'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  activeFilter === filter 
                    ? 'bg-[oklch(0.35_0.165_260)] text-white' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search plan or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] focus:outline-none"
            />
          </div>
        </div>

        {/* Table List */}
        <div className="flex-1 overflow-y-auto p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-gray-500 text-xs font-bold uppercase tracking-wider sticky top-0 z-10 shadow-sm border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Plan / Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Next Due Date</th>
                <th className="px-6 py-4 text-right">Remaining Balance</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(plan => (
                <tr key={plan.id} className="hover:bg-gray-50 group transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-1 h-10 rounded-full ${plan.status === 'Overdue' ? 'bg-red-500' : plan.status === 'Due Today' ? 'bg-amber-500' : plan.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`} />
                      <div>
                        <Link href="/admin/customers/1" className="font-bold text-gray-900 hover:text-[oklch(0.58_0.235_29.234)] block leading-tight mb-1">{plan.customer}</Link>
                        <p className="text-xs text-gray-500">{plan.id} • {plan.product}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold border ${getStatusStyle(plan.status)}`}>
                      {plan.status === 'Completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {plan.status === 'Overdue' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {plan.status === 'Due Today' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {plan.status !== 'Completed' ? (
                      <div>
                        <p className={`font-semibold ${plan.status === 'Overdue' ? 'text-red-600' : 'text-gray-900'}`}>{plan.nextDue}</p>
                        <p className="text-xs text-gray-500">Amount: {formatPKR(plan.dueAmount)}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-gray-900">{formatPKR(plan.remaining)}</span>
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden flex">
                        <div className="bg-[oklch(0.58_0.235_29.234)] h-full" style={{width: `${(plan.paid / plan.total) * 100}%`}} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {plan.status !== 'Completed' && (
                        <Button 
                          size="sm" 
                          className="bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] h-8 text-xs px-3"
                          onClick={() => {
                            setRecordingPayment(plan);
                            setPaymentForm({ amount: plan.dueAmount.toString(), date: new Date().toISOString().split('T')[0], method: 'Cash' });
                          }}
                        >
                          Record Pay
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-gray-200">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-500 font-medium">No installment plans found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Record Payment Modal (Dummy) */}
      {recordingPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setRecordingPayment(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Record Installment Payment</h2>
            <p className="text-sm text-gray-500 mb-6">Plan: {recordingPayment.id} • {recordingPayment.customer}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Payment Amount (PKR)</label>
                <input 
                  type="number" 
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] focus:outline-none" 
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Payment Date</label>
                <input 
                  type="date" 
                  value={paymentForm.date}
                  onChange={(e) => setPaymentForm({...paymentForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Payment Method</label>
                <select 
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({...paymentForm, method: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] focus:outline-none bg-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 transition" onClick={() => setRecordingPayment(null)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] transition" onClick={() => {
                alert('Dummy action: Payment recorded successfully!');
                setRecordingPayment(null);
              }}>Confirm Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
