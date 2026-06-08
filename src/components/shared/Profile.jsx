import { useState, useRef, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { useLang } from '../../context/LanguageContext'
import Badge from './Badge'
import {
  Camera, MapPin, Wrench, Star, BadgeCheck, ShieldCheck, Share2,
  Users, Briefcase, Clock, Building2, CheckCircle2,
  UserCheck, Upload, Mail, Phone,
  FileText, User, Settings, Award, Check
} from 'lucide-react'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const SKILLS = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Mason', 'Welder', 'Driver', 'Other']

export default function Profile({ user, userData, setUserData, addToast }) {
  const { t } = useLang()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [toggling, setToggling] = useState(false)
  const [roleStats, setRoleStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [thekedarInfo, setThekedarInfo] = useState(null)
  const fileInputRef = useRef(null)

  const displayName = userData?.full_name || user?.full_name || t('User')
  const userInitials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  const userRole = userData?.role || 'worker'
  const showDocuments = userRole === 'admin' || userRole === 'worker'
  const canToggleAvailability = userRole === 'worker' || userRole === 'thekedar'
  const roleLabel = userRole.charAt(0).toUpperCase() + userRole.slice(1)

  useEffect(() => {
    let mounted = true
    const loadStats = async () => {
      setStatsLoading(true)
      try {
        if (userRole === 'worker') {
          if (userData?.thekedar_id) {
            const { data } = await supabase
              .from('users')
              .select('full_name, phone')
              .eq('id', userData.thekedar_id)
              .maybeSingle()
            if (data && mounted) setThekedarInfo(data)
          }
          const { count } = await supabase
            .from('job_applications')
            .select('id', { count: 'exact', head: true })
            .eq('worker_id', user.id)
            .in('status', ['hired', 'completed'])
          if (mounted) setRoleStats({ jobsDone: count || 0 })
        } else if (userRole === 'contractor') {
          const { count } = await supabase
            .from('jobs')
            .select('id', { count: 'exact', head: true })
            .eq('contractor_id', user.id)
            .eq('status', 'open')
          if (mounted) setRoleStats({ activeJobs: count || 0 })
        } else if (userRole === 'thekedar') {
          const [teamRes, availableRes] = await Promise.all([
            supabase.from('users').select('id', { count: 'exact', head: true }).eq('thekedar_id', user.id),
            supabase.from('users').select('id', { count: 'exact', head: true }).eq('thekedar_id', user.id).eq('available', true),
          ])
          if (mounted) setRoleStats({ teamCount: teamRes.count || 0, availableCount: availableRes.count || 0 })
        } else if (userRole === 'admin') {
          const [workersRes, contractorsRes, thekedarsRes, jobsRes, verifiedRes] = await Promise.all([
            supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'worker'),
            supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'contractor'),
            supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'thekedar'),
            supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'open'),
            supabase.from('users').select('id', { count: 'exact', head: true }).eq('is_verified', true),
          ])
          if (mounted) {
            setRoleStats({
              workers: workersRes.count || 0,
              contractors: contractorsRes.count || 0,
              thekedars: thekedarsRes.count || 0,
              activeJobs: jobsRes.count || 0,
              verified: verifiedRes.count || 0,
            })
          }
        }
      } catch {
        // silent
      } finally {
        if (mounted) setStatsLoading(false)
      }
    }
    loadStats()
    return () => { mounted = false }
  }, [user.id, userRole, userData?.thekedar_id])

  const handleAvailabilityToggle = async () => {
    if (!canToggleAvailability) return
    setToggling(true)
    try {
      const newStatus = !userData?.available
      const { error } = await supabase
        .from('users')
        .update({ available: newStatus })
        .eq('id', user.id)
      if (error) throw error
      setUserData?.({ ...userData, available: newStatus })
      addToast?.(newStatus ? t('You are now available') : t('You are now unavailable'), 'success')
    } catch (err) {
      addToast?.(err.message || t('Error updating status'), 'error')
    } finally {
      setToggling(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const newName = e.target.fullName.value.trim()
      const newEmail = e.target.email.value.trim()
      const newCity = e.target.city?.value?.trim()
      const updates = {}
      if (newName) updates.full_name = newName
      if (newEmail) updates.email = newEmail
      if (newCity) updates.city = newCity

      if (userRole === 'worker') {
        const newSkill = e.target.skill?.value
        const newChowk = e.target.chowk?.value?.trim()
        if (newSkill) updates.skill = newSkill
        if (newChowk) updates.chowk = newChowk
      }

      const photoFile = e.target.photo.files[0]
      if (photoFile) {
        if (photoFile.size > MAX_FILE_SIZE) {
          addToast?.(t('Photo must be under 5MB'), 'error')
          setSaving(false)
          return
        }
        if (!photoFile.type.startsWith('image/')) {
          addToast?.(t('File must be an image'), 'error')
          setSaving(false)
          return
        }
        setUploading(true)
        const ext = photoFile.name.split('.').pop()
        const fileName = `avatar-${user.id}-${Date.now()}.${ext}`
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

      addToast?.(t('Profile updated successfully!'), 'success')
      setUserData?.({ ...userData, ...updates })
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      addToast?.(err.message || t('Error updating profile'), 'error')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const shareOnWhatsApp = () => {
    const text = `${t('I am on Shramik!')} 🛠️\n${t('Name')}: ${displayName}\n${t('Skill')}: ${userData?.skill || t('Skilled Worker')}\n${t('Area')}: ${userData?.chowk || userData?.city || 'Nashik'}\n${t('Contractors can hire me directly on Shramik.')}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const tabs = [
    { id: 'profile', label: t('Profile'), icon: User },
    ...(showDocuments ? [{ id: 'documents', label: t('Documents'), icon: FileText }] : []),
    { id: 'settings', label: t('Settings'), icon: Settings },
  ]

  const renderWorkerCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy"><Wrench size={18} /></div>
          <span className="text-sm text-slate-500 font-medium">{t('Skill')}</span>
        </div>
        <p className="text-lg font-bold text-slate-900">{userData?.skill || t('Not specified')}</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy"><MapPin size={18} /></div>
          <span className="text-sm text-slate-500 font-medium">{t('Area / Chowk')}</span>
        </div>
        <p className="text-lg font-bold text-slate-900">{userData?.chowk || userData?.city || t('Not specified')}</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy"><Star size={18} /></div>
          <span className="text-sm text-slate-500 font-medium">{t('Rating')}</span>
        </div>
        <p className="text-lg font-bold text-slate-900">{userData?.rating ? `${userData.rating} ★` : t('New')}</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy"><Users size={18} /></div>
          <span className="text-sm text-slate-500 font-medium">{t('Thekedar')}</span>
        </div>
        <p className="text-lg font-bold text-slate-900">
          {thekedarInfo ? thekedarInfo.full_name : t('Not linked')}
        </p>
        {thekedarInfo?.phone && (
          <p className="text-xs text-slate-400 mt-0.5">{thekedarInfo.phone}</p>
        )}
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy"><CheckCircle2 size={18} /></div>
          <span className="text-sm text-slate-500 font-medium">{t('Jobs Done')}</span>
        </div>
        <p className="text-lg font-bold text-slate-900">{statsLoading ? '...' : roleStats?.jobsDone || '0'}</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy">{userData?.available ? <CheckCircle2 size={18} /> : <Clock size={18} />}</div>
          <span className="text-sm text-slate-500 font-medium">{t('Availability')}</span>
        </div>
        <p className={`text-lg font-bold ${userData?.available ? 'text-green-600' : 'text-slate-400'}`}>
          {userData?.available ? t('wd_available') : t('wd_not_available')}
        </p>
      </div>
    </div>
  )

  const renderContractorCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy"><MapPin size={18} /></div>
          <span className="text-sm text-slate-500 font-medium">{t('City')}</span>
        </div>
        <p className="text-lg font-bold text-slate-900">{userData?.city || t('Not specified')}</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy"><Briefcase size={18} /></div>
          <span className="text-sm text-slate-500 font-medium">{t('Active Jobs')}</span>
        </div>
        <p className="text-lg font-bold text-slate-900">{statsLoading ? '...' : roleStats?.activeJobs || '0'}</p>
      </div>
    </div>
  )

  const renderThekedarCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy"><Users size={18} /></div>
          <span className="text-sm text-slate-500 font-medium">{t('th_my_team')}</span>
        </div>
        <p className="text-lg font-bold text-slate-900">{statsLoading ? '...' : roleStats?.teamCount || '0'}</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy"><UserCheck size={18} /></div>
          <span className="text-sm text-slate-500 font-medium">{t('Available Workers')}</span>
        </div>
        <p className="text-lg font-bold text-green-600">{statsLoading ? '...' : roleStats?.availableCount || '0'}</p>
      </div>
    </div>
  )

  const renderAdminCards = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy"><Users size={18} /></div>
          <span className="text-sm text-slate-500 font-medium">{t('Workers')}</span>
        </div>
        <p className="text-xl font-bold text-slate-900">{statsLoading ? '...' : roleStats?.workers || '0'}</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy"><Building2 size={18} /></div>
          <span className="text-sm text-slate-500 font-medium">{t('Contractors')}</span>
        </div>
        <p className="text-xl font-bold text-slate-900">{statsLoading ? '...' : roleStats?.contractors || '0'}</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy"><ShieldCheck size={18} /></div>
          <span className="text-sm text-slate-500 font-medium">{t('Thekedars')}</span>
        </div>
        <p className="text-xl font-bold text-slate-900">{statsLoading ? '...' : roleStats?.thekedars || '0'}</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy"><Briefcase size={18} /></div>
          <span className="text-sm text-slate-500 font-medium">{t('Active Jobs')}</span>
        </div>
        <p className="text-xl font-bold text-slate-900">{statsLoading ? '...' : roleStats?.activeJobs || '0'}</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy"><CheckCircle2 size={18} /></div>
          <span className="text-sm text-slate-500 font-medium">{t('Verified Users')}</span>
        </div>
        <p className="text-xl font-bold text-green-600">{statsLoading ? '...' : roleStats?.verified || '0'}</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-navy/10 rounded-lg text-navy"><UserCheck size={18} /></div>
          <span className="text-sm text-slate-500 font-medium">{t('Total Users')}</span>
        </div>
        <p className="text-xl font-bold text-slate-900">
          {statsLoading ? '...' : (roleStats?.workers || 0) + (roleStats?.contractors || 0) + (roleStats?.thekedars || 0)}
        </p>
      </div>
    </div>
  )

  const renderRoleCards = () => {
    if (userRole === 'worker') return renderWorkerCards()
    if (userRole === 'contractor') return renderContractorCards()
    if (userRole === 'thekedar') return renderThekedarCards()
    if (userRole === 'admin') return renderAdminCards()
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Cover + Avatar Card */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="relative h-28 md:h-36 bg-gradient-to-r from-navy to-navy-dark">
          {canToggleAvailability && (
            <button
              onClick={handleAvailabilityToggle}
              disabled={toggling}
              className={`absolute top-3 right-3 md:top-4 md:right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                userData?.available
                  ? 'bg-green-500/20 border-green-400/40 text-green-300 hover:bg-green-500/30'
                  : 'bg-slate-500/20 border-slate-400/40 text-slate-300 hover:bg-slate-500/30'
              }`}
            >
              {toggling ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : userData?.available ? (
                <Check size={14} />
              ) : (
                <Clock size={14} />
              )}
              {userData?.available ? t('wd_available') : t('wd_not_available')}
            </button>
          )}
        </div>

        <div className="px-4 md:px-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-saffron text-white flex items-center justify-center text-3xl md:text-4xl font-black shadow-lg border-4 border-white overflow-hidden">
                {userData?.avatar_url ? (
                  <img src={userData.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  userInitials
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center shadow-md hover:bg-navy-light transition-colors"
                title={t('Change Photo')}
              >
                <Camera size={14} />
              </button>
            </div>

            {/* Name + Info */}
            <div className="flex-1 min-w-0 pt-2 md:pt-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-navy truncate">{displayName}</h1>
                {userData?.is_verified ? (
                  <BadgeCheck size={20} className="text-green-500 shrink-0" />
                ) : (
                  <ShieldCheck size={18} className="text-amber-500 shrink-0" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge variant="primary">{roleLabel}</Badge>
                {userData?.is_verified ? (
                  <Badge variant="success">{t('wd_verified')}</Badge>
                ) : (
                  <Badge variant="warning">{t('wd_not_verified')}</Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><Phone size={14} /> {user?.phone || userData?.phone}</span>
                {userData?.email && (
                  <span className="flex items-center gap-1.5"><Mail size={14} /> {userData.email}</span>
                )}
              </div>
            </div>

            {/* WhatsApp Share for Workers */}
            {userRole === 'worker' && (
              <button
                onClick={shareOnWhatsApp}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-bold hover:bg-green-100 transition-colors border border-green-200"
              >
                <Share2 size={16} />
                {t('wd_share_whatsapp')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 md:px-6 py-3.5 text-sm font-bold transition-all relative ${
                activeTab === tab.id
                  ? 'text-navy'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 md:p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content space-y-6">
              {/* Role-specific Info Cards */}
              <section>
                <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                  <Award size={18} className="text-saffron" />
                  {roleLabel} {t('Overview')}
                </h2>
                {renderRoleCards()}
              </section>

              {/* Edit Form */}
              <section>
                <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                  <User size={18} className="text-saffron" />
                  {t('Edit Profile')}
                </h2>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600">{t('Full Name')}</label>
                        <input
                          name="fullName"
                          type="text"
                          defaultValue={userData?.full_name || ''}
                          placeholder={t('Enter your full name')}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600">{t('Email Address')}</label>
                        <input
                          name="email"
                          type="email"
                          defaultValue={userData?.email || ''}
                          placeholder="name@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600">{t('City')}</label>
                        <input
                          name="city"
                          type="text"
                          defaultValue={userData?.city || ''}
                          placeholder={t('Nashik')}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm"
                        />
                      </div>
                      {userRole === 'worker' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">{t('Skill')}</label>
                            <select
                              name="skill"
                              defaultValue={userData?.skill || ''}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm text-slate-700"
                            >
                              <option value="" disabled>{t('Select your skill')}</option>
                              {SKILLS.map(s => (
                                <option key={s} value={s}>{t(`reg_skill_${s.toLowerCase()}`) || s}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">{t('Chowk / Area')}</label>
                            <input
                              name="chowk"
                              type="text"
                              defaultValue={userData?.chowk || ''}
                              placeholder={t('e.g. Nashik Road, Gangapur')}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all text-sm"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600">{t('Profile Photo')}</label>
                      <input
                        ref={fileInputRef}
                        name="photo"
                        type="file"
                        accept="image/*"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-navy outline-none transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-navy file:text-white hover:file:bg-navy-light file:cursor-pointer cursor-pointer"
                      />
                      <p className="text-xs text-slate-400">{t('Max 5MB. JPEG, PNG, or WebP.')}</p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={saving || uploading}
                        className="px-6 py-3 bg-navy text-white rounded-xl font-bold shadow-md hover:bg-navy-light transition-all disabled:bg-slate-300 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                      >
                        {(uploading || saving) && (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {uploading ? t('Uploading...') : saving ? t('Saving...') : t('Save Changes')}
                      </button>
                      {uploading && <Upload size={16} className="text-navy animate-pulse" />}
                    </div>
                  </form>
                </div>
              </section>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="tab-content">
              <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <FileText size={18} className="text-saffron" />
                {t('Documents')}
              </h2>
              <div className="bg-white rounded-2xl border border-slate-100 p-8 md:p-10 shadow-sm text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText size={28} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">{t('Documents & Verification')}</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  {userRole === 'worker'
                    ? t('Upload your Aadhaar card, certificates, and other documents here to get verified and build trust with contractors.')
                    : t('Review and manage verification documents submitted by workers. Approve or request changes as needed.')}
                </p>
                <p className="text-xs text-slate-400 mt-4">{t('Coming soon')}</p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="tab-content">
              <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <Settings size={18} className="text-saffron" />
                {t('Account Settings')}
              </h2>
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-700 mb-3">{t('Account Information')}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-slate-500">{t('Phone')}</span>
                      <span className="font-medium text-slate-800">{user?.phone || userData?.phone}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-slate-500">{t('Role')}</span>
                      <span className="font-medium text-slate-800">{roleLabel}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-slate-500">{t('Member Since')}</span>
                      <span className="font-medium text-slate-800">
                        {userData?.created_at
                          ? new Date(userData.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : t('N/A')}
                      </span>
                    </div>
                    {canToggleAvailability && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-500">{t('Availability')}</span>
                        <button
                          onClick={handleAvailabilityToggle}
                          disabled={toggling}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                            userData?.available
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {toggling ? '...' : userData?.available ? t('wd_available') : t('wd_not_available')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-700 mb-3">{t('Language')}</h3>
                  <p className="text-sm text-slate-500">{t('Use the language toggle in the header to switch between English and Marathi.')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input for avatar upload trigger */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          if (file.size > MAX_FILE_SIZE) {
            addToast?.(t('Photo must be under 5MB'), 'error')
            return
          }
          if (!file.type.startsWith('image/')) {
            addToast?.(t('File must be an image'), 'error')
            return
          }
          setUploading(true)
          try {
            const ext = file.name.split('.').pop()
            const fileName = `avatar-${user.id}-${Date.now()}.${ext}`
            const { error: uploadErr } = await supabase.storage
              .from('avatars')
              .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true,
                contentType: file.type,
              })
            if (uploadErr) throw uploadErr
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName)
            const { error } = await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', user.id)
            if (error) throw error
            setUserData?.({ ...userData, avatar_url: publicUrl })
            addToast?.(t('Photo updated!'), 'success')
          } catch (err) {
            addToast?.(err.message || t('Error uploading photo'), 'error')
          } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
          }
        }}
      />
    </div>
  )
}
