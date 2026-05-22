import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Briefcase, Users, Clock, IndianRupee } from 'lucide-react'
import StatCard from '../shared/StatCard'
import { CardSkeleton } from '../shared/LoadingSkeleton'
import ErrorState from '../shared/ErrorState'

export default function ContractorDashboard({ user }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const displayName = user?.user_metadata?.full_name || 'Contractor'

  useEffect(() => {
    let mounted = true
    const fetchStats = async () => {
      try {
        const { data: activeJobs } = await supabase
          .from('jobs')
          .select('id', { count: 'exact', head: true })
          .eq('contractor_id', user.id)
          .eq('status', 'open')

        const { data: hiredCount } = await supabase
          .from('job_applications')
          .select('id', { count: 'exact', head: true })
          .in('job_id', supabase.from('jobs').select('id').eq('contractor_id', user.id))
          .eq('status', 'hired')

        const { data: pendingApps } = await supabase
          .from('job_applications')
          .select('id', { count: 'exact', head: true })
          .in('job_id', supabase.from('jobs').select('id').eq('contractor_id', user.id))
          .eq('status', 'applied')

        if (mounted) {
          setStats({
            activeJobs: activeJobs?.length || 0,
            hired: hiredCount?.length || 0,
            pending: pendingApps?.length || 0,
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
  }, [user.id])

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-extrabold text-navy">Welcome, {displayName} 👋</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          <>
            <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
          </>
        ) : error ? (
          <div className="col-span-4"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>
        ) : (
          <>
            <StatCard title="Active Jobs" value={stats?.activeJobs || '0'} icon={Briefcase} />
            <StatCard title="Workers Hired" value={stats?.hired || '0'} icon={Users} />
            <StatCard title="Pending Applications" value={stats?.pending || '0'} icon={Clock} />
            <StatCard title="Month Spend" value="—" icon={IndianRupee} />
          </>
        )}
      </div>
    </div>
  )
}
