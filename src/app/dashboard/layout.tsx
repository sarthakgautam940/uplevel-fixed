'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth, hydrateAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import {
  BarChart3, Activity, Apple, Heart, Video, Target, Calendar,
  Settings, LogOut, User, Menu, X, ChevronDown, Sparkles,
  Users, ClipboardList, Bell, Search, Plus, Moon, Sun,
  MessageSquare, BookOpen, Shield
} from 'lucide-react'

const athleteNav = [
  { label: 'Overview', href: '/dashboard', icon: BarChart3 },
  { label: 'Training', href: '/dashboard/training', icon: Activity },
  { label: 'Nutrition', href: '/dashboard/nutrition', icon: Apple },
  { label: 'Recovery', href: '/dashboard/recovery', icon: Heart },
  { label: 'Video', href: '/dashboard/video', icon: Video },
  { label: 'Goals', href: '/dashboard/goals', icon: Target },
  { label: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { label: 'Journal', href: '/dashboard/profile', icon: BookOpen },
]

const coachNav = [
  { label: 'Overview', href: '/dashboard', icon: BarChart3 },
  { label: 'Roster', href: '/coach/roster', icon: Users },
  { label: 'Training Plans', href: '/coach/plans', icon: ClipboardList },
  { label: 'Video Review', href: '/coach/review', icon: Video },
  { label: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
]

const parentNav = [
  { label: 'Overview', href: '/dashboard', icon: BarChart3 },
  { label: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => { hydrateAuth() }, [])

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('sp_user')
      if (!stored) router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060B14]">
        <div className="w-8 h-8 border-2 border-[#00E676] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const navItems = user.role === 'coach' ? coachNav : user.role === 'parent' ? parentNav : athleteNav

  return (
    <div className="min-h-screen bg-[#060B14] flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0F18] border-r border-[rgba(142,153,164,0.08)] flex flex-col transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3">
          <svg viewBox="0 0 64 64" fill="none" className="w-8 h-8">
            <defs><linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00E676"/><stop offset="100%" stopColor="#0A84FF"/></linearGradient></defs>
            <rect x="4" y="4" width="56" height="56" rx="14" fill="#060B14" stroke="url(#dg)" strokeWidth="1.5"/>
            <path d="M24 18L48 32L24 46V18Z" fill="url(#dg)" opacity="0.95"/>
          </svg>
          <span className="font-display font-bold text-lg">Smart<span className="text-gradient">Play</span></span>
        </div>

        {/* Quick Add */}
        <div className="px-4 mb-4">
          <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgba(0,230,118,0.06)] border border-[rgba(0,230,118,0.12)] text-sm font-medium text-[#00E676] hover:bg-[rgba(0,230,118,0.1)] transition-colors">
            <Plus size={16} />
            Quick Add
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive ? 'bg-[rgba(0,230,118,0.08)] text-[#00E676]' : 'text-[#5A6570] hover:text-[#B8C0C8] hover:bg-[rgba(142,153,164,0.04)]'
                )}>
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 space-y-1 border-t border-[rgba(142,153,164,0.06)] pt-4 mt-2">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#5A6570] hover:text-[#B8C0C8] hover:bg-[rgba(142,153,164,0.04)] transition-all">
            <Settings size={18} /> Settings
          </Link>
          <button onClick={() => { logout(); router.push('/') }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#5A6570] hover:text-[#FF5252] hover:bg-[rgba(255,82,82,0.04)] transition-all">
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#060B14]/80 backdrop-blur-xl border-b border-[rgba(142,153,164,0.06)] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-[#8E99A4] hover:text-[#F0F2F5]">
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6570]" />
              <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 rounded-xl bg-[#0D1520] border border-[rgba(142,153,164,0.08)] text-sm text-[#F0F2F5] placeholder-[#5A6570] w-64 focus:outline-none focus:border-[rgba(0,230,118,0.3)]" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl text-[#5A6570] hover:text-[#F0F2F5] hover:bg-[rgba(142,153,164,0.06)] relative">
              <Bell size={18} />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00E676]" />
            </button>
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[rgba(142,153,164,0.06)] transition-colors">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00E676] to-[#0A84FF] flex items-center justify-center text-xs font-bold text-[#060B14]">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium hidden sm:block">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className="text-[#5A6570]" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#0D1520] border border-[rgba(142,153,164,0.1)] rounded-xl shadow-elevated z-50 p-2">
                    <div className="px-3 py-2 border-b border-[rgba(142,153,164,0.06)] mb-2">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-[#5A6570]">{user.email}</div>
                      <div className="badge-primary text-[9px] mt-1">{user.role}</div>
                    </div>
                    <Link href="/dashboard/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#8E99A4] hover:text-[#F0F2F5] hover:bg-[rgba(142,153,164,0.06)]">
                      <User size={14} /> Profile
                    </Link>
                    <Link href="/dashboard/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#8E99A4] hover:text-[#F0F2F5] hover:bg-[rgba(142,153,164,0.06)]">
                      <Settings size={14} /> Settings
                    </Link>
                    <button onClick={() => { logout(); router.push('/') }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#FF5252] hover:bg-[rgba(255,82,82,0.06)]">
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
