import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from './supabaseClient'
import { Toast } from './components/Toast'
import { useToast } from './hooks/useToast'
import Register from './components/Register'
import PhoneLogin from './components/PhoneLogin'
import RoleSelection from './components/RoleSelection'
import LandingPage from './components/LandingPage'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import MobileNav from './components/layout/MobileNav'
import WorkerDashboard from './components/worker/WorkerDashboard'
import FindJobs from './components/worker/FindJobs'
import MyWork from './components/worker/MyWork'
import Earnings from './components/worker/Earnings'
import ContractorDashboard from './components/contractor/ContractorDashboard'
import PostJob from './components/contractor/PostJob'
import FindWorkers from './components/contractor/FindWorkers'
import MyJobs from './components/contractor/MyJobs'
import HiredWorkers from './components/contractor/HiredWorkers'
import AdminDashboard from './components/admin/AdminDashboard'
import Verifications from './components/admin/Verifications'
import ActivityFeed from './components/admin/ActivityFeed'
import CityCoverage from './components/admin/CityCoverage'
import Profile from './components/shared/Profile'

export default function App() {
  const [role, setRole] = useState(null)
  const [activeTab, setActiveTab] = useState('home')
  const { toasts, addToast, removeToast } = useToast()
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [realJobs, setRealJobs] = useState([])
  const [myApplications, setMyApplications] = useState([])
  const [openJobs, setOpenJobs] = useState([])
  const [acceptedJobs, setAcceptedJobs] = useState([])
  const [available, setAvailable] = useState(true)
  const authInitialized = useRef(false)

  // Auth session — runs once
  useEffect(() => {
    if (authInitialized.current) return
    authInitialized.current = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription?.unsubscribe()
  }, [])

  // Fetch user role when user changes
  useEffect(() => {
    if (!user) {
      setRole(null) // eslint-disable-line react-hooks/set-state-in-effect
      setUserData(null)
      return
    }
    let cancelled = false
    const fetchRole = async () => {
      try {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        if (data && !cancelled) {
          setUserData(data)
          if (data.role) {
            setRole(data.role)
            setActiveTab(data.role === 'admin' ? 'stats' : 'home')
          }
        }
      } catch {
        // User record may not exist yet
      }
    }
    fetchRole()
    return () => { cancelled = true }
  }, [user])

  const displayName = userData?.full_name || user?.user_metadata?.full_name || (user?.phone ? `User ${user.phone.slice(-4)}` : 'User')
  const userInitials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  // Data fetching
  const fetchJobs = useCallback(async () => {
    try {
      const { data: jobs } = await supabase.from('jobs').select('*')
      if (jobs) setRealJobs(jobs)
    } catch {
      // Silently fail — data will remain stale
    }
  }, [])

  const fetchOpenJobs = useCallback(async () => {
    try {
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('id', { ascending: false })

      if (jobs) {
        const { data: hiredApps } = await supabase
          .from('job_applications')
          .select('job_id')
          .in('status', ['hired', 'accepted'])

        if (hiredApps?.length > 0) {
          const hiredJobIds = hiredApps.map(a => a.job_id)
          setOpenJobs(jobs.filter(job => !hiredJobIds.includes(job.id)))
        } else {
          setOpenJobs(jobs)
        }
      }
    } catch {
      // Silently fail
    }
  }, [])

  const fetchMyApplications = useCallback(async () => {
    if (!user) return
    try {
      const { data: apps } = await supabase
        .from('job_applications')
        .select('*, jobs(*)')
        .eq('worker_id', user.id)
      if (apps) {
        setMyApplications(apps)
        setAcceptedJobs(apps.map(a => a.job_id))
      }
    } catch {
      // Silently fail
    }
  }, [user])

  // Initial data load
  const initialLoadDone = useRef(false)
  useEffect(() => {
    if (initialLoadDone.current) return
    initialLoadDone.current = true
    fetchJobs()
    fetchOpenJobs()
    fetchMyApplications()
  }, [fetchJobs, fetchOpenJobs, fetchMyApplications])

  // Refresh applications when switching to mywork tab
  useEffect(() => {
    if (activeTab === 'mywork' && user) {
      fetchMyApplications() // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [activeTab, user, fetchMyApplications])

  const handleRoleSelect = async (selectedRole) => {
    setRole(selectedRole)
    setActiveTab(selectedRole === 'admin' ? 'stats' : 'home')
    if (user) {
      try {
        await supabase.from('users').upsert({
          id: user.id,
          phone: user.phone,
          role: selectedRole,
        }, { onConflict: 'id' })
      } catch {
        // Ignore upsert errors
      }
    }
    addToast(`Logged in as ${selectedRole}`, 'success')
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    setActiveTab('home')
    addToast('Logged out successfully', 'info')
  }

  const applyToJob = async (jobId) => {
    if (!user) return
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert([{ job_id: jobId, worker_id: user.id, status: 'applied' }])

      if (error) {
        if (error.code === '23505') {
          addToast('Already applied to this job', 'warning')
        } else {
          addToast(error.message, 'error')
        }
        return
      }
      setAcceptedJobs(prev => [...prev, jobId])
      addToast('Applied successfully', 'success')
    } catch (err) {
      addToast(err.message || 'Error applying', 'error')
    }
  }

  const handleToggleAvailability = async () => {
    setAvailable(prev => !prev)
    if (user) {
      try {
        await supabase.from('users').update({ available: !available }).eq('id', user.id)
      } catch {
        // Ignore — UI already updated
      }
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Toast toasts={toasts} removeToast={removeToast} />
      {showRegister && <Register onClose={() => setShowRegister(false)} onSuccess={(user) => { if (user) setUser(user); setShowRegister(false); addToast('Welcome to Shramik!', 'success') }} />}
      {showLogin && <PhoneLogin onClose={() => setShowLogin(false)} onLoginSuccess={(u) => { setUser(u); setShowLogin(false); addToast('Logged in successfully!', 'success') }} />}

      {!user ? (
        <LandingPage onSelect={handleRoleSelect} onLogin={() => setShowLogin(true)} onRegister={() => setShowRegister(true)} />
      ) : !role ? (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
          <RoleSelection onSelect={handleRoleSelect} />
        </div>
      ) : (
        <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
          <Sidebar role={role} activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />
          <MobileNav role={role} activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />

          <main className="flex-1 h-screen overflow-y-auto pb-24 md:pb-0">
            <Header
              role={role}
              activeTab={activeTab}
              userInitials={userInitials}
              avatarUrl={userData?.avatar_url}
              available={available}
              onToggleAvailability={handleToggleAvailability}
              addToast={addToast}
            />

            <div className="p-6 max-w-7xl mx-auto tab-content">
              {role === 'worker' && (
                <>
                  {activeTab === 'home' && (
                    <WorkerDashboard
                      user={user}
                      userData={userData}
                      openJobs={openJobs}
                      acceptedJobs={acceptedJobs}
                      onApply={applyToJob}
                      onViewJobs={() => setActiveTab('jobs')}
                      addToast={addToast}
                    />
                  )}
                  {activeTab === 'jobs' && (
                    <FindJobs jobs={openJobs} acceptedJobs={acceptedJobs} onApply={applyToJob} />
                  )}
                  {activeTab === 'mywork' && <MyWork applications={myApplications} />}
                  {activeTab === 'earnings' && <Earnings user={user} />}
                </>
              )}

              {role === 'contractor' && (
                <>
                  {activeTab === 'home' && <ContractorDashboard user={user} />}
                  {activeTab === 'post' && <PostJob user={user} onJobPosted={fetchJobs} addToast={addToast} />}
                  {activeTab === 'find' && <FindWorkers addToast={addToast} />}
                  {activeTab === 'myjobs' && <MyJobs user={user} jobs={realJobs} onJobsUpdated={fetchJobs} addToast={addToast} />}
                  {activeTab === 'hired' && <HiredWorkers user={user} />}
                </>
              )}

              {role === 'admin' && (
                <>
                  {activeTab === 'stats' && <AdminDashboard user={user} />}
                  {activeTab === 'verify' && <Verifications addToast={addToast} />}
                  {activeTab === 'activity' && <ActivityFeed />}
                  {activeTab === 'cities' && <CityCoverage />}
                </>
              )}

              {activeTab === 'profile' && (
                <Profile user={user} userData={userData} setUserData={setUserData} addToast={addToast} />
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
