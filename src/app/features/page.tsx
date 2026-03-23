import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Activity, Apple, Heart, Brain, Video, Sparkles, Target, Calendar, Users, BarChart3, ArrowRight } from 'lucide-react'

const features = [
  { icon: <Activity size={28} />, title: 'Training Intelligence', desc: 'Log sessions with RPE, duration, and intensity. Track acute and chronic training load ratios. Get AI-powered overtraining alerts before injuries happen.', color: '#00E676', details: ['Session logging with RPE and intensity','Acute:chronic workload ratio tracking','AI overtraining risk detection','Drill library with equipment-light options','Coach-assigned training plans'] },
  { icon: <Apple size={28} />, title: 'Nutrition & Hydration', desc: 'Track meals, hydration, and macros. Get budget-friendly meal suggestions based on training load. Pre and post-training nutrition guidance.', color: '#0A84FF', details: ['Meal logging with macro tracking','Budget-friendly AI meal suggestions','Pre/post training nutrition tips','Hydration tracking with targets','Dietary preference support'] },
  { icon: <Heart size={28} />, title: 'Recovery & Wellness', desc: 'Daily readiness scoring from sleep, mood, soreness, energy, and stress. Visual trends show patterns. Alerts flag declining wellness.', color: '#FFD600', details: ['Daily readiness score (0-100)','Sleep quality and duration tracking','Mood, energy, and stress logging','Soreness body map','Automated recovery recommendations'] },
  { icon: <Brain size={28} />, title: 'Mental Performance', desc: 'Guided journaling, pre-game visualization, mindset tracking. Build mental resilience with evidence-based psychological tools.', color: '#E040FB', details: ['Guided reflection prompts','Pre-game visualization exercises','Mood and mindset tracking','Private journal (coach-invisible)','AI-generated mental performance insights'] },
  { icon: <Video size={28} />, title: 'Video Review', desc: 'Upload clips, tag key moments, get AI-generated technical feedback. Coaches can assign video homework and leave comments.', color: '#FF5252', details: ['Upload and organize clips','AI-powered clip analysis','Tag and timestamp moments','Coach comment threads','Video homework assignments'] },
  { icon: <Sparkles size={28} />, title: 'SmartPlay AI', desc: 'Weekly performance summaries, personalized recommendations, training adjustments, and contextual coaching — all generated from your logged data.', color: '#00E676', details: ['Weekly AI performance summaries','Personalized drill recommendations','Recovery and nutrition advice','Contextual coaching insights','Progress trend analysis'] },
]

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <span className="badge-primary mb-6 inline-flex">Features</span>
            <h1 className="font-display text-display-sm font-bold tracking-tight mb-4">
              Six modules, <span className="text-gradient">one platform</span>
            </h1>
            <p className="text-lg text-[#8E99A4] max-w-2xl mx-auto">
              Every feature works together to create a complete athlete development ecosystem.
            </p>
          </div>

          <div className="space-y-16">
            {features.map((feature, i) => (
              <div key={feature.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ background: `${feature.color}10`, color: feature.color }}>
                    {feature.icon}
                  </div>
                  <h2 className="font-display text-heading font-bold mb-3">{feature.title}</h2>
                  <p className="text-[#8E99A4] mb-6 leading-relaxed">{feature.desc}</p>
                  <div className="space-y-2.5">
                    {feature.details.map((d) => (
                      <div key={d} className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: feature.color }} />
                        <span className="text-sm text-[#B8C0C8]">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`card-elevated p-8 rounded-2xl ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="aspect-[4/3] rounded-xl bg-[rgba(142,153,164,0.04)] border border-[rgba(142,153,164,0.06)] flex items-center justify-center">
                    <div style={{ color: feature.color, opacity: 0.3 }}>{feature.icon}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <h2 className="font-display text-heading font-bold mb-4">Ready to get started?</h2>
            <p className="text-[#8E99A4] mb-8">14-day free trial. No credit card required.</p>
            <Link href="/signup" className="btn-primary text-base gap-2">
              Start Free Trial <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
