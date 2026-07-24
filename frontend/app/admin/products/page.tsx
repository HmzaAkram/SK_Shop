'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Search, Upload, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchApi } from '@/lib/api'

export default function ProductsPage() {
  const [productsList, setProductsList] = useState<any[]>([])
  const [categoriesList, setCategoriesList] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetchApi('/products'),
        fetchApi('/categories')
      ])
      if (prodRes.success) setProductsList(prodRes.data.data) // Laravel pagination
      if (catRes.success) setCategoriesList(catRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSaveProduct = async () => {
    try {
      // Create category if new
      let category_id = null;
      if (isAddingCategory && newProduct.category) {
        const catRes = await fetchApi('/categories', {
          method: 'POST',
          body: JSON.stringify({ name: newProduct.category })
        });
        if (catRes.success) {
          category_id = catRes.data.id;
          setCategoriesList([...categoriesList, catRes.data]);
        }
      } else if (newProduct.category) {
        const cat = categoriesList.find(c => c.name === newProduct.category);
        if (cat) category_id = cat.id;
      }

      const res = await fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify({
          name: newProduct.name,
          category_id: category_id,
          real_price: parseFloat(newProduct.realPrice),
          selling_price: parseFloat(newProduct.sellingPrice),
          stock: parseInt(newProduct.stock),
          description: newProduct.description,
          specifications: newProduct.specifications.filter(s => s.key && s.value),
        })
      });

      if (res.success) {
        setProductsList([res.data, ...productsList]);
        setNewProduct({ name: '', realPrice: '', sellingPrice: '', stock: '', description: '', category: '', specifications: [{ key: '', value: '' }], images: [] as File[] });
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      console.error(err);
      const msg = err?.errors ? Object.values(err.errors).flat().join('\n') : (err?.message || 'Failed to save product');
      alert(msg);
    }
  }

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    realPrice: '', 
    sellingPrice: '', 
    stock: '', 
    description: '', 
    category: '',
    specifications: [{ key: '', value: '' }],
    images: [] as File[]
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 4);
      setNewProduct({ ...newProduct, images: filesArray });
    }
  };

  const addSpecification = () => {
    setNewProduct({
      ...newProduct,
      specifications: [...newProduct.specifications, { key: '', value: '' }]
    });
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...newProduct.specifications];
    newSpecs[index][field] = value;
    setNewProduct({ ...newProduct, specifications: newSpecs });
  };

  const removeSpecification = (index: number) => {
    const newSpecs = newProduct.specifications.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, specifications: newSpecs });
  };
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
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-foreground/50">Loading products...</td></tr>
              ) : productsList.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-foreground/50">No products found.</td></tr>
              ) : productsList.map((product) => (
                <tr key={product.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-foreground font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-foreground/70">{product.category?.name || '-'}</td>
                  <td className="px-6 py-4 text-foreground font-semibold">RS {Number(product.selling_price).toLocaleString()}</td>
                  <td className="px-6 py-4 text-center text-foreground">{product.stock}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(product.stock > product.alert_stock ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock')}`}>
                      {product.stock > product.alert_stock ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
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
        {productsList.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-foreground">{product.name}</h3>
                <p className="text-sm text-foreground/70">{product.category?.name || '-'}</p>
              </div>
              <div className={`text-xs font-semibold px-2 py-1 rounded-md ${getStatusColor(product.stock > product.alert_stock ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock')}`}>
                {product.stock > product.alert_stock ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
              </div>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-primary">RS {Number(product.selling_price).toLocaleString()}</span>
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

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsAddModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Sticky Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
            </div>

            {/* Scrollable Body */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
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

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Real Price</label>
                    <input 
                      type="number" 
                      value={newProduct.realPrice}
                      onChange={(e) => setNewProduct({...newProduct, realPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none" 
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Selling Price</label>
                    <input 
                      type="number" 
                      value={newProduct.sellingPrice}
                      onChange={(e) => setNewProduct({...newProduct, sellingPrice: e.target.value})}
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
                      <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-100 transition" onClick={() => setIsAddingCategory(false)}>Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select 
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                      >
                        <option value="">Select a category</option>
                        {categoriesList.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-100 transition font-medium" onClick={() => setIsAddingCategory(true)}>+ New</button>
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

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Specifications</label>
                  <div className="space-y-2 mb-2">
                    {newProduct.specifications.map((spec, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={spec.key}
                          onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                          placeholder="e.g. Storage"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        <input 
                          type="text" 
                          value={spec.value}
                          onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                          placeholder="e.g. 250GB"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        <button onClick={() => removeSpecification(index)} className="px-2 py-2 border border-gray-300 rounded-lg text-red-600 hover:bg-red-50 transition">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addSpecification} className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-100 transition font-medium flex items-center">
                    <Plus className="w-3 h-3 mr-1" /> Add Specification
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Product Images (Max 4)</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  {newProduct.images.length > 0 && (
                    <p className="text-xs text-green-600 mt-2">{newProduct.images.length} image(s) selected.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 transition" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] transition" onClick={handleSaveProduct}>Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
