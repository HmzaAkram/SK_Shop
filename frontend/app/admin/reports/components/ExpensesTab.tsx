'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { fetchApi } from '@/lib/api'

export function ExpensesTab() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Utilities (Electricity/Water)')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const loadExpenses = async () => {
    try {
      const res = await fetchApi('/expenses')
      if (Array.isArray(res)) setExpenses(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExpenses()
  }, [])

  const handleSubmit = async () => {
    if (!title || !amount || !paymentMethod) {
      alert('Please fill Title, Amount and Payment Method')
      return
    }
    setSaving(true)
    try {
      const res = await fetchApi('/expenses', {
        method: 'POST',
        body: JSON.stringify({
          title,
          amount: Number(amount),
          expense_date: new Date().toISOString().split('T')[0],
          payment_method: paymentMethod,
          category,
          notes,
        })
      })
      if (res.success) {
        setTitle('')
        setAmount('')
        setPaymentMethod('')
        setNotes('')
        loadExpenses()
      }
    } catch (err) {
      console.error(err)
      alert('Failed to save expense')
    } finally {
      setSaving(false)
    }
  }

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Recent Expenses</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-foreground/70 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {expenses.map((exp, i) => (
                  <tr key={exp.id || i} className="hover:bg-muted/50 transition cursor-pointer">
                    <td className="px-4 py-3 text-foreground/70">{exp.expense_date}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{exp.title}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">{exp.category || '-'}</span></td>
                    <td className="px-4 py-3 text-foreground/70">{exp.payment_method}</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">- {formatPKR(exp.amount)}</td>
                  </tr>
                ))}
                {expenses.length === 0 && !loading && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">No expenses recorded yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 flex flex-col">
          <h2 className="text-xl font-bold text-foreground mb-6">Add New Expense</h2>
          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-sm font-bold text-foreground/70 mb-1">Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Electricity Bill" className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/70 mb-1">Amount (RS) *</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/70 mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none">
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
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} required className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none">
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
              <label className="block text-sm font-bold text-foreground/70 mb-1">Notes</label>
              <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Brief details about expense..." className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"></textarea>
            </div>
          </div>
          <button 
            disabled={saving}
            onClick={handleSubmit}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Plus className="w-4 h-4" /> {saving ? 'Saving...' : 'Record Expense'}
          </button>
        </Card>
      </div>
    </div>
  )
}
