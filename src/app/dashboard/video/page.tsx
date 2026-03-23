'use client'
import { Upload, Play, MessageSquare, Sparkles, Filter } from 'lucide-react'

const clips = [
  { id: '1', title: 'Match Highlights vs Valley FC', date: 'Mar 20', duration: '3:24', tags: ['match','highlights'], feedback: true, ai: true },
  { id: '2', title: 'Weak Foot Shooting Drill', date: 'Mar 19', duration: '1:45', tags: ['individual','shooting'], feedback: false, ai: true },
  { id: '3', title: '1v1 Defending Practice', date: 'Mar 17', duration: '2:10', tags: ['defending','1v1'], feedback: true, ai: false },
]

export default function VideoPage() {
  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Video Review</h1>
          <p className="text-sm text-[#8E99A4]">Upload clips, get AI feedback, improve your game</p>
        </div>
        <button className="btn-primary !px-4 !py-2.5 text-sm gap-1.5"><Upload size={16} /> Upload Clip</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clips.map((clip) => (
          <div key={clip.id} className="card-surface overflow-hidden group cursor-pointer">
            <div className="aspect-video bg-[rgba(142,153,164,0.06)] flex items-center justify-center relative">
              <Play size={36} className="text-[#5A6570] group-hover:text-[#00E676] transition-colors" />
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-white">{clip.duration}</span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold mb-1 group-hover:text-[#00E676] transition-colors">{clip.title}</h3>
              <div className="text-[11px] text-[#5A6570] mb-2">{clip.date}</div>
              <div className="flex items-center gap-2">
                {clip.tags.map(t => <span key={t} className="badge-neutral text-[9px]">{t}</span>)}
                {clip.feedback && <span className="badge-secondary text-[9px] gap-1"><MessageSquare size={8} /> Feedback</span>}
                {clip.ai && <span className="badge-primary text-[9px] gap-1"><Sparkles size={8} /> AI</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
