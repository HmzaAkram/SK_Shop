'use client'

import Link from 'next/link'
import { ArrowLeft, Check, ShieldCheck, Truck, MessageCircle, PhoneCall, Info } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function ProductDetailPage() {
  const params = useParams()
  const id = params?.id || '1'
  
  const [activeTab, setActiveTab] = useState('description')
  const [activeImage, setActiveImage] = useState(0)

  // Mock product data based on ID
  const product = {
    id: id as string,
    name: 'Dawlance 12 CFT Refrigerator (Chrome Series)',
    sku: 'SK-REF-DWL-001',
    brand: 'Dawlance',
    category: 'Refrigerators',
    price: 82500,
    oldPrice: 89000,
    stock: 4,
    images: ['🧊', '🥶', '❄️', '💧'],
    specs: [
      { label: 'Capacity', value: '12 Cubic Feet' },
      { label: 'Cooling Type', value: 'Direct Cool' },
      { label: 'Compressor', value: 'Non-Inverter' },
      { label: 'Energy Rating', value: 'A+' },
      { label: 'Warranty', value: '12 Years Compressor, 1 Year Parts' },
      { label: 'Color', value: 'Silver Chrome' },
    ],
    description: 'The Dawlance Chrome Series refrigerator offers superior cooling performance with European technology. Designed specifically for Pakistani power conditions, it operates efficiently even on low voltage. Features a 30% larger freezer portion compared to standard models, perfect for storing meat and frozen goods long-term.'
  }

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="min-h-screen bg-[oklch(0.98_0_0)] font-sans text-gray-900 pb-20">
      {/* Top Banner & Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/products" className="flex items-center gap-3 group text-gray-600 hover:text-[oklch(0.58_0.235_29.234)] transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <div className="hidden sm:block text-sm font-semibold text-gray-400">
            Home / Products / {product.category} / <span className="text-[oklch(0.35_0.165_260)]">{product.sku}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row">
            
            {/* Left: Images (45%) */}
            <div className="md:w-[45%] bg-gray-50 p-8 flex flex-col border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex items-center justify-center mb-6 min-h-[400px] shadow-inner text-9xl">
                {product.images[activeImage]}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 flex-shrink-0 rounded-xl border-2 flex items-center justify-center text-4xl bg-white transition-all ${
                      activeImage === idx 
                        ? 'border-[oklch(0.58_0.235_29.234)] shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {img}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Info (55%) */}
            <div className="md:w-[55%] p-8 md:p-12 flex flex-col">
              <div className="mb-6 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{product.brand}</span>
                  <span className="text-gray-400 text-sm font-medium">SKU: {product.sku}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-[oklch(0.35_0.165_260)] leading-[1.1] mb-6 tracking-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-end gap-4 mb-4">
                  <div className="text-4xl font-black text-[oklch(0.58_0.235_29.234)]">
                    {formatPKR(product.price)}
                  </div>
                  {product.oldPrice && (
                    <div className="text-xl text-gray-400 line-through font-semibold pb-1">
                      {formatPKR(product.oldPrice)}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-[#25D366]' : 'bg-red-500'}`} />
                  <span className={`text-sm font-bold ${product.stock > 0 ? 'text-[#25D366]' : 'text-red-500'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Installment Calculator Widget */}
              <div className="bg-[oklch(0.35_0.165_260)] rounded-2xl p-6 text-white mb-8 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-[oklch(0.58_0.235_29.234)]" />
                  <h3 className="font-bold text-lg">Easy Installment Plan</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="text-white/60 text-xs font-medium mb-1 uppercase tracking-wider">Duration</div>
                    <div className="font-bold text-lg">12 Months</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="text-white/60 text-xs font-medium mb-1 uppercase tracking-wider">Advance (20%)</div>
                    <div className="font-bold text-lg">{formatPKR(product.price * 0.2)}</div>
                  </div>
                  <div className="bg-[oklch(0.58_0.235_29.234)]/20 rounded-xl p-3 border border-[oklch(0.58_0.235_29.234)]/50">
                    <div className="text-[oklch(0.58_0.235_29.234)] text-xs font-bold mb-1 uppercase tracking-wider">Monthly</div>
                    <div className="font-black text-xl text-white">{formatPKR((product.price * 0.8) / 12)}</div>
                  </div>
                </div>
                <p className="text-xs text-white/50 text-center font-medium">*Calculations are estimates. Final plan subject to approval.</p>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <a 
                  href={`https://wa.me/923001234567?text=Hello, I am interested in buying ${product.name} (SKU: ${product.sku}). Please share details.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#1ebd5a] text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-[#25D366]/20 transition-transform hover:-translate-y-1"
                >
                  <MessageCircle className="w-6 h-6 fill-current" />
                  Inquire on WhatsApp
                </a>
                <a 
                  href="tel:03001234567"
                  className="bg-white text-[oklch(0.35_0.165_260)] border-2 border-gray-200 hover:border-[oklch(0.35_0.165_260)] py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors"
                >
                  <PhoneCall className="w-5 h-5" />
                  Call to Order
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex gap-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <ShieldCheck className="w-5 h-5 text-[oklch(0.58_0.235_29.234)]" />
                  Official Warranty
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Truck className="w-5 h-5 text-[oklch(0.58_0.235_29.234)]" />
                  Fast Lahore Delivery
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Check className="w-5 h-5 text-[oklch(0.58_0.235_29.234)]" />
                  Genuine Product
                </div>
              </div>

            </div>
          </div>
          
          {/* Tabs Section */}
          <div className="border-t border-gray-200">
            <div className="flex border-b border-gray-200 px-8">
              <button 
                onClick={() => setActiveTab('description')}
                className={`py-6 text-lg font-bold border-b-4 mr-8 transition-colors ${
                  activeTab === 'description' 
                    ? 'border-[oklch(0.58_0.235_29.234)] text-[oklch(0.35_0.165_260)]' 
                    : 'border-transparent text-gray-400 hover:text-gray-900'
                }`}
              >
                Product Description
              </button>
              <button 
                onClick={() => setActiveTab('specs')}
                className={`py-6 text-lg font-bold border-b-4 transition-colors ${
                  activeTab === 'specs' 
                    ? 'border-[oklch(0.58_0.235_29.234)] text-[oklch(0.35_0.165_260)]' 
                    : 'border-transparent text-gray-400 hover:text-gray-900'
                }`}
              >
                Specifications
              </button>
            </div>
            
            <div className="p-8 md:p-12">
              {activeTab === 'description' && (
                <div className="max-w-3xl text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </div>
              )}
              {activeTab === 'specs' && (
                <div className="max-w-3xl bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-gray-200">
                      {product.specs.map((spec, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <th className="px-6 py-4 font-bold text-gray-900 w-1/3">{spec.label}</th>
                          <td className="px-6 py-4 text-gray-600">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
