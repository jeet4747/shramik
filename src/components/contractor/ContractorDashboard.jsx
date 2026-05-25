import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Briefcase, Users, Clock, IndianRupee } from 'lucide-react'
import StatCard from '../shared/StatCard'
import { CardSkeleton } from '../shared/LoadingSkeleton'
import ErrorState from '../shared/ErrorState'

export default function ContractorDashboard({ user, userData }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetchStats = async () => {
      try {
        const { data: myJobs } = await supabase
          .from('jobs')
          .select('id, status')
          .eq('contractor_id', user.id)

        const activeJobs = Array.isArray(myJobs) ? myJobs.filter(j => j.status === 'open').length : 0

        const { data: allApps } = await supabase
          .from('job_applications')
          .select('id, status, jobs!inner(contractor_id)')
          .eq('jobs.contractor_id', user.id)

        const hired = Array.isArray(allApps) ? allApps.filter(a => a.status === 'hired').length : 0
        const pending = Array.isArray(allApps) ? allApps.filter(a => a.status === 'applied').length : 0

        if (mounted) {
          setStats({ activeJobs, hired, pending })
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

  const displayName = userData?.full_name || user?.full_name || 'Contractor'

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
