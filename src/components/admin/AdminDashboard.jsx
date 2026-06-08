import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Users, Building2, Briefcase, CheckCircle2, PlusCircle, UserCheck, UserX, ShieldCheck, MapPin, Wrench } from 'lucide-react'
import StatCard from '../shared/StatCard'
import { CardSkeleton } from '../shared/LoadingSkeleton'
import ErrorState from '../shared/ErrorState'

const TRADES = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Mason', 'Welder', 'Driver', 'Helper']
const CITIES = ['Nashik', 'Pune']
const CHOWKS = {
  'Nashik': ['Nashik MIDC', 'Ambad MIDC', 'Satpur MIDC', 'Panchavati', 'Gangapur Road', 'CIDCO'],
  'Pune': ['Hinjewadi', 'Bhosari', 'Chinchwad', 'Pimpri', 'Hadapsar', 'Kharadi'],
}

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState(null)
  const [showDemoForm, setShowDemoForm] = useState(false)
  const [demoForm, setDemoForm] = useState({
    title: '', trade: TRADES[0], city: 'Nashik', chowk: CHOWKS['Nashik'][0], pay: '800'
  })

  useEffect(() => {
    let mounted = true
    const fetchStats = async () => {
      try {
        const [workersRes, contractorsRes, thekedarsRes, jobsRes, completedRes, verifiedRes, unverifiedRes, whatsappRes] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'worker'),
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'contractor'),
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'thekedar'),
          supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'open'),
          supabase.from('jobs').select('id', { count: 'exact', head: true }).in('status', ['filled', 'assigned', 'completed']),
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('is_verified', true),
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('is_verified', false),
          supabase.from('whatsapp_groups').select('*').eq('is_active', true),
        ])

        if (mounted) {
          setStats({
            workers: workersRes.count || 0,
            contractors: contractorsRes.count || 0,
            thekedars: thekedarsRes.count || 0,
            activeJobs: jobsRes.count || 0,
            completed: completedRes.count || 0,
            verified: verifiedRes.count || 0,
            unverified: unverifiedRes.count || 0,
            total: (workersRes.count || 0) + (contractorsRes.count || 0) + (thekedarsRes.count || 0),
            whatsappGroups: whatsappRes.data || [],
          })
        }
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchStats()
    return () => { mounted = false }
  }, [])

  const seedDemoJob = async () => {
    if (!demoForm.title.trim()) {
      setSeedMsg({ type: 'error', text: 'Please enter a job title' })
      return
    }
    setSeeding(true)
    setSeedMsg(null)
    try {
      const { error: err } = await supabase.from('jobs').insert({
        contractor_id: user.id,
        title: demoForm.title,
        trade_needed: demoForm.trade,
        location: `${demoForm.chowk}, ${demoForm.city}`,
        pay_per_day: parseInt(demoForm.pay),
        status: 'open',
      })
      if (err) throw err
      setSeedMsg({ type: 'success', text: `Demo job "${demoForm.title}" created!` })
      setStats(prev => prev ? { ...prev, activeJobs: prev.activeJobs + 1 } : prev)
      setShowDemoForm(false)
    } catch (err) {
      setSeedMsg({ type: 'error', text: err.message })
    }
    setSeeding(false)
  }

  if (loading) return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Users" value={stats?.total?.toString() || '0'} icon={Users} />
        <StatCard title="Workers" value={stats?.workers?.toLocaleString() || '0'} icon={UserCheck} />
        <StatCard title="Contractors" value={stats?.contractors?.toString() || '0'} icon={Building2} />
        <StatCard title="Thekedars" value={stats?.thekedars?.toString() || '0'} icon={ShieldCheck} />
        <StatCard title="Verified" value={stats?.verified?.toString() || '0'} icon={CheckCircle2} />
        <StatCard title="Unverified" value={stats?.unverified?.toString() || '0'} icon={UserX} />
        <StatCard title="Active Jobs" value={stats?.activeJobs?.toString() || '0'} icon={Briefcase} />
      </div>

      {/* Demo Job Posting */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-navy">Demo Job Posting</h3>
          <button
            onClick={() => setShowDemoForm(!showDemoForm)}
            className="px-4 py-2 bg-navy text-white rounded-xl text-sm font-bold hover:bg-navy-light transition-all flex items-center gap-2"
          >
            <PlusCircle size={16} />
            {showDemoForm ? 'Cancel' : 'Create Demo Job'}
          </button>
        </div>

        {showDemoForm && (
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Job Title</label>
              <input type="text" value={demoForm.title}
                onChange={e => setDemoForm({ ...demoForm, title: e.target.value })}
                placeholder="e.g. Electrical Wiring - 2BHK"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Trade Required</label>
              <select value={demoForm.trade}
                onChange={e => setDemoForm({ ...demoForm, trade: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy">
                {TRADES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">City</label>
              <select value={demoForm.city}
                onChange={e => setDemoForm({ ...demoForm, city: e.target.value, chowk: CHOWKS[e.target.value][0] })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy">
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Area / Chowk</label>
              <select value={demoForm.chowk}
                onChange={e => setDemoForm({ ...demoForm, chowk: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy">
                {CHOWKS[demoForm.city]?.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Pay per day (₹)</label>
              <input type="number" value={demoForm.pay}
                onChange={e => setDemoForm({ ...demoForm, pay: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
            </div>
            <div className="flex items-end">
              <button onClick={seedDemoJob} disabled={seeding}
                className="w-full px-4 py-2 bg-saffron text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all disabled:bg-slate-300 flex items-center justify-center gap-2">
                {seeding ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Wrench size={16} />}
                {seeding ? 'Posting...' : 'Post Demo Job'}
              </button>
            </div>
          </div>
        )}

        {seedMsg && (
          <p className={`mt-2 text-xs font-bold ${seedMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {seedMsg.text}
          </p>
        )}
      </div>

      {/* WhatsApp Groups */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <h3 className="text-base font-bold text-navy mb-3">WhatsApp Job Alert Groups</h3>
        <p className="text-xs text-slate-500 mb-4">Users see these group links based on their city. Share these with workers to join.</p>
        <div className="space-y-2">
          {stats?.whatsappGroups?.length > 0 ? stats.whatsappGroups.map(g => (
            <div key={g.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-bold text-navy flex items-center gap-2">
                  <MapPin size={14} className="text-saffron" /> {g.group_name || `${g.city} Jobs`}
                </p>
                <p className="text-xs text-slate-400">{g.city} • {g.invite_link}</p>
              </div>
              <a href={g.invite_link} target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors">
                Open
              </a>
            </div>
          )) : (
            <p className="text-xs text-slate-400">No WhatsApp groups configured. Add them in the SQL seed data.</p>
          )}
        </div>
      </div>
    </div>
  )
}
