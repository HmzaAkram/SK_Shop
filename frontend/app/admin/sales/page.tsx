'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Eye, Trash2, Search, Download } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const sales = [
  { id: 'INV-001', customer: 'Ahmad Ali', date: '2024-06-14', items: 2, amount: 'RS 2,850', status: 'Completed' },
  { id: 'INV-002', customer: 'Fatima Khan', date: '2024-06-13', items: 1, amount: 'RS 1,200', status: 'Pending' },
  { id: 'INV-003', customer: 'Muhammad Hassan', date: '2024-06-12', items: 3, amount: 'RS 4,500', status: 'Completed' },
  { id: 'INV-004', customer: 'Aisha Mohamed', date: '2024-06-11', items: 1, amount: 'RS 899', status: 'Completed' },
  { id: 'INV-005', customer: 'Ibrahim Rashid', date: '2024-06-10', items: 2, amount: 'RS 2,100', status: 'Cancelled' },
]

export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'Pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
      case 'Cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales</h1>
          <p className="text-foreground/70 mt-1">Track all sales transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-background">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href="/admin/sales/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Sale
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-foreground/70 text-sm font-medium mb-2">Total Sales (This Month)</h3>
          <p className="text-3xl font-bold text-foreground">RS 24,500</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">↑ 12.5% from last month</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-foreground/70 text-sm font-medium mb-2">Number of Sales</h3>
          <p className="text-3xl font-bold text-foreground">145</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">↑ 8.2% from last month</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-foreground/70 text-sm font-medium mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold text-foreground">RS 169</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">↑ 3.5% from last month</p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Search by invoice number or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </Card>

      {/* Sales Table - Desktop */}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-card border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Invoice</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Customer</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Date</th>
                <th className="text-center px-6 py-4 font-semibold text-foreground">Items</th>
                <th className="text-right px-6 py-4 font-semibold text-foreground">Amount</th>
                <th className="text-center px-6 py-4 font-semibold text-foreground">Status</th>
                <th className="text-center px-6 py-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-foreground font-bold">{sale.id}</td>
                  <td className="px-6 py-4 text-foreground">{sale.customer}</td>
                  <td className="px-6 py-4 text-foreground/70">{sale.date}</td>
                  <td className="px-6 py-4 text-center text-foreground">{sale.items}</td>
                  <td className="px-6 py-4 text-right text-foreground font-bold">{sale.amount}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(sale.status)}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button className="p-2 hover:bg-muted rounded-lg transition">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Sales Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {sales.map((sale) => (
          <Card key={sale.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-foreground">{sale.id}</h3>
                <p className="text-sm text-foreground/70">{sale.customer}</p>
                <p className="text-sm text-foreground/70">{sale.date}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(sale.status)}`}>
                {sale.status}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-primary">{sale.amount}</span>
              <span className="text-sm text-foreground/70">{sale.items} items</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline" className="text-red-600">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
