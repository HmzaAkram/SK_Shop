'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Plus, Trash2, ChevronRight, User, ShoppingCart, CreditCard, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchApi } from '@/lib/api'

export default function NewSalePage() {
  const [step, setStep] = useState(1)
  const [catalog, setCatalog] = useState<any[]>([])

  useEffect(() => {
    fetchApi('/products').then(res => {
      if (res.success) setCatalog(res.data ?? [])
    }).catch(console.error)
  }, [])

  // Cart State
  const [cart, setCart] = useState<{ product: any, qty: number, details?: { serialNo: string, discount: number, unitPrice: number } }[]>([])

  // Product Details Modal State
  const [addingProduct, setAddingProduct] = useState<typeof catalog[0] | null>(null)
  const [productDetails, setProductDetails] = useState({ serialNo: '', discount: 0, unitPrice: 0 })
  const [showInvoice, setShowInvoice] = useState(false)
  const [createdSale, setCreatedSale] = useState<any>(null)

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [downPayment, setDownPayment] = useState('')
  const [installmentMonths, setInstallmentMonths] = useState(12)

  // Customer State
  const [customer, setCustomer] = useState({ name: '', phone: '', cnic: '', address: '' })

  // Witnesses State
  const [witnesses, setWitnesses] = useState([{ name: '', phone: '', cnic: '', address: '' }])
  const addWitness = () => setWitnesses([...witnesses, { name: '', phone: '', cnic: '', address: '' }])
  const removeWitness = (index: number) => setWitnesses(witnesses.filter((_, i) => i !== index))
  const updateWitness = (index: number, field: string, value: string) => {
    const updated = [...witnesses]
    updated[index] = { ...updated[index], [field]: value }
    setWitnesses(updated)
  }

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  }

  const subtotal = cart.reduce((sum, item) => sum + ((item.details?.unitPrice ?? item.product.selling_price) * item.qty - (item.details?.discount ?? 0) * item.qty), 0)
  const remaining = paymentMethod === 'Installment' ? subtotal - Number(downPayment || 0) : 0
  const monthly = paymentMethod === 'Installment' ? remaining / installmentMonths : 0

  const openProductModal = (product: typeof catalog[0]) => {
    if (product.stock === 0) return
    setAddingProduct(product)
    setProductDetails({ serialNo: '', discount: 0, unitPrice: product.selling_price })
  }

  const confirmAddProduct = () => {
    if (!addingProduct) return
    const existing = cart.find(i => i.product.id === addingProduct.id)
    if (existing) {
      setCart(cart.map(i => i.product.id === addingProduct.id ? { ...i, qty: i.qty + 1 } : i))
    } else {
      setCart([...cart, { product: addingProduct, qty: 1, details: productDetails }])
    }
    setAddingProduct(null)
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
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${step === s.num ? 'bg-[oklch(0.58_0.235_29.234)] text-white' :
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
            <div className="p-6 flex flex-col h-full overflow-y-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Select Customer</h2>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or CNIC..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 border-b border-gray-200"></div>
                <span className="text-xs text-gray-400 font-bold uppercase">OR</span>
                <div className="flex-1 border-b border-gray-200"></div>
              </div>

              <h3 className="font-bold text-gray-900 text-sm mb-4">Add New Customer</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <input type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-900 bg-white" placeholder="e.g. Tariq Mehmood" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input type="text" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-900 bg-white" placeholder="03XX-XXXXXXX" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">CNIC</label>
                  <input type="text" value={customer.cnic} onChange={e => setCustomer({...customer, cnic: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-900 bg-white" placeholder="XXXXX-XXXXXXX-X" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Address</label>
                  <textarea value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-900 bg-white" rows={2} placeholder="Complete home address"></textarea>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 text-sm">Witnesses (Optional for Installments)</h3>
                <Button variant="outline" size="sm" onClick={addWitness} className="h-8 text-xs bg-white hover:bg-gray-50 border-gray-200">
                  <Plus className="w-3 h-3 mr-1" /> Add Witness
                </Button>
              </div>

              <div className="space-y-4 mb-auto pb-4">
                {witnesses.map((w, index) => (
                  <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg relative">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-[oklch(0.58_0.235_29.234)] uppercase">Witness {index + 1}</span>
                      {witnesses.length > 1 && (
                        <button onClick={() => removeWitness(index)} className="text-gray-400 hover:text-red-600 p-1 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                        <input type="text" value={w.name} onChange={(e) => updateWitness(index, 'name', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] outline-none" placeholder="Name" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                        <input type="text" value={w.phone} onChange={(e) => updateWitness(index, 'phone', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] outline-none" placeholder="Phone" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">CNIC</label>
                        <input type="text" value={w.cnic} onChange={(e) => updateWitness(index, 'cnic', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] outline-none" placeholder="CNIC" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Address</label>
                        <input type="text" value={w.address} onChange={(e) => updateWitness(index, 'address', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] outline-none" placeholder="Complete address" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PRODUCTS */}
          {step === 2 && (
            <div className="p-6 flex flex-col h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Add Products</h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] focus:outline-none"
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
                      <span className="font-black text-[oklch(0.58_0.235_29.234)]">{formatPKR(product.selling_price)}</span>
                      <Button
                        size="sm"
                        onClick={() => openProductModal(product)}
                        disabled={product.stock === 0}
                        className={`h-7 px-2 text-xs ${product.stock > 0 ? 'bg-[oklch(0.35_0.165_260)] hover:bg-[oklch(0.25_0.165_260)] text-white' : 'bg-gray-200 text-gray-400'}`}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Product Details Modal */}
              {addingProduct && (
                <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Add Product Details</h3>
                    <div className="mb-4 text-sm text-gray-500">{addingProduct.name}</div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Unit Price (PKR)</label>
                        <input
                          type="number"
                          value={productDetails.unitPrice}
                          onChange={(e) => setProductDetails({ ...productDetails, unitPrice: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Serial Number / IMEI</label>
                        <input
                          type="text"
                          value={productDetails.serialNo}
                          onChange={(e) => setProductDetails({ ...productDetails, serialNo: e.target.value })}
                          placeholder="Optional"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Discount Amount (PKR)</label>
                        <input
                          type="number"
                          value={productDetails.discount}
                          onChange={(e) => setProductDetails({ ...productDetails, discount: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 transition" onClick={() => setAddingProduct(null)}>Cancel</button>
                      <button onClick={confirmAddProduct} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] transition">Add to Cart</button>
                    </div>
                  </div>
                </div>
              )}
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
                      className={`py-3 px-4 rounded-lg border-2 text-sm font-bold transition-all ${paymentMethod === method
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)]"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Plan Duration</label>
                      <select
                        value={installmentMonths}
                        onChange={(e) => setInstallmentMonths(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)]"
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
                          <td className="px-3 py-2 text-gray-500">15 Jun {2026 + Math.floor(installmentMonths / 12)}</td>
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
              <Button onClick={async () => {
                if (!customer.phone || !customer.phone.trim()) {
                  alert('Customer phone is required.');
                  return;
                }
                try {
                  const res = await fetchApi('/sales', {
                    method: 'POST',
                    body: JSON.stringify({
                      customer: {
                        name: customer.name,
                        phone: customer.phone,
                        cnic: customer.cnic,
                        address: customer.address,
                        guarantor_name: witnesses[0]?.name,
                        guarantor_phone: witnesses[0]?.phone,
                        guarantor_cnic: witnesses[0]?.cnic,
                      },
                      sale_date: new Date().toISOString().split('T')[0],
                      type: paymentMethod,
                      total_amount: subtotal,
                      advance_payment: paymentMethod === 'Installment' ? Number(downPayment || 0) : 0,
                      total_installments: paymentMethod === 'Installment' ? installmentMonths : null,
                      monthly_installment: paymentMethod === 'Installment' ? monthly : null,
                      items: cart.map(i => ({
                        product_id: i.product.id,
                        quantity: i.qty,
                        unit_price: i.details?.unitPrice ?? i.product.selling_price,
                        subtotal: ((i.details?.unitPrice ?? i.product.selling_price) * i.qty) - (i.details?.discount ?? 0) * i.qty
                      }))
                    })
                  })
                  if (res.success) {
                    setCreatedSale(res.data)
                    setShowInvoice(true)
                  } else {
                    alert(res.message || 'Failed to save sale')
                  }
                } catch (err) {
                  console.error(err)
                  alert('Failed to save sale.')
                }
              }} className="bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] px-8">
                Complete Sale
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
                      <p className="text-[oklch(0.58_0.235_29.234)] font-black text-sm">{formatPKR(item.product.selling_price)}</p>
                      <div className="flex items-center gap-2 border border-gray-200 rounded">
                        <button
                          className="px-2 py-0.5 text-gray-500 hover:bg-gray-100"
                          onClick={() => {
                            if (item.qty === 1) setCart(cart.filter(i => i.product.id !== item.product.id))
                            else setCart(cart.map(i => i.product.id === item.product.id ? { ...i, qty: i.qty - 1 } : i))
                          }}
                        >-</button>
                        <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                        <button
                          className="px-2 py-0.5 text-gray-500 hover:bg-gray-100"
                          onClick={() => setCart(cart.map(i => i.product.id === item.product.id ? { ...i, qty: i.qty + 1 } : i))}
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

      {/* Invoice Generation Modal */}
      {showInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Generated Invoice</h2>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowInvoice(false)}>Close</button>
            </div>
            
            {/* Printable Area */}
            <div className="p-8 overflow-y-auto flex-1 bg-white" id="invoice-print-area">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-black text-gray-900 uppercase">SK Electronics</h1>
                <p className="text-sm text-gray-500">Invoice #INV-{createdSale?.invoice_number || '----'}</p>
              </div>

              <div className="flex justify-between mb-8 text-sm">
                <div>
                  <p className="text-gray-500">Bill To:</p>
                  <p className="font-bold text-gray-900">{customer.name || 'N/A'}</p>
                  <p className="text-gray-600">{customer.phone || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Date:</p>
                  <p className="font-bold text-gray-900">22 Jun 2026</p>
                  <p className="text-gray-500 mt-2">Payment Method:</p>
                  <p className="font-bold text-[oklch(0.58_0.235_29.234)]">{paymentMethod}</p>
                </div>
              </div>

              <table className="w-full text-sm mb-6">
                <thead className="border-b-2 border-gray-900">
                  <tr>
                    <th className="text-left py-2">Item</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cart.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3">
                        <p className="font-bold text-gray-900">{item.product.name}</p>
                      </td>
                      <td className="py-3 text-center">{item.qty}</td>
                      <td className="py-3 text-right font-medium">
                        {formatPKR(((item.details?.unitPrice ?? item.product.selling_price) - (item.details?.discount ?? 0)) * item.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t-2 border-gray-900 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-700">Subtotal</span>
                  <span className="font-bold text-gray-900">{formatPKR(subtotal)}</span>
                </div>
                
                {paymentMethod === 'Installment' && (
                  <>
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-700">Down Payment Paid</span>
                      <span className="font-bold text-gray-900">{formatPKR(Number(downPayment || 0))}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="font-bold text-red-600">Remaining Balance</span>
                      <span className="font-bold text-red-600">{formatPKR(remaining)}</span>
                    </div>
                  </>
                )}
                
                {paymentMethod !== 'Installment' && (
                  <div className="flex justify-between text-green-600 border-t border-gray-200 pt-2">
                    <span className="font-bold">Total Paid</span>
                    <span className="font-bold">{formatPKR(subtotal)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <Button variant="outline" onClick={() => setShowInvoice(false)}>Cancel</Button>
              <Button className="bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)]" onClick={() => window.print()}>
                Print Bill
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
