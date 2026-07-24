'use client'

import React, { useState } from 'react'
import { Menu, X, LogOut, LayoutDashboard, Package, Users, ShoppingCart, CreditCard, TrendingUp, Bell, Plus, ChevronDown, Calendar } from 'lucide-react'
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
    <div className="force-light flex h-screen bg-[oklch(0.96_0_0)] overflow-hidden">
      {/* Mobile Hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white shadow rounded-lg"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-60 bg-[oklch(0.22_0.04_260)] text-white flex flex-col transform transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center gap-3 px-5 border-b border-white/10 flex-shrink-0">
          <div className="w-7 h-7 bg-[oklch(0.58_0.235_29.234)] rounded flex items-center justify-center">
            <span className="text-white text-xs font-black tracking-tight">SK</span>
          </div>
          <div>
            <p className="font-bold text-sm text-white leading-tight">SK Electronics</p>
            <p className="text-[10px] text-white/50 leading-tight">Karachi, PK</p>
          </div>
        </div>

        {/* Quick Action */}
        <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
          <Link
            href="/admin/sales/new"
            className="flex items-center justify-center gap-2 w-full py-2 bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] rounded-md text-white text-sm font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            New Sale
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
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
                    ? 'bg-[oklch(0.58_0.235_29.234)] text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-white/50'}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 border-t border-white/10 flex-shrink-0 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-[oklch(0.58_0.235_29.234)] flex items-center justify-center text-white text-xs font-bold">
              SK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Shahid Khan</p>
              <p className="text-[10px] text-white/40 truncate">Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-white/50 hover:text-white hover:bg-white/8 text-xs transition">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar Removed */}

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-5 pt-5 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
