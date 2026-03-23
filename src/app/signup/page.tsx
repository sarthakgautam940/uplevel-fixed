'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getPasswordStrength, US_STATES, POSITIONS } from '@/lib/utils'
import { Eye, EyeOff, ArrowRight, ArrowLeft, Check, Activity, Users, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = 'account' | 'role' | 'profile'

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading } = useAuth()
  const [step, setStep] = useState<Step>('account')
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', password: '',
    role: '' as 'athlete' | 'coach' | 'parent' | '',
    dateOfBirth: '', position: '', club: '', city: '', state: '',
  })

  const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password])

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }))

  const canProceedAccount = form.name && form.email && form.password.length >= 8
  const canProceedRole = form.role !== ''

  const handleSubmit = async () => {
    if (!form.role) return
    await signup({ name: form.name, email: form.email, password: form.password, role: form.role as any })
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <svg viewBox="0 0 64 64" fill="none" className="w-9 h-9">
              <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00E676"/><stop offset="100%" stopColor="#0A84FF"/></linearGradient></defs>
              <rect x="4" y="4" width="56" height="56" rx="14" fill="#060B14" stroke="url(#sg)" strokeWidth="1.5"/>
              <path d="M24 18L48 32L24 46V18Z" fill="url(#sg)" opacity="0.95"/>
              <circle cx="24" cy="18" r="3" fill="#00E676"/><circle cx="48" cy="32" r="3" fill="#0A84FF"/><circle cx="24" cy="46" r="3" fill="#00E676"/>
            </svg>
            <span className="font-display font-bold text-xl">Smart<span className="text-gradient">Play</span></span>
          </Link>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {(['account', 'role', 'profile'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  step === s ? 'bg-[#00E676] text-[#060B14]' :
                  (['account', 'role', 'profile'].indexOf(step) > i) ? 'bg-[#00E676]/20 text-[#00E676]' :
                  'bg-[#141D2B] text-[#5A6570]'
                )}>
                  {(['account', 'role', 'profile'].indexOf(step) > i) ? <Check size={14} /> : i + 1}
                </div>
                {i < 2 && <div className={cn('flex-1 h-0.5 rounded-full',
                  (['account', 'role', 'profile'].indexOf(step) > i) ? 'bg-[#00E676]/30' : 'bg-[#141D2B]'
                )} />}
              </div>
            ))}
          </div>

          {/* Step 1: Account */}
          {step === 'account' && (
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">Create your account</h1>
              <p className="text-[#8E99A4] mb-8">14-day free trial. No credit card required.</p>
              <div className="space-y-5">
                <div>
                  <label className="input-label">Full Name</label>
                  <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Jordan Rivera" className="input-field" autoComplete="name" />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" className="input-field" autoComplete="email" />
                </div>
                <div>
                  <label className="input-label">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min 8 characters" className="input-field pr-12" autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6570] hover:text-[#F0F2F5]">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i < passwordStrength.score ? passwordStrength.color : '#141D2B' }} />
                        ))}
                      </div>
                      <span className="text-[10px]" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                    </div>
                  )}
                </div>
                <button disabled={!canProceedAccount} onClick={() => setStep('role')} className="btn-primary w-full justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Role */}
          {step === 'role' && (
            <div>
              <button onClick={() => setStep('account')} className="flex items-center gap-1 text-sm text-[#8E99A4] hover:text-[#F0F2F5] mb-6">
                <ArrowLeft size={16} /> Back
              </button>
              <h1 className="font-display text-3xl font-bold mb-2">How will you use SmartPlay?</h1>
              <p className="text-[#8E99A4] mb-8">Select your primary role. You can change this later.</p>
              <div className="space-y-3">
                {[
                  { value: 'athlete', label: 'Athlete', desc: 'Track my training, wellness, and development', icon: <Activity size={24} />, color: '#00E676' },
                  { value: 'coach', label: 'Coach', desc: 'Manage my team, plan training, review athletes', icon: <Users size={24} />, color: '#0A84FF' },
                  { value: 'parent', label: 'Parent', desc: 'Monitor my child\'s progress and wellness', icon: <Heart size={24} />, color: '#FFD600' },
                ].map((role) => (
                  <button
                    key={role.value}
                    onClick={() => update('role', role.value)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left',
                      form.role === role.value
                        ? 'border-[rgba(0,230,118,0.3)] bg-[rgba(0,230,118,0.04)]'
                        : 'border-[rgba(142,153,164,0.1)] hover:border-[rgba(142,153,164,0.2)]'
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${role.color}10`, color: role.color }}>
                      {role.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{role.label}</div>
                      <div className="text-xs text-[#8E99A4]">{role.desc}</div>
                    </div>
                    <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center',
                      form.role === role.value ? 'border-[#00E676] bg-[#00E676]' : 'border-[#5A6570]'
                    )}>
                      {form.role === role.value && <Check size={12} className="text-[#060B14]" />}
                    </div>
                  </button>
                ))}
              </div>
              <button disabled={!canProceedRole} onClick={() => form.role === 'athlete' ? setStep('profile') : handleSubmit()} className="btn-primary w-full justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
                {form.role === 'athlete' ? 'Continue' : 'Create Account'} <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 3: Athlete Profile (athletes only) */}
          {step === 'profile' && (
            <div>
              <button onClick={() => setStep('role')} className="flex items-center gap-1 text-sm text-[#8E99A4] hover:text-[#F0F2F5] mb-6">
                <ArrowLeft size={16} /> Back
              </button>
              <h1 className="font-display text-3xl font-bold mb-2">Your athlete profile</h1>
              <p className="text-[#8E99A4] mb-8">Help us personalize your experience. You can edit this anytime.</p>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Date of Birth</label>
                    <input type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="input-label">Position</label>
                    <select value={form.position} onChange={(e) => update('position', e.target.value)} className="input-field">
                      <option value="">Select...</option>
                      {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="input-label">Club / Team</label>
                  <input type="text" value={form.club} onChange={(e) => update('club', e.target.value)} placeholder="Valley FC Academy" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">City</label>
                    <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Austin" className="input-field" />
                  </div>
                  <div>
                    <label className="input-label">State</label>
                    <select value={form.state} onChange={(e) => update('state', e.target.value)} className="input-field">
                      <option value="">Select...</option>
                      {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={handleSubmit} disabled={isLoading} className="btn-primary w-full justify-center gap-2 disabled:opacity-50">
                  {isLoading ? 'Creating account...' : 'Create Account'} {!isLoading && <ArrowRight size={18} />}
                </button>
                <button onClick={handleSubmit} className="text-sm text-[#5A6570] hover:text-[#8E99A4] transition-colors w-full text-center">
                  Skip for now
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-[#5A6570] mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-[#00E676] hover:text-[#69F0AE] font-medium">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative bg-[#0A0F18] overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(10,132,255,0.08) 0%, transparent 70%)' }} />
        <div className="relative text-center px-12">
          <div className="text-8xl mb-6">🏆</div>
          <h2 className="font-display text-2xl font-bold mb-3">Join 2,400+ athletes</h2>
          <p className="text-[#8E99A4] max-w-sm">Your free trial starts today. Full access to every feature for 14 days.</p>
        </div>
      </div>
    </div>
  )
}
