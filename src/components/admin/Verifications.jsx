import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { BadgeCheck, UserCheck } from 'lucide-react'
import Badge from '../shared/Badge'
import EmptyState from '../shared/EmptyState'
import { TableSkeleton } from '../shared/LoadingSkeleton'
import ErrorState from '../shared/ErrorState'

export default function Verifications({ addToast }) {
  const [queue, setQueue] = useState([])
  const [unverified, setUnverified] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('pending')

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      try {
        const [verificationsRes, usersRes] = await Promise.all([
          supabase
            .from('verifications')
            .select('*, users(full_name, skill, city)')
            .eq('status', 'pending')
            .order('created_at', { ascending: false }),
          supabase
            .from('users')
            .select('id, full_name, phone, skill, city, created_at')
            .eq('role', 'worker')
            .eq('verified', false)
            .order('created_at', { ascending: false })
        ])

        if (mounted) {
          setQueue(verificationsRes.data || [])
          setUnverified(usersRes.data || [])
        }
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetch()
    return () => { mounted = false }
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const { error: err } = await supabase
        .from('verifications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (err) throw err
      setQueue(queue.filter((v) => v.id !== id))
      addToast?.(`Verification ${status}`, status === 'approved' ? 'success' : 'error')
    } catch (err) {
      addToast?.(err.message || 'Error', 'error')
    }
  }

  const verifyUser = async (userId) => {
    try {
      const { error: err } = await supabase
        .from('users')
        .update({ verified: true, updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (err) throw err
      setUnverified(unverified.filter((u) => u.id !== userId))
      addToast?.('Worker verified successfully!', 'success')
    } catch (err) {
      addToast?.(err.message || 'Error', 'error')
    }
  }

  if (loading) return <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm"><TableSkeleton rows={5} cols={4} /></div>
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'pending' ? 'bg-white text-navy shadow-sm' : 'text-slate-400'}`}
        >
          Verification Requests {queue.length > 0 && `(${queue.length})`}
        </button>
        <button
          onClick={() => setTab('users')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'users' ? 'bg-white text-navy shadow-sm' : 'text-slate-400'}`}
        >
          Unverified Workers {unverified.length > 0 && `(${unverified.length})`}
        </button>
      </div>

      {/* Pending verifications */}
      {tab === 'pending' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-base font-bold text-navy">Worker Verification Queue</h2>
            <Badge variant="warning">{queue.length} Pending</Badge>
          </div>
          {queue.length === 0 ? (
            <div className="p-8">
              <EmptyState icon={BadgeCheck} title="No pending verifications" description="All verification requests have been handled." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 font-bold text-slate-500">Name</th>
                    <th className="px-5 py-3 font-bold text-slate-500">Skill</th>
                    <th className="px-5 py-3 font-bold text-slate-500">Location</th>
                    <th className="px-5 py-3 font-bold text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {queue.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-semibold">{v.users?.full_name || 'Unknown'}</td>
                      <td className="px-5 py-3"><Badge>{v.users?.skill || '—'}</Badge></td>
                      <td className="px-5 py-3 text-slate-500">{v.users?.city || '—'}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(v.id, 'approved')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors">Approve</button>
                          <button onClick={() => updateStatus(v.id, 'rejected')} className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Direct user verification */}
      {tab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-base font-bold text-navy">Recently Registered Workers</h2>
            <Badge variant="info">{unverified.length} Pending</Badge>
          </div>
          {unverified.length === 0 ? (
            <div className="p-8">
              <EmptyState icon={UserCheck} title="All workers verified" description="Every worker on the platform has been verified." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 font-bold text-slate-500">Name</th>
                    <th className="px-5 py-3 font-bold text-slate-500">Phone</th>
                    <th className="px-5 py-3 font-bold text-slate-500">Skill</th>
                    <th className="px-5 py-3 font-bold text-slate-500">City</th>
                    <th className="px-5 py-3 font-bold text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {unverified.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-semibold">{u.full_name || '—'}</td>
                      <td className="px-5 py-3 text-slate-500">{u.phone || '—'}</td>
                      <td className="px-5 py-3"><Badge>{u.skill || '—'}</Badge></td>
                      <td className="px-5 py-3 text-slate-500">{u.city || '—'}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => verifyUser(u.id)}
                          className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-bold hover:bg-navy-light transition-colors flex items-center gap-1"
                        >
                          <BadgeCheck size={14} /> Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
