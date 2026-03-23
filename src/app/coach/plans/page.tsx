'use client'
import { Plus, Calendar, Clock, Zap } from 'lucide-react'

const plans = [
  { id: '1', title: 'Pre-Season Fitness Block', dates: 'Mar 15 – Apr 5', sessions: 12, focus: 'Endurance + Speed', status: 'active' },
  { id: '2', title: 'Technical Week — Ball Control', dates: 'Mar 22 – 28', sessions: 5, focus: 'First touch + Passing', status: 'active' },
  { id: '3', title: 'Match Day Prep Template', dates: 'Reusable', sessions: 3, focus: 'Activation + Tactical', status: 'template' },
]

export default function PlansPage() {
  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Training Plans</h1>
          <p className="text-sm text-[#8E99A4]">Build and assign training plans for your team</p>
        </div>
        <button className="btn-primary !px-4 !py-2.5 text-sm gap-1.5"><Plus size={16} /> New Plan</button>
      </div>
      <div className="space-y-4">
        {plans.map((p) => (
          <div key={p.id} className="card-elevated p-5 cursor-pointer hover:border-[rgba(142,153,164,0.2)] transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display font-semibold mb-1">{p.title}</h3>
                <div className="flex items-center gap-4 text-xs text-[#5A6570]">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {p.dates}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {p.sessions} sessions</span>
                  <span className="flex items-center gap-1"><Zap size={12} /> {p.focus}</span>
                </div>
              </div>
              <span className={p.status === 'active' ? 'badge-primary' : 'badge-neutral'}>{p.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
