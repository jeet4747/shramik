import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Users, Building2, Briefcase, CheckCircle2 } from 'lucide-react'
import StatCard from '../shared/StatCard'
import { CardSkeleton } from '../shared/LoadingSkeleton'
import ErrorState from '../shared/ErrorState'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Workers" value={stats?.workers?.toLocaleString() || '0'} icon={Users} />
        <StatCard title="Contractors" value={stats?.contractors?.toString() || '0'} icon={Building2} />
        <StatCard title="Active Jobs" value={stats?.activeJobs?.toString() || '0'} icon={Briefcase} />
        <StatCard title="Completed" value={stats?.completed?.toString() || '0'} icon={CheckCircle2} />
      </div>
    </div>
  )
}
