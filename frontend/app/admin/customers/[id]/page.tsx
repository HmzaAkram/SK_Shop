'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, MapPin, CreditCard, ShoppingBag, Receipt, AlertCircle, ArrowLeft, MoreVertical, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CustomerProfile() {
  const [activeTab, setActiveTab] = useState<'purchases'|'installments'|'payments'>('installments')

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  }

  // Mock Data
  const customer = {
    name: '',
    cnic: '',
    phone: '',
    address: '',
    joinDate: '',
    witness: '',
    outstanding: 0,
    status: 'Good Standing' // 'Good Standing' | 'Overdue'
  }

  const purchases: any[] = []
  const installments: any[] = []
  const payments: any[] = []

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header / Breadcrumb */}
      <div className="flex items-center gap-4 text-sm">
        <Link href="/admin/customers" className="text-gray-500 hover:text-[oklch(0.58_0.235_29.234)] flex items-center gap-1 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Customers
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-semibold">{customer.name}</span>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row relative">
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 md:p-8 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-[oklch(0.35_0.165_260)] to-[oklch(0.58_0.235_29.234)] rounded-full flex items-center justify-center text-3xl font-black text-white mb-4 shadow-lg">
            {customer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">{customer.name}</h1>
          <p className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">{customer.cnic}</p>
          
          <div className="w-full flex gap-2">
            <Button className="flex-1 bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] text-white shadow-md">
              Message
            </Button>
            <Button variant="outline" className="flex-1 bg-white hover:bg-gray-50">Edit</Button>
          </div>
        </div>

        <div className="p-6 md:p-8 md:w-2/3 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-8">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[oklch(0.58_0.235_29.234)] mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone</p>
                <p className="text-sm font-semibold text-gray-900">{customer.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[oklch(0.58_0.235_29.234)] mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Address</p>
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{customer.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[oklch(0.58_0.235_29.234)] mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Customer Since</p>
                <p className="text-sm font-semibold text-gray-900">{customer.joinDate}</p>
              </div>
            </div>
            {customer.witness && (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[oklch(0.58_0.235_29.234)] mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Witness (Installment)</p>
                  <p className="text-sm font-semibold text-gray-900">{customer.witness}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Outstanding Balance</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-gray-900">{formatPKR(customer.outstanding)}</span>
                {customer.status === 'Overdue' && (
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Overdue
                  </span>
                )}
              </div>
            </div>
            {customer.outstanding > 0 && (
              <Button size="sm" className="bg-[oklch(0.35_0.165_260)] hover:bg-[oklch(0.25_0.165_260)] text-white shadow-md">
                Record Payment
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('installments')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'installments' ? 'border-[oklch(0.58_0.235_29.234)] text-[oklch(0.58_0.235_29.234)]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            <CreditCard className="w-4 h-4" /> Installment Plans
          </button>
          <button 
            onClick={() => setActiveTab('purchases')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'purchases' ? 'border-[oklch(0.58_0.235_29.234)] text-[oklch(0.58_0.235_29.234)]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            <ShoppingBag className="w-4 h-4" /> Purchase History
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'payments' ? 'border-[oklch(0.58_0.235_29.234)] text-[oklch(0.58_0.235_29.234)]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            <Receipt className="w-4 h-4" /> Payment History
          </button>
        </div>

        <div className="p-0">
          {/* INSTALLMENTS TAB */}
          {activeTab === 'installments' && (
            <div className="p-6">
              {installments.map(plan => (
                <div key={plan.id} className="border border-red-200 bg-red-50/30 rounded-xl overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                  
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{plan.product}</h3>
                      <p className="text-xs text-gray-500 font-medium">Started: {plan.date} • Plan ID: {plan.id}</p>
                    </div>
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Due: {plan.nextDue}
                    </span>
                  </div>
                  
                  <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="font-bold text-gray-900">{formatPKR(plan.total)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Monthly</p>
                      <p className="font-bold text-[oklch(0.58_0.235_29.234)]">{formatPKR(plan.monthly)} <span className="text-xs text-gray-400 font-normal">x{plan.months}</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                      <p className="font-bold text-green-600">{formatPKR(plan.paid)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Remaining</p>
                      <p className="font-bold text-gray-900">{formatPKR(plan.remaining)}</p>
                    </div>
                  </div>
                  
                  <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden border border-gray-300">
                      <div className="bg-[oklch(0.58_0.235_29.234)] h-full rounded-full" style={{width: `${(plan.paid / plan.total) * 100}%`}}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-12 text-right">{Math.round((plan.paid / plan.total) * 100)}%</span>
                    <Button size="sm" className="bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] shadow-md">
                      Pay Installment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PURCHASES TAB */}
          {activeTab === 'purchases' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Products</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {purchases.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[oklch(0.35_0.165_260)]">{p.id}</td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{p.date}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{p.products}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded ${p.type === 'Installment' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {p.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-gray-900">{formatPKR(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Receipt #</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">For</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{p.id}</td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{p.date}</td>
                    <td className="px-6 py-4 text-gray-900">{p.type}</td>
                    <td className="px-6 py-4 text-gray-600">{p.method}</td>
                    <td className="px-6 py-4 text-right font-black text-green-600">+{formatPKR(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
