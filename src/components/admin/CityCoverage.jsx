import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import Badge from '../shared/Badge'
import { CardSkeleton } from '../shared/LoadingSkeleton'
import ErrorState from '../shared/ErrorState'

export default function CityCoverage() {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      try {
        const { data, error: err } = await supabase
          .from('users')
          .select('city, role')
          .not('city', 'is', null)

        if (err) throw err

        const cityMap = {}
        data?.forEach((u) => {
          if (!u.city) return
          const c = u.city.toLowerCase()
          if (!cityMap[c]) cityMap[c] = { city: u.city, workers: 0, contractors: 0 }
          if (u.role === 'worker') cityMap[c].workers++
          if (u.role === 'contractor') cityMap[c].contractors++
        })

        if (mounted) setCities(Object.values(cityMap).sort((a, b) => b.workers - a.workers))
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetch()
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />
  if (cities.length === 0) return <p className="text-slate-400 text-center py-10">No city data yet. Workers will appear as they register.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cities.map((c) => (
        <div key={c.city} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <h3 className="text-xl font-black text-navy mb-2 capitalize">{c.city}</h3>
          <div className="text-sm text-slate-500 space-y-1 mb-3">
            <p>{c.workers} workers</p>
            <p>{c.contractors} contractors</p>
          </div>
          <Badge variant={c.workers > 0 ? 'success' : 'warning'}>
            {c.workers > 0 ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      ))}
    </div>
  )
}
