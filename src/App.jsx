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

// --- SCREEN: LANDING PAGE ---

const LandingPage = ({ onSelect, onLogin, onRegister }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    } else {
      alert("Shramik can be installed from your browser menu (Add to Home Screen).");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans selection:bg-saffron/30">
      {/* Government/Official Top Bar */}
      <div className="bg-[#0f2b5b] text-white py-1.5 px-6 text-xs md:text-sm font-medium flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-3 opacity-90">
          <span className="flex items-center gap-1.5"><Shield size={14} className="text-saffron" /> An Initiative for the National Workforce</span>
        </div>
        <div className="flex items-center gap-4 opacity-80 font-semibold tracking-wider uppercase text-[10px] md:text-xs">
          <span>Skill India Compliant</span>
          <span className="hidden sm:inline">|</span>
          <span>Aadhaar Verified Network</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex flex-wrap justify-between items-center z-50 shadow-sm">
        <Wordmark />
        <div className="flex flex-wrap items-center gap-3 md:gap-5 mt-4 sm:mt-0">
          <button onClick={handleInstallClick} className="hidden md:flex items-center gap-2 text-slate-600 font-bold hover:text-navy transition-colors px-3 py-2 text-sm bg-slate-100 rounded-lg border border-slate-200">
            <Download size={16} /> Install App
          </button>
          <button onClick={onLogin} className="text-navy font-bold hover:text-saffron transition-colors px-3 py-2 text-sm md:text-base">Log In</button>
          <button onClick={onRegister} className="bg-gradient-to-r from-[#0f2b5b] to-[#1a3c6e] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all active:scale-95 text-sm md:text-base border border-[#0f2b5b]">Register Now</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32 flex flex-col items-center text-center max-w-6xl mx-auto">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-saffron/10 via-transparent to-transparent -z-10"></div>

        <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-50 text-green-700 rounded-full font-bold text-xs uppercase tracking-widest mb-8 border border-green-200 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          National Pilot Now Live in Nashik
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#0f2b5b] leading-[1.15] mb-8 tracking-tight">
          Empowering India's <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#d95d12]">Unorganized Sector</span>
        </h1>

        <p className="text-lg md:text-2xl text-slate-600 max-w-4xl mb-12 leading-relaxed font-medium">
          A unified, secure, and transparent digital ecosystem connecting skilled workers with verified employment opportunities. Eradicating exploitation and ensuring financial inclusion for the blue-collar workforce.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button onClick={onLogin} className="px-10 py-4 bg-[#0f2b5b] text-white rounded-lg font-bold text-lg shadow-xl shadow-navy/20 hover:bg-navy transition-all transform hover:-translate-y-0.5 border border-transparent">
            Access the Portal
          </button>
          <button onClick={handleInstallClick} className="px-10 py-4 bg-white text-[#0f2b5b] border-2 border-[#0f2b5b] rounded-lg font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
            <Download size={20} /> Install Web Application
          </button>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-slate-200 w-full max-w-4xl opacity-80">
          <div className="flex flex-col items-center">
            <h4 className="text-3xl font-black text-[#0f2b5b]">1.2M+</h4>
            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Target Workers</p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-3xl font-black text-[#0f2b5b]">₹0</h4>
            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Commission Taken</p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-3xl font-black text-[#0f2b5b]">100%</h4>
            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Aadhaar Verified</p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-3xl font-black text-[#0f2b5b]">24/7</h4>
            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Support Grid</p>
          </div>
        </div>
      </section>

      {/* The Problem & Solution Framework */}
      <section id="manifesto" className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f2b5b] tracking-tight">The Operational Framework</h2>
            <div className="w-24 h-1 bg-saffron mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Current State */}
            <div className="space-y-6 p-10 bg-[#fafafa] rounded-2xl border border-slate-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="rotate-180" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Current Ecosystem</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg font-medium">
                The existing blue-collar job market operates informally, leading to systemic inefficiencies and lack of social security for workers.
              </p>
              <ul className="space-y-5 mt-8">
                {['Fragmented and informal job discovery', 'High exploitation by unauthorized intermediaries', 'Absence of verifiable work history or financial footprint'].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-700 font-semibold">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5"><X size={14} className="text-slate-500" /></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shramik State */}
            <div className="space-y-6 p-10 bg-[#0f2b5b] text-white rounded-2xl shadow-2xl shadow-navy/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full -z-10"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-white/20 text-white rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">Shramik Integration</h3>
              </div>
              <p className="text-white/80 leading-relaxed text-lg font-medium">
                A centralized infrastructure that directly connects authenticated workers with verified contractors, ensuring transparency and accountability.
              </p>
              <ul className="space-y-5 mt-8">
                {['Direct algorithmic matching based on verified skills', 'Zero-commission model maximizing worker earnings', 'Digital identity generation for future credit access'].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-white/90 font-semibold">
                    <div className="w-6 h-6 rounded-full bg-saffron flex items-center justify-center flex-shrink-0 mt-0.5"><Check size={14} className="text-white" /></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* Certifications & Trust */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#0f2b5b] tracking-tight">Recognized & Certified</h2>
            <div className="w-16 h-1 bg-saffron mx-auto mt-4 rounded-full"></div>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              We operate with the highest standards of security and official government compliance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-6 hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-4 rounded-xl text-[#0f2b5b]">
                <BadgeCheck size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Govt. Certified MSME</h3>
                <p className="text-slate-600 leading-relaxed font-medium text-sm">
                  Officially registered and recognized as an MSME Business by the Government of India, ensuring trust, reliability, and regulatory compliance in all our operations.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-6 hover:shadow-md transition-shadow">
              <div className="bg-orange-50 p-4 rounded-xl text-saffron">
                <Award size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">ISO 27001 Certified</h3>
                <p className="text-slate-600 leading-relaxed font-medium text-sm">
                  Adhering to strict international standards for Information Security Management Systems (ISMS), guaranteeing that your data is protected at all times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f2b5b] text-white py-12 px-6 border-t-4 border-saffron">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-2 rounded-lg">
                <Hammer size={24} className="text-[#0f2b5b]" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight block">Shramik</span>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80 text-saffron">Har Haath Ko Kaam</span>
              </div>
            </div>
            <p className="text-white/60 text-sm font-medium max-w-sm leading-relaxed">
              A technological initiative dedicated to organizing India's informal labor sector, promoting dignity, security, and economic growth.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-6 text-sm font-bold opacity-80">
              <a href="#" className="hover:text-saffron transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-saffron transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-saffron transition-colors">Verification Guidelines</a>
            </div>
            <div className="text-white/40 text-xs font-semibold">
              © 2026 Shramik Platform Initiative. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

export default function App() {

  const [role, setRole] = useState(null); // null = Landing Page
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toasts, addToast, removeToast } = useToast();

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
  }, [])

  // Local state for interactive elements
  const [available, setAvailable] = useState(true);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [ongoingJobs, setOngoingJobs] = useState(mockData.myJobs.filter(j => j.status === 'Ongoing').map(j => j.id));
  const [contractorJobsList, setContractorJobsList] = useState(mockData.contractorJobs);
  const [hiredList, setHiredList] = useState(mockData.hiredWorkers);
  const [verificationQueue, setVerificationQueue] = useState(mockData.pendingVerifications);
  const [viewApplicantsFor, setViewApplicantsFor] = useState(null);

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
            <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10">
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
              {/* --- WORKER DASHBOARD TABS --- */}
              {role === 'worker' && (
                <>
                  {activeTab === 'home' && (
                    <div className="space-y-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-3xl font-extrabold text-navy">Namaste, Ramesh bhai 👋</h2>
                          <p className="text-slate-500">Aaj Nashik mein kaafi kaam hai aapke liye.</p>
                        </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {mockData.nearbyJobs.map((job) => (
                            <div key={job.id} className={`p-6 rounded-2xl border transition-all ${acceptedJobs.includes(job.id) ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 hover:shadow-lg'}`}>
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="text-lg font-bold text-slate-900">{job.title}</h4>
                                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                    <span>{job.contractor}</span>
                                    {job.verified && <ShieldCheck size={14} className="text-blue-500" />}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-navy">₹{job.pay}</p>
                                  <p className="text-xs text-slate-500">Per Day</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1 text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded">
                                  <MapPin size={14} /> {job.location} ({job.distance})
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-6">
                                {job.skills.map(s => <Badge key={s}>{s}</Badge>)}
                              </div>

                              {acceptedJobs.includes(job.id) ? (
                                <div className="w-full py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                  <Check size={20} /> Accepted
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setAcceptedJobs([...acceptedJobs, job.id]);
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
                      </section>
                    </div>
                  )}

                  {activeTab === 'jobs' && (
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="text" placeholder="Search Nashik jobs..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-navy transition-all" />
                        </div>
                        <div className="flex gap-2">
                          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium"><Filter size={16} /> Filter</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {mockData.nearbyJobs.map(job => (
                          <div key={job.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-all gap-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-navy">{job.title}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-slate-500 text-sm">{job.contractor}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500 text-sm flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.map(s => <Badge key={s}>{s}</Badge>)}
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-lg font-bold text-slate-900">₹{job.pay}/day</p>
                                <p className="text-xs text-green-600 font-medium">Starts Tomorrow</p>
                              </div>
                              <button className="px-6 py-2 bg-navy text-white rounded-lg font-bold">Apply</button>
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
                              <th className="px-6 py-4 text-sm font-bold text-slate-600">Contractor</th>
                              <th className="px-6 py-4 text-sm font-bold text-slate-600">Date</th>
                              <th className="px-6 py-4 text-sm font-bold text-slate-600">Status</th>
                              <th className="px-6 py-4 text-sm font-bold text-slate-600 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {mockData.myJobs.map((job) => (
                              <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-900">{job.title}</td>
                                <td className="px-6 py-4 text-slate-600">{job.contractor}</td>
                                <td className="px-6 py-4 text-slate-500">{job.date}</td>
                                <td className="px-6 py-4">
                                  <Badge variant={job.status === 'Completed' ? 'success' : job.status === 'Ongoing' ? 'primary' : 'warning'}>
                                    {job.status}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {job.status === 'Ongoing' && (
                                    <button
                                      onClick={() => addToast(`Marked ${job.title} as completed! Pending contractor approval.`, "info")}
                                      className="text-navy text-sm font-bold hover:underline"
                                    >
                                      Mark Complete
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
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
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                              <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                              />
                              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                {mockData.earningsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.amount > 0 ? '#1a3c6e' : '#e2e8f0'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-800 px-2">Recent Payments</h3>
                        <div className="space-y-3">
                          {mockData.earningsBreakdown.map((item, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                              <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                  <IndianRupee size={20} />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{item.job}</p>
                                  <p className="text-sm text-slate-500">{item.contractor} • {item.date}</p>
                                </div>
                              </div>
                              <p className="font-black text-green-600">+₹{item.amount}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'profile' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="h-32 bg-navy relative">
                          <button className="absolute right-6 top-6 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl font-bold transition-all">Edit Profile</button>
                        </div>
                        <div className="px-8 pb-8">
                          <div className="relative -mt-12 mb-4">
                            <div className="w-24 h-24 rounded-3xl bg-saffron text-white flex items-center justify-center text-3xl font-black shadow-lg border-4 border-white">
                              RK
                            </div>
                            <div className="absolute bottom-0 right-0 p-1 bg-green-500 text-white rounded-full border-2 border-white">
                              <Check size={12} />
                            </div>
                          </div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
                                Ramesh Kumar
                                <Badge variant="success">Verified Worker</Badge>
                              </h2>
                              <p className="text-slate-500 font-medium">Professional Electrician in Nashik Road</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-8 py-6 border-y border-slate-100">
                            <div className="text-center">
                              <p className="text-2xl font-black text-navy">3</p>
                              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Years Exp</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-black text-navy">47</p>
                              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Jobs Done</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-black text-navy">4.7</p>
                              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Rating</p>
                            </div>
                          </div>

                          <div className="mt-8">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Core Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {['Electrician', 'Wiring', 'Solar Panel', 'MCB Fitting', 'Generator'].map(s => (
                                <span key={s} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl border border-slate-100 font-semibold">{s}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* --- CONTRACTOR DASHBOARD TABS --- */}
              {role === 'contractor' && (
                <>
                  {activeTab === 'home' && (
                    <div className="space-y-8">
                      <h2 className="text-3xl font-extrabold text-navy">Welcome, Suresh Contractors 👋</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard title="Active Jobs" value="3" icon={Briefcase} />
                        <StatCard title="Workers Hired" value="12" icon={Users} />
                        <StatCard title="Pending Applications" value="7" icon={Clock} />
                        <StatCard title="Month Spend" value="₹54,000" icon={IndianRupee} />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                          <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
                          <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setActiveTab('post')} className="p-4 bg-navy text-white rounded-xl font-bold flex flex-col items-center gap-2 hover:bg-navy-light transition-colors">
                              <PlusCircle size={24} /> Post New Job
                            </button>
                            <button onClick={() => setActiveTab('find')} className="p-4 bg-saffron text-white rounded-xl font-bold flex flex-col items-center gap-2 hover:bg-orange-600 transition-colors">
                              <Search size={24} /> Find Workers
                            </button>
                          </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Check size={16} /></div>
                              <p className="text-sm text-slate-600">Ramesh Kumar applied for <strong>Wiring Work</strong></p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><IndianRupee size={16} /></div>
                              <p className="text-sm text-slate-600">Payment of <strong>₹800</strong> released to Manoj</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'post' && (
                    <div className="max-w-3xl mx-auto space-y-8">
                      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h2 className="text-2xl font-bold text-navy mb-6">Post a New Job</h2>
                        <form className="space-y-6" onSubmit={(e) => {
                          e.preventDefault();
                          addToast("Job Posted Successfully!", "success");
                        }}>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-600">Job Title</label>
                              <input type="text" placeholder="e.g. Wiring Work - 2BHK" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-navy transition-all" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-600">Skill Required</label>
                              <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-navy transition-all">
                                {mockData.skillOptions.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-600">Location in Nashik</label>
                              <input type="text" placeholder="e.g. Nashik Road" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-navy transition-all" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-600">Pay Per Day (₹)</label>
                              <input type="number" placeholder="800" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-navy transition-all" />
                            </div>
                          </div>
                          <button type="submit" className="w-full py-4 bg-navy text-white rounded-xl font-bold text-lg shadow-lg hover:bg-navy-light transition-all active:scale-95">Post Job</button>
                        </form>
                      </div>
                    </div>
                  )}

                  {activeTab === 'find' && (
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="text" placeholder="Search workers by name..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-navy transition-all" />
                        </div>
                        <select className="px-4 py-2 rounded-xl bg-slate-50 border-none font-medium text-slate-700">
                          {mockData.skillOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockData.workerPool.map(worker => (
                          <div key={worker.id} className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-navy flex items-center justify-center text-xl font-black group-hover:bg-navy group-hover:text-white transition-colors">
                                {worker.initials}
                              </div>
                              <div>
                                <h4 className="font-bold text-lg text-slate-900">{worker.name}</h4>
                                <div className="flex items-center gap-1 text-saffron text-sm font-bold">
                                  <Star size={14} fill="currentColor" /> {worker.rating}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-6">
                              {worker.skills.map(s => <Badge key={s}>{s}</Badge>)}
                            </div>
                            <div className="flex items-center justify-between py-4 border-t border-slate-50">
                              <div className="text-sm text-slate-500">
                                <p className="flex items-center gap-1"><MapPin size={12} /> {worker.distance}</p>
                              </div>
                              <button
                                onClick={() => addToast(`Hire request sent to ${worker.name}!`, "success")}
                                className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-navy transition-colors"
                              >
                                Hire Now
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'myjobs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {contractorJobsList.map(job => (
                        <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <h3 className="text-xl font-bold text-navy">{job.title}</h3>
                              <p className="text-slate-500 flex items-center gap-1 mt-1"><MapPin size={14} /> {job.location}</p>
                            </div>
                            <Badge variant={job.status === 'Active' ? 'success' : 'warning'}>{job.status}</Badge>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-lg text-navy"><Users size={20} /></div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Applicants</p>
                                <p className="text-lg font-black text-navy">{job.applicants}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setViewApplicantsFor(viewApplicantsFor === job.id ? null : job.id)}
                              className="text-navy font-bold flex items-center gap-1"
                            >
                              {viewApplicantsFor === job.id ? 'Close' : 'View Applicants'} <ChevronRight size={18} className={viewApplicantsFor === job.id ? 'rotate-90' : ''} />
                            </button>
                          </div>

                          {viewApplicantsFor === job.id && (
                            <div className="space-y-3 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
                              {mockData.applicantsMap[job.id]?.map(app => (
                                <div key={app.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-navy/5 text-navy flex items-center justify-center font-bold text-xs">{(app.name.match(/\b\w/g) || []).join('')}</div>
                                    <div>
                                      <p className="text-sm font-bold">{app.name}</p>
                                      <p className="text-[10px] text-slate-500">{app.experience} • {app.rating} ★</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button onClick={() => addToast(`Hired ${app.name}!`, "success")} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><Check size={16} /></button>
                                    <button className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><X size={16} /></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
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
                              <th className="px-6 py-4 text-sm font-bold text-slate-600">Job Assigned</th>
                              <th className="px-6 py-4 text-sm font-bold text-slate-600">Start Date</th>
                              <th className="px-6 py-4 text-sm font-bold text-slate-600">Pay</th>
                              <th className="px-6 py-4 text-sm font-bold text-slate-600">Contact</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {hiredList.map(worker => (
                              <tr key={worker.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-bold text-slate-900">{worker.name}</td>
                                <td className="px-6 py-4"><Badge>{worker.skill}</Badge></td>
                                <td className="px-6 py-4 text-slate-600 text-sm">{worker.job}</td>
                                <td className="px-6 py-4 text-slate-500 text-sm">{worker.startDate}</td>
                                <td className="px-6 py-4 font-bold text-navy">₹{worker.pay}/day</td>
                                <td className="px-6 py-4">
                                  <a
                                    href={`https://wa.me/91${worker.phone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-green-600 hover:text-green-700 font-bold text-sm"
                                  >
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

              {/* --- ADMIN DASHBOARD TABS --- */}
              {role === 'admin' && (
                <>
                  {activeTab === 'stats' && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Total Workers" value="1,240" icon={Users} trend="+84" />
                        <StatCard title="Contractors" value="87" icon={Building2} trend="+12" />
                        <StatCard title="Jobs Today" value="34" icon={Briefcase} trend="+5" />
                        <StatCard title="Completed (Month)" value="412" icon={CheckCircle2} trend="+18%" />
                      </div>

                      <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                          <h3 className="text-xl font-bold text-navy mb-6">Monthly Growth</h3>
                          <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                { month: 'Jan', count: 450 },
                                { month: 'Feb', count: 620 },
                                { month: 'Mar', count: 980 },
                                { month: 'Apr', count: 1240 },
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="count" fill="#1a3c6e" radius={[8, 8, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                          <h3 className="text-xl font-bold text-navy mb-6">Revenue Split</h3>
                          <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-2xl">
                              <p className="text-xs text-slate-500 uppercase font-bold">Total Payouts</p>
                              <p className="text-2xl font-black text-navy">₹4.2L</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                              <p className="text-xs text-slate-500 uppercase font-bold">Platform Fee (5%)</p>
                              <p className="text-2xl font-black text-saffron">₹21K</p>
                            </div>
                          </div>
                        </div>
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
                              <tr key={worker.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-900">{worker.name}</td>
                                <td className="px-6 py-4"><Badge>{worker.skill}</Badge></td>
                                <td className="px-6 py-4 text-slate-600">{worker.location}</td>
                                <td className="px-6 py-4">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        setVerificationQueue(verificationQueue.filter(w => w.id !== worker.id));
                                        addToast(`${worker.name} approved!`, "success");
                                      }}
                                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 transition-colors"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => {
                                        setVerificationQueue(verificationQueue.filter(w => w.id !== worker.id));
                                        addToast(`${worker.name} rejected.`, "error");
                                      }}
                                      className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                                    >
                                      Reject
                                    </button>
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
                        <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                          <div className={`w-2 h-12 rounded-full ${item.type === 'job' ? 'bg-navy' :
                            item.type === 'hire' ? 'bg-green-500' :
                              item.type === 'verify' ? 'bg-blue-500' : 'bg-saffron'
                            }`}></div>
                          <div className="flex-1">
                            <p className="text-slate-800 font-medium">{item.text}</p>
                            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">{item.time}</p>
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
                          <Badge variant={city.status === 'Active' ? 'success' : city.status === 'Coming Soon' ? 'warning' : 'default'} className="mt-2">
                            {city.status}
                          </Badge>
                          {city.workers && (
                            <div className="mt-4 pt-4 border-t border-slate-50 w-full space-y-1">
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Stats</p>
                              <p className="text-sm font-bold text-slate-700">{city.workers} Workers</p>
                              <p className="text-sm font-bold text-slate-700">{city.jobs} Jobs Today</p>
                            </div>
                          )}
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