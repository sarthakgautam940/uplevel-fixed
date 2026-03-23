'use client'
import { useState } from 'react'
import { Plus, Apple, Droplets, Sparkles, TrendingUp } from 'lucide-react'

const meals = [
  { id: '1', meal: 'Breakfast', desc: 'Oatmeal with banana, honey, and peanut butter', time: '7:30 AM', calories: 420, protein: 14, carbs: 68, fats: 12 },
  { id: '2', meal: 'Pre-Training', desc: 'Whole wheat toast with jam + orange juice', time: '3:00 PM', calories: 280, protein: 6, carbs: 52, fats: 4 },
  { id: '3', meal: 'Post-Training', desc: 'Chocolate milk + banana', time: '5:30 PM', calories: 350, protein: 16, carbs: 54, fats: 8 },
  { id: '4', meal: 'Dinner', desc: 'Chicken stir-fry with rice and vegetables', time: '7:00 PM', calories: 580, protein: 35, carbs: 72, fats: 14 },
]

export default function NutritionPage() {
  const totalCals = meals.reduce((a, m) => a + m.calories, 0)
  const totalProtein = meals.reduce((a, m) => a + m.protein, 0)

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Nutrition</h1>
          <p className="text-sm text-[#8E99A4]">Track meals, hydration, and get AI-powered suggestions</p>
        </div>
        <button className="btn-primary !px-4 !py-2.5 text-sm gap-1.5"><Plus size={16} /> Log Meal</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Calories', value: totalCals.toLocaleString(), target: '2,200', color: '#00E676' },
          { label: 'Protein', value: `${totalProtein}g`, target: '120g', color: '#0A84FF' },
          { label: 'Hydration', value: '2.1L', target: '2.5L', color: '#4DA6FF' },
          { label: 'Meals Today', value: meals.length.toString(), target: '5', color: '#FFD600' },
        ].map((s) => (
          <div key={s.label} className="card-elevated p-4">
            <div className="text-[11px] text-[#5A6570] mb-1">{s.label}</div>
            <div className="text-2xl font-display font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-[#5A6570]">Target: {s.target}</div>
          </div>
        ))}
      </div>

      {/* AI Suggestion */}
      <div className="card-elevated p-5 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 -translate-y-1/2 translate-x-1/2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,230,118,0.08), transparent)' }} />
        <div className="flex items-center gap-2 mb-2 relative">
          <Sparkles size={16} className="text-[#00E676]" />
          <span className="text-xs font-semibold text-[#00E676]">AI Nutrition Tip</span>
        </div>
        <p className="text-sm text-[#B8C0C8] relative">You have a match tomorrow. Consider adding a carb-rich dinner tonight (pasta, rice, or sweet potatoes) to maximize glycogen stores. Budget option: rice and beans with vegetables — high carb, complete protein, under $3.</p>
      </div>

      {/* Meal List */}
      <h3 className="font-display font-semibold mb-4">Today&apos;s Meals</h3>
      <div className="space-y-3">
        {meals.map((m) => (
          <div key={m.id} className="card-elevated p-4 flex items-center gap-4 cursor-pointer hover:border-[rgba(142,153,164,0.2)] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[rgba(10,132,255,0.1)] flex items-center justify-center text-[#0A84FF]">
              <Apple size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{m.meal}</span>
                <span className="text-[10px] text-[#5A6570]">{m.time}</span>
              </div>
              <p className="text-xs text-[#8E99A4]">{m.desc}</p>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[11px] font-mono">
              <span>{m.calories} cal</span>
              <span className="text-[#0A84FF]">{m.protein}g P</span>
              <span className="text-[#FFD600]">{m.carbs}g C</span>
              <span className="text-[#E040FB]">{m.fats}g F</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
