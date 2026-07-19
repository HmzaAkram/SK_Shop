'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Search, MessageSquare } from 'lucide-react'
import { useState } from 'react'

const customers = [
  { id: 1, name: 'Ahmad Ali', email: 'ahmad@example.com', phone: '+966 50 123 4567', totalPurchases: '$5,400', status: 'Active' },
  { id: 2, name: 'Fatima Khan', email: 'fatima@example.com', phone: '+966 50 234 5678', totalPurchases: '$3,200', status: 'Active' },
  { id: 3, name: 'Muhammad Hassan', email: 'hassan@example.com', phone: '+966 50 345 6789', totalPurchases: '$8,900', status: 'Inactive' },
  { id: 4, name: 'Aisha Mohamed', email: 'aisha@example.com', phone: '+966 50 456 7890', totalPurchases: '$6,100', status: 'Active' },
  { id: 5, name: 'Ibrahim Rashid', email: 'ibrahim@example.com', phone: '+966 50 567 8901', totalPurchases: '$2,300', status: 'Active' },
]

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', totalPurchases: '$0', status: 'Active' })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-foreground/70 mt-1">Manage customer accounts and information</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
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
          <Button variant="outline">Filter</Button>
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
                      <button className="p-2 hover:bg-muted rounded-lg transition" title="Message via WhatsApp">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                      </button>
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
              <Button size="sm" variant="outline" className="flex-1 text-green-600">
                <MessageSquare className="w-4 h-4 mr-1" />
                WhatsApp
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Customer Modal (Dummy) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Customer</h2>
            
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
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => {
                alert('Dummy action: Customer added!');
                setIsAddModalOpen(false);
              }}>Save Customer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
