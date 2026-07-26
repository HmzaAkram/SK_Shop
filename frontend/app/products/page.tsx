'use client'

import Link from 'next/link'
import { ArrowLeft, Search, Filter, ChevronDown, Check, LayoutGrid, List } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchApi } from '@/lib/api'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [productsList, setProductsList] = useState<any[]>([])
  const [categoriesList, setCategoriesList] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetchApi('/products'),
          fetchApi('/categories')
        ])
        if (prodRes.success) setProductsList(prodRes.data.data)
        if (catRes.success) {
          setCategoriesList([{name: 'All'}, ...catRes.data])
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadData()
  }, [])

  const brands: string[] = Array.from(new Set((productsList || []).map(p => p?.brand || 'Other')))

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  }

  const filteredProducts = (productsList || []).filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = selectedCategory === 'All' || p.category?.name === selectedCategory
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand || 'Other')
    return matchesSearch && matchesCat && matchesBrand
  })

  return (
    <div className="min-h-screen bg-[oklch(0.98_0_0)] font-sans text-gray-900">
      {/* Top Banner & Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gray-100 group-hover:bg-[oklch(0.58_0.235_29.234)] rounded-full flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
            </div>
            <span className="font-bold text-lg tracking-tight">SK Electronics</span>
          </Link>
          <div className="hidden sm:block text-sm font-semibold text-gray-500">
            Home / <span className="text-[oklch(0.35_0.165_260)]">Products</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters (25%) */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <h2 className="text-xl font-black text-[oklch(0.35_0.165_260)] mb-6 tracking-tight">Filters</h2>
            
            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] focus:border-transparent transition-all"
              />
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4">Categories</h3>
              <div className="space-y-2">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id || cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === cat.name 
                        ? 'bg-[oklch(0.58_0.235_29.234)]/10 text-[oklch(0.58_0.235_29.234)]' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="mb-8">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4">Brands</h3>
              <div className="space-y-3">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      selectedBrands.includes(brand) ? 'bg-[oklch(0.35_0.165_260)] border-[oklch(0.35_0.165_260)]' : 'border-gray-300 bg-white group-hover:border-[oklch(0.35_0.165_260)]'
                    }`}>
                      {selectedBrands.includes(brand) && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range (Visual only) */}
            <div>
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4">Price Range</h3>
              <div className="flex items-center gap-2">
                <input type="text" placeholder="Min" className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" />
                <span className="text-gray-400">-</span>
                <input type="text" placeholder="Max" className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid (75%) */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-black text-[oklch(0.35_0.165_260)] tracking-tight">
              {selectedCategory === 'All' ? 'All Appliances' : selectedCategory}
              <span className="text-base font-semibold text-gray-400 ml-2">({filteredProducts.length})</span>
            </h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)]">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="hidden sm:flex bg-white border border-gray-200 rounded-lg p-1">
                <button className="p-1.5 bg-gray-100 rounded text-gray-900"><LayoutGrid className="w-4 h-4" /></button>
                <button className="p-1.5 text-gray-400 hover:text-gray-900"><List className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product, idx) => {
              const inStock = product.stock > 0
              return (
              <div 
                key={product.id} 
                className={`bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all group flex flex-col`}
              >
                <div className={`relative bg-gray-50 flex items-center justify-center overflow-hidden h-56`}>
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold group-hover:scale-110 transition-transform duration-500">Image</div>
                  {!inStock && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                      <span className="bg-red-500 text-white font-bold text-sm px-4 py-1.5 rounded-full shadow-lg">Out of Stock</span>
                    </div>
                  )}
                </div>
                
                <div className={`p-5 flex-1 flex flex-col`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-gray-500 font-bold tracking-wider uppercase bg-gray-100 px-2 py-0.5 rounded">PRD-{product.id}</span>
                    <span className="text-[10px] text-[oklch(0.58_0.235_29.234)] font-bold tracking-wider uppercase">{product.category?.name || '-'}</span>
                  </div>
                  
                  <h3 className={`font-bold text-gray-900 mb-3 leading-tight text-lg line-clamp-2`}>
                    <Link href={`/products/${product.id}`} className="hover:text-[oklch(0.58_0.235_29.234)] transition-colors">{product.name}</Link>
                  </h3>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-xs text-gray-500 font-medium mb-0.5">Cash Price</div>
                        <div className={`font-black text-[oklch(0.35_0.165_260)] text-xl`}>
                          {formatPKR(product.selling_price)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-500 font-medium mb-0.5">Installment From</div>
                        <div className="font-bold text-[oklch(0.58_0.235_29.234)] text-sm">{formatPKR(product.selling_price / 12)}/mo</div>
                      </div>
                    </div>
                    
                    <Link 
                      href={inStock ? `https://wa.me/923001234567?text=Hi, I am interested in ${product.name}` : '#'}
                      className={`block w-full py-3 rounded-xl text-center font-bold text-sm transition-all ${
                        inStock 
                          ? 'bg-gray-900 text-white hover:bg-[oklch(0.58_0.235_29.234)] shadow-lg hover:shadow-[oklch(0.58_0.235_29.234)]/30' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {inStock ? 'Order via WhatsApp' : 'Out of Stock'}
                    </Link>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
        
      </div>
    </div>
  )
}
