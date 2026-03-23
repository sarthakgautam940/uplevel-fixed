'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch {
      setError('Invalid credentials. Try a demo account below.')
    }
  }

  const loginAsDemo = async (role: string) => {
    setError('')
    await login(`${role}@demo.com`, 'demo')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <svg viewBox="0 0 64 64" fill="none" className="w-9 h-9">
              <defs>
                <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E676"/>
                  <stop offset="100%" stopColor="#0A84FF"/>
                </linearGradient>
              </defs>
              <rect x="4" y="4" width="56" height="56" rx="14" fill="#060B14" stroke="url(#lg)" strokeWidth="1.5"/>
              <path d="M24 18L48 32L24 46V18Z" fill="url(#lg)" opacity="0.95"/>
              <circle cx="24" cy="18" r="3" fill="#00E676"/>
              <circle cx="48" cy="32" r="3" fill="#0A84FF"/>
              <circle cx="24" cy="46" r="3" fill="#00E676"/>
            </svg>
            <span className="font-display font-bold text-xl">Smart<span className="text-gradient">Play</span></span>
          </Link>

          <h1 className="font-display text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-[#8E99A4] mb-8">Log in to your SmartPlay account</p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[rgba(255,82,82,0.08)] border border-[rgba(255,82,82,0.15)] text-[#FF5252] text-sm mb-6">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6570] hover:text-[#F0F2F5] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[rgba(142,153,164,0.2)] bg-[#0D1520] text-[#00E676] focus:ring-[#00E676]" />
                <span className="text-sm text-[#8E99A4]">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#0A84FF] hover:text-[#4DA6FF] transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[rgba(142,153,164,0.1)]" /></div>
            <div className="relative flex justify-center"><span className="px-4 bg-[#060B14] text-xs text-[#5A6570] uppercase tracking-wider">or try a demo</span></div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { role: 'athlete', label: 'Athlete', color: '#00E676' },
              { role: 'coach', label: 'Coach', color: '#0A84FF' },
              { role: 'parent', label: 'Parent', color: '#FFD600' },
            ].map((d) => (
              <button
                key={d.role}
                onClick={() => loginAsDemo(d.role)}
                className="py-2.5 rounded-xl text-sm font-medium border border-[rgba(142,153,164,0.1)] hover:border-[rgba(142,153,164,0.25)] transition-all text-center"
                style={{ color: d.color }}
              >
                {d.label}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-[#5A6570] mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#00E676] hover:text-[#69F0AE] font-medium transition-colors">Start free trial</Link>
          </p>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative bg-[#0A0F18] overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,230,118,0.08) 0%, transparent 70%)' }} />
        <div className="relative text-center px-12">
          <div className="text-8xl mb-6">⚽</div>
          <h2 className="font-display text-2xl font-bold mb-3">Track. Train. Transform.</h2>
          <p className="text-[#8E99A4] max-w-sm">Every session logged, every insight earned. Your development journey starts with data.</p>
        </div>
      </div>
    </div>
  )
}
