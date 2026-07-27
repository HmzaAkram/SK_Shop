'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { fetchApi } from '@/lib/api'
import { MonthYearSelector } from './MonthYearSelector'
import { QuickFilters } from './QuickFilters'

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#8b5cf6']

export function AnalyticsTab() {
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Filter state
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [filterType, setFilterType] = useState<'custom' | 'currentMonth' | 'lastMonth' | 'last3Months' | 'last6Months' | 'currentYear'>('custom')

  const buildQuery = () => {
    const params = new URLSearchParams()
    if (filterType === 'custom') {
      if (month) params.append('month', month.toString())
      if (year) params.append('year', year.toString())
    } else if (filterType === 'currentYear') {
      params.append('year', year.toString())
    } else if (filterType === 'last3Months' || filterType === 'last6Months') {
      const months = filterType === 'last3Months' ? 3 : 6
      const start = new Date()
      start.setMonth(start.getMonth() - months)
      const from = start.toISOString().split('T')[0]
      const to = new Date().toISOString().split('T')[0]
      params.append('from_date', from)
      params.append('to_date', to)
    } else if (filterType === 'lastMonth' || filterType === 'currentMonth') {
      params.append('month', month.toString())
      params.append('year', year.toString())
    }
    return params.toString()
  }

  const loadReport = async () => {
    setLoading(true)
    try {
      const query = buildQuery()
      const res = await fetchApi(`/reports/summary?${query}`)
      if (res.success !== false) setReportData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Initial load and when filter type changes
  useEffect(() => {
    const now = new Date()
    setMonth(now.getMonth() + 1)
    setYear(now.getFullYear())
    loadReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType])

  // Refetch when month/year changes for relevant filter types
  useEffect(() => {
    if (filterType === 'custom' || filterType === 'currentMonth' || filterType === 'lastMonth') {
      loadReport()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year])

  const handleQuickSelect = (type: any) => {
    setFilterType(type)
    const now = new Date()
    if (type === 'currentMonth') {
      setMonth(now.getMonth() + 1)
      setYear(now.getFullYear())
    } else if (type === 'lastMonth') {
      const last = new Date()
      last.setMonth(last.getMonth() - 1)
      setMonth(last.getMonth() + 1)
      setYear(last.getFullYear())
    } else if (type === 'currentYear') {
      setYear(now.getFullYear())
    }
  }

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  }

  const totalSales = reportData?.total_sales || 0
  const totalExpenses = reportData?.total_expenses || 0
  const profit = reportData?.profit || 0

  // Build monthly chart data
  const monthlySales = reportData?.monthly_sales || []
  const monthlyExpenses = reportData?.monthly_expenses || []
  const monthlyCogs = reportData?.monthly_cogs || []

  const chartData = monthlySales.map((s: any) => {
    const expMonth = monthlyExpenses.find((e: any) => e.month === s.month)
    const cogsMonth = monthlyCogs.find((c: any) => c.month === s.month)
    const revenue = Number(s.total)
    const cogs = Number(cogsMonth?.total || 0)
    const expenses = Number(expMonth?.total || 0)
    const netProfit = revenue - cogs - expenses
    return { period: s.month, revenue, cogs, expenses, net_profit: netProfit }
  })

  // Sales breakdown by type for pie chart
  const cashSales = reportData?.cash_sales || 0
  const installmentSales = reportData?.installment_sales || 0
  const pieData = [
    { name: 'Cash Sales', value: Number(cashSales) || 0 },
    { name: 'Installment Sales', value: Number(installmentSales) || 0 },
  ].filter(d => d.value > 0)

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <QuickFilters onSelect={handleQuickSelect} />
        <MonthYearSelector month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); setFilterType('custom'); }} />
      </div>

      {/* Financial Summary */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">Profit & Loss Summary</h2>
          <span className="text-sm text-gray-500">{reportData?.from} → {reportData?.to}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Activity className="w-5 h-5" /></div>
              <p className="text-sm font-bold text-gray-500 uppercase">Total Sales</p>
            </div>
            <p className="text-2xl font-black text-blue-700">{loading ? '...' : formatPKR(totalSales)}</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><TrendingUp className="w-5 h-5" /></div>
              <p className="text-sm font-bold text-gray-500 uppercase">Total Orders</p>
            </div>
            <p className="text-2xl font-black text-purple-700">{loading ? '...' : reportData?.sales_count || 0}</p>
          </div>

          <div className="p-4 rounded-xl bg-red-50 border border-red-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg text-red-600"><TrendingDown className="w-5 h-5" /></div>
              <p className="text-sm font-bold text-gray-500 uppercase">Total Expenses</p>
            </div>
            <p className="text-2xl font-black text-red-700">{loading ? '...' : formatPKR(totalExpenses)}</p>
          </div>

          <div className="p-4 rounded-xl bg-green-50 border border-green-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600"><DollarSign className="w-5 h-5" /></div>
              <p className="text-sm font-bold text-gray-500 uppercase">Net Profit</p>
            </div>
            <p className={`text-2xl font-black ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>{loading ? '...' : formatPKR(profit)}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Monthly Revenue & Profit</h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="period" stroke="var(--color-foreground)" />
              <YAxis stroke="var(--color-foreground)" tickFormatter={(value) => `RS ${value / 1000}k`} />
              <Tooltip formatter={(value: number) => formatPKR(value)} contentStyle={{ backgroundColor: 'var(--color-card)', border: `1px solid var(--color-border)`, borderRadius: '8px', color: 'var(--color-foreground)' }} />
              <Legend />
              <Line type="monotone" name="Revenue" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} />
              <Line type="monotone" name="COGS" dataKey="cogs" stroke="#f59e0b" strokeWidth={3} />
              <Line type="monotone" name="Net Profit" dataKey="net_profit" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6 md:col-span-1">
          <h2 className="text-xl font-bold text-foreground mb-6">Sales Breakdown</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatPKR(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-gray-400 text-sm">No sales data yet</div>
          )}
        </Card>
      </div>
    </div>
  )
}
