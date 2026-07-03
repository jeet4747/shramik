import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, isSupabaseReady, USE_DUMMY_OTP } from './supabaseClient'
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
import ThekedarDashboard from './components/thekedar/ThekedarDashboard'
import ContractorDashboard from './components/contractor/ContractorDashboard'
import PostJob from './components/contractor/PostJob'
import FindWorkers from './components/contractor/FindWorkers'
import MyJobs from './components/contractor/MyJobs'
import HiredWorkers from './components/contractor/HiredWorkers'
import AdminDashboard from './components/admin/AdminDashboard'
import Verifications from './components/admin/Verifications'
import ActivityFeed from './components/admin/ActivityFeed'
import CityCoverage from './components/admin/CityCoverage'
import InstallBanner from './components/InstallBanner'
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
  const initialized = useRef(false)

  // Initialize auth + session
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const init = async () => {
      // Try to restore Supabase session
      const { data: { session } } = await supabase.auth.getSession()
      const saved = localStorage.getItem('shramik_user')

      if (session?.user) {
        setUser({ id: session.user.id, phone: session.user.phone, role: null })
        return
      }

      // Fallback: restore from localStorage (backward compat)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setUser(parsed)
        } catch (err) {
          console.error('Failed to parse stored user:', err)
          localStorage.removeItem('shramik_user')
        }
      }
    }
    init()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({ id: session.user.id, phone: session.user.phone, role: null })
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setRole(null)
        setUserData(null)
        localStorage.removeItem('shramik_user')
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  // Fetch user data from DB when user changes
  useEffect(() => {
    if (!user) return

    let cancelled = false
    const fetchData = async () => {
      try {
        // Dev mode: use dummy data from localStorage instead of Supabase
        if (USE_DUMMY_OTP) {
          const raw = localStorage.getItem('shramik_dummy_data')
          if (raw) {
            const dummy = JSON.parse(raw)
            if (!cancelled) {
              setUserData(dummy)
              if (dummy.role) {
                setRole(dummy.role)
                setActiveTab(dummy.role === 'admin' ? 'stats' : 'home')
              }
            }
            return
          }
        }

        let { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        // Fallback: if ID not found (e.g. after DB reset), find by phone
        if (!data && user.phone) {
          const { data: byPhone } = await supabase
            .from('users')
            .select('*')
            .eq('phone', user.phone)
            .maybeSingle()
          if (byPhone) data = byPhone
        }

        if (data && !cancelled) {
          const role = user.role || data.role
          const session = { id: data.id, phone: data.phone, role }
          localStorage.setItem('shramik_user', JSON.stringify(session))
          if (data.id !== user.id) setUser(session)
          if (data.role !== role) {
            await supabase.from('users').update({ role }).eq('id', data.id)
          }
          setUserData(data)
          if (role) {
            setRole(role)
            setActiveTab(role === 'admin' ? 'stats' : 'home')
          }
        }
      } catch {
        console.error('Failed to fetch user data')
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [user])

  const displayName = userData?.full_name || user?.full_name || 'User'
  const userInitials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  // Data fetching
  const fetchJobs = useCallback(async () => {
    try {
      const { data } = await supabase.from('jobs').select('*')
      if (Array.isArray(data)) setRealJobs(data)
    } catch (err) {
      console.error('Error fetching jobs:', err)
    }
  }, [])

  const fetchOpenJobs = useCallback(async () => {
    try {
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('id', { ascending: false })

      if (Array.isArray(jobs)) {
        const { data: hiredApps } = await supabase
          .from('job_applications')
          .select('job_id')
          .in('status', ['hired', 'accepted'])

        if (Array.isArray(hiredApps) && hiredApps.length > 0) {
          const hiredJobIds = hiredApps.map(a => a.job_id)
          setOpenJobs(jobs.filter(job => !hiredJobIds.includes(job.id)))
        } else {
          setOpenJobs(jobs)
        }
      }
    } catch (err) {
      console.error('Error fetching open jobs:', err)
    }
  }, [])

  const fetchMyApplications = useCallback(async () => {
    if (!user) return
    try {
      const { data } = await supabase
        .from('job_applications')
        .select('*, jobs(*)')
        .eq('worker_id', user.id)

      if (Array.isArray(data)) {
        setMyApplications(data)
        setAcceptedJobs(data.map(a => a.job_id))
      }
    } catch (err) {
      console.error('Error fetching applications:', err)
    }
  }, [user])

  // Initial data load
  const dataLoaded = useRef(false)
  useEffect(() => {
    if (dataLoaded.current) return
    dataLoaded.current = true
    fetchJobs()
    fetchOpenJobs()
    fetchMyApplications()
  }, [fetchJobs, fetchOpenJobs, fetchMyApplications])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'mywork' && user) fetchMyApplications()
  }

  const setCurrentUser = (userData) => {
    const session = { id: userData.id, phone: userData.phone, role: userData.role }
    localStorage.setItem('shramik_user', JSON.stringify(session))
    setUser(session)
    setUserData(userData)
    if (userData.role) {
      setRole(userData.role)
      setActiveTab(userData.role === 'admin' ? 'stats' : 'home')
    }
  }

  const handleRoleSelect = async (selectedRole) => {
    setRole(selectedRole)
    setActiveTab(selectedRole === 'admin' ? 'stats' : 'home')
    if (user) {
      try {
        const { data } = await supabase
          .from('users')
          .update({ role: selectedRole })
          .eq('id', user.id)
          .select()
          .maybeSingle()

        if (data) {
          const session = { id: data.id, phone: data.phone, role: data.role }
          localStorage.setItem('shramik_user', JSON.stringify(session))
          setUser(session)
          setUserData(data)
        }
      } catch (err) {
        console.error('Error updating role:', err)
      }
    }
    addToast(`Logged in as ${selectedRole}`, 'success')
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Supabase signOut failed, proceeding with local logout:', err)
    }
    localStorage.removeItem('shramik_user')
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
      } catch (err) {
        console.error('Error toggling availability:', err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Toast toasts={toasts} removeToast={removeToast} />
      <InstallBanner />
      {!isSupabaseReady && (
        <div style={{background:'#dc2626',color:'white',padding:'16px',textAlign:'center',fontSize:'14px',zIndex:99999}}>
          Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel env vars and redeploy.
        </div>
      )}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSuccess={(data) => { setCurrentUser(data); addToast('Welcome to Shramik!', 'success') }}
        />
      )}
      {showLogin && (
        <PhoneLogin
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(data) => { setCurrentUser(data); addToast('Signed in successfully!', 'success') }}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true) }}
        />
      )}

      {!user ? (
        <LandingPage
          onSelect={handleRoleSelect}
          onLogin={() => setShowLogin(true)}
          onRegister={() => setShowRegister(true)}
        />
      ) : !role ? (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
          <RoleSelection onSelect={handleRoleSelect} />
        </div>
      ) : (
        <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
          <Sidebar role={role} activeTab={activeTab} onTabChange={handleTabChange} onLogout={logout} />
          <MobileNav role={role} activeTab={activeTab} onTabChange={handleTabChange} onLogout={logout} />

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
                  {activeTab === 'mywork' && (
                    <MyWork
                      applications={myApplications}
                      addToast={addToast}
                      onMarkComplete={fetchMyApplications}
                    />
                  )}
                  {activeTab === 'earnings' && <Earnings user={user} />}
                </>
              )}

              {role === 'thekedar' && (
                <>
                  {activeTab === 'home' && <ThekedarDashboard user={user} addToast={addToast} />}
                  {activeTab === 'find' && <FindWorkers addToast={addToast} />}
                </>
              )}

              {role === 'contractor' && (
                <>
                  {activeTab === 'home' && <ContractorDashboard user={user} userData={userData} />}
                  {activeTab === 'post' && <PostJob user={user} onJobPosted={fetchJobs} addToast={addToast} />}
                  {activeTab === 'find' && <FindWorkers addToast={addToast} />}
                  {activeTab === 'myjobs' && <MyJobs user={user} jobs={realJobs} onJobsUpdated={fetchJobs} addToast={addToast} />}
                  {activeTab === 'hired' && <HiredWorkers user={user} />}
                </>
              )}

              {role === 'admin' && (
                <>
                  {activeTab === 'stats' && <AdminDashboard />}
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
