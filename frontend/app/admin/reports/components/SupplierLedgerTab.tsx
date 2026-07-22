import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { FilterExportBar } from './FilterExportBar'

export function SupplierLedgerTab({ onTransactionClick }: { onTransactionClick: (t: any) => void }) {
  const [showAddPurchase, setShowAddPurchase] = useState(false)

  const purchases = [
    {
      id: 'PUR-1001',
      supplier: 'Samsung Distributor',
      date: '10 Jun 2026',
      product: 'Samsung 65" 4K TV',
      qty: 10,
      rate: 50000,
      totalBill: 500000,
      paid: 300000,
      remaining: 200000,
      status: 'Partially Paid',
      history: [
        { date: '10 Jun 2026', amount: 100000, method: 'Bank Transfer' },
        { date: '18 Jun 2026', amount: 150000, method: 'Cheque' },
        { date: '01 Jul 2026', amount: 50000, method: 'Bank Transfer' },
      ]
    },
    {
      id: 'PUR-1002',
      supplier: 'Apple Official',
      date: '12 Jun 2026',
      product: 'iPhone 15 Pro Max',
      qty: 5,
      rate: 350000,
      totalBill: 1750000,
      paid: 1750000,
      remaining: 0,
      status: 'Paid',
      history: [
        { date: '12 Jun 2026', amount: 1750000, method: 'Bank Transfer' },
      ]
    },
    {
      id: 'PUR-1003',
      supplier: 'Sony Electronics',
      date: '20 Jun 2026',
      product: 'PlayStation 5',
      qty: 20,
      rate: 130000,
      totalBill: 2600000,
      paid: 0,
      remaining: 2600000,
      status: 'Unpaid',
      history: []
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FilterExportBar />

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Supplier Purchase Ledger</h2>
            <p className="text-sm text-foreground/70">Track stock purchases and supplier payments</p>
          </div>
          <button 
            className="px-4 py-2 bg-[oklch(0.58_0.235_29.234)] text-white rounded-lg text-sm font-medium hover:bg-[oklch(0.52_0.235_29.234)] transition flex items-center gap-2"
            onClick={() => setShowAddPurchase(true)}
          >
            <Plus className="w-4 h-4" /> New Purchase
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-foreground/70 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Date / ID</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Stock Details</th>
                <th className="px-4 py-3 text-right">Total Bill</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3 text-right">Remaining</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {purchases.map((pur) => (
                <tr key={pur.id} className="hover:bg-muted/50 transition cursor-pointer" onClick={() => onTransactionClick(pur)}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground">{pur.date}</p>
                    <p className="text-xs text-foreground/50">{pur.id}</p>
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground">{pur.supplier}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{pur.product}</p>
                    <p className="text-xs text-foreground/70">{pur.qty} units @ RS {pur.rate.toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">RS {pur.totalBill.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">RS {pur.paid.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium text-red-600">RS {pur.remaining.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      pur.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      pur.status === 'Partially Paid' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {pur.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Purchase Modal */}
      {showAddPurchase && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddPurchase(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Record Stock Purchase</h2>
              <p className="text-sm text-gray-500">Enter details of the stock received from the supplier.</p>
            </div>
            
            <div className="px-6 py-4 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Supplier Name *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] outline-none" placeholder="e.g. Samsung Distributor" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Purchase Date *</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Product Name *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] outline-none" placeholder="e.g. Samsung 65 TV" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Quantity *</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] outline-none" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Rate (Per Unit) *</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] outline-none" placeholder="RS 0" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Invoice Number (Optional)</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] outline-none" placeholder="INV-12345" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Initial Payment (Optional)</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] outline-none" placeholder="RS 0 (if paying right away)" />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 transition" onClick={() => setShowAddPurchase(false)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] transition" onClick={() => {
                alert('Dummy action: Purchase Stock Saved!');
                setShowAddPurchase(false);
              }}>Save Purchase</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
