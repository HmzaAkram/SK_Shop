'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const customers = [
  { id: 1, name: 'Ahmad Ali', email: 'ahmad@example.com', phone: '+92 300 123 4567', totalPurchases: 'RS 5,400', status: 'Active' },
  { id: 2, name: 'Fatima Khan', email: 'fatima@example.com', phone: '+92 301 234 5678', totalPurchases: 'RS 3,200', status: 'Active' },
  { id: 3, name: 'Muhammad Hassan', email: 'hassan@example.com', phone: '+92 302 345 6789', totalPurchases: 'RS 8,900', status: 'Inactive' },
  { id: 4, name: 'Aisha Mohamed', email: 'aisha@example.com', phone: '+92 303 456 7890', totalPurchases: 'RS 6,100', status: 'Active' },
  { id: 5, name: 'Ibrahim Rashid', email: 'ibrahim@example.com', phone: '+92 304 567 8901', totalPurchases: 'RS 2,300', status: 'Active' },
]

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', cnic: '', address: '' })

  const [witnesses, setWitnesses] = useState([{ name: '', phone: '', cnic: '', address: '' }])
  const addWitness = () => setWitnesses([...witnesses, { name: '', phone: '', cnic: '', address: '' }])
  const removeWitness = (index: number) => setWitnesses(witnesses.filter((_, i) => i !== index))
  const updateWitness = (index: number, field: string, value: string) => {
    const updated = [...witnesses]
    updated[index] = { ...updated[index], [field]: value }
    setWitnesses(updated)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-foreground/70 mt-1">Manage customer accounts and information</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] transition" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition">Filter</button>
        </div>
      </Card>

      {/* Customers Table - Desktop */}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-card border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Name</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Phone</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Total Purchases</th>
                <th className="text-center px-6 py-4 font-semibold text-foreground">Status</th>
                <th className="text-center px-6 py-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-foreground font-medium">{customer.name}</td>
                  <td className="px-6 py-4 text-foreground/70">{customer.email}</td>
                  <td className="px-6 py-4 text-foreground/70">{customer.phone}</td>
                  <td className="px-6 py-4 text-foreground font-semibold">{customer.totalPurchases}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        customer.status === 'Active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Link href={`/admin/customers/${customer.id}`} className="p-2 hover:bg-muted rounded-lg transition" title="View Profile">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </Link>
                      <button className="p-2 hover:bg-muted rounded-lg transition" title="Edit">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition" title="Delete">
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

      {/* Customers Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-foreground">{customer.name}</h3>
                <p className="text-sm text-foreground/70">{customer.email}</p>
                <p className="text-sm text-foreground/70">{customer.phone}</p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  customer.status === 'Active'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                }`}
              >
                {customer.status}
              </span>
            </div>
            <div className="mb-3">
              <span className="text-lg font-bold text-primary">{customer.totalPurchases}</span>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/customers/${customer.id}`} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition">
                <Eye className="w-4 h-4" />
                View Profile
              </Link>
              <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsAddModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Sticky Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Add New Customer</h2>
            </div>

            {/* Scrollable Body */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none" 
                    placeholder="e.g. Ali Khan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">CNIC</label>
                  <input 
                    type="text" 
                    value={newCustomer.cnic}
                    onChange={(e) => setNewCustomer({...newCustomer, cnic: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none" 
                    placeholder="12345-1234567-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none" 
                    placeholder="ali@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none" 
                    placeholder="03XX-XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                  <textarea 
                    rows={2}
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none" 
                    placeholder="Full address..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 mb-4 border-t border-gray-100 pt-6">
                <h3 className="font-bold text-gray-900 text-sm">Witnesses (Optional)</h3>
                <button type="button" onClick={addWitness} className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition">
                  <Plus className="w-3 h-3" /> Add Witness
                </button>
              </div>

              <div className="space-y-4 pb-4">
                {witnesses.map((w, index) => (
                  <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg relative">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-gray-500 uppercase">Witness {index + 1}</span>
                      {witnesses.length > 1 && (
                        <button onClick={() => removeWitness(index)} className="text-red-400 hover:text-red-600 p-1 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                        <input type="text" value={w.name} onChange={(e) => updateWitness(index, 'name', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary outline-none" placeholder="Name" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                        <input type="text" value={w.phone} onChange={(e) => updateWitness(index, 'phone', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary outline-none" placeholder="Phone" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">CNIC</label>
                        <input type="text" value={w.cnic} onChange={(e) => updateWitness(index, 'cnic', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary outline-none" placeholder="CNIC" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Address</label>
                        <input type="text" value={w.address} onChange={(e) => updateWitness(index, 'address', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary outline-none" placeholder="Address" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 transition" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] transition" onClick={() => {
                alert('Dummy action: Customer added!');
                setNewCustomer({ name: '', email: '', phone: '', cnic: '', address: '' });
                setWitnesses([{ name: '', phone: '', cnic: '', address: '' }]);
                setIsAddModalOpen(false);
              }}>Save Customer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

