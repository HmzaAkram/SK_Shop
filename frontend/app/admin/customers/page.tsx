'use client'

import { Card } from '@/components/ui/card'
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchApi } from '@/lib/api'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const q = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''
        const res = await fetchApi(`/customers${q}`, { signal: controller.signal as any })
        // backend returns { success, message, data: [...] }
        const data = Array.isArray(res.data) ? res.data : res
        if (!cancelled) setCustomers(data)
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load customers')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    // simple debounce
    const t = setTimeout(load, 250)
    return () => { cancelled = true; controller.abort(); clearTimeout(t) }
  }, [searchQuery])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-foreground/70 mt-1">Manage customer accounts and information</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] transition">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </button>
      </div>

      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition">Filter</button>
        </div>
      </Card>

      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-card border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Name</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Phone</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Total Purchases</th>
                <th className="text-center px-6 py-4 font-semibold text-foreground">Status</th>
                <th className="text-center px-6 py-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
              )}
              {!loading && customers.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No customers found</td></tr>
              )}
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-foreground font-medium">{customer.name}</td>
                  <td className="px-6 py-4 text-foreground/70">{customer.phone}</td>
                  <td className="px-6 py-4 text-foreground font-semibold">{customer.total_purchases ?? customer.total_purchased ?? customer.sales_sum_total_amount ?? customer.totalPurchases ?? 0}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}`}>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Link href={`/admin/customers/${customer.id}`} className="p-2 hover:bg-muted rounded-lg transition" title="View Profile">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </Link>
                      <button className="p-2 hover:bg-muted rounded-lg transition" title="Edit">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition" title="Delete">
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

      <div className="md:hidden space-y-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-foreground">{customer.name}</h3>
              <p className="text-sm text-foreground/70">{customer.phone}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}`}>
              Active
            </span>
            </div>
            <div className="mb-3">
            <span className="text-lg font-bold text-primary">{customer.total_purchases ?? customer.total_purchased ?? customer.sales_sum_total_amount ?? customer.totalPurchases ?? 0}</span>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/customers/${customer.id}`} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition">
                <Eye className="w-4 h-4" />
                View Profile
              </Link>
              <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
          </Card>
        ))}
      </div>

      {error && <div className="text-red-600">{error}</div>}
    </div>
  )
}
