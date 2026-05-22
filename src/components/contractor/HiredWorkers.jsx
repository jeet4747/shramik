import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { MessageCircle } from 'lucide-react'
import Badge from '../shared/Badge'
import EmptyState from '../shared/EmptyState'
import { TableSkeleton } from '../shared/LoadingSkeleton'
import ErrorState from '../shared/ErrorState'

export default function HiredWorkers({ user }) {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      try {
        const { data: jobs } = await supabase
          .from('jobs')
          .select('id, title')
          .eq('contractor_id', user.id)

        if (!jobs || jobs.length === 0) {
          if (mounted) { setWorkers([]); setLoading(false) }
          return
        }

        const jobIds = jobs.map((j) => j.id)
        const { data: apps, error: err } = await supabase
          .from('job_applications')
          .select('*, jobs(title), users(full_name, phone)')
          .in('job_id', jobIds)
          .eq('status', 'hired')

        if (err) throw err
        if (mounted) setWorkers(apps || [])
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetch()
    return () => { mounted = false }
  }, [user.id])

  if (loading) return <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden"><TableSkeleton rows={4} cols={4} /></div>
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />
  if (workers.length === 0) return <EmptyState icon={MessageCircle} title="No hired workers yet" description="Workers you hire will appear here." />

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-slate-600">Worker</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600">Job</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-600">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {workers.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-900">{app.users?.full_name || 'Worker'}</td>
                <td className="px-6 py-4"><Badge>{app.jobs?.title || '—'}</Badge></td>
                <td className="px-6 py-4">
                  {app.users?.phone && (
                    <a
                      href={`https://wa.me/91${app.users.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-600 font-bold text-sm"
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
