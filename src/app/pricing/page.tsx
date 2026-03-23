import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const tiers = [
  {
    name: 'Player', price: '$12', period: '/month', description: 'Full access for individual athletes.',
    features: ['Full athlete dashboard','Training & wellness logging','Nutrition planner + AI suggestions','Video upload & AI clip review','Goal tracking with streaks','Mental performance journal','Weekly AI summaries','Recruiting profile page'],
    cta: 'Start 14-Day Free Trial', highlighted: true, badge: 'Most Popular',
  },
  {
    name: 'Coach', price: '$49', period: '/month', description: 'Manage your team with full visibility.',
    features: ['Everything in Player','Team roster management','Readiness & risk dashboard','Training plan builder','Video review assignments','Team announcements','Performance comparison tools','Up to 25 athletes included'],
    cta: 'Coming Soon', highlighted: false, badge: 'Teams',
  },
  {
    name: 'Program', price: '$199', period: '/month', description: 'Multi-team management for clubs and academies.',
    features: ['Everything in Coach','Unlimited teams & athletes','Admin & director dashboards','Custom branding','API access','Priority support','Bulk onboarding tools','Annual reporting & exports'],
    cta: 'Contact Sales', highlighted: false, badge: 'Organizations',
  },
]

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <span className="badge-accent mb-6 inline-flex"><Sparkles size={12} /> Pricing</span>
            <h1 className="font-display text-display-sm font-bold tracking-tight mb-4">
              Simple, <span className="text-gradient">transparent</span> pricing
            </h1>
            <p className="text-lg text-[#8E99A4] max-w-xl mx-auto">
              Start with a 14-day free trial. No credit card required. Cancel anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier) => (
              <div key={tier.name} className={cn(
                'relative rounded-2xl p-6 transition-all duration-500',
                tier.highlighted ? 'bg-[#0D1520] border-2 border-[#00E676]/30 shadow-glow scale-[1.02]' : 'bg-[#0D1520] border border-[rgba(142,153,164,0.1)]'
              )}>
                {tier.badge && <span className={cn('absolute -top-3 left-6', tier.highlighted ? 'badge-primary' : 'badge-neutral')}>{tier.badge}</span>}
                <div className="mb-6 pt-2">
                  <h3 className="font-display font-bold text-xl mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-extrabold">{tier.price}</span>
                    <span className="text-sm text-[#8E99A4]">{tier.period}</span>
                  </div>
                  <p className="text-sm text-[#5A6570] mt-2">{tier.description}</p>
                </div>
                <div className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#00E676] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#B8C0C8]">{f}</span>
                    </div>
                  ))}
                </div>
                <Link href={tier.highlighted ? '/signup' : '/contact'} className={cn('w-full text-center py-3 rounded-full text-sm font-semibold transition-all block', tier.highlighted ? 'btn-primary' : 'btn-secondary')}>
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
