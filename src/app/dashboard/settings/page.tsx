'use client'
import { useAuth } from '@/hooks/useAuth'
import { User, Bell, Shield, CreditCard, Palette } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="max-w-[700px] mx-auto">
      <h1 className="font-display text-2xl font-bold mb-8">Settings</h1>
      <div className="space-y-6">
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-4">
            <User size={20} className="text-[#0A84FF]" />
            <h3 className="font-display font-semibold">Profile</h3>
          </div>
          <div className="space-y-4">
            <div><label className="input-label">Name</label><input defaultValue={user?.name || ''} className="input-field" /></div>
            <div><label className="input-label">Email</label><input defaultValue={user?.email || ''} className="input-field" /></div>
          </div>
          <button className="btn-primary !py-2.5 text-sm mt-4">Save Changes</button>
        </div>

        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={20} className="text-[#FFD600]" />
            <h3 className="font-display font-semibold">Notifications</h3>
          </div>
          <div className="space-y-3">
            {['Daily readiness reminders','Coach feedback notifications','Weekly AI summaries','Goal milestone alerts'].map((n) => (
              <label key={n} className="flex items-center justify-between py-2">
                <span className="text-sm text-[#B8C0C8]">{n}</span>
                <div className="w-10 h-6 rounded-full bg-[#00E676] p-0.5 cursor-pointer"><div className="w-5 h-5 rounded-full bg-white translate-x-4" /></div>
              </label>
            ))}
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard size={20} className="text-[#00E676]" />
            <h3 className="font-display font-semibold">Subscription</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Player Membership</div>
              <div className="text-xs text-[#8E99A4]">{user?.subscription?.status === 'trialing' ? '14-day free trial' : '$12/month'}</div>
            </div>
            <span className="badge-primary">{user?.subscription?.status || 'active'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
