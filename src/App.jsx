import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'
import {
  Hammer, User, Briefcase, BarChart3, Home, Search, PlusCircle, Users, CheckCircle2,
  MapPin, Clock, IndianRupee, LogOut, Menu, X, ArrowRight, ShieldCheck, MessageCircle,
  Filter, Bell, ChevronRight, Star, TrendingUp, Building2, Eye, Trash2, Check, ExternalLink,
  Download, Smartphone, Shield, Award, BadgeCheck
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import Wordmark from './components/Wordmark';
import { Toast, useToast } from './components/Toast';
import Register from './components/Register';
import PhoneLogin from './components/PhoneLogin';
import RoleSelection from './components/RoleSelection';
import * as mockData from './data/mockData';
import LandingPage from './components/LandingPage';

// --- SHARED COMPONENTS ---

const Badge = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-orange-100 text-orange-700',
    primary: 'bg-navy/10 text-navy',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant] || styles.default}`}>
      {children}
    </span>
  );
};

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg text-navy">
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-sm text-slate-500 font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
  </div>
);

const JobApplications = ({ jobId, supabase, addToast, onJobUpdated }) => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('job_applications')
        .select('*, users(full_name, phone)')
        .eq('job_id', jobId)
      if (data) setApplications(data)
      setLoading(false)
    }
    fetch()
  }, [jobId])

  if (loading) return <p className="text-slate-400 text-sm">Loading...</p>
  if (applications.length === 0) return <p className="text-slate-400 text-sm">Koi application nahi abhi</p>

  return (
    <div className="space-y-3 mt-4">
      <p className="text-sm font-bold text-slate-600">{applications.length} Application(s)</p>
      {applications.map(app => (
        <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
          <div>
            <p className="font-bold text-slate-900">{app.users?.full_name || 'Worker'}</p>
            <p className="text-xs text-slate-500">{app.users?.phone}</p>
          </div>
          {app.status === 'applied' && (
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await supabase.from('job_applications').update({ status: 'hired' }).eq('id', app.id)
                  setApplications(applications.map(a => a.id === app.id ? { ...a, status: 'hired' } : a))
                  await supabase.from('jobs').update({ status: 'filled' }).eq('id', jobId)
                  addToast(`Worker hired!`, "success")
                  if (onJobUpdated) onJobUpdated()
                }}
                className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-bold"
              >Approve ✓</button>
              <button
                onClick={async () => {
                  await supabase.from('job_applications').update({ status: 'rejected' }).eq('id', app.id)
                  setApplications(applications.map(a => a.id === app.id ? { ...a, status: 'rejected' } : a))
                  addToast(`Rejected`, "error")
                }}
                className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-sm font-bold"
              >Reject ✗</button>
            </div>
          )}
          {app.status !== 'applied' && (
            <Badge variant={app.status === 'hired' ? 'success' : 'warning'}>{app.status}</Badge>
          )}
        </div>
      ))}
    </div>
  )
}


// --- MAIN APP COMPONENT ---

export default function App() {
  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toasts, addToast, removeToast } = useToast();
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [realJobs, setRealJobs] = useState([])
  const [realWorkers, setRealWorkers] = useState([])
  const [myApplications, setMyApplications] = useState([])
  const [openJobs, setOpenJobs] = useState([]);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [available, setAvailable] = useState(true);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [ongoingJobs, setOngoingJobs] = useState([]);
  const [contractorJobsList, setContractorJobsList] = useState(mockData.contractorJobs);
  const [hiredList, setHiredList] = useState(mockData.hiredWorkers);
  const [verificationQueue, setVerificationQueue] = useState(mockData.pendingVerifications);
  const [viewApplicantsFor, setViewApplicantsFor] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
  }, [])

  useEffect(() => {
    const fetchRoleFromDB = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setUserData(data);
        if (data.role) {
          setRole(data.role);
          setActiveTab(data.role === 'admin' ? 'stats' : 'home');
        }
      }
    };
    fetchRoleFromDB();
  }, [user]);

  const displayName = userData?.full_name || user?.user_metadata?.full_name || (user?.phone ? `User ${user.phone.slice(-4)}` : 'User');
  const userInitials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const fetchJobs = async () => {
    const { data: jobs } = await supabase.from('jobs').select('*')
    if (jobs) setRealJobs(jobs)
  }

  async function fetchOpenJobs() {
    const { data: jobs, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "open")
      .order("id", { ascending: false });

    if (!error && jobs) {
      // 10x Developer Hack: Forcefully scrub out jobs that have been hired,
      // in case the Supabase jobs table RLS silently blocked the status update!
      const { data: hiredApps } = await supabase
        .from("job_applications")
        .select("job_id")
        .in("status", ["hired", "accepted"]);

      if (hiredApps && hiredApps.length > 0) {
        const hiredJobIds = hiredApps.map(a => a.job_id);
        const trulyOpenJobs = jobs.filter(job => !hiredJobIds.includes(job.id));
        setOpenJobs(trulyOpenJobs);
      } else {
        setOpenJobs(jobs);
      }
    }
  }

  async function fetchAssignedJobs(workerId) {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("assigned_worker_id", workerId)
      .eq("status", "assigned")
      .order("id", { ascending: false });

    if (!error) setAssignedJobs(data || []);
  }

  async function fetchApplications(jobId) {
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .eq("job_id", jobId)
      .eq("status", "applied")
      .order("id", { ascending: true });

    if (!error) setJobApplications(data || []);
  }

  async function applyToJob(jobId, workerId) {
    const { error } = await supabase
      .from("job_applications")
      .insert([{ job_id: jobId, worker_id: workerId, status: "applied" }]);

    if (error) {
      if (error.code === "23505") {
        addToast?.("Already applied to this job", "warning");
      } else {
        addToast?.(error.message, "error");
      }
      return;
    }

    setAcceptedJobs([...acceptedJobs, jobId]);
    addToast?.("Applied successfully", "success");
  }

  async function approveWorkerForJob(jobId, selectedWorkerId, contractorId) {
    // 1) Verify owner + open status
    const { data: job, error: jobErr } = await supabase
      .from("jobs")
      .select("id, contractor_id, status")
      .eq("id", jobId)
      .single();

    if (jobErr) return addToast?.(jobErr.message, "error");
    if (!job) return addToast?.("Job not found", "error");
    if (job.contractor_id !== contractorId) return addToast?.("Unauthorized", "error");
    if (job.status !== "open") return addToast?.("Job already assigned", "warning");

    // 2) Assign in jobs table
    const { data: updatedJob, error: assignErr } = await supabase
      .from("jobs")
      .update({
        status: "assigned"
      })
      .eq("id", jobId)
      .eq("status", "open")
      .select();

    if (assignErr) return addToast?.(assignErr.message, "error");
    if (!updatedJob || updatedJob.length === 0) {
      alert("🔴 CRITICAL DATABASE ERROR: Supabase RLS Policy is silently blocking you from updating the 'jobs' table! Because of this, the job's status remains 'open' and it will continue showing up in the Find Jobs feed for everyone. YOU MUST GO TO SUPABASE AND EITHER COMPLETELY DISABLE RLS FOR THE 'jobs' TABLE, OR ADD AN 'UPDATE' POLICY FOR CONTRACTORS.");
      return; // Stop execution so they are forced to fix it!
    }

    // 3) Mark selected hired (Fallback to hired instead of accepted, since DB constraint might require it)
    const { error: acceptedErr } = await supabase
      .from("job_applications")
      .update({ status: "hired" })
      .eq("job_id", jobId)
      .eq("worker_id", selectedWorkerId);

    if (acceptedErr) {
      console.error("Soft Fail: Could not update job_application status:", acceptedErr);
      // Soft-fail: We don't return here because the main 'jobs' table WAS successfully updated.
    }

    // 4) Mark others rejected
    const { error: rejectedErr } = await supabase
      .from("job_applications")
      .update({ status: "rejected" })
      .eq("job_id", jobId)
      .neq("worker_id", selectedWorkerId);

    if (rejectedErr) {
      console.error("Soft Fail: Could not update other applications:", rejectedErr);
    }

    addToast?.("Worker assigned successfully", "success");

    // refresh lists
    setOpenJobs((prev) => prev.filter((j) => j.id !== jobId));
    await fetchOpenJobs();
    if (user?.role === "worker") await fetchAssignedJobs(user.id);
  }

  useEffect(() => {
    const fetchAll = async () => {
      await fetchJobs()
      const { data: workers } = await supabase.from('users').select('*').eq('role', 'worker')
      if (workers) setRealWorkers(workers)
      if (user) {
        const { data: apps } = await supabase
          .from('job_applications')
          .select('*, jobs(*)')
          .eq('worker_id', user.id)
        if (apps) {
          setMyApplications(apps);
          setAcceptedJobs(apps.map(a => a.job_id));
        }
      }
    }
    fetchAll()
  }, [user])

  useEffect(() => {
    if (!user?.id) return;

    fetchOpenJobs();

    if (role === "worker") {
      fetchAssignedJobs(user.id);
    }
  }, [user?.id, role]);

  useEffect(() => {
    if (activeTab === 'mywork' && user) {
      const fetchApps = async () => {
        const { data: apps } = await supabase
          .from('job_applications')
          .select('*, jobs(*)')
          .eq('worker_id', user.id);
        if (apps) setMyApplications(apps);
      }
      fetchApps();
      fetchAssignedJobs(user.id);
    }
  }, [activeTab, user]);

  const handleRoleSelect = async (selectedRole) => {
    setRole(selectedRole);
    setActiveTab(selectedRole === 'admin' ? 'stats' : 'home');

    // Ensure the user exists in the public.users table to satisfy foreign keys
    if (user) {
      await supabase.from('users').upsert({
        id: user.id,
        phone: user.phone,
        role: selectedRole
      }, { onConflict: 'id' });
    }

    addToast(`Logged in as ${selectedRole === 'worker' ? 'Worker' : selectedRole === 'contractor' ? 'Contractor' : 'Admin'}`, 'success');
  };

  const handleLoginSignup = () => {
    setShowLogin(true);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setActiveTab('home');
    addToast("Logged out successfully", "info");
  };

  const NavItem = ({ id, label, icon: Icon }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
          ? 'bg-navy text-white shadow-lg'
          : 'text-slate-500 hover:bg-slate-100 hover:text-navy'
          }`}
      >
        <Icon size={20} />
        <span className="font-semibold">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-bg">
      <Toast toasts={toasts} removeToast={removeToast} />
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSuccess={(msg) => {
            addToast(msg, "success");
            setShowRegister(false);
          }}
        />
      )}
      {showLogin && (
        <PhoneLogin
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(u) => {
            setUser(u);
            setShowLogin(false);
            addToast("Logged in successfully!", "success");
          }}
        />
      )}

      {!user ? (
        <LandingPage onSelect={handleRoleSelect} onLogin={handleLoginSignup} onRegister={() => setShowRegister(true)} />
      ) : !role ? (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
          <RoleSelection onSelect={handleRoleSelect} />
        </div>
      ) : (
        <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar - Desktop */}
          <aside className={`hidden md:flex flex-col w-72 bg-white border-r border-slate-100 p-6 z-20 transition-all ${!isSidebarOpen ? '-ml-72' : ''}`}>
            <div className="mb-10">
              <Wordmark />
            </div>
            <nav className="flex-1 space-y-2">
              {role === 'worker' && (
                <>
                  <NavItem id="home" label="Home" icon={Home} />
                  <NavItem id="jobs" label="Find Jobs" icon={Search} />
                  <NavItem id="mywork" label="My Work" icon={Briefcase} />
                  <NavItem id="earnings" label="Earnings" icon={IndianRupee} />
                  <NavItem id="profile" label="Profile" icon={User} />
                </>
              )}
              {role === 'contractor' && (
                <>
                  <NavItem id="home" label="Overview" icon={BarChart3} />
                  <NavItem id="post" label="Post Job" icon={PlusCircle} />
                  <NavItem id="find" label="Find Workers" icon={Users} />
                  <NavItem id="myjobs" label="My Jobs" icon={Briefcase} />
                  <NavItem id="hired" label="Hired" icon={CheckCircle2} />
                  <NavItem id="profile" label="Profile" icon={User} />
                </>
              )}
              {role === 'admin' && (
                <>
                  <NavItem id="stats" label="Platform Stats" icon={BarChart3} />
                  <NavItem id="verify" label="Verifications" icon={ShieldCheck} />
                  <NavItem id="activity" label="Activity Feed" icon={TrendingUp} />
                  <NavItem id="cities" label="City Coverage" icon={MapPin} />
                </>
              )}
            </nav>
            <button
              onClick={logout}
              className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-semibold transition-colors"
            >
              <LogOut size={20} />
              <span>Exit Dashboard</span>
            </button>
          </aside>

          {/* Mobile Nav Bar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50">
            <button onClick={() => setActiveTab('home')} className={`p-2 ${activeTab === 'home' ? 'text-navy' : 'text-slate-400'}`}><Home size={24} /></button>
            {role === 'worker' && <button onClick={() => setActiveTab('jobs')} className={`p-2 ${activeTab === 'jobs' ? 'text-navy' : 'text-slate-400'}`}><Search size={24} /></button>}
            {role === 'contractor' && <button onClick={() => setActiveTab('post')} className={`p-2 ${activeTab === 'post' ? 'text-navy' : 'text-slate-400'}`}><PlusCircle size={24} /></button>}
            <button onClick={() => setActiveTab(role === 'admin' ? 'verify' : 'profile')} className={`p-2 ${activeTab === 'profile' || activeTab === 'verify' ? 'text-navy' : 'text-slate-400'}`}><User size={24} /></button>
            <button onClick={logout} className="p-2 text-red-400"><LogOut size={24} /></button>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 h-screen overflow-y-auto pb-24 md:pb-0">
            <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-2 flex justify-between items-center z-10">
              <div className="md:hidden"><Wordmark /></div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h1>
              </div>
              <div className="flex items-center gap-4">
                {role === 'worker' && (
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                    <span className={`w-2.5 h-2.5 rounded-full ${available ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                    <span className="text-sm font-semibold text-slate-600">{available ? 'Available' : 'Busy'}</span>
                    <button
                      onClick={() => {
                        setAvailable(!available);
                        addToast(`Status changed to ${!available ? 'Available' : 'Busy'}`, 'info');
                      }}
                      className={`w-10 h-6 rounded-full relative transition-colors ${available ? 'bg-green-500' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${available ? 'left-5' : 'left-1'}`}></div>
                    </button>
                  </div>
                )}
                <div className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center font-bold overflow-hidden shadow-sm">
                  {userData?.avatar_url ? (
                    <img src={userData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    userInitials
                  )}
                </div>
              </div>
            </header>

            <div className="p-6 max-w-7xl mx-auto tab-content">
              {/* WORKER TABS */}
              {role === 'worker' && (
                <>
                  {activeTab === 'home' && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-extrabold text-navy">Namaste, {displayName} 👋</h2>
                        <p className="text-slate-500">Aaj Nashik mein kaafi kaam hai aapke liye.</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard title="Jobs Done" value="47" icon={CheckCircle2} />
                        <StatCard title="This Month" value="₹18,400" icon={IndianRupee} trend="+12%" />
                        <StatCard title="Active Jobs" value="2" icon={Clock} />
                        <StatCard title="Rating" value="4.7 ★" icon={Star} />
                      </div>
                      <section>
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-slate-800">New Jobs Near You</h3>
                          <button onClick={() => setActiveTab('jobs')} className="text-navy font-semibold text-sm flex items-center gap-1">View All <ChevronRight size={16} /></button>
                        </div>
                        {openJobs.length === 0 ? (
                          <p className="text-slate-400 text-center py-10">Abhi koi job nahi hai</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {openJobs.map((job) => (
                              <div key={job.id} className={`p-6 rounded-2xl border transition-all ${acceptedJobs.includes(job.id) ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 hover:shadow-lg'}`}>
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h4 className="text-lg font-bold text-slate-900">{job.title}</h4>
                                    <p className="text-sm text-slate-500 mt-1">{job.trade_needed}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xl font-bold text-navy">₹{job.pay_per_day}</p>
                                    <p className="text-xs text-slate-500">Per Day</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mb-4 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                                  <MapPin size={14} /> {job.location}
                                </div>
                                {acceptedJobs.includes(job.id) ? (
                                  <div className="w-full py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                    <Check size={20} /> Accepted
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => applyToJob(job.id, user.id)}
                                    className="w-full py-3 bg-saffron hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
                                  >
                                    Accept Job
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    </div>
                  )}

                  {activeTab === 'jobs' && (
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="text" placeholder="Search Nashik jobs..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-navy" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {openJobs.map(job => (
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
                              <button
                                onClick={() => applyToJob(job.id, user.id)}
                                className="px-6 py-2 bg-navy text-white rounded-lg font-bold"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'mywork' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-navy">My Assigned Jobs</h2>
                      {myApplications.filter(app => app.status === 'hired' || app.status === 'accepted' || (app.jobs?.status === 'assigned' && app.jobs?.assigned_worker_id === user.id)).length === 0 ? (
                        <p className="text-slate-400">No assigned jobs yet</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {myApplications.filter(app => app.status === 'hired' || app.status === 'accepted' || (app.jobs?.status === 'assigned' && app.jobs?.assigned_worker_id === user.id)).map((app) => (
                            <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-green-500">
                              <h3 className="text-lg font-bold text-slate-900">{app.jobs?.title || 'Unknown Job'}</h3>
                              <p className="text-slate-500 mt-1"><MapPin size={14} className="inline mr-1" />{app.jobs?.location || 'Unknown Location'}</p>
                              <div className="mt-4">
                                <Badge variant="success">Status: Assigned to you</Badge>
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
                              {myApplications.length === 0 ? (
                                <tr><td colSpan={3} className="text-center py-10 text-slate-400">Koi application nahi abhi</td></tr>
                              ) : (
                                myApplications.map((app) => {
                                  // Fallback: If DB failed to update application status, but job is assigned to this worker, consider it accepted
                                  const isActuallyAssigned = app.jobs?.status === 'assigned' && app.jobs?.assigned_worker_id === user.id;
                                  const displayStatus = isActuallyAssigned ? 'accepted' : app.status;

                                  return (
                                    <tr key={app.id} className="hover:bg-slate-50">
                                      <td className="px-6 py-4 font-semibold text-slate-900">{app.jobs?.title}</td>
                                      <td className="px-6 py-4 text-slate-600">{app.jobs?.location}</td>
                                      <td className="px-6 py-4">
                                        <Badge variant={displayStatus === 'accepted' || displayStatus === 'hired' ? 'success' : displayStatus === 'applied' ? 'primary' : 'warning'}>
                                          {displayStatus}
                                        </Badge>
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
                  )}

                  {activeTab === 'earnings' && (
                    <div className="space-y-6">
                      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-slate-500 font-medium mb-1">Total This Week</h3>
                        <h2 className="text-4xl font-black text-navy mb-8">₹5,000</h2>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockData.earningsData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="day" axisLine={false} tickLine={false} />
                              <YAxis axisLine={false} tickLine={false} />
                              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                {mockData.earningsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.amount > 0 ? '#1a3c6e' : '#e2e8f0'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}


                </>
              )}

              {/* CONTRACTOR TABS */}
              {role === 'contractor' && (
                <>
                  {activeTab === 'home' && (
                    <div className="space-y-8">
                      <h2 className="text-3xl font-extrabold text-navy">Welcome, {displayName} 👋</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard title="Active Jobs" value={realJobs.length} icon={Briefcase} />
                        <StatCard title="Workers Hired" value="12" icon={Users} />
                        <StatCard title="Pending Applications" value="7" icon={Clock} />
                        <StatCard title="Month Spend" value="₹54,000" icon={IndianRupee} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'post' && (
                    <div className="max-w-3xl mx-auto">
                      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h2 className="text-2xl font-bold text-navy mb-6">Post a New Job</h2>
                        <form className="space-y-6" onSubmit={async (e) => {
                          e.preventDefault();
                          const form = e.target;

                          // Pehle user ko users table mein ensure karo
                          await supabase.from('users').upsert({
                            id: user.id,
                            phone: user.phone,
                            role: 'contractor'
                          }, { onConflict: 'id' });

                          // Phir job insert karo
                          const { error } = await supabase.from('jobs').insert({
                            contractor_id: user.id,
                            title: form.title.value,
                            trade_needed: form.trade.value,
                            location: form.location.value,
                            pay_per_day: parseInt(form.pay.value),
                            status: 'open'
                          });
                          if (error) {
                            addToast("Error posting job!", "error");
                          } else {
                            addToast("Job Posted Successfully!", "success");
                            form.reset();
                            const { data: jobs } = await supabase.from('jobs').select('*')
                            if (jobs) setRealJobs(jobs)
                          }
                        }}>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-600">Job Title</label>
                              <input name="title" type="text" placeholder="e.g. Wiring Work - 2BHK" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-navy" required />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-600">Skill Required</label>
                              <select name="trade" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-navy">
                                <option>Electrician</option>
                                <option>Plumber</option>
                                <option>Carpenter</option>
                                <option>Helper</option>
                                <option>Painter</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-600">Location</label>
                              <input name="location" type="text" placeholder="e.g. Nashik Road" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-navy" required />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-600">Pay Per Day (₹)</label>
                              <input name="pay" type="number" placeholder="800" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-navy" required />
                            </div>
                          </div>
                          <button type="submit" className="w-full py-4 bg-navy text-white rounded-xl font-bold text-lg shadow-lg hover:bg-navy-light transition-all">Post Job</button>
                        </form>
                      </div>
                    </div>
                  )}

                  {activeTab === 'find' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {realWorkers.length === 0 ? (
                        <p className="text-slate-400 col-span-3 text-center py-10">Koi worker nahi mila</p>
                      ) : (
                        realWorkers.map(worker => (
                          <div key={worker.id} className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-16 h-16 rounded-2xl bg-navy text-white flex items-center justify-center text-xl font-black">
                                {worker.full_name?.charAt(0) || 'W'}
                              </div>
                              <div>
                                <h4 className="font-bold text-lg text-slate-900">{worker.full_name || 'Worker'}</h4>
                                <p className="text-sm text-slate-500">{worker.city}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => addToast(`Hire request sent!`, "success")}
                              className="w-full py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-navy transition-colors"
                            >
                              Hire Now
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'myjobs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {realJobs.filter(job => job.contractor_id === user.id).length === 0 ? (
                        <p className="text-slate-400 col-span-2 text-center py-10">Koi job post nahi ki abhi</p>
                      ) : (
                        realJobs.filter(job => job.contractor_id === user.id && job.status === 'open').map(job => (
                          <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-navy">{job.title}</h3>
                                <p className="text-slate-500 flex items-center gap-1 mt-1">
                                  <MapPin size={14} /> {job.location} • ₹{job.pay_per_day}/day
                                </p>
                              </div>
                              <Badge variant={job.status === 'open' ? 'success' : 'warning'}>
                                {job.status}
                              </Badge>
                            </div>

                            {/* Applications Section */}
                            <div className="mt-4 border-t border-slate-100 pt-4">
                              <button
                                onClick={() => fetchApplications(job.id)}
                                className="text-navy font-bold text-sm bg-slate-50 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors w-full mb-4"
                              >
                                View Applicants
                              </button>

                              <div className="space-y-3">
                                {jobApplications
                                  .filter((a) => a.job_id === job.id)
                                  .map((app) => (
                                    <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                                      <div>
                                        <span className="font-bold text-slate-900 block">Worker ID: {app.worker_id?.substring(0, 8)}...</span>
                                        <Badge variant="primary" className="mt-1">{app.status}</Badge>
                                      </div>
                                      <button
                                        onClick={() => approveWorkerForJob(job.id, app.worker_id, user.id)}
                                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-bold shadow-sm"
                                      >
                                        Approve
                                      </button>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {activeTab === 'hired' && (
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                              <th className="px-6 py-4 text-sm font-bold text-slate-600">Worker</th>
                              <th className="px-6 py-4 text-sm font-bold text-slate-600">Skill</th>
                              <th className="px-6 py-4 text-sm font-bold text-slate-600">Pay</th>
                              <th className="px-6 py-4 text-sm font-bold text-slate-600">Contact</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {hiredList.map(worker => (
                              <tr key={worker.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-bold text-slate-900">{worker.name}</td>
                                <td className="px-6 py-4"><Badge>{worker.skill}</Badge></td>
                                <td className="px-6 py-4 font-bold text-navy">₹{worker.pay}/day</td>
                                <td className="px-6 py-4">
                                  <a href={`https://wa.me/91${worker.phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                    <MessageCircle size={16} /> WhatsApp
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ADMIN TABS */}
              {role === 'admin' && (
                <>
                  {activeTab === 'stats' && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Total Workers" value="1,240" icon={Users} trend="+84" />
                        <StatCard title="Contractors" value="87" icon={Building2} trend="+12" />
                        <StatCard title="Jobs Today" value="34" icon={Briefcase} trend="+5" />
                        <StatCard title="Completed" value="412" icon={CheckCircle2} trend="+18%" />
                      </div>
                    </div>
                  )}

                  {activeTab === 'verify' && (
                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-navy">Worker Verification Queue</h2>
                        <Badge variant="warning">{verificationQueue.length} Pending</Badge>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-6 py-4 text-sm font-bold text-slate-600">Name</th>
                              <th className="px-6 py-4 text-sm font-bold text-slate-600">Skill</th>
                              <th className="px-6 py-4 text-sm font-bold text-slate-600">Location</th>
                              <th className="px-6 py-4 text-sm font-bold text-slate-600">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {verificationQueue.map(worker => (
                              <tr key={worker.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-bold">{worker.name}</td>
                                <td className="px-6 py-4"><Badge>{worker.skill}</Badge></td>
                                <td className="px-6 py-4 text-slate-600">{worker.location}</td>
                                <td className="px-6 py-4">
                                  <div className="flex gap-2">
                                    <button onClick={() => { setVerificationQueue(verificationQueue.filter(w => w.id !== worker.id)); addToast(`${worker.name} approved!`, "success"); }} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-bold">Approve</button>
                                    <button onClick={() => { setVerificationQueue(verificationQueue.filter(w => w.id !== worker.id)); addToast(`${worker.name} rejected.`, "error"); }} className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-sm font-bold">Reject</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'activity' && (
                    <div className="max-w-2xl mx-auto space-y-4">
                      {mockData.activityFeed.map(item => (
                        <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                          <div className={`w-2 h-12 rounded-full ${item.type === 'job' ? 'bg-navy' : item.type === 'hire' ? 'bg-green-500' : 'bg-saffron'}`}></div>
                          <div>
                            <p className="text-slate-800 font-medium">{item.text}</p>
                            <p className="text-xs text-slate-400 font-bold mt-1">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'cities' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {mockData.cityData.map(city => (
                        <div key={city.city} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                          <span className="text-4xl mb-4">{city.emoji}</span>
                          <h3 className="text-xl font-black text-navy">{city.city}</h3>
                          <Badge variant={city.status === 'Active' ? 'success' : 'warning'}>{city.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* SHARED TABS */}
              {activeTab === 'profile' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                    <div className="h-32 bg-navy"></div>
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
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          const newName = e.target.fullName.value;
                          const newEmail = e.target.email.value;

                          const updates = { full_name: newName };
                          if (newEmail) updates.email = newEmail;

                          // Handle Photo Upload via Base64
                          const photoFile = e.target.photo.files[0];
                          if (photoFile) {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              updates.avatar_url = reader.result;
                              const { error } = await supabase.from('users').update(updates).eq('id', user.id);
                              if (error) {
                                addToast?.(error.message, 'error');
                              } else {
                                addToast?.('Profile updated successfully!', 'success');
                                setUserData({ ...userData, ...updates });
                              }
                            };
                            reader.readAsDataURL(photoFile);
                            return; // Stop here, reader will handle the submit
                          }

                          const { error } = await supabase
                            .from('users')
                            .update(updates)
                            .eq('id', user.id);

                          if (error) {
                            addToast?.(error.message, 'error');
                          } else {
                            addToast?.('Profile updated successfully!', 'success');
                            setUserData({ ...userData, ...updates });
                          }
                        }} className="space-y-4">

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
                              name="photo"
                              type="file"
                              accept="image/*"
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-navy file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-navy file:text-white hover:file:bg-navy-light"
                            />
                            <p className="text-xs text-slate-400">Choose an image to upload as your profile picture. It will be saved securely.</p>
                          </div>

                          <button type="submit" className="px-6 py-3 bg-navy text-white rounded-xl font-bold shadow-md hover:bg-navy-light transition-all">
                            Save Changes
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}