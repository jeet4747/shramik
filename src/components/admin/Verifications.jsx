import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import Badge from '../shared/Badge'
import EmptyState from '../shared/EmptyState'
import { TableSkeleton } from '../shared/LoadingSkeleton'
import ErrorState from '../shared/ErrorState'

export default function Verifications({ addToast }) {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      try {
        const { data, error: err } = await supabase
          .from('verifications')
          .select('*, users(full_name, skill, city)')
          .eq('status', 'pending')
          .order('created_at', { ascending: false })

        if (err) throw err
        if (mounted) setQueue(data || [])
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
      addToast?.(`Verification ${status === 'approved' ? 'approved' : 'rejected'}!`, status === 'approved' ? 'success' : 'error')
    } catch (err) {
      addToast?.(err.message || 'Error updating verification', 'error')
    }
  }

  if (loading) return <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm"><TableSkeleton rows={5} cols={4} /></div>
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />
  if (queue.length === 0) return <EmptyState icon={Badge} title="No pending verifications" description="All workers have been verified." />

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-navy">Worker Verification Queue</h2>
        <Badge variant="warning">{queue.length} Pending</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-slate-600">Name</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600">Skill</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600">Location</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {queue.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold">{v.users?.full_name || 'Unknown'}</td>
                <td className="px-6 py-4"><Badge>{v.users?.skill || '—'}</Badge></td>
                <td className="px-6 py-4 text-slate-600">{v.users?.city || '—'}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(v.id, 'approved')}
                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-bold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(v.id, 'rejected')}
                      className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-sm font-bold"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
