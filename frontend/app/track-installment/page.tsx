'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, FileText, CheckCircle2, AlertCircle } from 'lucide-react'

// Mock Data
const mockInstallments: Record<string, any> = {
  "12345-1234567-1": {
    customerName: "Ali Raza",
    purchaseDate: "15 May, 2025",
    products: ["Haier 1.5 Ton Inverter AC", "Dawlance Microwave Oven"],
    totalBill: 142500,
    amountPaid: 42500,
    amountRemaining: 100000,
    paidMonths: ["June", "July"],
    remainingInstallments: 10,
    installmentPerMonth: 10000,
  },
  "98765-4321098-7": {
    customerName: "Sarah Khan",
    purchaseDate: "10 Jan, 2026",
    products: ["Apple iPhone 13 Pro"],
    totalBill: 285000,
    amountPaid: 285000,
    amountRemaining: 0,
    paidMonths: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    remainingInstallments: 0,
    installmentPerMonth: 47500,
  }
}

export default function TrackInstallment() {
  const [cnic, setCnic] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [data, setData] = useState<any>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)
    
    // Simple lookup
    const result = mockInstallments[cnic]
    if (result) {
      setData(result)
    } else {
      setData(null)
    }
  }

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="min-h-screen bg-[oklch(0.98_0_0)] font-sans text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <img src="/weblogo.png" alt="SK Electronics" className="h-45 w-auto" />
          </Link>
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[oklch(0.58_0.235_29.234)] font-medium transition">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[oklch(0.35_0.165_260)] mb-4">Track Your Installments</h1>
          <p className="text-gray-500">Enter your CNIC below to view your payment history and remaining balance.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter CNIC (e.g. 12345-1234567-1)"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                className="w-full pl-11 pr-4 py-4 rounded-xl border border-gray-200 focus:border-[oklch(0.58_0.235_29.234)] focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)]/20 outline-none transition text-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-[oklch(0.58_0.235_29.234)]/20 transition flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Track Details
            </button>
          </form>
        </div>

        {hasSearched && !data && (
          <div className="bg-red-50 text-red-600 rounded-2xl p-8 text-center border border-red-100 flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
            <h3 className="text-xl font-bold mb-2">No Records Found</h3>
            <p>We couldn't find any installment plans associated with this CNIC. Please check the number and try again.</p>
          </div>
        )}

        {hasSearched && data && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[oklch(0.35_0.165_260)] text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">{data.customerName}</h2>
                <p className="text-[oklch(0.85_0.1_260)]">CNIC: {cnic}</p>
              </div>
              <div className="text-right">
                <p className="text-[oklch(0.85_0.1_260)] text-sm mb-1">Purchase Date</p>
                <p className="font-semibold">{data.purchaseDate}</p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Products Purchased</h3>
              <ul className="mb-8 space-y-2">
                {data.products.map((product: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-[oklch(0.58_0.235_29.234)]" />
                    {product}
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <p className="text-gray-500 text-sm font-medium mb-1">Total Bill</p>
                  <p className="text-2xl font-black text-gray-800">{formatPKR(data.totalBill)}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <p className="text-green-600 text-sm font-medium mb-1">Amount Paid</p>
                  <p className="text-2xl font-black text-green-700">{formatPKR(data.amountPaid)}</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                  <p className="text-orange-600 text-sm font-medium mb-1">Amount Remaining</p>
                  <p className="text-2xl font-black text-orange-700">{formatPKR(data.amountRemaining)}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Paid Months</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.paidMonths.length > 0 ? (
                      data.paidMonths.map((month: string, index: number) => (
                        <span key={index} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold shadow-sm">
                          {month}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">No payments recorded yet.</span>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Plan Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-500">Monthly Installment</span>
                      <span className="font-bold text-gray-800">{formatPKR(data.installmentPerMonth)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-500">Remaining Installments</span>
                      <span className="font-bold text-orange-600">{data.remainingInstallments} Months</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
