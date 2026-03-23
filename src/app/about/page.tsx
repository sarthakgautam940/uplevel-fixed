import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Shield, Heart, Zap, Users, Globe, Award } from 'lucide-react'

const values = [
  { icon: <Shield size={24} />, title: 'Equity First', desc: 'Elite-level tools shouldn\'t require elite-level budgets. SmartPlay works without wearables, expensive hardware, or premium club infrastructure.', color: '#00E676' },
  { icon: <Heart size={24} />, title: 'Privacy by Design', desc: 'Athletes own their inner world. Coaches see performance data — never private journals. Parents get oversight without surveillance.', color: '#0A84FF' },
  { icon: <Zap size={24} />, title: 'Science-Backed', desc: 'Every metric, every recommendation, every AI insight is grounded in sports science. No guesswork. No gimmicks.', color: '#FFD600' },
  { icon: <Users size={24} />, title: 'Community Centered', desc: 'Built for the whole development ecosystem — athletes, coaches, parents, and clubs working together.', color: '#E040FB' },
  { icon: <Globe size={24} />, title: 'Accessible Everywhere', desc: 'Web-first design that works on any device. No app store required. Budget-friendly recommendations for every family.', color: '#FF5252' },
  { icon: <Award size={24} />, title: 'Development Over Results', desc: 'SmartPlay measures growth, consistency, and well-being — not just wins and losses. Long-term development wins.', color: '#00E676' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-[960px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="badge-secondary mb-6 inline-flex">About SmartPlay</span>
            <h1 className="font-display text-display-sm font-bold tracking-tight mb-6">
              Leveling the <span className="text-gradient">playing field</span>
            </h1>
            <p className="text-lg text-[#8E99A4] max-w-2xl mx-auto leading-relaxed">
              SmartPlay was born from a simple observation: the tools that help professional athletes optimize their performance don&apos;t exist for the millions of youth athletes who need them most. We&apos;re changing that.
            </p>
          </div>

          <div className="mb-20">
            <h2 className="font-display text-heading font-bold text-center mb-10">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v) => (
                <div key={v.title} className="card-surface p-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${v.color}10`, color: v.color }}>
                    {v.icon}
                  </div>
                  <h3 className="font-display font-semibold text-base mb-2">{v.title}</h3>
                  <p className="text-sm text-[#8E99A4] leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-display text-heading font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-[#8E99A4] max-w-2xl mx-auto leading-relaxed">
              To give every youth athlete — regardless of their family&apos;s budget, their club&apos;s resources, or their access to technology — the same caliber of performance intelligence that was previously reserved for elite programs. Development should be democratic.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
