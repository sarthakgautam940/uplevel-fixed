'use client'
import { Play, MessageSquare, CheckCircle2 } from 'lucide-react'

const reviews = [
  { id: '1', athlete: 'Jordan Rivera', title: 'Match Highlights vs Valley FC', date: 'Mar 20', status: 'pending' },
  { id: '2', athlete: 'Alex Thompson', title: 'Passing Drill Submission', date: 'Mar 19', status: 'pending' },
  { id: '3', athlete: 'Casey Wilson', title: 'Sprint Technique Video', date: 'Mar 18', status: 'reviewed' },
]

export default function ReviewPage() {
  return (
    <div className="max-w-[1000px] mx-auto">
      <h1 className="font-display text-2xl font-bold mb-1">Video Review</h1>
      <p className="text-sm text-[#8E99A4] mb-8">Review athlete submissions and provide feedback</p>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="card-elevated p-4 flex items-center gap-4 cursor-pointer hover:border-[rgba(142,153,164,0.2)] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[rgba(142,153,164,0.06)] flex items-center justify-center">
              <Play size={20} className="text-[#5A6570]" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{r.title}</div>
              <div className="text-[11px] text-[#5A6570]">{r.athlete} · {r.date}</div>
            </div>
            {r.status === 'pending' ? (
              <span className="badge-accent text-[9px]">Needs Review</span>
            ) : (
              <span className="badge-primary text-[9px] gap-1"><CheckCircle2 size={10} /> Reviewed</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
