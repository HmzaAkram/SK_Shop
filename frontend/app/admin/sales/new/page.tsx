'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Plus, Trash2, ChevronRight, User, ShoppingCart, CreditCard, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

const catalog = [
  { id: 'p1', name: 'Dawlance 12 CFT Refrigerator', sku: 'SK-REF-DWL-001', price: 82500, stock: 4 },
  { id: 'p2', name: 'Haier 1.5 Ton Inverter AC', sku: 'SK-AC-HIR-015', price: 124000, stock: 8 },
  { id: 'p3', name: 'Samsung 43" Smart TV', sku: 'SK-TV-SAM-043', price: 68900, stock: 12 },
  { id: 'p4', name: 'PEL 20 Ltr Microwave', sku: 'SK-MW-PEL-020', price: 18500, stock: 0 },
]

export default function NewSalePage() {
  const [step, setStep] = useState(1)
  
  // Cart State
  const [cart, setCart] = useState<{product: typeof catalog[0], qty: number}[]>([])
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [downPayment, setDownPayment] = useState('')
  const [installmentMonths, setInstallmentMonths] = useState(12)

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0)
  const remaining = paymentMethod === 'Installment' ? subtotal - Number(downPayment || 0) : 0
  const monthly = paymentMethod === 'Installment' ? remaining / installmentMonths : 0

  const addToCart = (product: typeof catalog[0]) => {
    if (product.stock === 0) return
    const existing = cart.find(i => i.product.id === product.id)
    if (existing) {
      setCart(cart.map(i => i.product.id === product.id ? {...i, qty: i.qty + 1} : i))
    } else {
      setCart([...cart, {product, qty: 1}])
    }
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Sale</h1>
          <p className="text-gray-500 text-sm">Create a new invoice and process payment</p>
        </div>
        
        {/* Steps */}
        <div className="flex items-center gap-2">
          {[
            { num: 1, label: 'Customer', icon: User },
            { num: 2, label: 'Products', icon: ShoppingCart },
            { num: 3, label: 'Payment', icon: CreditCard }
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                step === s.num ? 'bg-[oklch(0.58_0.235_29.234)] text-white' : 
                step > s.num ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                {s.label}
              </div>
              {i < 2 && <div className={`w-4 h-[2px] ${step > s.num ? 'bg-green-200' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Main Content Area (Left) */}
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* STEP 1: CUSTOMER */}
          {step === 1 && (
            <div className="p-6 flex flex-col h-full">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Select Customer</h2>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or CNIC..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 border-b border-gray-200"></div>
                <span className="text-xs text-gray-400 font-bold uppercase">OR</span>
                <div className="flex-1 border-b border-gray-200"></div>
              </div>

              <h3 className="font-bold text-gray-900 text-sm mb-4">Add New Customer</h3>
              <div className="grid grid-cols-2 gap-4 mb-auto">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" placeholder="e.g. Tariq Mehmood" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" placeholder="03XX-XXXXXXX" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">CNIC</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" placeholder="XXXXX-XXXXXXX-X" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Address</label>
                  <textarea className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" rows={2} placeholder="Complete home address"></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PRODUCTS */}
          {step === 2 && (
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Add Products</h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4">
                {catalog.map(product => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-1.5 py-0.5 rounded uppercase">{product.sku}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        Qty: {product.stock}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-3 line-clamp-2">{product.name}</h3>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-black text-[oklch(0.58_0.235_29.234)]">{formatPKR(product.price)}</span>
                      <Button 
                        size="sm" 
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`h-7 px-2 text-xs ${product.stock > 0 ? 'bg-[oklch(0.35_0.165_260)] hover:bg-[oklch(0.25_0.165_260)] text-white' : 'bg-gray-200 text-gray-400'}`}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && (
            <div className="p-6 flex flex-col h-full overflow-y-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Configuration</h2>
              
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-3">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Cash', 'Bank Transfer', 'Installment'].map(method => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 px-4 rounded-lg border-2 text-sm font-bold transition-all ${
                        paymentMethod === method 
                          ? 'border-[oklch(0.58_0.235_29.234)] bg-[oklch(0.58_0.235_29.234)]/5 text-[oklch(0.58_0.235_29.234)]' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'Installment' && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[oklch(0.58_0.235_29.234)]" />
                    Installment Details
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Down Payment (PKR)</label>
                      <input 
                        type="number" 
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)]" 
                        placeholder="0" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Plan Duration</label>
                      <select 
                        value={installmentMonths}
                        onChange={(e) => setInstallmentMonths(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)]"
                      >
                        <option value={3}>3 Months</option>
                        <option value={6}>6 Months</option>
                        <option value={12}>12 Months</option>
                        <option value={18}>18 Months</option>
                        <option value={24}>24 Months</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Schedule Preview</h4>
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500">
                        <tr>
                          <th className="text-left px-3 py-2 font-medium">Inst #</th>
                          <th className="text-left px-3 py-2 font-medium">Due Date</th>
                          <th className="text-right px-3 py-2 font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="px-3 py-2 text-gray-900 font-medium">Down Payment</td>
                          <td className="px-3 py-2 text-gray-500">Today</td>
                          <td className="px-3 py-2 text-right font-bold">{formatPKR(Number(downPayment || 0))}</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-gray-900 font-medium">1</td>
                          <td className="px-3 py-2 text-gray-500">15 Jul 2026</td>
                          <td className="px-3 py-2 text-right font-bold text-[oklch(0.58_0.235_29.234)]">{formatPKR(monthly)}</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-gray-900 font-medium">...</td>
                          <td className="px-3 py-2 text-gray-500">...</td>
                          <td className="px-3 py-2 text-right font-bold text-[oklch(0.58_0.235_29.234)]">{formatPKR(monthly)}</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-gray-900 font-medium">{installmentMonths}</td>
                          <td className="px-3 py-2 text-gray-500">15 Jun {2026 + Math.floor(installmentMonths/12)}</td>
                          <td className="px-3 py-2 text-right font-bold text-[oklch(0.58_0.235_29.234)]">{formatPKR(monthly)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center mt-auto">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
            ) : <div />}
            
            {step < 3 ? (
              <Button 
                onClick={() => setStep(step + 1)} 
                className="bg-[oklch(0.35_0.165_260)] hover:bg-[oklch(0.25_0.165_260)]"
                disabled={step === 2 && cart.length === 0}
              >
                Next Step <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button className="bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] px-8">
                Generate Invoice
              </Button>
            )}
          </div>
        </div>

        {/* Cart Summary (Right) */}
        <div className="w-80 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-[oklch(0.35_0.165_260)] text-white flex justify-between items-center">
            <h3 className="font-bold">Current Cart</h3>
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">{cart.length}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {cart.length === 0 ? (
              <div className="text-center text-gray-400 py-10 text-sm">Cart is empty</div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm relative pr-8">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-xs line-clamp-1 mb-1">{item.product.name}</p>
                    <div className="flex justify-between items-end">
                      <p className="text-[oklch(0.58_0.235_29.234)] font-black text-sm">{formatPKR(item.product.price)}</p>
                      <div className="flex items-center gap-2 border border-gray-200 rounded">
                        <button 
                          className="px-2 py-0.5 text-gray-500 hover:bg-gray-100"
                          onClick={() => {
                            if (item.qty === 1) setCart(cart.filter(i => i.product.id !== item.product.id))
                            else setCart(cart.map(i => i.product.id === item.product.id ? {...i, qty: i.qty - 1} : i))
                          }}
                        >-</button>
                        <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                        <button 
                          className="px-2 py-0.5 text-gray-500 hover:bg-gray-100"
                          onClick={() => setCart(cart.map(i => i.product.id === item.product.id ? {...i, qty: i.qty + 1} : i))}
                        >+</button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCart(cart.filter(i => i.product.id !== item.product.id))}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-5 border-t border-gray-200 bg-white">
            <div className="space-y-3 mb-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-medium text-gray-900">{formatPKR(subtotal)}</span>
              </div>
              
              {paymentMethod === 'Installment' && (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>Down Payment</span>
                    <span className="font-medium text-red-600">-{formatPKR(Number(downPayment || 0))}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Remaining Balance</span>
                    <span className="font-medium text-gray-900">{formatPKR(remaining)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between text-gray-900 font-bold">
                      <span>Monthly ({installmentMonths}x)</span>
                      <span className="text-[oklch(0.58_0.235_29.234)]">{formatPKR(monthly)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="pt-3 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
              <span className="font-bold text-gray-900 uppercase text-xs">Total</span>
              <span className="text-2xl font-black text-[oklch(0.35_0.165_260)]">{formatPKR(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
