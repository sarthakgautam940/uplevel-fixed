'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Activity, TrendingUp, TrendingDown, Moon, Droplets, Zap,
  Target, Calendar, ChevronRight, Plus, Sparkles, Flame,
  ArrowUpRight, AlertTriangle, CheckCircle2
} from 'lucide-react'

const readinessData = [72, 68, 75, 80, 77, 82, 85, 78, 84, 88, 86, 90, 87, 89]
const loadData = [280, 340, 300, 410, 380, 450, 320]
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function DashboardPage() {
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const readiness = 87
  const readinessStatus = readiness >= 80 ? 'Optimal' : readiness >= 60 ? 'Good' : 'Low'
  const readinessColor = readiness >= 80 ? '#00E676' : readiness >= 60 ? '#FFD600' : '#FF5252'

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Good Morning, Jordan</h1>
          <p className="text-sm text-[#8E99A4]">Here&apos;s your performance snapshot for today</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge-primary gap-1.5">
            <Flame size={12} />
            12-Day Streak
          </span>
          <button onClick={() => setShowQuickAdd(!showQuickAdd)} className="btn-primary !px-4 !py-2.5 text-sm gap-1.5">
            <Plus size={16} /> Log Session
          </button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Readiness Score - Featured */}
        <div className="col-span-2 lg:col-span-1 card-elevated p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: `radial-gradient(circle, ${readinessColor}15, transparent)` }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${readinessColor}15`, color: readinessColor }}>
                <Zap size={16} />
              </div>
              <span className="text-xs text-[#8E99A4] font-medium">Readiness</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-bold" style={{ color: readinessColor }}>{readiness}</span>
              <span className="text-xs font-semibold" style={{ color: readinessColor }}>{readinessStatus}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUp size={12} className="text-[#00E676]" />
              <span className="text-[11px] text-[#00E676]">+5 from yesterday</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-[rgba(142,153,164,0.08)] overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${readiness}%`, background: `linear-gradient(90deg, ${readinessColor}, ${readinessColor}80)` }} />
            </div>
          </div>
        </div>

        {/* Sleep */}
        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(10,132,255,0.1)] flex items-center justify-center text-[#0A84FF]"><Moon size={16} /></div>
            <span className="text-xs text-[#8E99A4] font-medium">Sleep</span>
          </div>
          <div className="text-3xl font-display font-bold text-[#F0F2F5]">8.2<span className="text-sm text-[#8E99A4] font-normal ml-1">hrs</span></div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="text-[11px] text-[#0A84FF]">Quality: 4/5</div>
          </div>
        </div>

        {/* Hydration */}
        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(0,230,118,0.1)] flex items-center justify-center text-[#00E676]"><Droplets size={16} /></div>
            <span className="text-xs text-[#8E99A4] font-medium">Hydration</span>
          </div>
          <div className="text-3xl font-display font-bold text-[#F0F2F5]">2.1<span className="text-sm text-[#8E99A4] font-normal ml-1">L</span></div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="text-[11px] text-[#FFD600]">Target: 2.5L</div>
          </div>
        </div>

        {/* Weekly Load */}
        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(255,214,0,0.1)] flex items-center justify-center text-[#FFD600]"><Activity size={16} /></div>
            <span className="text-xs text-[#8E99A4] font-medium">Weekly Load</span>
          </div>
          <div className="text-3xl font-display font-bold text-[#F0F2F5]">2,430<span className="text-sm text-[#8E99A4] font-normal ml-1">AU</span></div>
          <div className="flex items-center gap-1.5 mt-1">
            <TrendingUp size={12} className="text-[#00E676]" />
            <div className="text-[11px] text-[#00E676]">+8% vs last week</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Readiness Trend */}
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-sm">Readiness Trend</h3>
                <p className="text-xs text-[#5A6570]">Last 14 days</p>
              </div>
              <span className="badge-primary text-[10px] gap-1"><Sparkles size={10} /> AI Insight Available</span>
            </div>
            <div className="flex items-end gap-1.5 h-40">
              {readinessData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80 cursor-pointer relative group"
                    style={{
                      height: `${(v / 100) * 100}%`,
                      background: v >= 80 ? 'linear-gradient(to top, rgba(0,230,118,0.7), rgba(0,230,118,0.2))'
                        : v >= 60 ? 'linear-gradient(to top, rgba(10,132,255,0.7), rgba(10,132,255,0.2))'
                          : 'linear-gradient(to top, rgba(255,214,0,0.7), rgba(255,214,0,0.2))'
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[#141D2B] text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {v}/100
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[9px] text-[#5A6570]">
              <span>14d ago</span><span>7d ago</span><span>Today</span>
            </div>
          </div>

          {/* Training Load Chart */}
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-sm">Training Load — This Week</h3>
                <p className="text-xs text-[#5A6570]">Acute vs Chronic load ratio</p>
              </div>
              <div className="flex gap-3 text-[10px]">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#0A84FF]" />Acute</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#5A6570]" />Chronic</span>
              </div>
            </div>
            <div className="flex items-end gap-3 h-32">
              {loadData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm" style={{
                    height: `${(v / 500) * 100}%`,
                    background: 'linear-gradient(to top, rgba(10,132,255,0.7), rgba(10,132,255,0.15))'
                  }} />
                  <span className="text-[9px] text-[#5A6570]">{daysOfWeek[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Widgets */}
        <div className="space-y-6">
          {/* AI Insight */}
          <div className="card-elevated p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: 'radial-gradient(circle, rgba(0,230,118,0.08), transparent)' }} />
            <div className="flex items-center gap-2 mb-3 relative">
              <Sparkles size={16} className="text-[#00E676]" />
              <span className="text-xs font-semibold text-[#00E676]">SmartPlay AI</span>
            </div>
            <p className="text-sm text-[#B8C0C8] leading-relaxed relative">
              Your readiness is excellent today (87/100). Great conditions for high-intensity work.
              Consider adding finishing drills or 1v1 scenarios. Recovery looks strong — sleep quality
              has been consistent this week.
            </p>
          </div>

          {/* Upcoming */}
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-sm">Upcoming</h3>
              <ChevronRight size={16} className="text-[#5A6570]" />
            </div>
            <div className="space-y-3">
              {[
                { time: '4:00 PM', event: 'Team Practice', type: 'practice', color: '#00E676' },
                { time: '6:30 PM', event: 'Post-Training Meal', type: 'nutrition', color: '#0A84FF' },
                { time: 'Tomorrow 9 AM', event: 'Match vs Valley FC', type: 'match', color: '#FFD600' },
                { time: 'Thu', event: 'Recovery Day', type: 'rest', color: '#E040FB' },
              ].map((item) => (
                <div key={item.event} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-1 h-10 rounded-full" style={{ background: item.color }} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#F0F2F5] group-hover:text-[#00E676] transition-colors">{item.event}</div>
                    <div className="text-[11px] text-[#5A6570]">{item.time}</div>
                  </div>
                  <ArrowUpRight size={14} className="text-[#5A6570] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Goals Progress */}
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-sm">Active Goals</h3>
              <span className="text-xs text-[#00E676] font-medium">3/5 on track</span>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Improve weak foot accuracy', progress: 65, color: '#00E676' },
                { title: '8hrs sleep avg per week', progress: 82, color: '#0A84FF' },
                { title: 'Score 5 goals this month', progress: 40, color: '#FFD600' },
              ].map((goal) => (
                <div key={goal.title}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[#B8C0C8]">{goal.title}</span>
                    <span className="text-xs font-mono" style={{ color: goal.color }}>{goal.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[rgba(142,153,164,0.08)] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${goal.progress}%`, background: goal.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="card-elevated p-5">
            <h3 className="font-display font-semibold text-sm mb-4">Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-xs">
                <AlertTriangle size={14} className="text-[#FFD600] mt-0.5 flex-shrink-0" />
                <span className="text-[#B8C0C8]">Hydration below target 2 of last 3 days. Consider increasing water intake before training.</span>
              </div>
              <div className="flex items-start gap-3 text-xs">
                <CheckCircle2 size={14} className="text-[#00E676] mt-0.5 flex-shrink-0" />
                <span className="text-[#B8C0C8]">Sleep consistency has improved 15% this week. Great work!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
