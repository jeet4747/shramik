import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { CheckCircle2, IndianRupee, Clock, Star, ChevronRight, MapPin, Check, Search, Filter } from 'lucide-react'
import StatCard from '../shared/StatCard'
import Badge from '../shared/Badge'
import EmptyState from '../shared/EmptyState'
import ErrorState from '../shared/ErrorState'
import { CardSkeleton, ListSkeleton } from '../shared/LoadingSkeleton'

export default function WorkerDashboard({ user, userData, openJobs, acceptedJobs, onApply, onViewJobs }) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [statsError, setStatsError] = useState(null)
  const [recentJobs, setRecentJobs] = useState([])
  const displayName = userData?.full_name || user?.user_metadata?.full_name || 'Worker'

  useEffect(() => {
    let mounted = true
    const fetchStats = async () => {
      try {
        const { data: jobsDone } = await supabase
          .from('job_applications')
          .select('id', { count: 'exact', head: true })
          .eq('worker_id', user.id)
          .in('status', ['hired', 'completed'])

        const { data: earnings } = await supabase
          .from('earnings')
          .select('amount')
          .eq('worker_id', user.id)
          .eq('status', 'paid')

        const totalEarnings = earnings?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0

        if (mounted) {
          setStats({
            jobsDone: jobsDone?.length || 0,
            totalEarnings,
            activeJobs: acceptedJobs?.length || 0,
            rating: userData?.rating || 0,
          })
        }
      } catch (err) {
        if (mounted) setStatsError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchStats()
    return () => { mounted = false }
  }, [user.id, acceptedJobs?.length, userData?.rating])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setRecentJobs(openJobs?.slice(0, 4) || []) }, [openJobs])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-navy">Namaste, {displayName} 👋</h2>
        <p className="text-slate-500">Here's what's available for you today.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : statsError ? (
          <div className="col-span-4">
            <ErrorState message={statsError} onRetry={() => window.location.reload()} />
          </div>
        ) : (
          <>
            <StatCard title="Jobs Done" value={stats?.jobsDone || '0'} icon={CheckCircle2} />
            <StatCard title="This Month" value={`₹${(stats?.totalEarnings || 0).toLocaleString('en-IN')}`} icon={IndianRupee} />
            <StatCard title="Active Jobs" value={stats?.activeJobs || '0'} icon={Clock} />
            <StatCard title="Rating" value={stats?.rating ? `${stats.rating} ★` : '—'} icon={Star} />
          </>
        )}
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">New Jobs Near You</h3>
          <button onClick={onViewJobs} className="text-navy font-semibold text-sm flex items-center gap-1">
            View All <ChevronRight size={16} />
          </button>
        </div>
        {recentJobs.length === 0 && !loading ? (
          <EmptyState icon={Search} title="No jobs available right now" description="Check back later for new opportunities near you." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentJobs.map((job) => {
              const isAccepted = acceptedJobs?.includes(job.id)
              return (
                <div key={job.id} className={`p-6 rounded-2xl border transition-all ${isAccepted ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 hover:shadow-lg'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{job.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{job.trade_needed}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-navy">₹{job.pay_per_day}</p>
                      <p className="text-xs text-slate-500">Per Day</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                    <MapPin size={14} /> {job.location}
                  </div>
                  {isAccepted ? (
                    <div className="w-full py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                      <Check size={20} /> Accepted
                    </div>
                  ) : (
                    <button
                      onClick={() => onApply(job.id)}
                      className="w-full py-3 bg-saffron hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
                    >
                      Accept Job
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
