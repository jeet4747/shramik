import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Briefcase, Users, Clock, IndianRupee, TrendingUp, MapPin, Star, ChevronRight } from 'lucide-react'
import StatCard from '../shared/StatCard'
import { CardSkeleton } from '../shared/LoadingSkeleton'
import ErrorState from '../shared/ErrorState'
import WhatsAppGroupBanner from '../worker/WhatsAppGroupBanner'

export default function ContractorDashboard({ user, userData }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recentJobs, setRecentJobs] = useState([])

  useEffect(() => {
    let mounted = true
    const fetchStats = async () => {
      try {
        const { data: myJobs } = await supabase
          .from('jobs')
          .select('id, status, title, location, pay_per_day, created_at')
          .eq('contractor_id', user.id)
          .order('created_at', { ascending: false })

        const jobs = Array.isArray(myJobs) ? myJobs : []
        const activeJobs = jobs.filter(j => j.status === 'open').length
        const filledJobs = jobs.filter(j => j.status === 'assigned' || j.status === 'filled').length
        const completedJobs = jobs.filter(j => j.status === 'completed').length

        const { data: allApps } = await supabase
          .from('job_applications')
          .select('id, status, jobs!inner(contractor_id)')
          .eq('jobs.contractor_id', user.id)

        const pending = Array.isArray(allApps) ? allApps.filter(a => a.status === 'applied').length : 0

        if (mounted) {
          setStats({ activeJobs, filledJobs, completedJobs, pending, total: jobs.length })
          setRecentJobs(jobs.slice(0, 5))
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
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-navy">Welcome, {displayName.split(' ')[0]}!</h2>
            <p className="text-slate-500 text-sm mt-1">Manage your job postings and workforce.</p>
          </div>
          <div className="w-12 h-12 bg-navy text-white rounded-xl flex items-center justify-center text-lg font-black shrink-0">
            {displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          <><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></>
        ) : error ? (
          <div className="col-span-4"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>
        ) : (
          <>
            <StatCard title="Active Jobs" value={stats?.activeJobs || '0'} icon={Briefcase} />
            <StatCard title="Filled" value={stats?.filledJobs || '0'} icon={Users} />
            <StatCard title="Pending Apps" value={stats?.pending || '0'} icon={Clock} />
            <StatCard title="Completed" value={stats?.completedJobs || '0'} icon={TrendingUp} />
          </>
        )}
      </div>

      {/* WhatsApp Group */}
      <WhatsAppGroupBanner city={userData?.city || 'Nashik'} />

      {/* Recent Jobs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-navy">Your Job Postings</h3>
          <span className="text-xs text-slate-400 font-semibold">{stats?.total || 0} total</span>
        </div>
        {recentJobs.length === 0 ? (
          <div className="p-8 text-center">
            <Briefcase size={32} className="text-slate-200 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-400">No jobs posted yet</p>
            <p className="text-xs text-slate-300 mt-1">Post your first job to find skilled workers.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {recentJobs.map(job => (
              <div key={job.id} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{job.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1"><IndianRupee size={12} />{job.pay_per_day}/day</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      job.status === 'open' ? 'bg-green-50 text-green-600' :
                      job.status === 'assigned' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'
                    }`}>{job.status}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
