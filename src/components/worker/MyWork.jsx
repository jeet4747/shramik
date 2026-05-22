import { Briefcase, MapPin } from 'lucide-react'
import Badge from '../shared/Badge'
import EmptyState from '../shared/EmptyState'
import { ListSkeleton } from '../shared/LoadingSkeleton'

export default function MyWork({ applications, loading }) {
  const assigned = applications?.filter(
    (app) => app.status === 'hired' || app.status === 'accepted' || (app.jobs?.status === 'assigned' && app.jobs?.assigned_worker_id === applications[0]?.worker_id)
  ) || []

  if (loading) return <ListSkeleton rows={4} />

  const statusVariant = (status) => {
    switch (status) {
      case 'accepted':
      case 'hired':
        return 'success'
      case 'applied':
        return 'primary'
      default:
        return 'warning'
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-navy">My Assigned Jobs</h2>
      {assigned.length === 0 ? (
        <EmptyState icon={Briefcase} title="No assigned jobs yet" description="Jobs you get hired for will appear here." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assigned.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-green-500">
              <h3 className="text-lg font-bold text-slate-900">{app.jobs?.title || 'Unknown Job'}</h3>
              <p className="text-slate-500 mt-1"><MapPin size={14} className="inline mr-1" />{app.jobs?.location || 'Unknown'}</p>
              <div className="mt-4">
                <Badge variant="success">Assigned to you</Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold text-navy mt-8">My Applications</h2>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Job Title</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Location</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {applications?.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-10 text-slate-400">No applications yet</td></tr>
              ) : (
                applications?.map((app) => {
                  const isActuallyAssigned = app.jobs?.status === 'assigned' && app.jobs?.assigned_worker_id === app.worker_id
                  const displayStatus = isActuallyAssigned ? 'accepted' : app.status
                  return (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">{app.jobs?.title}</td>
                      <td className="px-6 py-4 text-slate-600">{app.jobs?.location}</td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariant(displayStatus)}>{displayStatus}</Badge>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
