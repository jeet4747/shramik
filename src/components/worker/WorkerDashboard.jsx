import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import {
  CheckCircle2, IndianRupee, Clock, Star, ChevronRight, MapPin, Check, Search,
  BadgeCheck, Share2, ShieldCheck, Phone, Wrench
} from 'lucide-react'
import StatCard from '../shared/StatCard'
import EmptyState from '../shared/EmptyState'
import ErrorState from '../shared/ErrorState'
import { CardSkeleton } from '../shared/LoadingSkeleton'

export default function WorkerDashboard({ user, userData, openJobs, acceptedJobs, onApply, onViewJobs }) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [statsError, setStatsError] = useState(null)
  const recentJobs = openJobs?.slice(0, 4) || []
  const displayName = userData?.full_name || user?.user_metadata?.full_name || 'Worker'

  useEffect(() => {
    let mounted = true
    const fetchStats = async () => {
      try {
        const { count: jobsDone } = await supabase
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
            jobsDone: jobsDone || 0,
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

  const shareProfile = () => {
    const text = `I am on Shramik! 🛠️
Name: ${displayName}
Skill: ${userData?.skill || 'Skilled Worker'}
City: ${userData?.city || 'Nashik'}
Contractors can hire me directly on Shramik.`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-navy text-white rounded-xl flex items-center justify-center text-xl font-black shrink-0">
              {displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-navy">{displayName}</h2>
                {userData?.verified && <BadgeCheck size={18} className="text-green-500" />}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                {userData?.skill && (
                  <span className="flex items-center gap-1"><Wrench size={13} /> {userData.skill}</span>
                )}
                {userData?.city && (
                  <span className="flex items-center gap-1"><MapPin size={13} /> {userData.city}</span>
                )}
                <span className="flex items-center gap-1"><Phone size={13} /> {user?.phone || userData?.phone}</span>
              </div>
              {userData?.verified ? (
                <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                  <BadgeCheck size={13} /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck size={13} /> Pending Verification
                </span>
              )}
            </div>
          </div>
          <button
            onClick={shareProfile}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors"
          >
            <Share2 size={14} /> Share on WhatsApp
          </button>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-xl font-extrabold text-navy mb-4">Welcome, {displayName.split(' ')[0]} 👋</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            <>
              <CardSkeleton /> <CardSkeleton /> <CardSkeleton /> <CardSkeleton />
            </>
          ) : statsError ? (
            <div className="col-span-4">
              <ErrorState message={statsError} onRetry={() => window.location.reload()} />
            </div>
          ) : (
            <>
              <StatCard title="Jobs Done" value={stats?.jobsDone || '0'} icon={CheckCircle2} />
              <StatCard title="Earned" value={`₹${(stats?.totalEarnings || 0).toLocaleString('en-IN')}`} icon={IndianRupee} />
              <StatCard title="Active" value={stats?.activeJobs || '0'} icon={Clock} />
              <StatCard title="Rating" value={stats?.rating ? `${stats.rating} ★` : 'New'} icon={Star} />
            </>
          )}
        </div>
      </div>

      {/* Jobs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">New Jobs Near You</h3>
          <button onClick={onViewJobs} className="text-navy font-semibold text-sm flex items-center gap-1">
            View All <ChevronRight size={16} />
          </button>
        </div>
        {recentJobs.length === 0 && !loading ? (
          <EmptyState icon={Search} title="No jobs available right now" description="Check back later for new opportunities." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentJobs.map((job) => {
              const isAccepted = acceptedJobs?.includes(job.id)
              return (
                <div key={job.id} className={`p-5 rounded-2xl border transition-all ${isAccepted ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 hover:shadow-md'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{job.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{job.trade_needed}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-navy">₹{job.pay_per_day}</p>
                      <p className="text-[10px] text-slate-500">/day</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mb-3 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                    <MapPin size={13} /> {job.location}
                  </div>
                  {isAccepted ? (
                    <div className="w-full py-2.5 bg-green-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1.5">
                      <Check size={18} /> Applied
                    </div>
                  ) : (
                    <button
                      onClick={() => onApply(job.id)}
                      className="w-full py-2.5 bg-saffron hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all active:scale-95"
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
