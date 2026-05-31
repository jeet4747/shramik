import { useState } from 'react'
import { supabase } from '../../supabaseClient'

const TRADES = ['Electrician', 'Plumber', 'Carpenter', 'Helper', 'Painter', 'Mason', 'Welder']

export default function PostJob({ user, onJobPosted, addToast }) {
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ title: '', trade: TRADES[0], location: '', pay: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Job title is required'
    if (!form.location.trim()) errs.location = 'Location is required'
    const payNum = parseInt(form.pay)
    if (!form.pay || isNaN(payNum) || payNum < 1) errs.pay = 'Enter a valid daily wage (min ₹1)'
    if (payNum > 100000) errs.pay = 'Daily wage seems too high (max ₹1,00,000)'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      // Check if phone already exists with different role
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, role')
        .eq('phone', user.phone)
        .maybeSingle()

      if (existingUser && existingUser.id !== user.id) {
        addToast?.('Phone number already registered', 'error')
        setSubmitting(false)
        return
      }

      await supabase.from('users').upsert({
        id: user.id,
        phone: user.phone,
        role: 'contractor',
      }, { onConflict: 'id' })

      const { error } = await supabase.from('jobs').insert({
        contractor_id: user.id,
        title: form.title.trim(),
        trade_needed: form.trade,
        location: form.location.trim(),
        pay_per_day: parseInt(form.pay),
        status: 'open',
      })

      if (error) throw error

      addToast?.('Job Posted Successfully!', 'success')
      setForm({ title: '', trade: TRADES[0], location: '', pay: '' })
      if (onJobPosted) onJobPosted()
    } catch (err) {
      addToast?.(err.message || 'Error posting job', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-navy mb-6">Post a New Job</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Job Title</label>
              <input
                name="title"
                type="text"
                placeholder="e.g. Wiring Work - 2BHK"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.title ? 'border-red-300' : 'border-slate-200'} focus:ring-2 focus:ring-navy`}
                required
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Skill Required</label>
              <select
                name="trade"
                value={form.trade}
                onChange={(e) => setForm({ ...form, trade: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-navy"
              >
                {TRADES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Location</label>
              <input
                name="location"
                type="text"
                placeholder="e.g. Nashik Road"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.location ? 'border-red-300' : 'border-slate-200'} focus:ring-2 focus:ring-navy`}
                required
              />
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Pay Per Day (₹)</label>
              <input
                name="pay"
                type="number"
                placeholder="800"
                min="1"
                max="100000"
                value={form.pay}
                onChange={(e) => setForm({ ...form, pay: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.pay ? 'border-red-300' : 'border-slate-200'} focus:ring-2 focus:ring-navy`}
                required
              />
              {errors.pay && <p className="text-xs text-red-500 mt-1">{errors.pay}</p>}
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-navy text-white rounded-xl font-bold text-lg shadow-lg hover:bg-navy-light transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  )
}
