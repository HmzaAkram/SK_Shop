'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Eye, Trash2, Search, Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchApi } from '@/lib/api'
import { TransactionDetailsModal } from '@/app/admin/reports/components/TransactionDetailsModal'

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const q = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''
        const res = await fetchApi(`/sales${q}`, { signal: controller.signal as any })
        // backend returns { success, message, data: [...] }
        const data = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : (res.data ?? [])
        if (!cancelled) setSales(data)
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load sales')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    const t = setTimeout(load, 200)
    return () => { cancelled = true; controller.abort(); clearTimeout(t) }
  }, [searchQuery])

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

  // View modal state and selected sale
  const [selectedSale, setSelectedSale] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const mapSaleToTransaction = (sale: any) => {
    if (!sale) return null
    return {
      id: sale.id,
      entity: sale.customer?.name ?? sale.customer,
      date: sale.sale_date,
      totalBill: sale.total_amount,
      product: sale.items && sale.items.length > 0 ? sale.items.map((it: any) => `${it.product?.name ?? it.product_id} x${it.quantity}`).join(', ') : undefined,
      history: sale.installments ? sale.installments.map((ins: any) => ({ date: ins.due_date, method: ins.status, amount: ins.amount })) : undefined,
      remaining: sale.total_amount - (sale.advance_payment ?? 0),
    }
  }

  const handleView = async (saleId: number | string) => {
    try {
      const res = await fetchApi(`/sales/${saleId}`)
      const sale = res?.data || res
      setSelectedSale(mapSaleToTransaction(sale))
      setIsModalOpen(true)
    } catch (err: any) {
      alert(err?.message || 'Failed to load sale details')
    }
  }

  const handleDelete = async (saleId: number | string) => {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) return
    try {
      await fetchApi(`/sales/${saleId}`, { method: 'DELETE' })
      setSales((prev) => prev.filter((s) => s.id !== saleId))
    } catch (err: any) {
      alert(err?.message || 'Failed to delete sale')
    }
  }

  return (
    <div className="space-y-6">
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
              {loading && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
              )}
              {!loading && sales.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No sales found</td></tr>
              )}
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-foreground font-bold">INV-{sale.invoice_number ?? sale.id}</td>
                  <td className="px-6 py-4 text-foreground">{sale.customer?.name ?? sale.customer}</td>
                  <td className="px-6 py-4 text-foreground/70">{sale.sale_date ?? sale.date}</td>
                  <td className="px-6 py-4 text-center text-foreground">{(sale.items || []).length}</td>
                  <td className="px-6 py-4 text-right text-foreground font-bold">{sale.total_amount ?? sale.amount}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(sale.type ?? '')}`}>
                      {sale.type ?? (sale.paid ? 'Completed' : 'Installment')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => handleView(sale.id)} className="p-2 hover:bg-muted rounded-lg transition" title="View">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button onClick={() => handleDelete(sale.id)} className="p-2 hover:bg-muted rounded-lg transition" title="Delete">
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
        {sales.map((sale) => (
          <Card key={sale.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-foreground">INV-{sale.invoice_number ?? sale.id}</h3>
                <p className="text-sm text-foreground/70">{sale.customer?.name ?? sale.customer}</p>
                <p className="text-sm text-foreground/70">{sale.sale_date ?? sale.date}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(sale.type ?? '')}`}>
                {sale.type ?? (sale.paid ? 'Completed' : 'Installment')}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-primary">{sale.total_amount ?? sale.amount}</span>
              <span className="text-sm text-foreground/70">{(sale.items || []).length} items</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => handleView(sale.id)}>
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDelete(sale.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && selectedSale && (
        <TransactionDetailsModal transaction={selectedSale} onClose={() => { setIsModalOpen(false); setSelectedSale(null); }} />
      )}

      {error && <div className="text-red-600">{error}</div>}
    </div>
  )
}
