import React, { useState, useEffect } from 'react';
import {
  Shield, Download, TrendingUp, X, ShieldCheck, Check, BadgeCheck, Award,
  ChevronDown, ArrowRight, CheckCircle2, UserCheck, Building, Globe,
  Activity, MapPin, Search, Lock, Zap
} from 'lucide-react';
import Wordmark from './Wordmark';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full justify-between items-center text-left text-lg font-bold text-[#0f2b5b] hover:text-saffron transition-colors"
      >
        <span>{question}</span>
        <ChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`mt-2 text-slate-600 font-medium leading-relaxed overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        {answer}
      </div>
    </div>
  );
};

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
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-saffron/30">
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
      <header className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-slate-200 px-6 py-4 flex flex-wrap justify-between items-center z-50 shadow-sm transition-all duration-300">
        <Wordmark />
        <div className="flex flex-wrap items-center gap-3 md:gap-5">
          <button onClick={handleInstallClick} className="hidden md:flex items-center gap-2 text-slate-600 font-bold hover:text-navy transition-colors px-3 py-2 text-sm bg-slate-100 rounded-lg border border-slate-200 hover:bg-slate-200">
            <Download size={16} /> Install App
          </button>
          <button onClick={onLogin} className="text-navy font-bold hover:text-saffron transition-colors px-3 py-2 text-sm md:text-base">Log In</button>
          <button onClick={onRegister} className="bg-gradient-to-r from-[#0f2b5b] to-[#1a3c6e] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all active:scale-95 text-sm md:text-base border border-[#0f2b5b] hover:from-[#1a3c6e] hover:to-[#0f2b5b]">Register Now</button>
        </div>
      </header>

      {/* Hero Section */}

      {/* Animated Background Elements */}<section className="relative overflow-hidden pt-8 pb-24 md:pt-12 md:pb-32 px-6 flex flex-col items-center">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[60%] bg-blue-100/50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[50%] bg-orange-100/50 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Column: Text Content */}
          <div className="text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-navy rounded-full font-bold text-xs uppercase tracking-widest border border-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-saffron animate-ping"></span>
              Empowering 500+ Million Workers
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#0f2b5b] leading-[1.1] tracking-tight">
              The Digital Backbone of India's <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-orange-600">Skilled Workforce</span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-xl">
              Shramik is more than a platform—it is the digital infrastructure for the blue-collar economy. We are bridging the gap between skilled labor and demand.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onRegister} className="px-8 py-4 bg-[#0f2b5b] text-white rounded-xl font-bold text-lg shadow-xl shadow-navy/20 hover:bg-[#1a3c6e] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Join the Waitlist <ArrowRight size={20} />
              </button>
              <button onClick={handleInstallClick} className="px-8 py-4 bg-white text-[#0f2b5b] border-2 border-slate-200 rounded-xl font-bold text-lg hover:border-[#0f2b5b] transition-all flex items-center justify-center gap-2 shadow-sm">
                <Download size={20} /> Get the App
              </button>
            </div>

            <div className="pt-6 flex flex-wrap gap-8 opacity-80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-600" size={20} />
                <span className="font-bold text-slate-700 text-sm">Connecting Reliable Talent</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-blue-600" size={20} />
                <span className="font-bold text-slate-700 text-sm">Securing the Future</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Component Showcase */}
          <div className="relative w-full h-[500px] hidden lg:block">
            {/* Main Center Card */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 z-20 transition-transform duration-500 hover:scale-105">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-saffron text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-md">
                    RK
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Ramesh Kumar</h3>
                    <p className="text-xs text-slate-500 font-medium">Master Electrician</p>
                  </div>
                </div>
                <div className="bg-green-50 text-green-600 p-1.5 rounded-full">
                  <ShieldCheck size={20} />
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Experience</span>
                  <span className="font-bold text-slate-900">8 Years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Rating</span>
                  <span className="font-bold text-slate-900">4.9 ★ (124 Jobs)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Availability</span>
                  <span className="font-bold text-green-600 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Available Now</span>
                </div>
              </div>
              <button className="w-full py-3 bg-navy text-white rounded-xl font-bold text-sm shadow-md">
                Hire Now
              </button>
            </div>

            {/* Floating Top Right Card */}
            <div className="absolute top-10 right-0 w-64 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-4 z-30" style={{ animation: 'bounce 4s infinite ease-in-out' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <Zap size={16} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">New Job Posted</h4>
              </div>
              <p className="text-xs text-slate-600 font-medium mb-3">Factory Wiring Project - Nashik MIDC</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-navy">₹1,200 / day</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold">Just Now</span>
              </div>
            </div>

            {/* Floating Bottom Left Card */}
            <div className="absolute bottom-10 left-0 w-72 bg-[#0f2b5b] text-white rounded-2xl shadow-xl shadow-navy/30 border border-white/10 p-5 z-30" style={{ animation: 'bounce 5s infinite ease-in-out reverse' }}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-saffron" />
                  <span className="font-bold text-sm">Platform Stats</span>
                </div>
                <span className="text-xs text-blue-200">Live</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-blue-200 mb-1">Active Workers</p>
                  <p className="font-black text-xl">12,450+</p>
                </div>
                <div>
                  <p className="text-xs text-blue-200 mb-1">Jobs Completed</p>
                  <p className="font-black text-xl">8,920</p>
                </div>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-slate-200 rounded-full border-dashed z-0 opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-slate-200 rounded-full z-0 opacity-50"></div>
          </div>
        </div>
      </section>

      {/* The Crisis Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-black tracking-widest uppercase text-saffron mb-3">The Crisis</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-[#0f2b5b] tracking-tight">Why India Needs Shramik</h3>
            <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
              India’s blue-collar sector is a <span className="text-navy font-bold">$300 billion market</span>, yet it remains largely invisible. Millions of skilled workers operate in an ecosystem plagued by inefficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-saffron/30 hover:shadow-xl hover:shadow-saffron/5 transition-all group">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap size={32} />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4">The Intermediary Trap</h4>
              <p className="text-slate-600 leading-relaxed font-medium">
                Workers are heavily dependent on local agents who extract unfair commissions, leaving the worker with unstable income and zero agency.
              </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-navy/30 hover:shadow-xl hover:shadow-navy/5 transition-all group">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search size={32} />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4">The Invisible Professional</h4>
              <p className="text-slate-600 leading-relaxed font-medium">
                Without a formal, verified digital identity, skilled workers cannot prove their expertise, making it difficult to secure high-value contracts.
              </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-green-300/50 hover:shadow-xl hover:shadow-green-500/5 transition-all group">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity size={32} />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4">The Reliability Gap</h4>
              <p className="text-slate-600 leading-relaxed font-medium">
                For contractors and large-scale project managers, finding verified, background-checked talent is a constant bottleneck that leads to project delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution: Three Pillar Ecosystem */}
      <section className="py-24 bg-[#0f2b5b] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent -z-0"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm font-black tracking-widest uppercase text-saffron mb-3">Our Solution</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">A Three-Pillar Ecosystem</h3>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto font-medium leading-relaxed">
              Shramik is built to serve all sides of the labor market simultaneously.
            </p>
          </div>

          <div className="space-y-8">
            {/* Pillar 1 */}
            <div className="bg-white/10 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/10 flex flex-col md:flex-row gap-8 items-center hover:bg-white/15 transition-colors">
              <div className="md:w-1/3 flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-saffron to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-saffron/40">
                  <UserCheck size={64} className="text-white" />
                </div>
              </div>
              <div className="md:w-2/3 space-y-4">
                <h4 className="text-2xl md:text-3xl font-bold">1. For the Skilled Worker <span className="text-saffron block md:inline md:ml-2 text-xl">(The Career Platform)</span></h4>
                <p className="text-lg text-blue-100 font-medium">We aren't just helping you find a job; we are helping you build a career.</p>
                <ul className="space-y-3 mt-4">
                  <li className="flex items-start gap-3"><Check className="text-saffron shrink-0 mt-1" /> <span><strong>Verified Digital Identity:</strong> Build a professional profile tracking skills, work history, and ratings.</span></li>
                  <li className="flex items-start gap-3"><Check className="text-saffron shrink-0 mt-1" /> <span><strong>Fair Pay & Transparency:</strong> Say goodbye to hidden cuts. Earnings go directly to the worker.</span></li>
                  <li className="flex items-start gap-3"><Check className="text-saffron shrink-0 mt-1" /> <span><strong>Upskilling & Growth:</strong> Certification paths from basic trades to master-level.</span></li>
                </ul>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white/10 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/10 flex flex-col md:flex-row-reverse gap-8 items-center hover:bg-white/15 transition-colors">
              <div className="md:w-1/3 flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40">
                  <Building size={64} className="text-white" />
                </div>
              </div>
              <div className="md:w-2/3 space-y-4">
                <h4 className="text-2xl md:text-3xl font-bold">2. For the Contractor & Employer <span className="text-blue-300 block md:inline md:ml-2 text-xl">(The Talent Pipeline)</span></h4>
                <p className="text-lg text-blue-100 font-medium">Access the largest database of verified, skill-checked labor in your region.</p>
                <ul className="space-y-3 mt-4">
                  <li className="flex items-start gap-3"><Check className="text-blue-400 shrink-0 mt-1" /> <span><strong>On-Demand Scaling:</strong> Instant access to vetted talent, from single hires to full teams.</span></li>
                  <li className="flex items-start gap-3"><Check className="text-blue-400 shrink-0 mt-1" /> <span><strong>Background-Checked Security:</strong> We handle verification so you can focus on delivery.</span></li>
                  <li className="flex items-start gap-3"><Check className="text-blue-400 shrink-0 mt-1" /> <span><strong>Project Management:</strong> Post jobs, track progress, and manage payments in one dashboard.</span></li>
                </ul>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white/10 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/10 flex flex-col md:flex-row gap-8 items-center hover:bg-white/15 transition-colors">
              <div className="md:w-1/3 flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/40">
                  <Globe size={64} className="text-white" />
                </div>
              </div>
              <div className="md:w-2/3 space-y-4">
                <h4 className="text-2xl md:text-3xl font-bold">3. For Enterprise & Large Projects <span className="text-purple-300 block md:inline md:ml-2 text-xl">(The Infrastructure Partner)</span></h4>
                <p className="text-lg text-blue-100 font-medium leading-relaxed">
                  We provide scalable solutions for large-scale infrastructure projects, factories, and mass-scale events like the Kumbh Mela. We ensure labor continuity, compliance, and quality control at scale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety + Certifications */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-black tracking-widest uppercase text-saffron mb-3">Trust & Safety</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-[#0f2b5b] tracking-tight">The Shramik Guarantee</h3>
            <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Trust is the currency of our platform. We operate with a strict "Verify-First" policy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-navy/10 text-navy rounded-full flex items-center justify-center mb-6">
                <Lock size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Identity Verification</h4>
              <p className="text-slate-600 font-medium">Government-backed ID checks (Aadhaar) for every user.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-saffron/10 text-saffron rounded-full flex items-center justify-center mb-6">
                <Award size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Skill Assessment</h4>
              <p className="text-slate-600 font-medium">Practical verification of trade capabilities before a worker is marked "Verified."</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mb-6">
                <TrendingUp size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Performance Tracking</h4>
              <p className="text-slate-600 font-medium">Real-time rating system ensuring high-quality work is rewarded with more opportunity.</p>
            </div>
          </div>

          {/* Certifications Box */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-200">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex items-start gap-6">
                <div className="bg-blue-50 p-4 rounded-xl text-[#0f2b5b] shrink-0">
                  <BadgeCheck size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Govt. Certified MSME</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Officially registered and recognized as an MSME Business by the Government of India, ensuring trust, reliability, and regulatory compliance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-orange-50 p-4 rounded-xl text-saffron shrink-0">
                  <ShieldCheck size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">ISO 27001 Certified</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Adhering to strict international standards for Information Security Management Systems (ISMS), guaranteeing data protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Growth Roadmap */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-black tracking-widest uppercase text-saffron mb-3">The Growth Roadmap</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-[#0f2b5b] tracking-tight mb-6">Why We Are Different</h3>
              <p className="text-xl text-slate-600 font-medium mb-10 leading-relaxed">
                Many platforms try to be "job boards." We are an economic mobility engine.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0 text-navy font-black text-lg">1</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Tier 2/3 Focus</h4>
                    <p className="text-slate-600 font-medium leading-relaxed">Optimized for low-bandwidth environments. Whether using a smartphone or offline/voice-assisted workflows, Shramik is accessible.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0 text-navy font-black text-lg">2</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Hyper-Local Launch</h4>
                    <p className="text-slate-600 font-medium leading-relaxed">Starting in Nashik, concentrating on the electrical trade to ensure absolute quality and market density before expanding.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0 text-navy font-black text-lg">3</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">"LinkedIn for Blue-Collar India"</h4>
                    <p className="text-slate-600 font-medium leading-relaxed">Creating a permanent digital footprint for every skilled professional, ensuring hard work leads to better pay and career growth.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-navy to-blue-500 rounded-3xl transform rotate-3 scale-105 opacity-20 blur-lg"></div>
              <div className="bg-[#0f2b5b] p-10 rounded-3xl shadow-2xl relative text-white">
                <MapPin size={48} className="text-saffron mb-6" />
                <h4 className="text-2xl font-bold mb-4">Pilot Live in Nashik, Maharashtra</h4>
                <p className="text-blue-100 font-medium leading-relaxed mb-8">
                  We are actively onboarding electricians, plumbers, and contractors in the Nashik region. Join the network today to get early access and premium placement.
                </p>
                <div className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-md">
                  <div className="text-4xl font-black mb-2">5,000+</div>
                  <div className="text-sm uppercase tracking-widest text-blue-200 font-bold">Workers Waitlisted in Nashik</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f2b5b] tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <FAQItem
              question="How do you verify workers on the platform?"
              answer="Every worker undergoes a multi-step verification process, including government ID validation and practical skill assessment. We ensure that every profile reflects the true capability of the individual."
            />
            <FAQItem
              question="Is Shramik free for workers?"
              answer="Creating a profile and viewing jobs is free. We are committed to the 'Worker-First' model, ensuring that our service fees are transparent and minimize the impact on worker earnings."
            />
            <FAQItem
              question="How does Shramik handle payments?"
              answer="We prioritize digital, transparent payment workflows. Once a job is marked as 'Complete' and verified by the contractor, payments are processed, ensuring the worker receives their dues without middle-man interference."
            />
            <FAQItem
              question="I am a contractor; what if I need labor for a massive event?"
              answer="Shramik is designed for scale. Our enterprise division specializes in large-scale labor deployment. We can help you source, verify, and manage labor for everything from factory maintenance to massive public events like the Kumbh Mela."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#0f2b5b] to-[#122a4e] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Join the Future of <br /><span className="text-saffron">Indian Labor</span></h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 font-medium leading-relaxed">
            The era of the "invisible worker" is ending. Whether you are an expert looking to command higher wages or a contractor looking for a team you can rely on, the journey starts here.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button onClick={onRegister} className="px-10 py-5 bg-saffron text-white rounded-xl font-bold text-xl shadow-xl hover:bg-orange-500 transition-all transform hover:-translate-y-1">
              Join the Waitlist
            </button>
            <button onClick={handleInstallClick} className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold text-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3">
              <Download size={24} /> Download the App
            </button>
          </div>
          <p className="mt-12 text-lg font-bold text-blue-200 tracking-wider">
            Shramik: Giving every worker an identity, an income, and a future.
          </p>
        </div>
      </section>

      {/* Footer is rendered in App.jsx typically or we can include it here, but looking at App.jsx, the footer was part of LandingPage. Let me add it here. */}
      <footer className="bg-[#0b1d3d] text-white py-12 px-6 border-t-4 border-saffron">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-2 rounded-lg">
                <CheckCircle2 size={24} className="text-[#0f2b5b]" />
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

export default LandingPage;
