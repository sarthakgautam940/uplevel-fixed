'use client'

import { create } from 'zustand'
import type { User, UserRole } from '@/types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  switchRole: (role: UserRole) => void
}

interface SignupData {
  name: string
  email: string
  password: string
  role: UserRole
}

// Demo users for development
const DEMO_USERS: Record<string, User> = {
  'athlete@demo.com': {
    id: 'usr_athlete_01',
    email: 'athlete@demo.com',
    name: 'Jordan Rivera',
    role: 'athlete',
    avatar: '',
    createdAt: '2026-01-15T00:00:00Z',
    onboardingComplete: true,
    subscription: { status: 'active', plan: 'player' },
  },
  'coach@demo.com': {
    id: 'usr_coach_01',
    email: 'coach@demo.com',
    name: 'Coach Martinez',
    role: 'coach',
    avatar: '',
    createdAt: '2026-01-10T00:00:00Z',
    onboardingComplete: true,
    subscription: { status: 'active', plan: 'coach' },
  },
  'parent@demo.com': {
    id: 'usr_parent_01',
    email: 'parent@demo.com',
    name: 'Sarah Rivera',
    role: 'parent',
    avatar: '',
    createdAt: '2026-01-20T00:00:00Z',
    onboardingComplete: true,
    subscription: { status: 'active', plan: 'player' },
  },
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email: string, _password: string) => {
    set({ isLoading: true })
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800))
    const user = DEMO_USERS[email]
    if (user) {
      set({ user, isAuthenticated: true, isLoading: false })
      // Store in session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sp_user', JSON.stringify(user))
      }
    } else {
      // Create new user from signup
      const newUser: User = {
        id: 'usr_' + Math.random().toString(36).slice(2, 9),
        email,
        name: email.split('@')[0],
        role: 'athlete',
        createdAt: new Date().toISOString(),
        onboardingComplete: false,
        subscription: { status: 'trialing', plan: 'player', trialEnd: new Date(Date.now() + 14 * 86400000).toISOString() },
      }
      set({ user: newUser, isAuthenticated: true, isLoading: false })
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sp_user', JSON.stringify(newUser))
      }
    }
  },

  signup: async (data: SignupData) => {
    set({ isLoading: true })
    await new Promise((r) => setTimeout(r, 1000))
    const user: User = {
      id: 'usr_' + Math.random().toString(36).slice(2, 9),
      email: data.email,
      name: data.name,
      role: data.role,
      createdAt: new Date().toISOString(),
      onboardingComplete: false,
      subscription: {
        status: 'trialing',
        plan: data.role === 'coach' ? 'coach' : 'player',
        trialEnd: new Date(Date.now() + 14 * 86400000).toISOString(),
      },
    }
    set({ user, isAuthenticated: true, isLoading: false })
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sp_user', JSON.stringify(user))
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sp_user')
    }
  },

  setUser: (user: User) => set({ user, isAuthenticated: true }),

  switchRole: (role: UserRole) => {
    set((state) => {
      if (!state.user) return state
      const updated = { ...state.user, role }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sp_user', JSON.stringify(updated))
      }
      return { user: updated }
    })
  },
}))

// Hydrate from session storage on load
export function hydrateAuth() {
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('sp_user')
    if (stored) {
      try {
        const user = JSON.parse(stored) as User
        useAuth.setState({ user, isAuthenticated: true })
      } catch { /* ignore */ }
    }
  }
}
