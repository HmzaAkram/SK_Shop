import { Card } from '@/components/ui/card'
import { DollarSign, TrendingUp, Package, Users, Truck, Wallet, Building } from 'lucide-react'

export function DashboardSummary() {
  const kpis = [
    { label: 'Total Sales', value: 'RS 65,180', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Expenses', value: 'RS 12,400', icon: DollarSign, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Total Purchases', value: 'RS 45,000', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Customer Receivable', value: 'RS 8,500', icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Supplier Payable', value: 'RS 15,000', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Cash in Hand', value: 'RS 18,280', icon: Wallet, color: 'text-teal-600', bg: 'bg-teal-100' },
    { label: 'Bank Balance', value: 'RS 25,000', icon: Building, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon
        return (
          <Card key={idx} className="p-4 flex flex-col justify-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${kpi.bg}`}>
              <Icon className={`w-4 h-4 ${kpi.color}`} />
            </div>
            <p className="text-xs text-foreground/70 font-medium mb-1">{kpi.label}</p>
            <p className="text-lg font-bold text-foreground">{kpi.value}</p>
          </Card>
        )
      })}
    </div>
  )
}
