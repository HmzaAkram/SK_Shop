﻿'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, ChevronDown, Calendar, AlertCircle, CheckCircle2, ChevronRight, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchApi } from '@/lib/api'

export default function PaymentsPage() {
const [installments, setInstallments] = useState<any[]>([])
const [searchQuery, setSearchQuery] = useState('')
const [activeFilter, setActiveFilter] = useState('All')
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
let cancelled = false
const controller = new AbortController()
const load = async () => {
setLoading(true)
setError(null)
try {
const res = await fetchApi('/installments', { signal: controller.signal as any })
const data = Array.isArray(res) ? res : (res.data ?? [])
if (!cancelled) {
// map backend installments to UI-friendly shape
const mapped = data.map((it: any) => {
const sale = it.sale || {}
const customer = sale.customer?.name || sale.customer || 'Unknown'
const product = (sale.items && sale.items[0] && sale.items[0].product && sale.items[0].product.name) || (sale.product) || 'Product'
const total = sale.total_amount ?? 0
const dueAmount = parseFloat(it.amount ?? 0)
const remaining = Math.max(0, (total || 0) - dueAmount)
const paid = (total || 0) - remaining
return {
id: it.id,
customer,
product,
status: it.status || (it.paid_date ? 'Completed' : 'Pending'),
nextDue: it.due_date,
dueAmount,
remaining,
paid,
total,
raw: it,
}
})
setInstallments(mapped)
}
} catch (err: any) {
if (!cancelled) setError(err.message || 'Failed to load installments')
} finally {
if (!cancelled) setLoading(false)
}
}
load()
return () => { cancelled = true; controller.abort() }
}, [])

const filtered = installments.filter(item => {
if (activeFilter !== 'All' && item.status !== activeFilter) return false
if (searchQuery && !item.customer.toLowerCase().includes(searchQuery.toLowerCase()) && !String(item.id).toLowerCase().includes(searchQuery.toLowerCase())) return false
return true
})

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

return (
<div className="max-w-7xl mx-auto space-y-6">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div>
<h1 className="text-2xl font-bold text-gray-900">Installments & Payments</h1>
<p className="text-gray-500 text-sm">Manage active installment plans and record payments</p>
</div>
</div>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <Card className="p-4 bg-white border-gray-200 shadow-sm flex flex-col justify-between">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Receivables</p>
      <p className="text-2xl font-black text-gray-900">{formatPKR(installments.reduce((s, i) => s + (i.total || 0), 0))}</p>
    </Card>
    <Card className="p-4 bg-white border-gray-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Due Today ({installments.filter(i => i.nextDue === new Date().toISOString().split('T')[0]).length})</p>
      </div>
      <p className="text-2xl font-black text-amber-600">{formatPKR(installments.filter(i => i.nextDue === new Date().toISOString().split('T')[0]).reduce((s, i) => s + (i.dueAmount || 0), 0))}</p>
    </Card>
    <Card className="p-4 bg-red-50 border-red-100 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Overdue ({installments.filter(i => i.status === 'Overdue').length})</p>
      </div>
      <p className="text-2xl font-black text-red-700">{formatPKR(installments.filter(i => i.status === 'Overdue').reduce((s, i) => s + (i.dueAmount || 0), 0))}</p>
    </Card>
    <Card className="p-4 bg-green-50 border-green-100 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Collected this month</p>
      </div>
      <p className="text-2xl font-black text-green-700">{formatPKR(installments.filter(i => i.status === 'Completed').reduce((s, i) => s + (i.dueAmount || 0), 0))}</p>
    </Card>
  </div>

  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-280px)]">
    <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
        {['All', 'Overdue', 'Due Today', 'Good', 'Completed'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeFilter === filter ? 'bg-[oklch(0.35_0.165_260)] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}>
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
          {loading && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>}
          {!loading && filtered.length === 0 && (
            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No installment plans found.</td></tr>
          )}
          {filtered.map(plan => (
            <tr key={plan.id} className="hover:bg-gray-50 group transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-10 rounded-full ${plan.status === 'Overdue' ? 'bg-red-500' : plan.status === 'Due Today' ? 'bg-amber-500' : plan.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`} />
                  <div>
                    <Link href={`/admin/customers/1`} className="font-bold text-gray-900 hover:text-[oklch(0.58_0.235_29.234)] block leading-tight mb-1">{plan.customer}</Link>
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
                    <div className="bg-[oklch(0.58_0.235_29.234)] h-full" style={{width: `${(plan.paid / (plan.total || 1)) * 100}%`}} />
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
                        alert('Record payment - dummy');
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

      {error && <div className="p-4 text-red-600">{error}</div>}
    </div>
  </div>
</div>
)
}