'use client'

import { useState } from 'react'
import { DashboardSummary } from './components/DashboardSummary'
import { AnalyticsTab } from './components/AnalyticsTab'
import { ExpensesTab } from './components/ExpensesTab'
import { SupplierLedgerTab } from './components/SupplierLedgerTab'
import { BankTab } from './components/BankTab'
import { TransactionDetailsModal } from './components/TransactionDetailsModal'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('analytics')
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Finance & Reports</h1>
          <p className="text-foreground/70 mt-1">Manage analytics, daily expenses, supplier ledgers, and bank accounts</p>
        </div>
      </div>

      {/* Global Dashboard Summary */}
      <DashboardSummary />

      {/* Tabs */}
      <div className="flex border-b border-border overflow-x-auto">
        <button 
          className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors ${activeTab === 'analytics' ? 'border-b-2 border-[oklch(0.58_0.235_29.234)] text-[oklch(0.58_0.235_29.234)]' : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics & Sales
        </button>
        <button 
          className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors ${activeTab === 'expenses' ? 'border-b-2 border-[oklch(0.58_0.235_29.234)] text-[oklch(0.58_0.235_29.234)]' : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'}`}
          onClick={() => setActiveTab('expenses')}
        >
          Daily Expenses
        </button>
        <button 
          className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors ${activeTab === 'supplier' ? 'border-b-2 border-[oklch(0.58_0.235_29.234)] text-[oklch(0.58_0.235_29.234)]' : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'}`}
          onClick={() => setActiveTab('supplier')}
        >
          Supplier Ledger
        </button>
        <button 
          className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors ${activeTab === 'bank' ? 'border-b-2 border-[oklch(0.58_0.235_29.234)] text-[oklch(0.58_0.235_29.234)]' : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'}`}
          onClick={() => setActiveTab('bank')}
        >
          Bank Account
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'expenses' && <ExpensesTab />}
        {activeTab === 'supplier' && <SupplierLedgerTab onTransactionClick={setSelectedTransaction} />}
        {activeTab === 'bank' && <BankTab />}
      </div>

      {/* Shared Transaction Details Modal */}
      <TransactionDetailsModal 
        transaction={selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
      />
    </div>
  )
}
