'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, AlertCircle, DollarSign, Package, Users, ShoppingCart, Clock, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import Link from 'next/link'

const monthlyData = [
  { month: 'Jan', revenue: 4500000, profit: 1200000 },
  { month: 'Feb', revenue: 5200000, profit: 1450000 },
  { month: 'Mar', revenue: 4800000, profit: 1300000 },
  { month: 'Apr', revenue: 6100000, profit: 1800000 },
  { month: 'May', revenue: 5800000, profit: 1600000 },
  { month: 'Jun', revenue: 6500000, profit: 1950000 },
]

export default function AdminDashboard() {
  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  }

  const kpis = [
    {
      label: 'Revenue (June)',
      value: formatPKR(6500000),
      change: '+12.5%',
      icon: DollarSign,
      status: 'success',
    },
    {
      label: 'Profit (June)',
      value: formatPKR(1950000),
      change: '+15.2%',
      icon: TrendingUp,
      status: 'success',
    },
    {
      label: 'Active Installments',
      value: '245',
      change: '+5',
      icon: Users,
      status: 'neutral',
    },
    {
      label: 'Due Today',
      value: '12',
      change: formatPKR(145000),
      icon: Clock,
      status: 'warning',
    },
    {
      label: 'Overdue Amount',
      value: formatPKR(450000),
      change: '15 Customers',
      icon: AlertCircle,
      status: 'danger',
    },
    {
      label: 'Low Stock Items',
      value: '8',
      change: 'Needs reorder',
      icon: Package,
      status: 'warning',
    },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          let bgClass = 'bg-gray-100 text-gray-600'
          if (kpi.status === 'success') bgClass = 'bg-green-100 text-green-600'
          if (kpi.status === 'warning') bgClass = 'bg-amber-100 text-amber-600'
          if (kpi.status === 'danger') bgClass = 'bg-red-100 text-red-600'

          return (
            <Card key={idx} className="p-4 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${bgClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-gray-500 text-xs font-medium mb-1">{kpi.label}</h3>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">{kpi.value}</span>
                <span className={`text-xs font-semibold ${kpi.status === 'success' ? 'text-green-600' : kpi.status === 'danger' ? 'text-red-600' : 'text-gray-500'}`}>
                  {kpi.change}
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-gray-900">Revenue & Profit Trends</h2>
            <select className="text-sm border-gray-200 rounded-md py-1 pl-2 pr-8 text-gray-600">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `Rs. ${val / 1000000}M`} />
                <Tooltip
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => formatPKR(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="revenue" name="Revenue" fill="oklch(0.35 0.165 260)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="profit" name="Profit" fill="oklch(0.58 0.235 29.234)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Reminders Widget */}
        <Card className="flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Payment Reminders</h2>
            <Link href="/admin/payments" className="text-xs text-[oklch(0.58_0.235_29.234)] font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="p-0 overflow-y-auto max-h-[300px]">
            {/* Overdue */}
            <div className="bg-red-50/50 px-5 py-2 border-b border-red-100">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Overdue (3)</span>
            </div>
            {[
              { name: 'Tariq Mehmood', inv: 'SK-2026-00042', amount: 15000, days: 5 },
              { name: 'Sana Javed', inv: 'SK-2026-00018', amount: 8500, days: 12 },
            ].map((item, i) => (
              <div key={`overdue-${i}`} className="px-5 py-3 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.inv} • <span className="text-red-600 font-medium">{item.days} days late</span></p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-gray-900">{formatPKR(item.amount)}</span>
                  <button className="text-[10px] font-semibold bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded hover:bg-gray-50">Record</button>
                </div>
              </div>
            ))}
            
            {/* Due Today */}
            <div className="bg-amber-50/50 px-5 py-2 border-b border-amber-100">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Due Today (4)</span>
            </div>
            {[
              { name: 'Usman Ali', inv: 'SK-2026-00085', amount: 12000 },
              { name: 'Kashif Raza', inv: 'SK-2026-00091', amount: 25000 },
            ].map((item, i) => (
              <div key={`today-${i}`} className="px-5 py-3 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.inv}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-gray-900">{formatPKR(item.amount)}</span>
                  <button className="text-[10px] font-semibold bg-[oklch(0.58_0.235_29.234)] text-white px-2 py-0.5 rounded hover:bg-[oklch(0.52_0.235_29.234)]">Record</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Sales Table */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Recent Sales</h2>
            <Button variant="outline" size="sm" className="h-8 text-xs">View All Sales</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Method</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { id: 'SK-2026-00145', name: 'Faizan Ahmed', amount: 124000, method: 'Cash', status: 'Paid', date: 'Today, 10:42 AM' },
                  { id: 'SK-2026-00144', name: 'Zainab Bibi', amount: 82500, method: 'Installment', status: 'Active', date: 'Today, 09:15 AM' },
                  { id: 'SK-2026-00143', name: 'Ali Hassan', amount: 18500, method: 'Card', status: 'Paid', date: 'Yesterday' },
                  { id: 'SK-2026-00142', name: 'Bilal Qureshi', amount: 215000, method: 'Installment', status: 'Active', date: 'Yesterday' },
                  { id: 'SK-2026-00141', name: 'Sadia Imran', amount: 45000, method: 'Bank Transfer', status: 'Pending', date: '13 Jun 2026' },
                ].map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <span className="font-semibold text-gray-900">{sale.id}</span>
                      <p className="text-[10px] text-gray-500">{sale.date}</p>
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-700">{sale.name}</td>
                    <td className="px-5 py-3 font-bold text-gray-900">{formatPKR(sale.amount)}</td>
                    <td className="px-5 py-3 text-gray-600">{sale.method}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        sale.status === 'Paid' ? 'bg-green-100 text-green-700' :
                        sale.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Low Stock */}
        <Card className="flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Low Stock Alerts</h2>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">8 Items</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs font-semibold">
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2 text-right">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'Dawlance 12 CFT Refrigerator', sku: 'SK-REF-DWL-001', qty: 2, threshold: 5 },
                  { name: 'Haier 1.5 Ton Inverter AC', sku: 'SK-AC-HIR-015', qty: 1, threshold: 10 },
                  { name: 'PEL 20 Ltr Microwave', sku: 'SK-MW-PEL-020', qty: 0, threshold: 4 },
                  { name: 'Orient 32" LED TV', sku: 'SK-TV-ORT-032', qty: 3, threshold: 8 },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 text-xs line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-gray-500">{item.sku}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold ${item.qty === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {item.qty}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-1">/ {item.threshold}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-gray-100 mt-auto">
            <Button variant="outline" className="w-full h-8 text-xs">Go to Inventory <ArrowRight className="w-3 h-3 ml-2" /></Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
