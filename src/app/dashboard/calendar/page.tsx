'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const events = [
  { date: 22, title: 'Team Practice', time: '4:00 PM', color: '#00E676' },
  { date: 23, title: 'Match vs Valley FC', time: '9:00 AM', color: '#FFD600' },
  { date: 24, title: 'Recovery Day', time: 'All Day', color: '#E040FB' },
  { date: 25, title: 'Individual Training', time: '3:30 PM', color: '#0A84FF' },
  { date: 26, title: 'Team Practice', time: '4:00 PM', color: '#00E676' },
  { date: 28, title: 'Fitness Testing', time: '10:00 AM', color: '#FF5252' },
]

export default function CalendarPage() {
  const [currentMonth] = useState(new Date(2026, 2)) // March 2026
  const daysInMonth = new Date(2026, 3, 0).getDate()
  const firstDay = new Date(2026, 2, 1).getDay()
  const today = 22

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Calendar</h1>
          <p className="text-sm text-[#8E99A4]">Plan your training schedule</p>
        </div>
        <button className="btn-primary !px-4 !py-2.5 text-sm gap-1.5"><Plus size={16} /> Add Event</button>
      </div>

      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-6">
          <button className="p-2 rounded-lg hover:bg-[rgba(142,153,164,0.06)]"><ChevronLeft size={20} className="text-[#8E99A4]" /></button>
          <h3 className="font-display font-semibold text-lg">March 2026</h3>
          <button className="p-2 rounded-lg hover:bg-[rgba(142,153,164,0.06)]"><ChevronRight size={20} className="text-[#8E99A4]" /></button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="text-center text-[11px] text-[#5A6570] font-semibold py-2">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayEvents = events.filter(e => e.date === day)
            const isToday = day === today
            return (
              <div key={day} className={cn(
                'min-h-[80px] p-2 rounded-lg border transition-colors cursor-pointer',
                isToday ? 'border-[#00E676]/30 bg-[rgba(0,230,118,0.04)]' : 'border-transparent hover:bg-[rgba(142,153,164,0.04)]'
              )}>
                <span className={cn('text-xs font-semibold', isToday ? 'text-[#00E676]' : 'text-[#8E99A4]')}>{day}</span>
                {dayEvents.map((e, ei) => (
                  <div key={ei} className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-medium truncate" style={{ background: `${e.color}15`, color: e.color }}>
                    {e.title}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
