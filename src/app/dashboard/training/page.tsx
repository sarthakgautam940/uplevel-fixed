'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Plus, Activity, Clock, Zap, TrendingUp, Filter, Calendar } from 'lucide-react'

const sessions = [
  { id: '1', date: '2026-03-22', type: 'Team Practice', duration: 90, intensity: 4, rpe: 7, load: 630, notes: 'High tempo passing drills and small-sided games' },
  { id: '2', date: '2026-03-21', type: 'Individual', duration: 45, intensity: 3, rpe: 5, load: 225, notes: 'Weak foot shooting practice' },
  { id: '3', date: '2026-03-20', type: 'Match', duration: 80, intensity: 5, rpe: 9, load: 720, notes: 'League match vs Valley FC. Started, played full game.' },
  { id: '4', date: '2026-03-19', type: 'Fitness', duration: 60, intensity: 4, rpe: 8, load: 480, notes: 'Speed and agility circuit' },
  { id: '5', date: '2026-03-18', type: 'Recovery', duration: 30, intensity: 1, rpe: 2, load: 60, notes: 'Light jog and stretching' },
]

const typeColors: Record<string, string> = {
  'Team Practice': '#00E676', 'Individual': '#0A84FF', 'Match': '#FFD600', 'Fitness': '#E040FB', 'Recovery': '#8E99A4'
}

export default function TrainingPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'Team Practice', duration: '', intensity: 3, rpe: 5, notes: '' })

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Training Log</h1>
          <p className="text-sm text-[#8E99A4]">Track your sessions and monitor training load</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary !px-4 !py-2.5 text-sm gap-1.5">
          <Plus size={16} /> Log Session
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'This Week', value: '5', unit: 'sessions', icon: <Activity size={16} />, color: '#00E676' },
          { label: 'Total Time', value: '305', unit: 'min', icon: <Clock size={16} />, color: '#0A84FF' },
          { label: 'Avg Intensity', value: '3.4', unit: '/5', icon: <Zap size={16} />, color: '#FFD600' },
          { label: 'Weekly Load', value: '2,115', unit: 'AU', icon: <TrendingUp size={16} />, color: '#E040FB' },
        ].map((s) => (
          <div key={s.label} className="card-elevated p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}10`, color: s.color }}>{s.icon}</div>
              <span className="text-[11px] text-[#5A6570]">{s.label}</span>
            </div>
            <div className="text-2xl font-display font-bold">{s.value}<span className="text-xs text-[#8E99A4] ml-1">{s.unit}</span></div>
          </div>
        ))}
      </div>

      {/* New Session Form */}
      {showForm && (
        <div className="card-elevated p-6 mb-8">
          <h3 className="font-display font-semibold mb-4">New Training Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Type</label>
              <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="input-field">
                {['Team Practice','Individual','Match','Fitness','Recovery'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Duration (minutes)</label>
              <input type="number" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} placeholder="90" className="input-field" />
            </div>
            <div>
              <label className="input-label">Intensity (1-5)</label>
              <div className="flex gap-2 mt-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setForm({...form, intensity: n})}
                    className={cn('w-10 h-10 rounded-lg text-sm font-semibold transition-all', form.intensity === n ? 'bg-[#00E676] text-[#060B14]' : 'bg-[#141D2B] text-[#5A6570] hover:bg-[#1A2535]')}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="input-label">RPE (1-10)</label>
              <input type="range" min="1" max="10" value={form.rpe} onChange={(e) => setForm({...form, rpe: parseInt(e.target.value)})} className="w-full accent-[#00E676]" />
              <div className="text-center text-sm font-mono text-[#00E676]">{form.rpe}/10</div>
            </div>
            <div className="md:col-span-2">
              <label className="input-label">Notes</label>
              <textarea rows={2} value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} placeholder="What did you work on?" className="input-field resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-primary !py-2.5 text-sm">Save Session</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {/* Session List */}
      <div className="space-y-3">
        {sessions.map((s) => (
          <div key={s.id} className="card-elevated p-4 flex items-center gap-4 group hover:border-[rgba(142,153,164,0.2)] transition-all cursor-pointer">
            <div className="w-1 h-12 rounded-full" style={{ background: typeColors[s.type] || '#8E99A4' }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold">{s.type}</span>
                <span className="text-[10px] text-[#5A6570]">{new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <p className="text-xs text-[#8E99A4] truncate">{s.notes}</p>
            </div>
            <div className="hidden md:flex items-center gap-6 text-xs">
              <div className="text-center"><div className="text-[#5A6570] mb-0.5">Duration</div><div className="font-mono font-semibold">{s.duration}m</div></div>
              <div className="text-center"><div className="text-[#5A6570] mb-0.5">RPE</div><div className="font-mono font-semibold">{s.rpe}/10</div></div>
              <div className="text-center"><div className="text-[#5A6570] mb-0.5">Load</div><div className="font-mono font-semibold text-[#00E676]">{s.load}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
