'use client'
import { useState } from 'react'
import { Heart, Moon, Zap, Brain, Activity, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function RecoveryPage() {
  const [wellness, setWellness] = useState({ sleep: 8.2, sleepQuality: 4, mood: 4, energy: 4, soreness: 2, stress: 2 })
  const readiness = Math.round(((wellness.sleepQuality + wellness.mood + wellness.energy + (6 - wellness.soreness) + (6 - wellness.stress)) / 25) * 100)

  const fields = [
    { key: 'sleepQuality', label: 'Sleep Quality', icon: <Moon size={18} />, color: '#0A84FF' },
    { key: 'mood', label: 'Mood', icon: <Brain size={18} />, color: '#E040FB' },
    { key: 'energy', label: 'Energy', icon: <Zap size={18} />, color: '#FFD600' },
    { key: 'soreness', label: 'Soreness', icon: <Activity size={18} />, color: '#FF5252', inverted: true },
    { key: 'stress', label: 'Stress', icon: <Heart size={18} />, color: '#FF5252', inverted: true },
  ]

  return (
    <div className="max-w-[800px] mx-auto">
      <h1 className="font-display text-2xl font-bold mb-1">Recovery & Wellness</h1>
      <p className="text-sm text-[#8E99A4] mb-8">Log your daily wellness check-in and track readiness</p>

      {/* Readiness Score */}
      <div className="card-elevated p-6 mb-8 text-center">
        <div className="text-xs text-[#8E99A4] mb-2">Today&apos;s Readiness Score</div>
        <div className="text-6xl font-display font-bold mb-2" style={{ color: readiness >= 80 ? '#00E676' : readiness >= 60 ? '#FFD600' : '#FF5252' }}>{readiness}</div>
        <div className="text-sm" style={{ color: readiness >= 80 ? '#00E676' : readiness >= 60 ? '#FFD600' : '#FF5252' }}>
          {readiness >= 80 ? 'Optimal — great day to push' : readiness >= 60 ? 'Good — moderate intensity recommended' : 'Low — consider a recovery day'}
        </div>
        <div className="mt-4 h-2 rounded-full bg-[rgba(142,153,164,0.08)] max-w-md mx-auto overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${readiness}%`, background: readiness >= 80 ? '#00E676' : readiness >= 60 ? '#FFD600' : '#FF5252' }} />
        </div>
      </div>

      {/* Wellness Inputs */}
      <div className="card-elevated p-6 mb-8">
        <h3 className="font-display font-semibold mb-6">Daily Check-in</h3>
        <div className="space-y-6">
          <div>
            <label className="input-label">Hours of Sleep</label>
            <input type="number" step="0.1" value={wellness.sleep} onChange={(e) => setWellness({...wellness, sleep: parseFloat(e.target.value) || 0})} className="input-field max-w-xs" />
          </div>
          {fields.map((f) => (
            <div key={f.key}>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ color: f.color }}>{f.icon}</span>
                <span className="text-sm font-medium">{f.label}</span>
                <span className="text-xs text-[#5A6570] ml-auto">{(wellness as any)[f.key]}/5</span>
              </div>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setWellness({...wellness, [f.key]: n})}
                    className={cn('flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all',
                      (wellness as any)[f.key] === n ? 'text-[#060B14]' : 'bg-[#141D2B] text-[#5A6570] hover:bg-[#1A2535]'
                    )}
                    style={(wellness as any)[f.key] === n ? { background: f.color } : undefined}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="btn-primary mt-6 text-sm">Save Check-in</button>
      </div>

      {/* AI Insight */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-[#00E676]" />
          <span className="text-xs font-semibold text-[#00E676]">Recovery AI</span>
        </div>
        <p className="text-sm text-[#B8C0C8]">Your soreness is low and energy is high. Sleep has been consistent (8+ hours for 4 consecutive days). This is an excellent recovery window — your body is ready for high-intensity work today.</p>
      </div>
    </div>
  )
}
