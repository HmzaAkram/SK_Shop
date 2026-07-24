'use client'

import { useState } from 'react'
import { X, Lock, Loader2 } from 'lucide-react'
import { fetchApi, setAuthToken } from '@/lib/api'

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetchApi('/login', {
        method: 'POST',
        body: JSON.stringify({ password })
      })

      if (response.success) {
        setAuthToken(response.data.token)
        window.location.href = '/admin'
      } else {
        setError(response.message || 'Invalid password')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[oklch(0.58_0.235_29.234)]/10 rounded-full flex items-center justify-center text-[oklch(0.58_0.235_29.234)]">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Admin Login</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition bg-gray-100 hover:bg-gray-200 rounded-full p-2">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Enter Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[oklch(0.58_0.235_29.234)] focus:border-transparent outline-none transition font-medium"
                required
              />
            </div>

            {error && (
              <p className="text-sm font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-[oklch(0.58_0.235_29.234)]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
