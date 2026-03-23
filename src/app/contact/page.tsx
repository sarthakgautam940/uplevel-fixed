'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Send, Mail, MessageSquare, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="badge-secondary mb-6 inline-flex"><MessageSquare size={12} /> Contact</span>
            <h1 className="font-display text-display-sm font-bold tracking-tight mb-4">Get in touch</h1>
            <p className="text-lg text-[#8E99A4]">Questions about SmartPlay? We&apos;d love to hear from you.</p>
          </div>

          {submitted ? (
            <div className="text-center py-16">
              <CheckCircle2 size={48} className="text-[#00E676] mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">Message sent!</h2>
              <p className="text-[#8E99A4]">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="input-label">Name</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Your name" className="input-field" />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="you@example.com" className="input-field" />
                </div>
              </div>
              <div>
                <label className="input-label">I am a...</label>
                <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="input-field">
                  <option value="">Select your role</option>
                  <option value="athlete">Athlete</option>
                  <option value="coach">Coach</option>
                  <option value="parent">Parent</option>
                  <option value="club">Club / Organization</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="input-label">Message</label>
                <textarea rows={5} required value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} placeholder="How can we help?" className="input-field resize-none" />
              </div>
              <button type="submit" className="btn-primary gap-2">
                <Send size={16} /> Send Message
              </button>
            </form>
          )}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-surface p-6 text-center">
              <Mail size={24} className="text-[#0A84FF] mx-auto mb-3" />
              <h3 className="font-display font-semibold mb-1">Email Us</h3>
              <a href="mailto:hello@smartplay.io" className="text-sm text-[#0A84FF] hover:text-[#4DA6FF]">hello@smartplay.io</a>
            </div>
            <div className="card-surface p-6 text-center">
              <MessageSquare size={24} className="text-[#00E676] mx-auto mb-3" />
              <h3 className="font-display font-semibold mb-1">Discord Community</h3>
              <a href="#" className="text-sm text-[#00E676] hover:text-[#69F0AE]">Join our Discord</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
