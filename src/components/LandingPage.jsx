import { useState } from 'react'
import {
  ChevronDown, ArrowRight, CheckCircle2, UserCheck, Building,
  ShieldCheck, BadgeCheck, Users, Briefcase, Menu, X, IndianRupee,
  Search, ChevronRight, Phone, MapPin, MessageSquare
} from 'lucide-react'
import Wordmark from './Wordmark'

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-slate-100 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full justify-between items-center text-left gap-3 text-sm font-bold text-navy hover:text-saffron transition-colors"
      >
        <span>{question}</span>
        <ChevronDown size={16} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-saffron' : 'text-slate-300'}`} />
      </button>
      <div className={`mt-2 text-sm text-slate-500 leading-relaxed overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        {answer}
      </div>
    </div>
  )
}

const LandingPage = ({ onLogin, onRegister }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen bg-white selection:bg-saffron/20">

      {/* ═══════ HEADER ═══════ */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-14 md:h-16">
          <Wordmark />

          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => nav('how')} className="text-sm font-semibold text-slate-500 hover:text-navy transition-colors">How It Works</button>
            <button onClick={() => nav('trust')} className="text-sm font-semibold text-slate-500 hover:text-navy transition-colors">Trust & Safety</button>
            <button onClick={() => nav('faq')} className="text-sm font-semibold text-slate-500 hover:text-navy transition-colors">FAQ</button>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button onClick={onLogin} className="text-sm font-bold text-navy px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors">Log In</button>
            <button onClick={onRegister} className="text-sm font-bold bg-saffron hover:bg-orange-600 text-white px-5 py-2 rounded-lg shadow-sm transition-all active:scale-95">
              Get Started
            </button>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-navy -mr-2">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 px-4 py-3 space-y-2 animate-fadeIn">
            <button onClick={() => nav('how')} className="block w-full text-left font-semibold text-slate-600 py-2 text-sm">How It Works</button>
            <button onClick={() => nav('trust')} className="block w-full text-left font-semibold text-slate-600 py-2 text-sm">Trust & Safety</button>
            <button onClick={() => nav('faq')} className="block w-full text-left font-semibold text-slate-600 py-2 text-sm">FAQ</button>
            <div className="flex gap-2 pt-2">
              <button onClick={() => { onLogin(); setMobileOpen(false) }} className="flex-1 py-2.5 border border-navy text-navy rounded-lg font-bold text-sm">Log In</button>
              <button onClick={() => { onRegister(); setMobileOpen(false) }} className="flex-1 py-2.5 bg-saffron text-white rounded-lg font-bold text-sm">Get Started</button>
            </div>
          </div>
        )}
      </header>

      {/* ═══════ HERO ═══════ */}
      <section className="bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-16 md:pt-16 md:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-navy rounded-full text-[11px] font-bold uppercase tracking-wider mb-6 border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron" />
              Govt. Registered MSME Initiative
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-navy leading-[1.1] tracking-tight">
              India's Trusted Platform for{' '}
              <span className="text-saffron">Skilled Work</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
              Shramik connects verified blue-collar professionals with contractors directly — no middlemen, no exploitation, just fair work.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <button onClick={onRegister} className="px-7 py-3.5 bg-navy text-white rounded-xl font-bold text-sm shadow-lg shadow-navy/20 hover:bg-navy-light transition-all flex items-center justify-center gap-2">
                Join as a Worker <ArrowRight size={16} />
              </button>
              <button onClick={onRegister} className="px-7 py-3.5 bg-white text-navy border-2 border-slate-200 rounded-xl font-bold text-sm hover:border-navy/30 transition-all flex items-center justify-center gap-2">
                Hire Workers <Search size={16} />
              </button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> Aadhaar Verified</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> ISO 27001 Certified</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> No Agent Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STATS ROW ═══════ */}
      <section className="border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, value: '12,450+', label: 'Workers Onboarded' },
              { icon: Briefcase, value: '8,920', label: 'Jobs Completed' },
              { icon: Building, value: '87+', label: 'Verified Contractors' },
              { icon: IndianRupee, value: '₹3.2Cr+', label: 'Earnings Generated' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <s.icon size={20} className="text-saffron mx-auto mb-1.5" />
                <p className="text-2xl md:text-3xl font-black text-navy">{s.value}</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="how" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-black tracking-[0.15em] uppercase text-saffron">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy mt-2 tracking-tight">How Shramik Works</h2>
            <p className="mt-3 text-sm text-slate-400 max-w-lg mx-auto">One platform for workers and contractors. No complexity, no hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Workers */}
            <div className="bg-slate-50 rounded-xl p-6 md:p-8 border border-slate-100">
              <div className="w-10 h-10 bg-navy text-white rounded-lg flex items-center justify-center mb-4"><UserCheck size={20} /></div>
              <h3 className="text-lg font-bold text-navy mb-4">For Workers</h3>
              <div className="space-y-4">
                {[
                  { step: '1', text: 'Create your profile with skills & experience' },
                  { step: '2', text: 'Get verified via Aadhaar & skill assessment' },
                  { step: '3', text: 'Browse jobs and get hired directly' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-navy/10 text-navy rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{item.step}</span>
                    <span className="text-sm text-slate-600">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contractors */}
            <div className="bg-slate-50 rounded-xl p-6 md:p-8 border border-slate-100">
              <div className="w-10 h-10 bg-saffron text-white rounded-lg flex items-center justify-center mb-4"><Building size={20} /></div>
              <h3 className="text-lg font-bold text-navy mb-4">For Contractors</h3>
              <div className="space-y-4">
                {[
                  { step: '1', text: 'Post your job with details & pay' },
                  { step: '2', text: 'Browse verified, skilled candidates' },
                  { step: '3', text: 'Hire, track & pay — all in one place' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-saffron/10 text-saffron rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{item.step}</span>
                    <span className="text-sm text-slate-600">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ WHY SHRAMIK ═══════ */}
      <section className="py-16 md:py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-black tracking-[0.15em] uppercase text-saffron">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 tracking-tight">Built for India's Workforce</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: ShieldCheck, title: 'Zero Middlemen', desc: 'Workers get 100% of what they earn. No agent cuts, no exploitation.' },
              { icon: BadgeCheck, title: 'Verified Profiles', desc: 'Every worker is Aadhaar-verified with skill assessments you can trust.' },
              { icon: Phone, title: 'Mobile-First', desc: 'Works on any smartphone, even on slow networks. No app download needed.' },
              { icon: MapPin, title: 'Hyper-Local', desc: 'Starting with Nashik — jobs near you, from contractors you know.' },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 backdrop-blur-sm rounded-xl p-5 md:p-6 border border-white/10">
                <item.icon size={24} className="text-saffron mb-3" />
                <h3 className="font-bold text-sm md:text-base mb-1.5">{item.title}</h3>
                <p className="text-xs md:text-sm text-blue-100/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TRUST & SAFETY ═══════ */}
      <section id="trust" className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-black tracking-[0.15em] uppercase text-saffron">Trust & Safety</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy mt-2 tracking-tight">Your Security is Our Priority</h2>
          </div>
          <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-4">
            {[
              { icon: BadgeCheck, title: 'Govt. Registered', desc: 'Registered MSME under Government of India' },
              { icon: ShieldCheck, title: 'ISO 27001', desc: 'International security standards compliance' },
              { icon: CheckCircle2, title: 'Aadhaar Verified', desc: 'Every identity is government-verified' },
            ].map((item) => (
              <div key={item.title} className="bg-white p-5 md:p-6 rounded-xl border border-slate-100 text-center shadow-sm">
                <item.icon size={28} className="text-saffron mx-auto mb-3" />
                <h3 className="font-bold text-navy text-sm md:text-base mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHATSAPP ═══════ */}
      <section className="py-12 md:py-16 bg-white border-t border-slate-100">
        <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight mb-2">Join our WhatsApp Community</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
            Get job alerts, platform updates, and connect with other workers and contractors in Nashik.
          </p>
          <a
            href="https://wa.me/919999999999?text=I%20want%20to%20join%20Shramik%20WhatsApp%20community"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all shadow-md"
          >
            <MessageSquare size={18} /> Join WhatsApp Group
          </a>
          <p className="text-[11px] text-slate-400 mt-3">200+ workers already connected. Replace with your group link.</p>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section id="faq" className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="bg-white border border-slate-100 rounded-xl p-5 md:p-6 shadow-sm">
            <FAQItem question="How do you verify workers?" answer="Every worker completes Aadhaar-based identity verification and a practical skill assessment. Only verified profiles appear in contractor searches." />
            <FAQItem question="Is Shramik free for workers?" answer="Yes. Creating a profile, browsing jobs, and applying is completely free. We never charge workers for access to opportunities." />
            <FAQItem question="How do payments work?" answer="Payments are processed digitally through our platform. Contractors release payment after job completion, and workers receive directly — no middlemen involved." />
            <FAQItem question="Where is Shramik available?" answer="We are currently live in Nashik, Maharashtra for the electrical and plumbing trades. We are expanding to more cities and trades soon." />
            <FAQItem question="How do I hire workers as a contractor?" answer="Register as a contractor, post your job requirements, and browse verified candidates. You can review profiles, ratings, and work history before hiring." />
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="bg-navy text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
            Ready to Join <span className="text-saffron">Shramik</span>?
          </h2>
          <p className="text-sm md:text-base text-blue-100/70 mb-8 max-w-lg mx-auto">
            Whether you're a skilled professional or a contractor looking for talent — start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={onRegister} className="px-8 py-3.5 bg-saffron text-white rounded-xl font-bold text-sm shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
              Create Free Account <ChevronRight size={16} />
            </button>
            <button onClick={onLogin} className="px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-bold text-sm hover:bg-white/20 transition-all">
              Sign In
            </button>
          </div>
          <p className="mt-6 text-xs text-blue-200/50 font-medium">
            No credit card required • Free for workers • Trusted by 12,000+ professionals
          </p>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-[#0a1e3d] text-white/50 py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <img src="/Shramik-Logo.png" alt="" width={28} height={28} className="rounded" />
                <span className="text-lg font-black tracking-tight text-white">Shramik</span>
              </div>
              <p className="text-xs text-white/30 max-w-xs text-center md:text-left">
                Organizing India's informal labor sector with technology, transparency, and trust.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex gap-4 text-xs font-semibold text-white/40">
                <a href="#" className="hover:text-saffron transition-colors">Terms</a>
                <a href="#" className="hover:text-saffron transition-colors">Privacy</a>
                <a href="#" className="hover:text-saffron transition-colors">Contact</a>
              </div>
              <p className="text-[10px] text-white/20">&copy; 2026 Shramik. MSME Registered. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
