import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { Search } from 'lucide-react'
import EmptyState from '../shared/EmptyState'
import { ListSkeleton } from '../shared/LoadingSkeleton'
import ErrorState from '../shared/ErrorState'

export default function FindWorkers({ addToast }) {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      try {
        const { data, error: err } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'worker')
          .limit(50)
        if (err) throw err
        if (mounted) setWorkers(data || [])
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetch()
    return () => { mounted = false }
  }, [])

  const filtered = workers.filter((w) => {
    if (!search) return true
    const q = search.toLowerCase()
    return w.full_name?.toLowerCase().includes(q) || w.skill?.toLowerCase().includes(q) || w.city?.toLowerCase().includes(q)
  })

  if (loading) return <ListSkeleton rows={6} />
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl border border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search workers by name, skill, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-navy"
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Search} title={search ? 'No workers match your search' : 'No workers registered yet'} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((worker) => (
            <div key={worker.id} className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-navy text-white flex items-center justify-center text-xl font-black">
                  {worker.full_name?.charAt(0) || 'W'}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">{worker.full_name || 'Worker'}</h4>
                  <p className="text-sm text-slate-500">{worker.skill || 'Skilled'} • {worker.city || '—'}</p>
                </div>
              </div>
              <button
                onClick={() => addToast?.('Hire request sent!', 'success')}
                className="w-full py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-navy transition-colors"
              >
                Hire Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
