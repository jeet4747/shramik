import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import {
  CheckCircle2, IndianRupee, Clock, Star, ChevronRight, MapPin, Check, Search,
  BadgeCheck, Share2, ShieldCheck, Phone, Wrench, Users, UserPlus, X
} from 'lucide-react'
import StatCard from '../shared/StatCard'
import EmptyState from '../shared/EmptyState'
import ErrorState from '../shared/ErrorState'
import { CardSkeleton } from '../shared/LoadingSkeleton'
import WhatsAppGroupBanner from './WhatsAppGroupBanner'

export default function WorkerDashboard({ user, userData, openJobs, acceptedJobs, onApply, onViewJobs, addToast }) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [statsError, setStatsError] = useState(null)
  const [thekedar, setThekedar] = useState(null)
  const [invites, setInvites] = useState([])
  const recentJobs = openJobs?.slice(0, 4) || []
  const displayName = userData?.full_name || user?.full_name || 'Worker'

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
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

        // Fetch thekedar info if linked
        if (userData?.thekedar_id) {
          const { data: th } = await supabase.from('users').select('full_name, phone').eq('id', userData.thekedar_id).maybeSingle()
          if (th && mounted) setThekedar(th)
        }
      } catch (err) {
        if (mounted) setStatsError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [user.id, acceptedJobs?.length, userData?.rating, userData?.thekedar_id])

  // Fetch pending team invites
  useEffect(() => {
    let mounted = true
    const fetchInvites = async () => {
      const { data } = await supabase
        .from('team_invites')
        .select('*, thekedar:thekedar_id(full_name, phone)')
        .eq('worker_id', user.id)
        .eq('status', 'pending')
      if (Array.isArray(data) && mounted) setInvites(data)
    }
    fetchInvites()
    return () => { mounted = false }
  }, [user.id])

  const acceptInvite = async (invite) => {
    await supabase.from('users').update({ thekedar_id: invite.thekedar_id }).eq('id', user.id)
    await supabase.from('team_invites').update({ status: 'accepted' }).eq('id', invite.id)
    setThekedar({ full_name: invite.thekedar?.full_name, phone: invite.thekedar?.phone })
    setInvites(prev => prev.filter(i => i.id !== invite.id))
    addToast('You joined ' + (invite.thekedar?.full_name || 'the team') + '!', 'success')
  }

  const rejectInvite = async (invite) => {
    await supabase.from('team_invites').update({ status: 'rejected' }).eq('id', invite.id)
    setInvites(prev => prev.filter(i => i.id !== invite.id))
    addToast('Invite declined', 'info')
  }

  const shareProfile = () => {
    const text = `I am on Shramik! 🛠️
Name: ${displayName}
Skill: ${userData?.skill || 'Skilled Worker'}
Area: ${userData?.chowk || userData?.city || 'Nashik'}
Contractors can hire me directly on Shramik.`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Pending Invites */}
      {invites.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
            <Users size={16} /> Team Invites ({invites.length})
          </h3>
          <div className="space-y-2">
            {invites.map(inv => (
              <div key={inv.id} className="bg-white rounded-xl p-3 border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-navy">{inv.thekedar?.full_name || 'Thekedar'}</p>
                  <p className="text-xs text-slate-400">{inv.thekedar?.phone}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => rejectInvite(inv)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                  <button
                    onClick={() => acceptInvite(inv)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-bold hover:bg-navy-light transition-all"
                  >
                    <Check size={14} /> Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                {userData?.is_verified && <BadgeCheck size={18} className="text-green-500" />}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                {userData?.skill && (
                  <span className="flex items-center gap-1"><Wrench size={13} /> {userData.skill}</span>
                )}
                {userData?.chowk && (
                  <span className="flex items-center gap-1"><MapPin size={13} /> {userData.chowk}</span>
                )}
                {!userData?.chowk && userData?.city && (
                  <span className="flex items-center gap-1"><MapPin size={13} /> {userData.city}</span>
                )}
                <span className="flex items-center gap-1"><Phone size={13} /> {user?.phone || userData?.phone}</span>
              </div>

              {/* Thekedar link */}
              {thekedar && (
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400">
                  <Users size={12} />
                  Part of <span className="font-bold text-navy">{thekedar.full_name}</span>'s team
                </div>
              )}

              <div className="flex items-center gap-2 mt-2">
                {userData?.is_verified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                    <BadgeCheck size={13} /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck size={13} /> Pending Verification
                  </span>
                )}
              </div>
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-navy">Welcome, {displayName.split(' ')[0]}!</h2>
          {userData?.chowk && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin size={12} /> {userData.chowk}
            </span>
          )}
        </div>
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

      {/* WhatsApp Group */}
      <WhatsAppGroupBanner city={userData?.city || 'Nashik'} />

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
