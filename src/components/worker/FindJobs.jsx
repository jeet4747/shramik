import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import Badge from '../shared/Badge'
import EmptyState from '../shared/EmptyState'
import { ListSkeleton } from '../shared/LoadingSkeleton'

export default function FindJobs({ jobs, acceptedJobs, onApply, loading }) {
  const [search, setSearch] = useState('')

  const filtered = jobs?.filter((job) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      job.title?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q) ||
      job.trade_needed?.toLowerCase().includes(q)
    )
  }) || []

  if (loading) return <ListSkeleton rows={5} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search jobs by title, location, or trade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-navy"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title={search ? 'No jobs match your search' : 'No jobs available'}
          description={search ? 'Try adjusting your search terms.' : 'Check back later for new opportunities.'}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((job) => (
            <div key={job.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-all gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-navy">{job.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-slate-500 text-sm flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                </div>
              </div>
              <Badge>{job.trade_needed}</Badge>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">₹{job.pay_per_day}/day</p>
                </div>
                {acceptedJobs?.includes(job.id) ? (
                  <span className="px-6 py-2 bg-green-100 text-green-700 rounded-lg font-bold text-sm">Applied ✓</span>
                ) : (
                  <button
                    onClick={() => onApply(job.id)}
                    className="px-6 py-2 bg-navy text-white rounded-lg font-bold hover:bg-navy-light transition-colors"
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
