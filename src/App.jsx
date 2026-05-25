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
  const initialized = useRef(false)

  // Restore session from localStorage on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const saved = localStorage.getItem('shramik_user')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUser(parsed) // eslint-disable-line react-hooks/set-state-in-effect
      } catch {
        localStorage.removeItem('shramik_user')
      }
    }
  }, [])

  // Fetch user data from DB when user changes
  useEffect(() => {
    if (!user) {
      setRole(null) // eslint-disable-line react-hooks/set-state-in-effect
      setUserData(null)
      return
    }

    let cancelled = false
    const fetchData = async () => {
      try {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (data && !cancelled) {
          setUserData(data)
          if (data.role) {
            setRole(data.role)
            setActiveTab(data.role === 'admin' ? 'stats' : 'home')
          }
        }
      } catch {
        // User record may not exist yet or DB issue
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
    } catch {
      // Silently fail
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
    } catch {
      // Silently fail
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
    } catch {
      // Silently fail
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

  // Refresh applications when switching to mywork tab
  useEffect(() => {
    if (activeTab === 'mywork' && user) {
      fetchMyApplications() // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [activeTab, user, fetchMyApplications])

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
      } catch {
        // Ignore
      }
    }
    addToast(`Logged in as ${selectedRole}`, 'success')
  }

  const logout = () => {
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
      } catch {
        // Ignore
      }
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Toast toasts={toasts} removeToast={removeToast} />
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
                  {activeTab === 'home' && <ContractorDashboard user={user} userData={userData} />}
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
