import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Briefcase, MapPin, Upload, X, CheckCircle } from 'lucide-react'
import Badge from '../shared/Badge'
import EmptyState from '../shared/EmptyState'
import { ListSkeleton } from '../shared/LoadingSkeleton'

export default function MyWork({ applications, loading, addToast, onMarkComplete }) {
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [completionNotes, setCompletionNotes] = useState('')
  const [uploading, setUploading] = useState(false)

  const assigned = applications?.filter(
    (app) => app.status === 'hired' || (app.jobs?.status === 'assigned' && app.jobs?.assigned_worker_id === applications[0]?.worker_id)
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

  const openCompleteModal = (app) => {
    setSelectedApp(app)
    setPhotoFile(null)
    setPhotoPreview(null)
    setCompletionNotes('')
    setShowCompleteModal(true)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleMarkComplete = async () => {
    if (!photoFile) { addToast?.('Please select a completion photo', 'error'); return }
    if (!selectedApp) return
    setUploading(true)
    try {
      const fileExt = photoFile.name.split('.').pop()
      const filePath = `proofs/${selectedApp.job_id}_${selectedApp.worker_id}_${Date.now()}.${fileExt}`

      const { error: uploadErr } = await supabase.storage.from('proofs').upload(filePath, photoFile)
      if (uploadErr) throw uploadErr

      const { data: { publicUrl } } = supabase.storage.from('proofs').getPublicUrl(filePath)

      await supabase.from('jobs').update({
        completion_photo_url: publicUrl,
        completion_notes: completionNotes,
        completed_at: new Date().toISOString()
      }).eq('id', selectedApp.job_id)

      await supabase.from('job_applications').update({ status: 'completed' }).eq('id', selectedApp.id)

      await supabase.from('users').update({ available: true }).eq('id', selectedApp.worker_id)

      addToast?.('Job marked as complete!', 'success')
      setShowCompleteModal(false)
      setPhotoFile(null)
      setPhotoPreview(null)
      setCompletionNotes('')
      setSelectedApp(null)
      onMarkComplete?.()
    } catch (err) {
      addToast?.(err.message || 'Error completing job', 'error')
    } finally {
      setUploading(false)
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
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{app.jobs?.title || 'Unknown Job'}</h3>
                  <p className="text-slate-500 mt-1"><MapPin size={14} className="inline mr-1" />{app.jobs?.location || 'Unknown'}</p>
                </div>
                {(app.status === 'hired' || app.status === 'accepted') && (
                  <button
                    onClick={() => openCompleteModal(app)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-green-600 transition-colors whitespace-nowrap"
                  >
                    <CheckCircle size={14} />
                    Mark Complete
                  </button>
                )}
              </div>
              <div className="mt-4">
                <Badge variant="success">Assigned to you</Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCompleteModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !uploading && setShowCompleteModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-navy">Mark Job Complete</h3>
              <button onClick={() => setShowCompleteModal(false)} className="text-slate-400 hover:text-slate-600" disabled={uploading}>
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-4">Upload a photo as proof of completion for <strong>{selectedApp.jobs?.title}</strong></p>

            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">Completion Photo *</label>
              {photoPreview ? (
                <div className="relative">
                  <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-slate-200" />
                  <button
                    onClick={() => { setPhotoFile(null); setPhotoPreview(null) }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-saffron transition-colors">
                  <Upload size={24} className="text-slate-400 mb-1" />
                  <span className="text-sm text-slate-500">Click to upload photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">Completion Notes</label>
              <textarea
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Add notes about the completed work..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-saffron"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleMarkComplete}
                className="flex-1 px-4 py-2.5 bg-navy text-white rounded-lg text-sm font-bold hover:bg-navy/90 transition-colors disabled:opacity-50"
                disabled={uploading || !photoFile}
              >
                {uploading ? 'Uploading...' : 'Confirm Complete'}
              </button>
            </div>
          </div>
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