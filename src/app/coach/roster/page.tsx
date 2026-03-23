'use client'
import { Search, Filter, UserPlus, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const athletes = [
  { name: 'Jordan Rivera', position: 'Striker', readiness: 87, load: 2430, status: 'green', age: 16 },
  { name: 'Alex Thompson', position: 'Midfielder', readiness: 72, load: 1980, status: 'green', age: 15 },
  { name: 'Sam Kim', position: 'Defender', readiness: 45, load: 3200, status: 'red', age: 16 },
  { name: 'Morgan Davis', position: 'Goalkeeper', readiness: 91, load: 1650, status: 'green', age: 15 },
  { name: 'Casey Wilson', position: 'Winger', readiness: 62, load: 2100, status: 'yellow', age: 16 },
  { name: 'Riley Chen', position: 'Midfielder', readiness: 78, load: 2350, status: 'green', age: 17 },
]

export default function RosterPage() {
  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Team Roster</h1>
          <p className="text-sm text-[#8E99A4]">U17 Elite — 18 athletes</p>
        </div>
        <button className="btn-primary !px-4 !py-2.5 text-sm gap-1.5"><UserPlus size={16} /> Add Athlete</button>
      </div>

      {/* Quick overview */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card-elevated p-4 text-center">
          <div className="text-3xl font-display font-bold text-[#00E676]">79</div>
          <div className="text-xs text-[#5A6570]">Avg Readiness</div>
        </div>
        <div className="card-elevated p-4 text-center">
          <div className="text-3xl font-display font-bold text-[#FF5252]">2</div>
          <div className="text-xs text-[#5A6570]">At Risk</div>
        </div>
        <div className="card-elevated p-4 text-center">
          <div className="text-3xl font-display font-bold text-[#0A84FF]">5</div>
          <div className="text-xs text-[#5A6570]">Pending Reviews</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6570]" />
        <input placeholder="Search athletes..." className="input-field pl-10" />
      </div>

      {/* Athlete list */}
      <div className="space-y-2">
        {athletes.map((a) => (
          <div key={a.name} className="card-elevated p-4 flex items-center gap-4 cursor-pointer hover:border-[rgba(142,153,164,0.2)] transition-all group">
            <div className={cn('w-3 h-3 rounded-full', {
              'bg-[#00E676]': a.status === 'green',
              'bg-[#FFD600]': a.status === 'yellow',
              'bg-[#FF5252]': a.status === 'red',
            })} />
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00E676] to-[#0A84FF] flex items-center justify-center text-xs font-bold text-[#060B14]">
              {a.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold group-hover:text-[#00E676] transition-colors">{a.name}</div>
              <div className="text-[11px] text-[#5A6570]">{a.position} · Age {a.age}</div>
            </div>
            <div className="hidden md:flex items-center gap-8 text-xs">
              <div className="text-center">
                <div className="text-[#5A6570] mb-0.5">Readiness</div>
                <div className="font-mono font-semibold" style={{ color: a.readiness >= 80 ? '#00E676' : a.readiness >= 60 ? '#FFD600' : '#FF5252' }}>{a.readiness}</div>
              </div>
              <div className="text-center">
                <div className="text-[#5A6570] mb-0.5">Load</div>
                <div className="font-mono font-semibold">{a.load.toLocaleString()}</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#5A6570] group-hover:text-[#8E99A4]" />
          </div>
        ))}
      </div>
    </div>
  )
}
