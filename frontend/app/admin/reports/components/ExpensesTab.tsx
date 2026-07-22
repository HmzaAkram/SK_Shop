import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { FilterExportBar } from './FilterExportBar'

export function ExpensesTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <FilterExportBar />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Recent Expenses</h2>
            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-foreground/70 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { date: '15 Jun 2026', cat: 'Utilities', desc: 'Electric Bill (K-Electric)', method: 'Bank Transfer', amount: 15500 },
                  { date: '14 Jun 2026', cat: 'Staff', desc: 'Tea & Snacks', method: 'Cash', amount: 850 },
                  { date: '12 Jun 2026', cat: 'Logistics', desc: 'Delivery Charges (City)', method: 'Cash', amount: 2500 },
                  { date: '10 Jun 2026', cat: 'Maintenance', desc: 'AC Repair in Shop', method: 'EasyPaisa', amount: 3000 },
                  { date: '01 Jun 2026', cat: 'Rent', desc: 'Shop Monthly Rent', method: 'Cheque', amount: 45000 },
                ].map((exp, i) => (
                  <tr key={i} className="hover:bg-muted/50 transition cursor-pointer">
                    <td className="px-4 py-3 text-foreground/70">{exp.date}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">{exp.cat}</span></td>
                    <td className="px-4 py-3 font-medium text-foreground">{exp.desc}</td>
                    <td className="px-4 py-3 text-foreground/70">{exp.method}</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">- RS {exp.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 flex flex-col">
          <h2 className="text-xl font-bold text-foreground mb-6">Add New Expense</h2>
          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-sm font-bold text-foreground/70 mb-1">Amount (RS)</label>
              <input type="number" placeholder="0" className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/70 mb-1">Category</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none">
                <option>Utilities (Electricity/Water)</option>
                <option>Staff & Food</option>
                <option>Rent</option>
                <option>Maintenance</option>
                <option>Marketing</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/70 mb-1">Payment Method *</label>
              <select required className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none">
                <option value="">Select Method</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="JazzCash">JazzCash</option>
                <option value="EasyPaisa">EasyPaisa</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/70 mb-1">Description</label>
              <textarea rows={2} placeholder="Brief details about expense..." className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"></textarea>
            </div>
          </div>
          <button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition" onClick={() => alert('Dummy action: Expense recorded!')}>
            <Plus className="w-4 h-4" /> Record Expense
          </button>
        </Card>
      </div>
    </div>
  )
}
