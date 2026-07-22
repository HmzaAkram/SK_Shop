'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Calendar, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { FilterExportBar } from './FilterExportBar'

const categoryData = [
  { name: 'Televisions', value: 35 },
  { name: 'Smartphones', value: 25 },
  { name: 'Laptops', value: 20 },
  { name: 'Gaming', value: 12 },
  { name: 'Audio', value: 8 },
]

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const years = ['2023', '2024', '2025', '2026']

export function AnalyticsTab() {
  const [selectedMonth, setSelectedMonth] = useState('March')
  const [selectedYear, setSelectedYear] = useState('2026')

  // Deterministic mock data generation
  const getFinancialData = (month: string, year: string) => {
    const seed = month.length * parseInt(year)
    const sales = 1500000 + (seed * 12345) % 1500000
    const grossProfit = sales * 0.35
    const expenses = grossProfit * 0.4
    return { sales, grossProfit, expenses }
  }

  const currentFinance = getFinancialData(selectedMonth, selectedYear)
  const netProfit = currentFinance.grossProfit - currentFinance.expenses

  const chartData = [
    { period: 'Week 1', revenue: currentFinance.sales * 0.2, profit: currentFinance.grossProfit * 0.2 },
    { period: 'Week 2', revenue: currentFinance.sales * 0.25, profit: currentFinance.grossProfit * 0.25 },
    { period: 'Week 3', revenue: currentFinance.sales * 0.3, profit: currentFinance.grossProfit * 0.3 },
    { period: 'Week 4', revenue: currentFinance.sales * 0.25, profit: currentFinance.grossProfit * 0.25 },
  ]

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FilterExportBar />

      {/* Monthly Financial Summary */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">Monthly Profit & Loss</h2>
          <div className="flex gap-3">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] focus:outline-none"
            >
              {months.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] focus:outline-none"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Activity className="w-5 h-5" /></div>
              <p className="text-sm font-bold text-gray-500 uppercase">Total Sales</p>
            </div>
            <p className="text-2xl font-black text-blue-700">{formatPKR(currentFinance.sales)}</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><TrendingUp className="w-5 h-5" /></div>
              <p className="text-sm font-bold text-gray-500 uppercase">Gross Profit</p>
            </div>
            <p className="text-2xl font-black text-purple-700">{formatPKR(currentFinance.grossProfit)}</p>
          </div>

          <div className="p-4 rounded-xl bg-red-50 border border-red-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg text-red-600"><TrendingDown className="w-5 h-5" /></div>
              <p className="text-sm font-bold text-gray-500 uppercase">Total Expenses</p>
            </div>
            <p className="text-2xl font-black text-red-700">{formatPKR(currentFinance.expenses)}</p>
          </div>

          <div className="p-4 rounded-xl bg-green-50 border border-green-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600"><DollarSign className="w-5 h-5" /></div>
              <p className="text-sm font-bold text-gray-500 uppercase">Net Profit</p>
            </div>
            <p className="text-2xl font-black text-green-700">{formatPKR(netProfit)}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Trend for {selectedMonth} {selectedYear}</h2>
            {/* Last 6 months button removed as requested, chart is now connected to the selected month */}
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="period" stroke="var(--color-foreground)" />
              <YAxis stroke="var(--color-foreground)" tickFormatter={(value) => `RS ${value / 1000}k`} />
              <Tooltip
                formatter={(value: number) => formatPKR(value)}
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: `1px solid var(--color-border)`,
                  borderRadius: '8px',
                  color: 'var(--color-foreground)',
                }}
              />
              <Legend />
              <Line type="monotone" name="Sales" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} />
              <Line type="monotone" name="Profit" dataKey="profit" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 md:col-span-1">
          <h2 className="text-xl font-bold text-foreground mb-6">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Top Selling Products</h2>
        <div className="space-y-3">
          {[
            { rank: 1, name: 'Samsung 65" TV', sales: 45, revenue: 'RS 4,045,500' },
            { rank: 2, name: 'iPhone 15 Pro', sales: 38, revenue: 'RS 4,926,200' },
            { rank: 3, name: 'MacBook Air M3', sales: 28, revenue: 'RS 3,357,200' },
            { rank: 4, name: 'PlayStation 5', sales: 22, revenue: 'RS 1,097,800' },
            { rank: 5, name: 'Sony Headphones', sales: 32, revenue: 'RS 1,116,800' },
          ].map((product) => (
            <div key={product.rank} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition">
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-primary w-8 text-center">#{product.rank}</span>
                <div>
                  <p className="font-semibold text-foreground">{product.name}</p>
                  <p className="text-sm text-foreground/70">{product.sales} sales</p>
                </div>
              </div>
              <span className="font-bold text-foreground">{product.revenue}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
