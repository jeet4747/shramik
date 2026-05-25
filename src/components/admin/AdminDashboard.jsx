import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Users, Building2, Briefcase, CheckCircle2, PlusCircle } from 'lucide-react'
import StatCard from '../shared/StatCard'
import { CardSkeleton } from '../shared/LoadingSkeleton'
import ErrorState from '../shared/ErrorState'

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetchStats = async () => {
      try {
        const [workersRes, contractorsRes, jobsRes, completedRes] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'worker'),
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'contractor'),
          supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'open'),
          supabase.from('jobs').select('id', { count: 'exact', head: true }).in('status', ['filled', 'assigned']),
        ])

        if (mounted) {
          setStats({
            workers: workersRes.count || 0,
            contractors: contractorsRes.count || 0,
            activeJobs: jobsRes.count || 0,
            completed: completedRes.count || 0,
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
    setSeeding(true)
    setSeedMsg(null)
    try {
      const { error: err } = await supabase.from('jobs').insert({
        contractor_id: user.id,
        title: 'Electrical Wiring — Residential Project',
        trade_needed: 'Electrician',
        location: 'Nashik MIDC',
        pay_per_day: 800,
        status: 'open',
      })
      if (err) throw err
      setSeedMsg({ type: 'success', text: 'Demo job created! Workers can now see it.' })
      setStats(prev => prev ? { ...prev, activeJobs: prev.activeJobs + 1 } : prev)
    } catch (err) {
      setSeedMsg({ type: 'error', text: err.message })
    }
    setSeeding(false)
  }

  if (loading) return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Workers" value={stats?.workers?.toLocaleString() || '0'} icon={Users} />
        <StatCard title="Contractors" value={stats?.contractors?.toString() || '0'} icon={Building2} />
        <StatCard title="Active Jobs" value={stats?.activeJobs?.toString() || '0'} icon={Briefcase} />
        <StatCard title="Completed" value={stats?.completed?.toString() || '0'} icon={CheckCircle2} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <h3 className="text-base font-bold text-navy mb-3">Quick Actions</h3>
        <button
          onClick={seedDemoJob}
          disabled={seeding}
          className="px-5 py-2.5 bg-navy text-white rounded-xl text-sm font-bold hover:bg-navy-light transition-all disabled:bg-slate-300 flex items-center gap-2"
        >
          {seeding ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <PlusCircle size={16} />
          )}
          {seeding ? 'Creating...' : 'Create Demo Job (so workers see something)'}
        </button>
        {seedMsg && (
          <p className={`mt-2 text-xs font-bold ${seedMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {seedMsg.text}
          </p>
        )}
      </div>
    </div>
  )
}
