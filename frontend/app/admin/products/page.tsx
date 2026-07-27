'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Search, Upload, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchApi } from '@/lib/api'

export default function ProductsPage() {
  const [productsList, setProductsList] = useState<any[]>([])
  const [categoriesList, setCategoriesList] = useState<any[]>([])
  const [brandsList, setBrandsList] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        fetchApi('/products'),
        fetchApi('/categories'),
        fetchApi('/brands')
      ])
      if (prodRes.success) setProductsList(prodRes.data ?? [])
      if (catRes.success) setCategoriesList(catRes.data)
      if (brandRes.success) setBrandsList(brandRes.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const [existingImages, setExistingImages] = useState<string[]>([])
  const [removeImages, setRemoveImages] = useState<string[]>([])

  const handleEditClick = (product: any) => {
    setIsEditing(true)
    setEditingProductId(product.id)
    setIsAddModalOpen(true)
    setNewProduct({
      name: product.name || '',
      brand: product.brand || '',
      realPrice: product.real_price ?? '',
      sellingPrice: product.selling_price ?? '',
      stock: product.stock ?? '',
      description: product.description || '',
      category: product.category?.name || '',
      specifications: (product.specifications && product.specifications.length) ? product.specifications : [{ key: '', value: '' }],
      images: [] as File[],
    })
    setExistingImages(product.images_paths || [])
    setRemoveImages([])
    setCurrentStock(product.stock ?? 0)
  }

  const toggleRemoveImage = (path: string) => {
    if (removeImages.includes(path)) {
      setRemoveImages(removeImages.filter(p => p !== path))
    } else {
      setRemoveImages([...removeImages, path])
    }
  }

  const clearModal = () => {
    setIsAddModalOpen(false)
    setIsEditing(false)
    setEditingProductId(null)
    setNewProduct({ name: '', brand: '', realPrice: '', sellingPrice: '', stock: '', description: '', category: '', specifications: [{ key: '', value: '' }], images: [] as File[] })
    setExistingImages([])
    setRemoveImages([])
    setIsAddingCategory(false)
  }

  const handleRefillStock = async () => {
    if (!isEditing || !editingProductId) return;
    // Validation: required, integer, positive
    if (refillQty === '') {
      alert('Please enter a refill quantity');
      return;
    }
    if (!/^[0-9]+$/.test(refillQty)) {
      alert('Refill quantity must be a positive integer');
      return;
    }
    const qty = parseInt(refillQty, 10);
    if (qty <= 0) {
      alert('Refill quantity must be greater than zero');
      return;
    }

    const newStock = (currentStock ?? parseInt(String(newProduct.stock || '0'), 10) ) + qty;

    try {
      const res = await fetchApi(`/products/${editingProductId}`, {
        method: 'PUT',
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.success) {
        alert('Stock updated successfully');
        // Update local states
        setCurrentStock(newStock);
        setNewProduct({ ...newProduct, stock: String(newStock) });
        setRefillQty('');
        await fetchData();
      } else {
        alert(res.message || 'Failed to update stock');
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to update stock');
    }
  }

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

      // If adding brand via + New, create it first and append to brand list
      if (isAddingBrand && newProduct.brand) {
        try {
          const bRes = await fetchApi('/brands', {
            method: 'POST',
            body: JSON.stringify({ name: newProduct.brand })
          });
          if (bRes.success) {
            setBrandsList([...brandsList, bRes.data]);
            setNewProduct({ ...newProduct, brand: bRes.data.name });
            setIsAddingBrand(false);
          }
        } catch (e) {
          console.error(e);
          alert('Failed to create brand');
          return;
        }
      }

      // Build multipart form data so images can be uploaded. Append specifications as indexed fields for Laravel to parse.
      const formData = new FormData()
      formData.append('name', newProduct.name)
      formData.append('brand', newProduct.brand)
      if (category_id) formData.append('category_id', String(category_id))
      formData.append('real_price', String(parseFloat(newProduct.realPrice || '0')))
      formData.append('selling_price', String(parseFloat(newProduct.sellingPrice || '0')))
      formData.append('stock', String(parseInt(String(newProduct.stock || '0'))))
      formData.append('description', newProduct.description || '')

      const specs = (newProduct.specifications || []).filter((s: any) => s.key && s.value)
      specs.forEach((s: any, idx: number) => {
        formData.append(`specifications[${idx}][key]`, s.key)
        formData.append(`specifications[${idx}][value]`, s.value)
      })

      // New uploads
      for (const file of (newProduct.images || [] as File[])) {
        formData.append('images[]', file)
      }

      // If editing, include remove_images and _method override for PUT
      let url = '/products'
      let method: any = 'POST'
      if (isEditing && editingProductId) {
        url = `/products/${editingProductId}`
        method = 'POST' // use method override for form-data
        formData.append('_method', 'PUT')
        for (const p of removeImages) {
          formData.append('remove_images[]', p)
        }
      }

      const res = await fetchApi(url, {
        method,
        body: formData,
      })

      if (res.success) {
        // Refresh list from server to get normalized data
        await fetchData()
        clearModal()
      }
    } catch (err: any) {
      console.error(err);
      const msg = err?.errors ? Object.values(err.errors).flat().join('\n') : (err?.message || 'Failed to save product');
      alert(msg);
    }
  }

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    brand: '',
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
  const [isAddingBrand, setIsAddingBrand] = useState(false)
  const [currentStock, setCurrentStock] = useState<number | null>(null)
  const [refillQty, setRefillQty] = useState('')

  const handleDeleteProduct = async (product: any) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetchApi(`/products/${product.id}`, { method: 'DELETE' });
      if (res.success) {
        // Refresh list
        await fetchData();
      } else {
        alert(res.message || 'Failed to delete product');
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to delete product');
    }
  }

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
                <th className="text-left px-6 py-4 font-semibold text-foreground">Brand</th>
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
                  <td className="px-6 py-4 text-foreground/70">{product.brand || '-'}</td>
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
                      <a href={`/products/${product.id}`} target="_blank" rel="noreferrer" className="p-2 hover:bg-muted rounded-lg transition" title="View">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </a>
                      <button onClick={() => handleEditClick(product)} className="p-2 hover:bg-muted rounded-lg transition" title="Edit">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product)} className="p-2 hover:bg-muted rounded-lg transition" title="Delete">
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
        {(productsList ?? []).map((product) => (
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
              <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(`/products/${product.id}`, '_blank')}>
                View
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditClick(product)}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDeleteProduct(product)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsAddModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-x-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Sticky Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
            </div>

            {/* Scrollable Body */}
            <div className="px-6 py-4 overflow-y-auto overflow-x-hidden flex-1">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </div>
                {/* close grid container */}

                    {/* Stock Refill (only shown when editing) */}
                    {isEditing && (
                      <div className="mt-3 p-3 border border-gray-100 rounded-lg bg-gray-50 col-span-3 w-full">
                        <h4 className="text-sm font-bold text-gray-800 mb-2">Stock Refill</h4>
                        <div className="text-sm text-gray-700 mb-2">Current Stock: <span className="font-bold">{currentStock ?? newProduct.stock}</span></div>
                        <div className="flex gap-2">
                          <input 
                            type="number"
                            min={1}
                            value={refillQty}
                            onChange={(e) => setRefillQty(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Quantity to add"
                          />
                          <button onClick={handleRefillStock} className="px-3 py-2 rounded-lg bg-[oklch(0.58_0.235_29.234)] text-white font-medium">Refill Stock</button>
                        </div>
                      </div>
                   )}

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
                  <label className="block text-sm font-bold text-gray-700 mb-1">Brand</label>
                  {isAddingBrand ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none" 
                        placeholder="New brand name"
                      />
                      <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-100 transition" onClick={() => setIsAddingBrand(false)}>Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select 
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                      >
                        <option value="">Select a brand</option>
                        {brandsList.map(b => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-100 transition font-medium" onClick={() => setIsAddingBrand(true)}>+ New</button>
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

                  {/* Existing images with remove toggle when editing */}
                  {existingImages.length > 0 && (
                    <div className="mb-3 flex gap-2 overflow-x-auto">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                          <div className="w-20 h-20 rounded-xl border flex items-center justify-center bg-white text-2xl">{img}</div>
                          <label className="text-xs mt-1 flex items-center gap-1">
                            <input type="checkbox" checked={removeImages.includes(img)} onChange={() => toggleRemoveImage(img)} /> Remove
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

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
