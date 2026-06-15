'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const revenueData = [
  { month: 'Jan', revenue: 4000, profit: 2400, orders: 45 },
  { month: 'Feb', revenue: 3000, profit: 1398, orders: 38 },
  { month: 'Mar', revenue: 2000, profit: 9800, orders: 52 },
  { month: 'Apr', revenue: 2780, profit: 3908, orders: 41 },
  { month: 'May', revenue: 1890, profit: 4800, orders: 35 },
  { month: 'Jun', revenue: 2390, profit: 3800, orders: 48 },
]

const categoryData = [
  { name: 'Televisions', value: 35 },
  { name: 'Smartphones', value: 25 },
  { name: 'Laptops', value: 20 },
  { name: 'Gaming', value: 12 },
  { name: 'Audio', value: 8 },
]

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-foreground/70 mt-1">Comprehensive business performance analytics</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Date Filter */}
      <Card className="p-4">
        <div className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
            <div className="flex gap-2">
              <input type="date" className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground" />
              <input type="date" className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground" />
            </div>
          </div>
          <Button variant="outline">Apply Filter</Button>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-foreground/70 text-sm font-medium mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-foreground">$65,180</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">↑ 15.2% vs last period</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-foreground/70 text-sm font-medium mb-2">Total Profit</h3>
          <p className="text-3xl font-bold text-foreground">$26,706</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">↑ 12.8% vs last period</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-foreground/70 text-sm font-medium mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-foreground">259</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">↑ 8.5% vs last period</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-foreground/70 text-sm font-medium mb-2">Avg Order Value</h3>
          <p className="text-3xl font-bold text-foreground">$252</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">↑ 6.1% vs last period</p>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">Revenue & Profit Trend</h2>
          <Button size="sm" variant="outline" className="flex gap-2">
            <Calendar className="w-4 h-4" />
            Last 6 Months
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-foreground)" />
            <YAxis stroke="var(--color-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: `1px solid var(--color-border)`,
                borderRadius: '8px',
                color: 'var(--color-foreground)',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} />
            <Line type="monotone" dataKey="profit" stroke="var(--color-chart-3)" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Orders & Categories */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Monthly Orders</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-foreground)" />
              <YAxis stroke="var(--color-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: `1px solid var(--color-border)`,
                  borderRadius: '8px',
                  color: 'var(--color-foreground)',
                }}
              />
              <Bar dataKey="orders" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
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
            { rank: 1, name: 'Samsung 65" TV', sales: 45, revenue: '$40,455' },
            { rank: 2, name: 'iPhone 15 Pro', sales: 38, revenue: '$49,262' },
            { rank: 3, name: 'MacBook Air M3', sales: 28, revenue: '$33,572' },
            { rank: 4, name: 'PlayStation 5', sales: 22, revenue: '$10,978' },
            { rank: 5, name: 'Sony Headphones', sales: 32, revenue: '$11,168' },
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

      {/* Export Options */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <h2 className="text-lg font-bold text-foreground mb-4">Export Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="border-2 border-primary text-primary bg-transparent hover:bg-primary/10">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button className="border-2 border-secondary text-secondary bg-transparent hover:bg-secondary/10">
            <Download className="w-4 h-4 mr-2" />
            Download Excel
          </Button>
          <Button className="border-2 border-primary/50 text-foreground hover:bg-muted">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </Card>
    </div>
  )
}
