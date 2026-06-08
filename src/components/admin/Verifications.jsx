import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { BadgeCheck, UserCheck, X, Upload, Camera, FileText, MapPin, User, Check } from 'lucide-react'
import Badge from '../shared/Badge'
import EmptyState from '../shared/EmptyState'
import { TableSkeleton } from '../shared/LoadingSkeleton'
import ErrorState from '../shared/ErrorState'

const ICON_MAP = { aadhaar: FileText, pan: FileText, selfie: Camera, chowk_photo: MapPin }
const LABEL_MAP = { aadhaar: 'Aadhaar Card', pan: 'PAN Card', selfie: 'Selfie', chowk_photo: 'Chowk Location' }

export default function Verifications({ addToast }) {
  const [queue, setQueue] = useState([])
  const [unverified, setUnverified] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('pending')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [files, setFiles] = useState({ aadhaar: null, pan: null, selfie: null, chowk_photo: null })
  const [previews, setPreviews] = useState({ aadhaar: null, pan: null, selfie: null, chowk_photo: null })
  const [uploading, setUploading] = useState(false)

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
            .eq('is_verified', false)
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

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((p) => { if (p) URL.revokeObjectURL(p) })
    }
  }, [previews])

  const openModal = (user) => {
    setSelectedUser(user)
    setFiles({ aadhaar: null, pan: null, selfie: null, chowk_photo: null })
    setPreviews({ aadhaar: null, pan: null, selfie: null, chowk_photo: null })
    setModalOpen(true)
  }

  const closeModal = () => {
    Object.values(previews).forEach((p) => { if (p) URL.revokeObjectURL(p) })
    setModalOpen(false)
    setSelectedUser(null)
    setFiles({ aadhaar: null, pan: null, selfie: null, chowk_photo: null })
    setPreviews({ aadhaar: null, pan: null, selfie: null, chowk_photo: null })
  }

  const handleFileChange = (field, file) => {
    if (previews[field]) URL.revokeObjectURL(previews[field])
    setFiles((prev) => ({ ...prev, [field]: file }))
    setPreviews((prev) => ({ ...prev, [field]: file ? URL.createObjectURL(file) : null }))
  }

  const uploadFile = async (file, userId, field) => {
    const ext = file.name.split('.').pop()
    const path = `${userId}/${field}_${Date.now()}.${ext}`
    const { error: uploadErr } = await supabase.storage
      .from('verifications')
      .upload(path, file, { upsert: true })
    if (uploadErr) throw uploadErr
    const { data: { publicUrl } } = supabase.storage
      .from('verifications')
      .getPublicUrl(path)
    return publicUrl
  }

  const submitVerification = async () => {
    if (!selectedUser) return
    const required = ['aadhaar', 'pan', 'selfie', 'chowk_photo']
    const missing = required.filter((f) => !files[f])
    if (missing.length) {
      addToast?.(`Please upload: ${missing.map((f) => LABEL_MAP[f]).join(', ')}`, 'error')
      return
    }

    setUploading(true)
    try {
      const urls = {}
      for (const field of required) {
        urls[`${field}_url`] = await uploadFile(files[field], selectedUser.id, field)
      }

      const { error: upsertErr } = await supabase
        .from('verification_documents')
        .upsert({
          user_id: selectedUser.id,
          ...urls,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })

      if (upsertErr) throw upsertErr

      const { error: userErr } = await supabase
        .from('users')
        .update({ is_verified: true, updated_at: new Date().toISOString() })
        .eq('id', selectedUser.id)

      if (userErr) throw userErr

      setUnverified((prev) => prev.filter((u) => u.id !== selectedUser.id))
      addToast?.('Worker verified successfully!', 'success')
      closeModal()
    } catch (err) {
      addToast?.(err.message || 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

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
                          onClick={() => openModal(u)}
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

      {/* Verification Document Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <User size={18} className="text-navy" />
                <div>
                  <h3 className="font-bold text-navy text-sm">Upload Verification Documents</h3>
                  <p className="text-xs text-slate-400">{selectedUser.full_name}</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {['aadhaar', 'pan', 'selfie', 'chowk_photo'].map((field) => {
                const Icon = ICON_MAP[field]
                const label = LABEL_MAP[field]
                return (
                  <div key={field}>
                    <label className="flex items-center gap-2 text-xs font-bold text-navy mb-1.5">
                      <Icon size={14} /> {label}
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-navy/40 transition-colors text-xs text-slate-400">
                        <Upload size={14} />
                        <span>{files[field] ? files[field].name : 'Choose file...'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(field, e.target.files[0])}
                        />
                      </label>
                      {previews[field] && (
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                          <img src={previews[field]} alt={label} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4">
              <button
                onClick={submitVerification}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f97316] text-white rounded-lg text-sm font-bold hover:bg-[#e8630e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check size={16} /> Submit Verification
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
