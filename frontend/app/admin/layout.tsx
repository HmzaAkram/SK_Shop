'use client'

import React, { useState } from 'react'
import { Menu, X, LogOut, LayoutDashboard, Package, Users, ShoppingCart, CreditCard, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { getAuthToken, removeAuthToken, fetchApi } from '@/lib/api'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push('/')
    }
  }, [router, pathname])

  const handleLogout = async () => {
    try {
      await fetchApi('/logout', { method: 'POST' })
    } catch (e) {
      // ignore
    } finally {
      removeAuthToken()
      router.push('/')
    }
  }

  const today = new Date().toLocaleDateString('en-PK', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  })

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/sales', label: 'Sales', icon: ShoppingCart },
    { href: '/admin/payments', label: 'Installments', icon: CreditCard },
    { href: '/admin/reports', label: 'Reports', icon: TrendingUp },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="force-light flex min-h-screen bg-background text-foreground">
      {/* Mobile Hamburger */}
      <button
        aria-label="Toggle menu"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white shadow-sm rounded-md border border-gray-100"
      >
        {sidebarOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
      </button>

      {/* Sidebar */}
      <aside
        aria-label="Primary navigation"
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[color:var(--sidebar)] text-[color:var(--sidebar-foreground)] flex flex-col transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center gap-3 px-5 border-b border-[color:var(--sidebar-border)] flex-shrink-0">
          <div className="w-8 h-8 bg-[color:var(--sidebar-primary)] rounded flex items-center justify-center">
            <span className="text-white text-sm font-extrabold tracking-tight">SK</span>
          </div>
          <div>
            <p className="font-semibold text-sm text-white leading-tight">SK Electronics</p>
            <p className="text-[11px] text-white/70 leading-tight">{today}</p>
          </div>
        </div>

        {/* Quick Action */}
        <div className="px-4 py-3 border-b border-[color:var(--sidebar-border)] flex-shrink-0">
          <Link
            href="/admin/sales/new"
            className="flex items-center justify-center gap-2 w-full py-2 bg-[color:var(--sidebar-primary)] hover:opacity-95 rounded-md text-white text-sm font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            New Sale
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  active
                    ? 'bg-[color:var(--sidebar-primary)] text-white shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/6'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-white/60'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom (profile & sign out) */}
        <div className="px-3 py-3 border-t border-[color:var(--sidebar-border)] flex-shrink-0 space-y-2">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-[color:var(--sidebar-primary)] flex items-center justify-center text-white text-sm font-bold">
              SK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Shahid Khan</p>
              <p className="text-xs text-white/60 truncate">Admin</p>
            </div>
            <button onClick={handleLogout} aria-label="Sign out" className="ml-2 p-2 rounded-md hover:bg-white/6">
              <LogOut className="w-4 h-4 text-white/80" />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Topbar placeholder for potential notifications or actions on larger screens */}
        <header className="hidden md:flex items-center justify-end gap-4 px-6 py-3 border-b bg-background border-gray-100">
          {/* space for global actions */}
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
