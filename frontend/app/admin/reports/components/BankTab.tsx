import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { FilterExportBar } from './FilterExportBar'

export function BankTab() {
  const [hasSetOpeningBalance, setHasSetOpeningBalance] = useState(false)
  const [openingBalance, setOpeningBalance] = useState('')

  const handleSetBalance = () => {
    if (openingBalance) {
      alert('Opening Balance Set! This action cannot be undone here.')
      setHasSetOpeningBalance(true)
    }
  }

  const transactions = [
    { id: 'TRX-101', date: '21 Jun 2026', type: 'Sales Income', entity: 'Customer: Ahmad Ali', method: 'Bank Transfer', invoice: 'INV-004', amount: 50000, balance: 350000 },
    { id: 'TRX-102', date: '20 Jun 2026', type: 'Expense', entity: 'K-Electric', method: 'Bank Transfer', invoice: '-', amount: -15500, balance: 300000 },
    { id: 'TRX-103', date: '18 Jun 2026', type: 'Supplier Payment', entity: 'Samsung Distributor', method: 'Cheque', invoice: 'PUR-1001', amount: -150000, balance: 315500 },
    { id: 'TRX-104', date: '15 Jun 2026', type: 'Customer Payment', entity: 'Customer: Fatima Khan (Installment)', method: 'Cash', invoice: 'PLAN-002', amount: 12000, balance: 465500 },
    { id: 'TRX-105', date: '12 Jun 2026', type: 'Supplier Payment', entity: 'Apple Official', method: 'Bank Transfer', invoice: 'PUR-1002', amount: -1750000, balance: 453500 },
    { id: 'TRX-106', date: '10 Jun 2026', type: 'Sales Income', entity: 'Walk-in Customer', method: 'Cash', invoice: 'INV-001', amount: 150000, balance: 2203500 },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FilterExportBar />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6 md:col-span-1 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <h3 className="text-white/80 text-sm font-medium mb-2">Current Bank Balance</h3>
          <p className="text-3xl font-bold">RS 350,000</p>
          <p className="text-sm text-white/70 mt-2">As of Today</p>
        </Card>
        
        <Card className="p-6 md:col-span-3 flex items-center">
          {!hasSetOpeningBalance ? (
            <div className="w-full">
              <h3 className="text-lg font-bold text-foreground mb-2">Set Opening Balance</h3>
              <p className="text-sm text-foreground/70 mb-4">Please set the initial bank balance. Note: This can only be done once by the Admin.</p>
              <div className="flex gap-4">
                <input 
                  type="number" 
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  placeholder="Enter initial amount (RS)" 
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none max-w-sm"
                />
                <button onClick={handleSetBalance} className="px-4 py-2 bg-[oklch(0.58_0.235_29.234)] text-white rounded-lg text-sm font-medium hover:bg-[oklch(0.52_0.235_29.234)] transition">
                  Save Opening Balance
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Opening Balance Set</h3>
                <p className="text-sm text-foreground/70">Initial balance recorded successfully.</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground/50">Initial Amount</p>
                <p className="text-xl font-bold text-foreground">RS {Number(openingBalance).toLocaleString()}</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Unified Transaction Ledger</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-foreground/70 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Date / ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-muted/50 transition cursor-pointer">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground">{trx.date}</p>
                    <p className="text-xs text-foreground/50">{trx.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      trx.type.includes('Income') || trx.type.includes('Customer Payment') 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {trx.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{trx.entity}</td>
                  <td className="px-4 py-3 text-foreground/70">{trx.method}</td>
                  <td className="px-4 py-3 text-foreground/70 text-xs">{trx.invoice}</td>
                  <td className={`px-4 py-3 text-right font-bold ${trx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trx.amount > 0 ? '+' : ''} RS {Math.abs(trx.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">RS {trx.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
