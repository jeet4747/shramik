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
  const [realJobs, setRealJobs] = useState([])
  const [realWorkers, setRealWorkers] = useState([])
  const [myApplications, setMyApplications] = useState([])
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

  const fetchJobs = async () => {
    const { data: jobs } = await supabase.from('jobs').select('*')
    if (jobs) setRealJobs(jobs)
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
        if (apps) setMyApplications(apps)
      }
    }
    fetchAll()
  }, [user])

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setActiveTab(selectedRole === 'admin' ? 'stats' : 'home');
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
                <div className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center font-bold">
                  {role === 'worker' ? 'RK' : role === 'contractor' ? 'SC' : 'AD'}
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
                        <h2 className="text-3xl font-extrabold text-navy">Namaste, Ramesh bhai 👋</h2>
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
                        {realJobs.filter(j => j.status === 'open').length === 0 ? (
                          <p className="text-slate-400 text-center py-10">Abhi koi job nahi hai</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {realJobs.filter(j => j.status === 'open').map((job) => (
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
                                    onClick={async () => {
                                      setAcceptedJobs([...acceptedJobs, job.id]);
                                      await supabase.from('job_applications').insert({
                                        job_id: job.id,
                                        worker_id: user.id,
                                        status: 'applied'
                                      });
                                      addToast("Job accepted! Contractor will contact you.", "success");
                                    }}
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
                        {realJobs.filter(j => j.status === 'open').map(job => (
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
                                onClick={async () => {
                                  await supabase.from('job_applications').insert({
                                    job_id: job.id,
                                    worker_id: user.id,
                                    status: 'applied'
                                  });
                                  addToast("Applied successfully!", "success");
                                }}
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
                              myApplications.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-4 font-semibold text-slate-900">{app.jobs?.title}</td>
                                  <td className="px-6 py-4 text-slate-600">{app.jobs?.location}</td>
                                  <td className="px-6 py-4">
                                    <Badge variant={app.status === 'hired' ? 'success' : app.status === 'applied' ? 'primary' : 'warning'}>
                                      {app.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
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

                  {activeTab === 'profile' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="h-32 bg-navy"></div>
                        <div className="px-8 pb-8">
                          <div className="relative -mt-12 mb-4">
                            <div className="w-24 h-24 rounded-3xl bg-saffron text-white flex items-center justify-center text-3xl font-black shadow-lg border-4 border-white">
                              RK
                            </div>
                          </div>
                          <h2 className="text-2xl font-bold text-navy">Ramesh Kumar</h2>
                          <p className="text-slate-500">{user?.phone}</p>
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
                      <h2 className="text-3xl font-extrabold text-navy">Welcome, Suresh Contractors 👋</h2>
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
                            <JobApplications jobId={job.id} supabase={supabase} addToast={addToast} onJobUpdated={fetchJobs} />
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
            </div>
          </main>
        </div>
      )}
    </div>
  );
}