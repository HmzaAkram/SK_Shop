'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { useState } from 'react'

const products = [
  { id: 1, name: 'Samsung 65" TV', category: 'Televisions', price: '$899', stock: 45, status: 'In Stock' },
  { id: 2, name: 'iPhone 15 Pro', category: 'Smartphones', price: '$1,299', stock: 12, status: 'Low Stock' },
  { id: 3, name: 'PlayStation 5', category: 'Gaming', price: '$499', stock: 0, status: 'Out of Stock' },
  { id: 4, name: 'MacBook Air M3', category: 'Laptops', price: '$1,199', stock: 8, status: 'Low Stock' },
  { id: 5, name: 'Samsung Refrigerator', category: 'Appliances', price: '$1,500', stock: 15, status: 'In Stock' },
  { id: 6, name: 'Sony Headphones', category: 'Audio', price: '$349', stock: 32, status: 'In Stock' },
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', description: '', category: '' })
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'Low Stock':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
      case 'Out of Stock':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-foreground/70 mt-1">Manage your product inventory</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </Card>

      {/* Products Table - Desktop */}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-card border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Product Name</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Category</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Price</th>
                <th className="text-center px-6 py-4 font-semibold text-foreground">Stock</th>
                <th className="text-center px-6 py-4 font-semibold text-foreground">Status</th>
                <th className="text-center px-6 py-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-foreground font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-foreground/70">{product.category}</td>
                  <td className="px-6 py-4 text-foreground font-semibold">{product.price}</td>
                  <td className="px-6 py-4 text-center text-foreground">{product.stock}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button className="p-2 hover:bg-muted rounded-lg transition">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Products Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-foreground">{product.name}</h3>
                <p className="text-sm text-foreground/70">{product.category}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-primary">{product.price}</span>
              <span className="text-sm text-foreground/70">Stock: {product.stock}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="outline" className="text-red-600">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Product Modal (Dummy) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Product</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none" 
                  placeholder="e.g. Samsung 65 TV"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price (PKR)</label>
                  <input 
                    type="number" 
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none" 
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Initial Stock</label>
                  <input 
                    type="number" 
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none" 
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                {isAddingCategory ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none" 
                      placeholder="New category name"
                    />
                    <Button variant="outline" onClick={() => setIsAddingCategory(false)}>Cancel</Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <select 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none bg-white"
                    >
                      <option value="">Select a category</option>
                      <option value="Refrigerators">Refrigerators</option>
                      <option value="Air Conditioners">Air Conditioners</option>
                      <option value="LED TVs">LED TVs</option>
                      <option value="Washing Machines">Washing Machines</option>
                      <option value="Microwaves">Microwaves</option>
                    </select>
                    <Button variant="outline" onClick={() => setIsAddingCategory(true)}>+ New</Button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none" 
                  placeholder="Short product description..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => {
                alert('Dummy action: Product saved!');
                setIsAddModalOpen(false);
              }}>Save Product</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
