import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { FilterExportBar } from './FilterExportBar'
import { fetchApi } from '@/lib/api'

export function BankTab() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApi('/payment-accounts')
      .then(res => {
        if (res.success) setAccounts(res.data ?? [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalCurrentBalance = accounts.reduce((acc, account) => acc + Number(account.current_balance || 0), 0)

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FilterExportBar />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6 md:col-span-1 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <h3 className="text-white/80 text-sm font-medium mb-2">Total Bank Balance</h3>
          <p className="text-3xl font-bold">RS {totalCurrentBalance.toLocaleString()}</p>
          <p className="text-sm text-white/70 mt-2">Combined for all accounts</p>
        </Card>
        
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full p-6 text-center text-gray-500">Loading accounts...</div>
          ) : accounts.length === 0 ? (
            <div className="col-span-full p-6 text-center text-gray-500">No bank accounts found. Create one during a new sale.</div>
          ) : (
            accounts.map(account => (
              <Card key={account.id} className="p-5 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-foreground">{account.name}</h3>
                    <span className="bg-[oklch(0.58_0.235_29.234)]/10 text-[oklch(0.58_0.235_29.234)] text-xs font-bold px-2 py-1 rounded">Active</span>
                  </div>
                  <div className="space-y-1 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Opening Balance</span>
                      <span className="font-medium text-gray-900">RS {Number(account.opening_balance).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Payments Received</span>
                      <span className="font-medium text-green-600">
                        +RS {(Number(account.current_balance) - Number(account.opening_balance)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Current</span>
                  <span className="text-xl font-black text-gray-900">RS {Number(account.current_balance).toLocaleString()}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

    </div>
  )
}
