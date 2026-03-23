'use client'
import { useState } from 'react'
import { Plus, Target, CheckCircle2, Circle, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const demoGoals = [
  { id: '1', title: 'Improve weak foot accuracy to 70%', category: 'Technical', progress: 65, status: 'active', milestones: [{ text: '50 weak foot shots per week', done: true }, { text: 'Use weak foot in 1v1 drills', done: true }, { text: 'Score 3 weak foot goals in matches', done: false }] },
  { id: '2', title: 'Average 8 hours sleep per week', category: 'Recovery', progress: 82, status: 'active', milestones: [{ text: 'Set consistent bedtime', done: true }, { text: 'No screens 30min before bed', done: true }, { text: 'Maintain for 4 weeks', done: false }] },
  { id: '3', title: 'Score 5 goals this month', category: 'Performance', progress: 40, status: 'active', milestones: [{ text: 'Goal 1', done: true }, { text: 'Goal 2', done: true }, { text: 'Goals 3-5', done: false }] },
]

const categoryColors: Record<string, string> = { Technical: '#00E676', Recovery: '#0A84FF', Performance: '#FFD600', Mental: '#E040FB', Nutrition: '#FF5252' }

export default function GoalsPage() {
  const [goals] = useState(demoGoals)
  return (
    <div className="max-w-[800px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Goals</h1>
          <p className="text-sm text-[#8E99A4]">Set targets, track milestones, build momentum</p>
        </div>
        <button className="btn-primary !px-4 !py-2.5 text-sm gap-1.5"><Plus size={16} /> New Goal</button>
      </div>
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="card-elevated p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge text-[9px]" style={{ background: `${categoryColors[goal.category]}15`, color: categoryColors[goal.category], border: `1px solid ${categoryColors[goal.category]}30` }}>{goal.category}</span>
                </div>
                <h3 className="font-display font-semibold">{goal.title}</h3>
              </div>
              <span className="text-2xl font-display font-bold" style={{ color: categoryColors[goal.category] }}>{goal.progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[rgba(142,153,164,0.08)] mb-4 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${goal.progress}%`, background: categoryColors[goal.category] }} />
            </div>
            <div className="space-y-2">
              {goal.milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {m.done ? <CheckCircle2 size={16} className="text-[#00E676]" /> : <Circle size={16} className="text-[#5A6570]" />}
                  <span className={cn('text-sm', m.done ? 'text-[#8E99A4] line-through' : 'text-[#F0F2F5]')}>{m.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
