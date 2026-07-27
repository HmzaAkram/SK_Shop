'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, MapPin, CreditCard, ShoppingBag, Receipt, AlertCircle, ArrowLeft, MoreVertical, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { fetchApi } from '@/lib/api'

export default function CustomerProfile() {
  const [activeTab, setActiveTab] = useState<'purchases'|'installments'|'payments'>('installments')

  const params = useParams();
  const id = params?.id as string | undefined;

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  }

  // Data states
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState<any>(null)
  const [purchases, setPurchases] = useState<any[]>([])
  const [installments, setInstallments] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetchApi(`/customers/${id}`).then(res => {
      if (res?.success) {
        const data = res.data ?? {}
        setCustomer(data)
        // Purchases -> server returns purchases whenLoaded
        setPurchases((data.purchases ?? []).slice().sort((a: any,b: any) => (new Date(b.sale_date)).getTime() - (new Date(a.sale_date)).getTime()))
        // Installments list
        setInstallments((data.installments ?? []).slice())
        // Payments (paid installments)
        setPayments((data.payments ?? []).slice().sort((a: any,b: any) => (new Date(b.paid_date || b.due_date)).getTime() - (new Date(a.paid_date || a.due_date)).getTime()))
      } else {
        setError('Failed to fetch customer data')
      }
    }).catch(e => {
      console.error(e)
      setError(e?.message || 'API error')
    }).finally(() => setLoading(false))
  }, [id])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header / Breadcrumb */}
      <div className="flex items-center gap-4 text-sm">
        <Link href="/admin/customers" className="text-gray-500 hover:text-[oklch(0.58_0.235_29.234)] flex items-center gap-1 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Customers
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-semibold">{loading ? 'Loading...' : (customer?.name ?? 'Not Available')}</span>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row relative">
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 md:p-8 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-[oklch(0.35_0.165_260)] to-[oklch(0.58_0.235_29.234)] rounded-full flex items-center justify-center text-3xl font-black text-white mb-4 shadow-lg">
            {loading ? '…' : ((customer?.name ?? '').split(' ').map((n: string) => n[0]).join('') || 'NA')}
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">{loading ? 'Loading...' : (customer?.name ?? 'Not Available')}</h1>
          <p className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">{loading ? '' : (customer?.cnic ?? 'Not Available')}</p>
          
          <div className="w-full flex gap-2">
            <Button className="flex-1 bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] text-white shadow-md">
              Message
            </Button>
            <Button variant="outline" className="flex-1 bg-white hover:bg-gray-50">Edit</Button>
          </div>
        </div>

        <div className="p-6 md:p-8 md:w-2/3 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-8">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[oklch(0.58_0.235_29.234)] mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone</p>
                <p className="text-sm font-semibold text-gray-900">{loading ? 'Loading...' : (customer?.phone ?? 'Not Available')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[oklch(0.58_0.235_29.234)] mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Address</p>
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{loading ? 'Loading...' : (customer?.address ?? 'Not Available')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[oklch(0.58_0.235_29.234)] mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Customer Since</p>
                <p className="text-sm font-semibold text-gray-900">{loading ? 'Loading...' : (customer?.customer_since ?? 'Not Available')}</p>
              </div>
            </div>

            {/* Witness / Guarantor */}
            <div className="col-span-2 space-y-4">
              {loading ? (
                <p className="text-sm text-gray-500">Loading witness information...</p>
              ) : (
                Object.keys(customer?.witness ?? {}).length > 0 ? (
                  Object.entries(customer.witness).map(([key, w]: [string, any]) => (
                    <div key={key} className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-[oklch(0.58_0.235_29.234)] mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Witness {key.replace('witness_', '')}</p>
                        <p className="text-sm font-semibold text-gray-900">{w.full_name}</p>
                        <p className="text-xs text-gray-500">{w.phone ?? 'No Phone'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-500">No Witness Information Available</div>
                )
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Outstanding Balance</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-gray-900">{loading ? 'Loading...' : formatPKR(customer?.outstanding_balance ?? 0)}</span>
                {(!loading && (customer?.status === 'Overdue' || (customer?.outstanding_balance ?? 0) > 0)) && (
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Overdue
                  </span>
                )}
              </div>
            </div>
            {(!loading && (customer?.outstanding_balance ?? 0) > 0) && (
              <Button size="sm" className="bg-[oklch(0.35_0.165_260)] hover:bg-[oklch(0.25_0.165_260)] text-white shadow-md">
                Record Payment
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('installments')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'installments' ? 'border-[oklch(0.58_0.235_29.234)] text-[oklch(0.58_0.235_29.234)]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            <CreditCard className="w-4 h-4" /> Installment Plans
          </button>
          <button 
            onClick={() => setActiveTab('purchases')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'purchases' ? 'border-[oklch(0.58_0.235_29.234)] text-[oklch(0.58_0.235_29.234)]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            <ShoppingBag className="w-4 h-4" /> Purchase History
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'payments' ? 'border-[oklch(0.58_0.235_29.234)] text-[oklch(0.58_0.235_29.234)]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            <Receipt className="w-4 h-4" /> Payment History
          </button>
        </div>

        <div className="p-0">
          {/* INSTALLMENTS TAB */}
          {activeTab === 'installments' && (
            <div className="p-6">
              {loading ? (
                <div className="text-sm text-gray-500">Loading installment plans...</div>
              ) : (
                (() => {
                  const plans = purchases.filter(p => p.type === 'Installment');
                  if (plans.length === 0) {
                    return (
                      <div className="p-6 text-center">
                        <h3 className="text-lg font-bold text-gray-900">No Active Installment Plan</h3>
                        <p className="text-sm text-gray-500">This customer has not purchased any product on installment.</p>
                      </div>
                    )
                  }

                  return plans.map((sale: any) => {
                    const items = sale.items ?? [];
                    const productName = items[0]?.product?.name ?? 'Not Available';
                    const total = Number(sale.total_amount ?? 0);
                    const down = Number(sale.advance_payment ?? 0);
                    const monthly = Number(sale.monthly_installment ?? 0);
                    const totalInstallments = Number(sale.total_installments ?? (sale.installments?.length ?? 0));
                    const installmentsList = sale.installments ?? [];
                    const paid = installmentsList.filter((it: any) => it.status === 'Paid').reduce((s: number, it: any) => s + Number(it.amount ?? 0), 0) + down;
                    const remaining = Math.max(0, total - paid);
                    const installmentsPaid = installmentsList.filter((it: any) => it.status === 'Paid').length;
                    const installmentsRemaining = Math.max(0, totalInstallments - installmentsPaid);
                    const nextDueObj = installmentsList.filter((it: any) => it.status !== 'Paid').sort((a: any,b: any) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];
                    const nextDue = nextDueObj ? nextDueObj.due_date : 'N/A';
                    const isOverdue = nextDueObj ? (new Date(nextDueObj.due_date) < new Date()) : false;
                    const status = installmentsRemaining === 0 ? 'Completed' : (isOverdue ? 'Overdue' : 'Active');

                    return (
                      <div key={sale.id} className="border rounded-xl overflow-hidden mb-4">
                        <div className="p-5 flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900 text-base">{productName}</h3>
                            <p className="text-xs text-gray-500 font-medium">Invoice: {sale.invoice_number} • {sale.sale_date}</p>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${status === 'Completed' ? 'bg-blue-100 text-blue-700' : status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {status}
                          </span>
                        </div>

                        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white border-t border-gray-100">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Price</p>
                            <p className="font-bold text-gray-900">{formatPKR(total)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Down Payment</p>
                            <p className="font-bold text-gray-900">{formatPKR(down)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Monthly Installment</p>
                            <p className="font-bold text-[oklch(0.58_0.235_29.234)]">{formatPKR(monthly)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Remaining Amount</p>
                            <p className="font-bold text-gray-900">{formatPKR(remaining)}</p>
                          </div>
                        </div>

                        <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center gap-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden border border-gray-300">
                            <div className="bg-[oklch(0.58_0.235_29.234)] h-full rounded-full" style={{width: `${total === 0 ? 0 : Math.round(((paid) / total) * 100)}%`}} />
                          </div>
                          <span className="text-xs font-bold text-gray-500 w-12 text-right">{total === 0 ? 0 : Math.round(((paid) / total) * 100)}%</span>
                          <div className="text-sm text-gray-600">{installmentsPaid} paid • {installmentsRemaining} remaining</div>
                        </div>
                      </div>
                    )
                  })
                })()
              )}
            </div>
          )}

          {/* PURCHASES TAB */}
          {activeTab === 'purchases' && (
            <div className="p-4">
              {loading ? (
                <div className="text-sm text-gray-500">Loading purchases...</div>
              ) : (
                purchases.length === 0 ? (
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-gray-900">No Purchase History Found</h3>
                    <p className="text-sm text-gray-500">This customer has not made any purchases yet.</p>
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4">Invoice</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Products</th>
                        <th className="px-6 py-4">Quantity</th>
                        <th className="px-6 py-4">Payment Method</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {purchases.map(p => {
                        const products = (p.items || []).map((it: any) => `${it.product?.name ?? 'Item'} (${it.quantity})`).join(', ')
                        const qty = (p.items || []).reduce((s: number, it: any) => s + (it.quantity || 0), 0)
                        const paymentMethod = p.type || 'Not Available'

                        return (
                          <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-[oklch(0.35_0.165_260)]">{p.invoice_number ?? p.id}</td>
                            <td className="px-6 py-4 text-gray-500 font-medium">{p.sale_date ?? p.created_at ?? 'Not Available'}</td>
                            <td className="px-6 py-4 text-gray-900 font-medium">{products}</td>
                            <td className="px-6 py-4">{qty}</td>
                            <td className="px-6 py-4">{paymentMethod}</td>
                            <td className="px-6 py-4 text-right font-black text-gray-900">{formatPKR(Number(p.total_amount ?? 0))}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )
              )}
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="p-4">
              {loading ? (
                <div className="text-sm text-gray-500">Loading payments...</div>
              ) : (
                payments.length === 0 ? (
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-gray-900">No Payments Found</h3>
                    <p className="text-sm text-gray-500">There are no recorded payments for this customer.</p>
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4">Receipt #</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Invoice</th>
                        <th className="px-6 py-4">Method</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                        <th className="px-6 py-4 text-right">Remaining</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {payments.map(p => {
                        const sale = purchases.find(s => s.id === p.sale_id) || {};
                        const paidSoFar = (sale.installments || []).filter((it: any) => it.status === 'Paid').reduce((s: number, it: any) => s + Number(it.amount || 0), 0) + Number(sale.advance_payment || 0);
                        const remaining = Math.max(0, Number(sale.total_amount || 0) - paidSoFar);

                        return (
                          <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-gray-900">{p.id}</td>
                            <td className="px-6 py-4 text-gray-500 font-medium">{p.paid_date ?? p.due_date ?? 'Not Available'}</td>
                            <td className="px-6 py-4 text-gray-900">{sale.invoice_number ?? sale.id ?? 'Not Available'}</td>
                            <td className="px-6 py-4 text-gray-600">{p.payment_method ?? 'Not Available'}</td>
                            <td className="px-6 py-4 text-right font-black text-green-600">+{formatPKR(Number(p.amount || 0))}</td>
                            <td className="px-6 py-4 text-right font-medium text-gray-900">{formatPKR(remaining)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
