'use client'
import { useState } from 'react'
import { BookOpen, Plus, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

const entries = [
  { id: '1', date: 'Mar 22, 2026', mood: 'great', content: 'Feeling really focused today. Pre-game visualization helped me feel calm before the match. I scored twice and felt confident on the ball.' },
  { id: '2', date: 'Mar 20, 2026', mood: 'good', content: 'Good training session. Coach praised my positioning. Need to work on communication with the backline during transitions.' },
  { id: '3', date: 'Mar 18, 2026', mood: 'okay', content: 'Tough day at school, felt distracted during practice. Recognized it early and used breathing exercises to refocus. Finished strong.' },
]

const moodEmoji: Record<string, string> = { great: '🔥', good: '😊', okay: '😐', tough: '😔', struggling: '💪' }

export default function JournalPage() {
  return (
    <div className="max-w-[700px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Journal</h1>
          <div className="flex items-center gap-2 text-sm text-[#8E99A4]">
            <Lock size={12} /> Private — only visible to you
          </div>
        </div>
        <button className="btn-primary !px-4 !py-2.5 text-sm gap-1.5"><Plus size={16} /> New Entry</button>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="card-elevated p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#5A6570]">{entry.date}</span>
              <span className="text-lg">{moodEmoji[entry.mood]}</span>
            </div>
            <p className="text-sm text-[#B8C0C8] leading-relaxed">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
