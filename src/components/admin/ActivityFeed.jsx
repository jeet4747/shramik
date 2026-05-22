import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { ListSkeleton } from '../shared/LoadingSkeleton'
import EmptyState from '../shared/EmptyState'
import ErrorState from '../shared/ErrorState'

export default function ActivityFeed() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      try {
        const { data, error: err } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)

        if (err) throw err
        if (mounted) setActivities(data || [])
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetch()
    return () => { mounted = false }
  }, [])

  if (loading) return <ListSkeleton rows={6} />
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />
  if (activities.length === 0) return <EmptyState title="No recent activity" description="Platform activity will appear here." />

  const typeColor = (type) => {
    switch (type) {
      case 'job': return 'bg-navy'
      case 'hire': return 'bg-green-500'
      case 'verify': return 'bg-saffron'
      default: return 'bg-slate-400'
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {activities.map((item) => (
        <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100">
          <div className={`w-2 h-12 rounded-full ${typeColor(item.type)}`} />
          <div>
            <p className="text-slate-800 font-medium">{item.body || item.title}</p>
            <p className="text-xs text-slate-400 font-bold mt-1">
              {item.created_at ? new Date(item.created_at).toLocaleString('en-IN') : ''}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
