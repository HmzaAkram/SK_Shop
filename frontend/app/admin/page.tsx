'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, AlertCircle, DollarSign, Package, Users, ShoppingCart, Clock, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { fetchApi } from '@/lib/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [sales, setSales] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, salesRes, reportRes] = await Promise.all([
          fetchApi('/dashboard/stats'),
          fetchApi('/sales'),
          fetchApi('/reports/summary'),
        ])
        if (statsRes.success !== false) setStats(statsRes)
        if (Array.isArray(salesRes)) setSales(salesRes.slice(0, 5))
        if (reportRes.success !== false) setReportData(reportRes)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  }

  const totalSales = stats?.total_sales || 0
  const totalExpenses = reportData?.total_expenses || 0
  const profit = totalSales - totalExpenses
  const overdueInstallments = stats?.overdue_installments || []
  const upcomingInstallments = stats?.upcoming_installments || []
  const lowStockProducts = stats?.low_stock_products || []

  const kpis = [
    { label: 'Total Revenue', value: formatPKR(totalSales), icon: DollarSign, status: totalSales > 0 ? 'success' : 'neutral' },
    { label: 'Profit', value: formatPKR(profit), icon: TrendingUp, status: profit > 0 ? 'success' : profit < 0 ? 'danger' : 'neutral' },
    { label: 'Total Customers', value: String(stats?.total_customers || 0), icon: Users, status: 'neutral' },
    { label: 'Total Orders', value: String(stats?.total_orders || 0), icon: ShoppingCart, status: 'neutral' },
    { label: 'Overdue', value: String(overdueInstallments.length), icon: AlertCircle, status: overdueInstallments.length > 0 ? 'danger' : 'neutral' },
    { label: 'Low Stock Items', value: String(lowStockProducts.length), icon: Package, status: lowStockProducts.length > 0 ? 'warning' : 'neutral' },
  ]

  // Build chart data from monthly report
  const monthlyChartData = (reportData?.monthly_sales || []).map((s: any) => {
    const expMonth = (reportData?.monthly_expenses || []).find((e: any) => e.month === s.month)
    return {
      month: s.month,
      revenue: s.total,
      profit: s.total - (expMonth?.total || 0),
    }
  })

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
                <span className="text-lg font-bold text-gray-900">{loading ? '...' : kpi.value}</span>
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
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `Rs. ${val / 1000}k`} />
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
          </div>
          <div className="p-0 overflow-y-auto max-h-[300px]">
            {/* Overdue */}
            <div className="bg-red-50/50 px-5 py-2 border-b border-red-100">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Overdue ({overdueInstallments.length})</span>
            </div>
            {overdueInstallments.map((item: any, i: number) => (
              <div key={`overdue-${i}`} className="px-5 py-3 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.sale?.customer?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">INV-{item.sale?.invoice_number} • <span className="text-red-600 font-medium">Due: {item.due_date}</span></p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-gray-900">{formatPKR(item.amount)}</span>
                </div>
              </div>
            ))}

            {/* Upcoming */}
            <div className="bg-amber-50/50 px-5 py-2 border-b border-amber-100">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Due Soon ({upcomingInstallments.length})</span>
            </div>
            {upcomingInstallments.map((item: any, i: number) => (
              <div key={`upcoming-${i}`} className="px-5 py-3 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.sale?.customer?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">INV-{item.sale?.invoice_number} • Due: {item.due_date}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-gray-900">{formatPKR(item.amount)}</span>
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
            <Link href="/admin/sales">
              <Button variant="outline" size="sm" className="h-8 text-xs">View All Sales</Button>
            </Link>
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
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <span className="font-semibold text-gray-900">INV-{sale.invoice_number}</span>
                      <p className="text-[10px] text-gray-500">{sale.sale_date}</p>
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-700">{sale.customer?.name}</td>
                    <td className="px-5 py-3 font-bold text-gray-900">{formatPKR(sale.total_amount)}</td>
                    <td className="px-5 py-3 text-gray-600">{sale.type}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        sale.type === 'Cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {sale.type === 'Cash' ? 'Paid' : 'Installment'}
                      </span>
                    </td>
                  </tr>
                ))}
                {sales.length === 0 && !loading && (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">No sales yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Low Stock */}
        <Card className="flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Low Stock Alerts</h2>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">{lowStockProducts.length} Items</span>
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
                {lowStockProducts.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 text-xs line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-gray-500">PRD-{item.id}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold ${item.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {item.stock}
                      </span>
                    </td>
                  </tr>
                ))}
                {lowStockProducts.length === 0 && !loading && (
                  <tr><td colSpan={2} className="px-4 py-8 text-center text-gray-400 text-sm">All products stocked</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-gray-100 mt-auto">
            <Link href="/admin/products">
              <Button variant="outline" className="w-full h-8 text-xs">Go to Inventory <ArrowRight className="w-3 h-3 ml-2" /></Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
