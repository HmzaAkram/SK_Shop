'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { DollarSign, TrendingUp, Package, Users, Truck, Wallet, Building } from 'lucide-react'
import { fetchApi } from '@/lib/api'

export function DashboardSummary() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchApi('/reports/summary').then(res => {
      if (res.success !== false) setData(res)
    }).catch(console.error)
  }, [])

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  }

  const kpis = [
    { label: 'Total Sales', value: formatPKR(data?.total_sales || 0), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Expenses', value: formatPKR(data?.total_expenses || 0), icon: DollarSign, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Cash Sales', value: formatPKR(data?.cash_sales || 0), icon: Wallet, color: 'text-teal-600', bg: 'bg-teal-100' },
    { label: 'Installment Sales', value: formatPKR(data?.installment_sales || 0), icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Total Orders', value: String(data?.sales_count || 0), icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Profit', value: formatPKR(data?.profit || 0), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon
        return (
          <Card key={idx} className="p-4 flex flex-col justify-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${kpi.bg}`}>
              <Icon className={`w-4 h-4 ${kpi.color}`} />
            </div>
            <p className="text-xs text-foreground/70 font-medium mb-1">{kpi.label}</p>
            <p className="text-lg font-bold text-foreground">{data ? kpi.value : '...'}</p>
          </Card>
        )
      })}
    </div>
  )
}
