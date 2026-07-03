import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { MapPin } from 'lucide-react'
import Badge from '../shared/Badge'
import EmptyState from '../shared/EmptyState'
import { ListSkeleton } from '../shared/LoadingSkeleton'

export default function MyJobs({ user, jobs, onJobsUpdated, addToast }) {
  const [selectedJob, setSelectedJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [loadingApps, setLoadingApps] = useState(false)

  const myJobs = jobs?.filter((job) => job.contractor_id === user.id && job.status === 'open') || []

  const fetchApplications = async (jobId) => {
    setSelectedJob(jobId)
    setLoadingApps(true)
    try {
      const { data } = await supabase
        .from('job_applications')
        .select('*, users(full_name, phone)')
        .eq('job_id', jobId)
        .eq('status', 'applied')
        .order('id', { ascending: true })
      setApplications(data || [])
    } catch (err) {
      console.error('Error fetching applications:', err)
      setApplications([])
    } finally {
      setLoadingApps(false)
    }
  }

  const handleApprove = async (jobId, workerId) => {
    try {
      const { data: job, error: jobErr } = await supabase
        .from('jobs')
        .select('id, contractor_id, status')
        .eq('id', jobId)
        .single()

      if (jobErr) throw jobErr
      if (!job) return addToast?.('Job not found', 'error')
      if (job.contractor_id !== user.id) return addToast?.('Unauthorized', 'error')
      if (job.status !== 'open') return addToast?.('Job already assigned', 'warning')

      const { error: assignErr } = await supabase
        .from('jobs')
        .update({ status: 'assigned', assigned_worker_id: workerId })
        .eq('id', jobId)
        .eq('status', 'open')

      if (assignErr) throw assignErr

      await supabase.from('job_applications').update({ status: 'hired' }).eq('job_id', jobId).eq('worker_id', workerId)
      await supabase.from('job_applications').update({ status: 'rejected' }).eq('job_id', jobId).neq('worker_id', workerId)

      await supabase.from('users').update({ available: false }).eq('id', workerId)

      addToast?.('Worker assigned successfully', 'success')
      setApplications([])
      setSelectedJob(null)
      if (onJobsUpdated) onJobsUpdated()
    } catch (err) {
      addToast?.(err.message || 'Error assigning worker', 'error')
    }
  }

  if (myJobs.length === 0) {
    return <EmptyState icon={MapPin} title="No jobs posted yet" description="Post your first job to find skilled workers." />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {myJobs.map((job) => (
        <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-navy">{job.title}</h3>
              <p className="text-slate-500 flex items-center gap-1 mt-1">
                <MapPin size={14} /> {job.location} • ₹{job.pay_per_day}/day
              </p>
            </div>
            <Badge variant={job.status === 'open' ? 'success' : 'warning'}>{job.status}</Badge>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <button
              onClick={() => fetchApplications(job.id)}
              className="text-navy font-bold text-sm bg-slate-50 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors w-full mb-4"
            >
              {selectedJob === job.id ? 'Hide Applicants' : 'View Applicants'}
            </button>

            {selectedJob === job.id && (
              <div className="space-y-3">
                {loadingApps ? (
                  <p className="text-slate-400 text-sm">Loading...</p>
                ) : applications.length === 0 ? (
                  <p className="text-slate-400 text-sm">No applications yet</p>
                ) : (
                  applications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <span className="font-bold text-slate-900 block">{app.users?.full_name || 'Worker'}</span>
                        <span className="text-xs text-slate-500">{app.users?.phone}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(job.id, app.worker_id)}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-bold shadow-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={async () => {
                            await supabase.from('job_applications').update({ status: 'rejected' }).eq('id', app.id)
                            setApplications(applications.filter((a) => a.id !== app.id))
                            addToast?.('Rejected', 'error')
                          }}
                          className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-sm font-bold"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
