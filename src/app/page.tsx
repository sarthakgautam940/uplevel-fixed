'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { cn } from '@/lib/utils'
import {
  Activity, Brain, Apple, Heart, Video, Target, Calendar, Users,
  Zap, Shield, TrendingUp, Star, ChevronDown, ChevronRight,
  BarChart3, Clock, Sparkles, ArrowRight, Check, Play,
  Moon, Droplets, Dumbbell, MessageSquare
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════
   HERO SECTION
   Emotion: Arrival — "This is the future of youth sports"
   ═══════════════════════════════════════════════════════ */

function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Layered Background */}
      <div className="absolute inset-0">
        {/* Grid */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        {/* Gradient orbs */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(0,230,118,0.15) 0%, transparent 70%)',
            left: `calc(20% + ${mousePos.x}px)`,
            top: `calc(30% + ${mousePos.y}px)`,
            transition: 'left 0.3s ease-out, top 0.3s ease-out',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(10,132,255,0.12) 0%, transparent 70%)',
            right: `calc(15% + ${-mousePos.x * 0.5}px)`,
            top: `calc(20% + ${-mousePos.y * 0.5}px)`,
            transition: 'right 0.3s ease-out, top 0.3s ease-out',
          }}
        />
        {/* Noise */}
        <div className="absolute inset-0 noise" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 pt-32 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,230,118,0.06)] border border-[rgba(0,230,118,0.15)] mb-8 animate-fade-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <Sparkles size={14} className="text-[#00E676]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#00E676]">Now in Open Beta — 14 Days Free</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-display font-extrabold tracking-tight mb-6 animate-fade-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            The Operating System{' '}
            <br className="hidden md:block" />
            for{' '}
            <span className="text-gradient">Youth Athletes</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-[#8E99A4] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
            Training analytics, nutrition intelligence, recovery tracking, and AI coaching — unified in one platform. Built for soccer. Designed for every athlete.
          </p>

          {/* CTA Pair */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up opacity-0" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
            <Link href="/signup" className="btn-primary text-base gap-2 group">
              Start Free Trial
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/features" className="btn-secondary text-base gap-2 group">
              <Play size={16} />
              See How It Works
            </Link>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="relative animate-fade-up opacity-0" style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}>
            <div className="relative rounded-2xl overflow-hidden border border-[rgba(142,153,164,0.1)] bg-[#0D1520] shadow-elevated">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(142,153,164,0.08)] bg-[#0A0F18]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-[rgba(142,153,164,0.06)] text-xs text-[#5A6570] font-mono">app.smartplay.io/dashboard</div>
                </div>
              </div>
              {/* Dashboard mock */}
              <DashboardMock />
            </div>
            {/* Glow behind card */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-b from-[rgba(0,230,118,0.06)] via-transparent to-[rgba(10,132,255,0.04)] blur-2xl" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse">
        <span className="text-[10px] uppercase tracking-widest text-[#5A6570]">Scroll</span>
        <ChevronDown size={16} className="text-[#5A6570]" />
      </div>
    </section>
  )
}

/* Dashboard Mock for Hero */
function DashboardMock() {
  return (
    <div className="p-6 grid grid-cols-12 gap-4 min-h-[400px]">
      {/* Sidebar */}
      <div className="col-span-2 hidden lg:flex flex-col gap-3">
        {[
          { icon: <BarChart3 size={16} />, label: 'Overview', active: true },
          { icon: <Activity size={16} />, label: 'Training', active: false },
          { icon: <Apple size={16} />, label: 'Nutrition', active: false },
          { icon: <Heart size={16} />, label: 'Recovery', active: false },
          { icon: <Video size={16} />, label: 'Video', active: false },
          { icon: <Target size={16} />, label: 'Goals', active: false },
        ].map((item) => (
          <div key={item.label} className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
            item.active ? 'bg-[rgba(0,230,118,0.08)] text-[#00E676]' : 'text-[#5A6570]'
          )}>
            {item.icon}
            {item.label}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Readiness Card */}
        <div className="card-elevated p-4">
          <div className="text-xs text-[#8E99A4] mb-2 font-medium">Today&apos;s Readiness</div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-display font-bold text-[#00E676]">87</span>
            <span className="text-xs text-[#00E676] mb-1 flex items-center gap-1">
              <TrendingUp size={12} /> +5 from yesterday
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[rgba(142,153,164,0.08)] overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#00E676] to-[#0A84FF]" style={{ width: '87%' }} />
          </div>
        </div>

        {/* Training Load */}
        <div className="card-elevated p-4">
          <div className="text-xs text-[#8E99A4] mb-2 font-medium">Weekly Load</div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-display font-bold text-[#F0F2F5]">2,430</span>
            <span className="text-xs text-[#8E99A4] mb-1">AU</span>
          </div>
          <div className="mt-3 flex items-end gap-1 h-12">
            {[40, 65, 55, 80, 70, 90, 45].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-[rgba(10,132,255,0.6)] to-[rgba(10,132,255,0.2)]" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card-elevated p-4">
          <div className="text-xs text-[#8E99A4] mb-2 font-medium">This Week</div>
          <div className="space-y-3">
            {[
              { label: 'Sessions', value: '5/6', color: '#00E676' },
              { label: 'Avg Sleep', value: '7.8h', color: '#0A84FF' },
              { label: 'Streak', value: '12 days', color: '#FFD600' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <span className="text-xs text-[#5A6570]">{stat.label}</span>
                <span className="text-sm font-semibold font-mono" style={{ color: stat.color }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart area */}
        <div className="md:col-span-2 card-elevated p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-[#8E99A4] font-medium">Readiness Trend — Last 14 Days</span>
            <span className="badge-primary text-[10px]">AI Insight</span>
          </div>
          <div className="flex items-end gap-1 h-32">
            {[72, 68, 75, 80, 77, 82, 85, 78, 84, 88, 86, 90, 87, 89].map((v, i) => (
              <div key={i} className="flex-1 rounded-t-sm transition-all" style={{
                height: `${(v / 100) * 100}%`,
                background: v >= 80 ? 'linear-gradient(to top, rgba(0,230,118,0.6), rgba(0,230,118,0.2))' :
                  v >= 60 ? 'linear-gradient(to top, rgba(10,132,255,0.6), rgba(10,132,255,0.2))' :
                    'linear-gradient(to top, rgba(255,214,0,0.6), rgba(255,214,0,0.2))'
              }} />
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div className="card-elevated p-4">
          <div className="text-xs text-[#8E99A4] mb-3 font-medium">Upcoming</div>
          <div className="space-y-2.5">
            {[
              { time: '4:00 PM', event: 'Team Practice', type: 'practice' },
              { time: '6:30 PM', event: 'Meal Prep', type: 'nutrition' },
              { time: 'Tomorrow', event: 'Recovery Day', type: 'rest' },
            ].map((item) => (
              <div key={item.event} className="flex items-center gap-3">
                <div className={cn('w-1.5 h-8 rounded-full', {
                  'bg-[#00E676]': item.type === 'practice',
                  'bg-[#0A84FF]': item.type === 'nutrition',
                  'bg-[#FFD600]': item.type === 'rest',
                })} />
                <div>
                  <div className="text-xs font-medium text-[#F0F2F5]">{item.event}</div>
                  <div className="text-[10px] text-[#5A6570]">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SOCIAL PROOF STRIP
   Emotion: Confirmation — "Trusted by others like me"
   ═══════════════════════════════════════════════════════ */

function SocialProofStrip() {
  const stats = [
    { number: '2,400+', label: 'Active Athletes' },
    { number: '180+', label: 'Teams' },
    { number: '96%', label: 'Retention Rate' },
    { number: '4.9', label: 'App Store Rating', icon: <Star size={14} className="text-[#FFD600] fill-[#FFD600]" /> },
  ]

  return (
    <section className="relative py-16 border-y border-[rgba(142,153,164,0.06)]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl md:text-4xl font-display font-bold text-[#F0F2F5]">{stat.number}</span>
                {stat.icon}
              </div>
              <span className="text-sm text-[#5A6570] mt-1 block">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PROBLEM STATEMENT
   Emotion: Recognition — "They understand my situation"
   ═══════════════════════════════════════════════════════ */

function ProblemSection() {
  return (
    <section className="section-padding relative">
      <div className="max-w-[960px] mx-auto px-6 md:px-12 text-center">
        <span className="badge-secondary mb-6 inline-flex">The Problem</span>
        <h2 className="font-display text-display-sm font-bold tracking-tight mb-6">
          Youth athletes deserve{' '}
          <span className="text-gradient">elite-level tools</span>
          <br className="hidden md:block" />
          without the elite-level price tag
        </h2>
        <p className="text-lg text-[#8E99A4] max-w-2xl mx-auto mb-12 leading-relaxed">
          Most performance platforms cost $500+/month, require wearables, and are built for pro teams.
          Young athletes are left with spreadsheets, scattered notes, and guesswork.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Clock size={24} />, title: 'Fragmented Data', desc: 'Training in one app, nutrition in another, sleep on a watch. Nothing connects.' },
            { icon: <Shield size={24} />, title: 'Cost Barrier', desc: 'GPS vests cost $300. Elite platforms start at $50/seat. Most families can\'t afford it.' },
            { icon: <Users size={24} />, title: 'No Ecosystem', desc: 'Coaches, parents, and athletes all use different tools — nobody has the full picture.' },
          ].map((item) => (
            <div key={item.title} className="card-surface p-6 text-left group">
              <div className="w-12 h-12 rounded-xl bg-[rgba(255,82,82,0.08)] border border-[rgba(255,82,82,0.15)] flex items-center justify-center text-[#FF5252] mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-[#8E99A4] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   FEATURES SECTION
   Emotion: Desire — "I want this"
   ═══════════════════════════════════════════════════════ */

function FeaturesSection() {
  const features = [
    {
      icon: <Activity size={24} />,
      title: 'Training Intelligence',
      desc: 'Log sessions, track load metrics (acute:chronic ratio), monitor intensity, and let AI flag overtraining risk before it happens.',
      color: '#00E676',
      gradient: 'from-[rgba(0,230,118,0.1)] to-transparent',
    },
    {
      icon: <Apple size={24} />,
      title: 'Nutrition & Hydration',
      desc: 'Budget-friendly meal ideas, macro tracking, pre/post training nutrition, and AI-generated suggestions based on your training load.',
      color: '#0A84FF',
      gradient: 'from-[rgba(10,132,255,0.1)] to-transparent',
    },
    {
      icon: <Heart size={24} />,
      title: 'Recovery & Wellness',
      desc: 'Daily readiness scoring from sleep, mood, soreness, and energy. Readiness alerts tell you when to push and when to rest.',
      color: '#FFD600',
      gradient: 'from-[rgba(255,214,0,0.1)] to-transparent',
    },
    {
      icon: <Brain size={24} />,
      title: 'Mental Performance',
      desc: 'Guided journaling, pre-game visualization prompts, mindset tracking, and AI-powered reflection that builds mental resilience.',
      color: '#E040FB',
      gradient: 'from-[rgba(224,64,251,0.1)] to-transparent',
    },
    {
      icon: <Video size={24} />,
      title: 'Video Review',
      desc: 'Upload clips, tag moments, get AI-generated technical feedback. Coaches can comment and assign video homework.',
      color: '#FF5252',
      gradient: 'from-[rgba(255,82,82,0.1)] to-transparent',
    },
    {
      icon: <Sparkles size={24} />,
      title: 'SmartPlay AI',
      desc: 'Weekly performance summaries, personalized drill recommendations, recovery advice, and contextual coaching — all generated from your data.',
      color: '#00E676',
      gradient: 'from-[rgba(0,230,118,0.1)] to-transparent',
    },
  ]

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(0,230,118,0.04) 0%, transparent 60%)' }} />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 relative">
        <div className="text-center mb-16">
          <span className="badge-primary mb-6 inline-flex">Features</span>
          <h2 className="font-display text-display-sm font-bold tracking-tight mb-4">
            Everything in <span className="text-gradient">one place</span>
          </h2>
          <p className="text-lg text-[#8E99A4] max-w-2xl mx-auto">
            Six integrated modules that work together to create a complete development platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="group relative card-surface p-6 hover:border-[rgba(142,153,164,0.2)] transition-all duration-500">
              {/* Hover glow */}
              <div className={cn('absolute inset-0 rounded-[16px] bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500', feature.gradient)} />
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300"
                  style={{ background: `${feature.color}10`, border: `1px solid ${feature.color}25`, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-[#F0F2F5] transition-colors">{feature.title}</h3>
                <p className="text-sm text-[#8E99A4] leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   ROLE TABS — Athletes / Coaches / Parents
   ═══════════════════════════════════════════════════════ */

function RolesSection() {
  const [activeRole, setActiveRole] = useState<'athlete' | 'coach' | 'parent'>('athlete')

  const roles = {
    athlete: {
      title: 'For Athletes',
      subtitle: 'Your performance command center',
      features: [
        'Personal readiness dashboard with daily scoring',
        'Training session logging with RPE and load tracking',
        'Nutrition planner with budget-friendly meal ideas',
        'Video upload and AI-powered clip analysis',
        'Goal setting with milestone tracking and streaks',
        'Shareable recruiting profile',
        'Mental performance journal with guided prompts',
        'AI-generated weekly summaries and recommendations',
      ],
    },
    coach: {
      title: 'For Coaches',
      subtitle: 'See your whole team at a glance',
      features: [
        'Team roster with individual athlete dashboards',
        'Readiness overview — know who\'s ready to train',
        'Training plan builder with drill assignments',
        'Video review workflow with comment threads',
        'Announcements and team communication',
        'Risk flags for overtraining or declining wellness',
        'Performance comparison and trend analysis',
        'Bulk action tools for assignments and feedback',
      ],
    },
    parent: {
      title: 'For Parents',
      subtitle: 'Stay connected without micromanaging',
      features: [
        'Weekly wellness summary of your child\'s data',
        'Schedule and calendar visibility',
        'Goal progress and consistency tracking',
        'Coach-approved notes and feedback visibility',
        'Nutrition and sleep trends overview',
        'No access to private journal entries (privacy-first)',
        'Push notifications for important updates',
        'Direct messaging with coaches when needed',
      ],
    },
  }

  const data = roles[activeRole]

  return (
    <section className="section-padding relative">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12">
          <span className="badge-accent mb-6 inline-flex">Built for Everyone</span>
          <h2 className="font-display text-display-sm font-bold tracking-tight mb-4">
            Three roles, <span className="text-gradient">one platform</span>
          </h2>
          <p className="text-lg text-[#8E99A4] max-w-2xl mx-auto">
            Permission-aware dashboards give each user exactly what they need — nothing more, nothing less.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-[#0D1520] border border-[rgba(142,153,164,0.1)] rounded-full p-1">
            {(['athlete', 'coach', 'parent'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={cn(
                  'px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300',
                  activeRole === role
                    ? 'bg-[#00E676] text-[#060B14] shadow-glow-sm'
                    : 'text-[#8E99A4] hover:text-[#F0F2F5]'
                )}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-display text-heading font-bold mb-2">{data.title}</h3>
            <p className="text-lg text-[#8E99A4] mb-8">{data.subtitle}</p>
            <div className="space-y-3">
              {data.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[rgba(0,230,118,0.1)] border border-[rgba(0,230,118,0.2)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-[#00E676]" />
                  </div>
                  <span className="text-sm text-[#B8C0C8]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Role-specific mock */}
          <div className="relative">
            <div className="card-elevated p-6 rounded-2xl">
              {activeRole === 'athlete' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Good Morning, Jordan</span>
                    <span className="badge-primary text-[10px]">Day 12 Streak</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Readiness', value: '87', unit: '/100', color: '#00E676' },
                      { label: 'Sleep', value: '8.2', unit: 'hrs', color: '#0A84FF' },
                      { label: 'Load', value: '340', unit: 'AU', color: '#FFD600' },
                    ].map((s) => (
                      <div key={s.label} className="bg-[rgba(142,153,164,0.04)] rounded-xl p-3 text-center">
                        <div className="text-[10px] text-[#5A6570] mb-1">{s.label}</div>
                        <div className="text-2xl font-display font-bold" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[10px] text-[#5A6570]">{s.unit}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[rgba(0,230,118,0.04)] border border-[rgba(0,230,118,0.1)] rounded-xl p-3">
                    <div className="flex items-center gap-2 text-[#00E676] text-xs font-medium mb-1">
                      <Sparkles size={12} />
                      AI Insight
                    </div>
                    <p className="text-xs text-[#B8C0C8]">Your readiness is excellent today. Great time for high-intensity training. Consider adding speed work or finishing drills.</p>
                  </div>
                </div>
              )}
              {activeRole === 'coach' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">U17 Elite — Team Overview</span>
                    <span className="text-xs text-[#8E99A4]">18 athletes</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Avg Readiness', value: '79', color: '#00E676' },
                      { label: 'At Risk', value: '2', color: '#FF5252' },
                      { label: 'Pending Reviews', value: '5', color: '#0A84FF' },
                    ].map((s) => (
                      <div key={s.label} className="bg-[rgba(142,153,164,0.04)] rounded-xl p-3 text-center">
                        <div className="text-[10px] text-[#5A6570] mb-1">{s.label}</div>
                        <div className="text-2xl font-display font-bold" style={{ color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                  {/* Mini roster */}
                  <div className="space-y-2">
                    {[
                      { name: 'Jordan R.', readiness: 87, status: 'green' },
                      { name: 'Alex T.', readiness: 62, status: 'yellow' },
                      { name: 'Sam K.', readiness: 45, status: 'red' },
                    ].map((a) => (
                      <div key={a.name} className="flex items-center justify-between py-2 border-b border-[rgba(142,153,164,0.06)] last:border-0">
                        <div className="flex items-center gap-2">
                          <div className={cn('w-2 h-2 rounded-full', {
                            'bg-[#00E676]': a.status === 'green',
                            'bg-[#FFD600]': a.status === 'yellow',
                            'bg-[#FF5252]': a.status === 'red',
                          })} />
                          <span className="text-xs font-medium">{a.name}</span>
                        </div>
                        <span className="text-xs font-mono text-[#8E99A4]">{a.readiness}/100</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeRole === 'parent' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Jordan&apos;s Weekly Summary</span>
                    <span className="text-xs text-[#8E99A4]">Mar 15–22</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Sessions', value: '5 of 6', icon: <Activity size={14} /> },
                      { label: 'Avg Sleep', value: '7.8 hrs', icon: <Moon size={14} /> },
                      { label: 'Goal Progress', value: '72%', icon: <Target size={14} /> },
                      { label: 'Mood Avg', value: 'Good', icon: <Sparkles size={14} /> },
                    ].map((s) => (
                      <div key={s.label} className="bg-[rgba(142,153,164,0.04)] rounded-xl p-3">
                        <div className="flex items-center gap-1.5 text-[#5A6570] text-[10px] mb-1">
                          {s.icon} {s.label}
                        </div>
                        <div className="text-sm font-semibold text-[#F0F2F5]">{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[rgba(10,132,255,0.04)] border border-[rgba(10,132,255,0.1)] rounded-xl p-3">
                    <p className="text-xs text-[#B8C0C8]">Coach Martinez noted: "Jordan showed great focus during tactical drills this week. Keep encouraging rest days on weekends."</p>
                  </div>
                </div>
              )}
            </div>
            {/* Glow */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-[rgba(0,230,118,0.04)] to-[rgba(10,132,255,0.04)] blur-xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   TESTIMONIALS
   ═══════════════════════════════════════════════════════ */

function TestimonialsSection() {
  const testimonials = [
    { name: 'Maria Gonzalez', role: 'Parent, ECNL U15', quote: 'My daughter finally has structure to her development. The readiness score alone has prevented two potential injuries this season.', rating: 5 },
    { name: 'Coach David Chen', role: 'Director, Valley FC Academy', quote: 'I can see my entire roster\'s wellness in 30 seconds. The overtraining flags have completely changed how I manage load across the season.', rating: 5 },
    { name: 'Marcus J.', role: 'Athlete, MLS NEXT U17', quote: 'I used to keep everything in my head. Now I can actually see my progress. The AI summaries help me prep for college ID camps.', rating: 5 },
    { name: 'Dr. Sarah Kim', role: 'Sports Psychologist', quote: 'The mental performance journaling module is genuinely well-designed. It integrates evidence-based practices in an accessible way.', rating: 5 },
  ]

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12">
          <span className="badge-primary mb-6 inline-flex">Testimonials</span>
          <h2 className="font-display text-display-sm font-bold tracking-tight">
            Trusted by <span className="text-gradient">athletes and coaches</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card-surface p-6 group">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-[#FFD600] fill-[#FFD600]" />
                ))}
              </div>
              <p className="text-sm text-[#B8C0C8] leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <div className="text-sm font-semibold text-[#F0F2F5]">{t.name}</div>
                <div className="text-xs text-[#5A6570]">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   PRICING
   ═══════════════════════════════════════════════════════ */

function PricingSection() {
  const tiers = [
    {
      name: 'Player',
      price: '$12',
      period: '/month',
      description: 'Full access for individual athletes. Everything you need to train smarter.',
      features: [
        'Full athlete dashboard',
        'Training & wellness logging',
        'Nutrition planner + AI suggestions',
        'Video upload & AI clip review',
        'Goal tracking with streaks',
        'Mental performance journal',
        'Weekly AI performance summaries',
        'Recruiting profile page',
      ],
      cta: 'Start 14-Day Free Trial',
      highlighted: true,
      badge: 'Most Popular',
    },
    {
      name: 'Coach',
      price: '$49',
      period: '/month',
      description: 'Manage your team with full athlete visibility and planning tools.',
      features: [
        'Everything in Player',
        'Team roster management',
        'Readiness & risk dashboard',
        'Training plan builder',
        'Video review assignments',
        'Team announcements',
        'Performance comparison tools',
        'Up to 25 athletes included',
      ],
      cta: 'Coming Soon',
      highlighted: false,
      badge: 'Teams',
    },
    {
      name: 'Program',
      price: '$199',
      period: '/month',
      description: 'Multi-team management for clubs, academies, and organizations.',
      features: [
        'Everything in Coach',
        'Unlimited teams & athletes',
        'Admin & director dashboards',
        'Custom branding',
        'API access',
        'Priority support',
        'Bulk onboarding tools',
        'Annual reporting & exports',
      ],
      cta: 'Contact Sales',
      highlighted: false,
      badge: 'Organizations',
    },
  ]

  return (
    <section id="pricing" className="section-padding relative">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12">
          <span className="badge-accent mb-6 inline-flex">Pricing</span>
          <h2 className="font-display text-display-sm font-bold tracking-tight mb-4">
            Simple, <span className="text-gradient">transparent</span> pricing
          </h2>
          <p className="text-lg text-[#8E99A4] max-w-xl mx-auto">
            Start with a 14-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                'relative rounded-2xl p-6 transition-all duration-500 group',
                tier.highlighted
                  ? 'bg-[#0D1520] border-2 border-[#00E676]/30 shadow-glow scale-[1.02]'
                  : 'bg-[#0D1520] border border-[rgba(142,153,164,0.1)] hover:border-[rgba(142,153,164,0.2)]'
              )}
            >
              {tier.badge && (
                <span className={cn('absolute -top-3 left-6', tier.highlighted ? 'badge-primary' : 'badge-neutral')}>
                  {tier.badge}
                </span>
              )}

              <div className="mb-6 pt-2">
                <h3 className="font-display font-bold text-xl mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-extrabold">{tier.price}</span>
                  <span className="text-sm text-[#8E99A4]">{tier.period}</span>
                </div>
                <p className="text-sm text-[#5A6570] mt-2">{tier.description}</p>
              </div>

              <div className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <Check size={14} className="text-[#00E676] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#B8C0C8]">{f}</span>
                  </div>
                ))}
              </div>

              <Link
                href={tier.highlighted ? '/signup' : '/contact'}
                className={cn(
                  'w-full text-center py-3 rounded-full text-sm font-semibold transition-all block',
                  tier.highlighted
                    ? 'btn-primary'
                    : 'btn-secondary'
                )}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════ */

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { q: 'Is SmartPlay only for soccer?', a: 'SmartPlay is optimized for soccer with position-specific features, but the core platform (training load, wellness, nutrition, video review) works for any sport. We\'re expanding sport-specific modules throughout 2026.' },
    { q: 'What age group is SmartPlay designed for?', a: 'SmartPlay is built for youth athletes ages 10–18 and their development ecosystems — coaches, parents, and clubs. The interface is designed to be intuitive for younger users while providing the analytical depth that serious athletes need.' },
    { q: 'Do I need any wearables or special equipment?', a: 'No. SmartPlay works entirely through manual logging and AI-driven insights. No GPS vest, no heart rate monitor, no expensive hardware. If you do have wearables, we\'re building integrations — but they\'re never required.' },
    { q: 'How does the 14-day free trial work?', a: 'Sign up with your email, start using every feature immediately. No credit card needed. After 14 days, your Player Membership begins at $12/month through Stripe. Cancel anytime — your data stays yours.' },
    { q: 'Can coaches see everything an athlete logs?', a: 'Coaches see training data, wellness scores, and video uploads. They cannot access private journal entries or personal reflections. We built SmartPlay with privacy-first permissions — athletes own their inner world.' },
    { q: 'Is my child\'s data safe?', a: 'Absolutely. We use encryption at rest and in transit, follow COPPA guidelines for minors, and never sell data. Parent accounts have oversight visibility without invasive access. Full details in our Privacy Policy.' },
  ]

  return (
    <section className="section-padding">
      <div className="max-w-[800px] mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <span className="badge-secondary mb-6 inline-flex">FAQ</span>
          <h2 className="font-display text-display-sm font-bold tracking-tight">
            Common questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-[rgba(142,153,164,0.08)] rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-medium text-[#F0F2F5] pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={cn('text-[#5A6570] transition-transform flex-shrink-0', openIndex === i && 'rotate-180')}
                />
              </button>
              <div className={cn(
                'overflow-hidden transition-all duration-300',
                openIndex === i ? 'max-h-60' : 'max-h-0'
              )}>
                <p className="px-6 pb-4 text-sm text-[#8E99A4] leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE ASSEMBLY
   ═══════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <SocialProofStrip />
        <ProblemSection />
        <FeaturesSection />
        <RolesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
