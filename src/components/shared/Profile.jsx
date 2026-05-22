import { useState, useRef } from 'react'
import { supabase } from '../../supabaseClient'

const MAX_FILE_SIZE = 5 * 1024 * 1024

export default function Profile({ user, userData, setUserData, addToast }) {
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const displayName = userData?.full_name || user?.user_metadata?.full_name || 'User'
  const userInitials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const newName = e.target.fullName.value.trim()
      const newEmail = e.target.email.value.trim()

      const updates = { full_name: newName }
      if (newEmail) updates.email = newEmail

      const photoFile = e.target.photo.files[0]
      if (photoFile) {
        if (photoFile.size > MAX_FILE_SIZE) {
          addToast?.('Photo must be under 5MB', 'error')
          setSaving(false)
          return
        }
        if (!photoFile.type.startsWith('image/')) {
          addToast?.('File must be an image', 'error')
          setSaving(false)
          return
        }

        setUploading(true)
        const fileName = `avatar-${user.id}-${Date.now()}.${photoFile.name.split('.').pop()}`
        const { error: uploadErr } = await supabase.storage
          .from('avatars')
          .upload(fileName, photoFile, {
            cacheControl: '3600',
            upsert: true,
            contentType: photoFile.type,
          })

        if (uploadErr) throw uploadErr

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)

        updates.avatar_url = publicUrl
      }

      const { error } = await supabase.from('users').update(updates).eq('id', user.id)
      if (error) throw error

      addToast?.('Profile updated successfully!', 'success')
      setUserData?.({ ...userData, ...updates })
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      addToast?.(err.message || 'Error updating profile', 'error')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="h-32 bg-navy" />
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-4">
            <div className="w-24 h-24 rounded-3xl bg-saffron text-white flex items-center justify-center text-3xl font-black shadow-lg border-4 border-white overflow-hidden">
              {userData?.avatar_url ? (
                <img src={userData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                userInitials
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-navy">{displayName}</h2>
          <p className="text-slate-500">{user?.phone}</p>
          {userData?.email && <p className="text-slate-500 font-medium">{userData.email}</p>}

          <div className="mt-8 pt-8 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Full Name</label>
                  <input
                    name="fullName"
                    type="text"
                    defaultValue={userData?.full_name || ''}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-navy"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={userData?.email || ''}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-navy"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">Profile Photo</label>
                <input
                  ref={fileInputRef}
                  name="photo"
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-navy file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-navy file:text-white hover:file:bg-navy-light"
                />
                <p className="text-xs text-slate-400">Max 5MB. JPEG, PNG, or WebP.</p>
              </div>

              <button
                type="submit"
                disabled={saving || uploading}
                className="px-6 py-3 bg-navy text-white rounded-xl font-bold shadow-md hover:bg-navy-light transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
