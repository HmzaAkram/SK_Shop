'use client'

import Link from 'next/link'
import { ArrowRight, MapPin, Phone, MessageCircle, Star, FileText } from 'lucide-react'
// Mock Data
const featuredProducts: any[] = []
const categories: any[] = []

export default function Home() {
  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="min-h-screen bg-[oklch(0.98_0_0)] font-sans text-gray-900">
      {/* Top Banner */}
      <div className="bg-[oklch(0.35_0.165_260)] text-white text-xs py-2 px-4 text-center font-medium">
        Call us: 0300-1234567 | Easy Monthly Installments Available on All Products!
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <img src="/weblogo.png" alt="SK Electronics" className="h-45 w-auto" />
          </Link>
          
          <div className="hidden md:flex gap-8 font-semibold text-sm">
            <Link href="/" className="text-[oklch(0.58_0.235_29.234)]">Home</Link>
            <Link href="/products" className="text-gray-600 hover:text-[oklch(0.58_0.235_29.234)] transition">Products</Link>
            <Link href="/products" className="text-gray-600 hover:text-[oklch(0.58_0.235_29.234)] transition">Installment Plans</Link>
            <Link href="#contact" className="text-gray-600 hover:text-[oklch(0.58_0.235_29.234)] transition">Contact</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/track-installment"
               className="hidden sm:flex items-center gap-2 bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-[oklch(0.58_0.235_29.234)]/20 transition-transform hover:-translate-y-0.5">
              <FileText className="w-4 h-4 fill-current" />
              Track Installment
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 rounded-bl-[100px] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:pt-12 md:pb-32">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy (55%) */}
            <div className="md:col-span-7 pr-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[oklch(0.58_0.235_29.234)] text-xs font-bold mb-6">
                <Star className="w-3.5 h-3.5 fill-current" />
                Trusted Electronics Retailer in Karachi
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-[oklch(0.35_0.165_260)] leading-[1.1] mb-6 tracking-tight">
                Upgrade Your Home <br/>
                <span className="text-[oklch(0.58_0.235_29.234)]">Without the Wait.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-lg leading-relaxed">
                Get premium home appliances today with our flexible, easy monthly installment plans. Genuine products from top brands.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] text-white px-8 py-4 rounded-xl font-bold text-base shadow-xl shadow-[oklch(0.58_0.235_29.234)]/20 transition-transform hover:-translate-y-1 flex items-center gap-2">
                  Shop Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/products" className="bg-white hover:bg-gray-50 text-[oklch(0.35_0.165_260)] border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-base transition-colors">
                  View Installment Plans
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-8 text-sm font-semibold text-gray-500">
                <div className="flex flex-col gap-1"><span className="text-2xl font-black text-[oklch(0.35_0.165_260)]">15+</span> Brands</div>
                <div className="flex flex-col gap-1"><span className="text-2xl font-black text-[oklch(0.35_0.165_260)]">5k+</span> Happy Customers</div>
                <div className="flex flex-col gap-1"><span className="text-2xl font-black text-[oklch(0.35_0.165_260)]">0%</span> Hidden Fees</div>
              </div>
            </div>
            
            {/* Right Images (45%) */}
            <div className="md:col-span-5 relative h-[500px] hidden md:block">
              {/* Product Card 1 */}
              <div className="absolute top-10 right-10 w-64 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 rotate-3 z-20">
                <div className="w-full h-40 bg-gray-50 rounded-xl mb-4 flex items-center justify-center">
                  <img src="/dummydata/png-transparent-washing-machines-lg-electronics-direct-drive-mechanism-home-appliance-washing-machine-electronics-home-appliance-washing-machine-thumbnail.png" alt="Washing Machine" className="h-28 object-contain" />
                </div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Dawlance</div>
                <div className="font-bold text-gray-900 leading-tight mb-2">12 CFT Refrigerator</div>
                <div className="text-[oklch(0.58_0.235_29.234)] font-black text-lg">{formatPKR(82500)}</div>
              </div>
              
              {/* Product Card 2 */}
              <div className="absolute bottom-20 left-0 w-72 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 -rotate-6 z-30">
                <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Hot Sale</div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <img src="/dummydata/png-transparent-india-evaporative-cooler-symphony-limited-fan-cooler-world-refrigeration-home-appliance-thumbnail.png" alt="AC" className="h-12 object-contain" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase mb-1">Haier</div>
                    <div className="font-bold text-gray-900 leading-tight mb-1 text-sm">1.5 Ton Inverter AC</div>
                    <div className="text-[oklch(0.58_0.235_29.234)] font-black">{formatPKR(124000)}</div>
                  </div>
                </div>
              </div>

               {/* Deco Circle */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[oklch(0.58_0.235_29.234)]/5 rounded-full blur-3xl z-10" />
            </div>

          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-[oklch(0.35_0.165_260)] mb-2 tracking-tight">Shop by Category</h2>
            <p className="text-gray-500">Find exactly what you need for your home</p>
          </div>
          <Link href="/products" className="text-[oklch(0.58_0.235_29.234)] font-bold hover:underline hidden sm:block">View All</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 grid-rows-2 gap-4 h-[400px]">
          {categories.map((cat, idx) => (
            <Link key={idx} href={`/products?category=${cat.name}`} className={`${cat.colSpan} ${cat.bg} rounded-3xl p-6 group relative overflow-hidden transition-all hover:shadow-lg flex flex-col justify-between border border-transparent hover:border-gray-200`}>
              <img src={cat.img} alt={cat.name} className="w-16 h-16 object-contain group-hover:scale-110 transition-transform origin-bottom-left" />
              <div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500 font-medium">{cat.count}</p>
              </div>
              <div className="absolute bottom-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                <ArrowRight className="w-5 h-5 text-gray-900" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[oklch(0.35_0.165_260)] mb-4 tracking-tight">Featured Products</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Top quality appliances with easy installment options.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all group flex flex-col">
                <div className="relative h-48 bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  <img src={product.img} alt={product.name} className="w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-500" />
                  {product.tag && (
                    <span className="absolute top-3 left-3 bg-[oklch(0.58_0.235_29.234)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {product.tag}
                    </span>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="text-xs text-gray-400 font-bold uppercase mb-1">{product.brand}</div>
                  <h3 className="font-bold text-gray-900 mb-2 leading-tight line-clamp-2 hover:text-[oklch(0.58_0.235_29.234)] cursor-pointer">
                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                  </h3>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-end justify-between">
                    <div>
                      {product.oldPrice && <div className="text-xs text-gray-400 line-through font-semibold mb-0.5">{formatPKR(product.oldPrice)}</div>}
                      <div className="text-lg font-black text-[oklch(0.58_0.235_29.234)]">{formatPKR(product.price)}</div>
                    </div>
                    <Link href={`/products/${product.id}`} className="w-10 h-10 bg-gray-100 hover:bg-[oklch(0.58_0.235_29.234)] hover:text-white rounded-full flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products" className="inline-flex items-center gap-2 font-bold text-[oklch(0.35_0.165_260)] hover:text-[oklch(0.58_0.235_29.234)] border-b-2 border-transparent hover:border-[oklch(0.58_0.235_29.234)] pb-1 transition-all">
              Explore Full Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[oklch(0.35_0.165_260)] text-white pt-20 pb-10 border-t-8 border-[oklch(0.58_0.235_29.234)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[oklch(0.58_0.235_29.234)] rounded flex items-center justify-center">
                  <span className="font-black text-white text-sm tracking-tighter">SK</span>
                </div>
                <span className="font-black text-xl tracking-tight">SK Electronics</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Your trusted partner for home appliances and electronics in Karachi. Quality products with flexible payment options.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Quick Links</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                <li><Link href="/products" className="hover:text-white transition">All Products</Link></li>
                <li><Link href="/products" className="hover:text-white transition">Installment Plans</Link></li>
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/admin" className="hover:text-white transition text-[oklch(0.58_0.235_29.234)]">Admin Panel</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Top Categories</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link href="#" className="hover:text-white transition">Refrigerators</Link></li>
                <li><Link href="#" className="hover:text-white transition">Air Conditioners</Link></li>
                <li><Link href="#" className="hover:text-white transition">Washing Machines</Link></li>
                <li><Link href="#" className="hover:text-white transition">LED TVs</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Contact Us</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[oklch(0.58_0.235_29.234)] flex-shrink-0 mt-0.5" />
                  <span>Shop #45, Electronics Market,<br/>Hall Road, Karachi</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[oklch(0.58_0.235_29.234)] flex-shrink-0" />
                  <span>0300-1234567<br/>042-31234567</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40 font-medium">
            <p>&copy; 2026 SK Electronics. All rights reserved.</p>
            <p>Developed for Production</p>
          </div>
        </div>
      </footer>
      
      {/* Sticky WhatsApp Float */}
      <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" 
         className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center">
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </div>
  )
}
