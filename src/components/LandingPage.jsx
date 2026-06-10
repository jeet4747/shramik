import { useState, useEffect, useRef } from 'react'
import {
  ArrowRight, CheckCircle2, Users, Briefcase, Building, Menu, X, ChevronRight,
  Phone, MapPin, MessageSquare, UserPlus, ShieldCheck, BadgeCheck, Star,
  Search, Wrench, Clock, Award, TrendingUp, Smartphone, Share2, Play,
  ChevronLeft, Quote, Zap, Globe, Target, Wallet, Eye, Bell
} from 'lucide-react'
import Wordmark from './Wordmark'
import WhatsAppModal from './WhatsAppModal'
import LangToggle from './LangToggle'
import { useLang } from '../context/LanguageContext'

function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true
        const start = performance.now()
        const step = (now) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * end))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.3 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return { count, ref }
}

const workers = [
  { name: 'Rajesh Patil', skill: 'इलेक्ट्रिशियन', chowk: 'Nashik MIDC', rating: 4.8, jobs: 47, available: true, verified: true },
  { name: 'Suresh Gaikwad', skill: 'प्लंबर', chowk: 'Ambad MIDC', rating: 4.6, jobs: 32, available: true, verified: true },
  { name: 'Mahesh Jadhav', skill: 'मिस्त्री', chowk: 'Satpur MIDC', rating: 4.9, jobs: 58, available: false, verified: true },
  { name: 'Anil Pawar', skill: 'सुतार', chowk: 'Gangapur Road', rating: 4.7, jobs: 41, available: true, verified: true },
]

const testimonials = [
  { name: 'Rajesh Patil', role: 'Electrician, Nashik MIDC', text: 'Pehle roz subah chowk pe khade rehte the. Ab Shramik se ghar baithe job milti hai. Bahut accha hai.', rating: 5 },
  { name: 'Vijay Thekedar', role: 'Contractor, Ambad MIDC', text: 'Meri team ab Shramik pe hai. Naye workers bhi mil jaate hai jab zaroorat hoti hai. Time bachta hai.', rating: 5 },
  { name: 'Suresh Gaikwad', role: 'Plumber, Nashik', text: 'WhatsApp pe job alert aata hai aur direct apply karte hai. Koi commission nahi, koi tension nahi.', rating: 5 },
]

const thekedarBenefits = [
  { icon: Users, title: 'Build Your Team', desc: 'Add workers to your team. They get your job alerts instantly.' },
  { icon: Search, title: 'Find Skilled Workers', desc: 'Browse available workers by skill and chowk location.' },
  { icon: Zap, title: 'Post Urgent Needs', desc: 'Need 5 masons in 1 hour? Post it and nearby workers get notified.' },
  { icon: Wallet, title: 'No Commission', desc: 'Direct hire. No middleman cuts. You pay what you quoted.' },
]

const LandingPage = ({ onLogin, onRegister }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const { t } = useLang()

  const workersCount = useCountUp(200)
  const jobsCount = useCountUp(50)
  const contractorsCount = useCountUp(15)

  const nav = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex(i => (i + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white selection:bg-saffron/20">
      {showWhatsApp && <WhatsAppModal onClose={() => setShowWhatsApp(false)} />}

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-14">
          <Wordmark />
          <nav className="hidden md:flex items-center gap-5">
            <button onClick={() => nav('workers')} className="text-sm font-semibold text-slate-500 hover:text-navy transition-colors">{t('stat_workers')}</button>
            <button onClick={() => nav('how')} className="text-sm font-semibold text-slate-500 hover:text-navy transition-colors">{t('nav_how')}</button>
            <button onClick={() => nav('thekedar')} className="text-sm font-semibold text-slate-500 hover:text-navy transition-colors">{t('reg_contractor')}</button>
            <button onClick={() => nav('faq')} className="text-sm font-semibold text-slate-500 hover:text-navy transition-colors">{t('nav_faq')}</button>
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <LangToggle />
            <button onClick={onLogin} className="text-sm font-bold text-navy px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors">{t('login_title')}</button>
            <button onClick={onRegister} className="text-sm font-bold bg-saffron hover:bg-orange-600 text-white px-5 py-2 rounded-lg shadow-sm transition-all active:scale-95">{t('hero_cta')}</button>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-navy -mr-2">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 px-4 py-3 space-y-2 bg-white">
            <button onClick={() => nav('workers')} className="block w-full text-left font-semibold text-slate-600 py-2 text-sm">{t('stat_workers')}</button>
            <button onClick={() => nav('how')} className="block w-full text-left font-semibold text-slate-600 py-2 text-sm">{t('nav_how')}</button>
            <button onClick={() => nav('thekedar')} className="block w-full text-left font-semibold text-slate-600 py-2 text-sm">{t('reg_contractor')}</button>
            <button onClick={() => nav('faq')} className="block w-full text-left font-semibold text-slate-600 py-2 text-sm">{t('nav_faq')}</button>
            <div className="flex items-center gap-2 pt-2"><LangToggle /></div>
            <div className="flex gap-2">
              <button onClick={() => { onLogin(); setMobileOpen(false) }} className="flex-1 py-2.5 border border-navy text-navy rounded-lg font-bold text-sm">{t('login_title')}</button>
              <button onClick={() => { onRegister(); setMobileOpen(false) }} className="flex-1 py-2.5 bg-saffron text-white rounded-lg font-bold text-sm">{t('hero_cta')}</button>
            </div>
          </div>
        )}
      </header>

      {/* ═══ HERO ═══ (unchanged — user said it's good) */}
      <section className="bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-16 md:pt-20 md:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[11px] font-bold tracking-wider mb-5 border border-green-100">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {t('hero_badge')}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-navy leading-[1.1] tracking-tight">
              {t('hero_title')}{' '}<span className="text-saffron">{t('hero_title_highlight')}</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">{t('hero_subtitle')}</p>
            <div className="mt-8">
              <button onClick={onRegister} className="w-full sm:w-auto px-10 py-4 bg-saffron text-white rounded-xl font-bold text-base shadow-lg shadow-saffron/30 hover:bg-orange-600 transition-all active:scale-[0.97] flex items-center justify-center gap-2 mx-auto text-lg">
                <UserPlus size={22} /> {t('hero_cta')}
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-3 flex-wrap">
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> {t('hero_verified')}</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> {t('hero_free')}</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> {t('hero_nashik')}</span>
            </p>
            <div className="mt-6 flex items-center justify-center gap-1.5">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=User+${i}&background=f97316&color=fff&size=32`} alt="" className="w-full h-full" />
                  </div>
                ))}
              </div>
              <span className="text-sm font-bold text-navy ml-1">{t('hero_count')} <span className="font-normal text-slate-400">{t('hero_workers_joined')}</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 1. TRUST BADGES MARQUEE ═══════ */}
      <div className="border-y border-slate-100 bg-white overflow-hidden py-3">
        <div className="animate-marquee flex gap-8 whitespace-nowrap">
          {[...Array(2)].flatMap(() => [
            { icon: Award, text: 'MSME Registered' },
            { icon: ShieldCheck, text: 'ISO 27001 Certified' },
            { icon: BadgeCheck, text: 'Aadhaar Verified' },
            { icon: Users, text: '200+ Workers' },
            { icon: Building, text: '15+ Contractors' },
            { icon: MapPin, text: 'Nashik Based' },
            { icon: Star, text: '4.8 ⭐ Rating' },
          ]).map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500">
              <item.icon size={14} className="text-saffron" />
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════ 2. ANIMATED STATS COUNTERS ═══════ */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-black tracking-[0.15em] uppercase text-saffron">{t('trust_label')} IN NUMBERS</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy mt-2">Nashik's Growing Workforce Platform</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: Users, value: workersCount.count, label: t('stat_workers'), suffix: '+', color: 'from-blue-500 to-blue-600' },
              { icon: Briefcase, value: jobsCount.count, label: t('stat_jobs'), suffix: '+', color: 'from-saffron to-orange-600' },
              { icon: Building, value: contractorsCount.count, label: t('stat_contractors'), suffix: '+', color: 'from-green-500 to-emerald-600' },
              { icon: MapPin, value: 1, label: 'City Active', suffix: '', color: 'from-purple-500 to-purple-600', display: 'Nashik' },
            ].map((s, i) => (
              <div key={i} ref={s.display ? null : (s.icon === Users ? workersCount.ref : s.icon === Briefcase ? jobsCount.ref : contractorsCount.ref)} className={`bg-white rounded-2xl p-4 md:p-6 border border-slate-100 shadow-sm text-center hover:shadow-md transition-shadow ${i === 3 ? 'md:col-span-1' : ''}`}>
                <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md`}>
                  <s.icon size={22} className="text-white" />
                </div>
                <p className="text-3xl md:text-4xl font-black text-navy">
                  {s.display || s.value}
                  {s.suffix}
                </p>
                <p className="text-xs text-slate-400 font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 3. HOW IT WORKS — REDESIGNED ═══════ */}
      <section id="how" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-black tracking-[0.15em] uppercase text-saffron">{t('how_label')}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy mt-2">{t('how_title')}</h2>
            <p className="mt-3 text-sm text-slate-400 max-w-lg mx-auto">From chowk to job — 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                icon: Smartphone,
                title: 'Worker registers',
                desc: 'Enter phone + skill in 2 min. No fees, no documents needed.',
                color: 'bg-navy',
                shadow: 'shadow-navy/10',
              },
              {
                step: '02',
                icon: Bell,
                title: 'Gets job alerts',
                desc: 'Matching jobs come via WhatsApp & app. Apply in one tap.',
                color: 'bg-saffron',
                shadow: 'shadow-saffron/10',
              },
              {
                step: '03',
                icon: Target,
                title: 'Gets hired directly',
                desc: 'Contractor confirms. Direct work, no middleman cuts.',
                color: 'bg-green-500',
                shadow: 'shadow-green-500/10',
              },
            ].map((item, i) => (
              <div key={i} className={`relative bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 hover:shadow-lg transition-all group ${i % 2 === 0 ? 'md:translate-y-0' : 'md:translate-y-8'}`}>
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 ${item.color} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${item.shadow}`}>
                    <item.icon size={26} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-black tracking-widest text-saffron">{item.step}</span>
                    <h3 className="text-lg font-bold text-navy mt-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                {/* Connecting line */}
                {i < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 w-8 h-0.5 bg-slate-200">
                    <div className="w-2 h-2 bg-saffron rounded-full absolute right-0 top-1/2 -translate-y-1/2" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* For Thekedar quick note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              {t('reg_contractor')}?{' '}
              <button onClick={() => nav('thekedar')} className="text-saffron font-bold hover:underline">
                See how Shramik helps you manage your team →
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ 4. WORKER SHOWCASE ═══════ */}
      <section id="workers" className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-black tracking-[0.15em] uppercase text-saffron">LIVE ON PLATFORM</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy mt-2">Skilled Workers Near You</h2>
            <p className="mt-3 text-sm text-slate-400 max-w-lg mx-auto">These workers are available for hire right now in Nashik</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {workers.map((w, i) => (
              <div key={i} className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all ${w.available ? 'border-green-100' : 'border-slate-100 opacity-75'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-navy to-blue-700 text-white rounded-xl flex items-center justify-center text-lg font-black">
                    {w.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {w.available ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-dot" />
                      Available Now
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">On Job</span>
                  )}
                </div>
                <h3 className="text-base font-bold text-navy">{w.name}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <Wrench size={12} /> {w.skill}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <MapPin size={12} /> {w.chowk}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star size={12} fill="currentColor" /> {w.rating}
                  </div>
                  <span className="text-[10px] text-slate-400">{w.jobs} jobs done</span>
                </div>
                {w.verified && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-green-600">
                    <BadgeCheck size={11} /> Verified
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button onClick={onRegister} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-navy border-2 border-slate-200 rounded-xl font-bold text-sm hover:border-saffron/50 hover:text-saffron transition-all">
              <Search size={16} /> Browse All Workers
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ 5. THEKEDAR SECTION ═══════ */}
      <section id="thekedar" className="py-16 md:py-20 bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[11px] font-black tracking-[0.15em] uppercase text-saffron">{t('reg_contractor')}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold mt-2 leading-tight">
                Manage Your Team Like{' '}
                <span className="text-saffron">A Pro</span>
              </h2>
              <p className="mt-4 text-sm text-blue-100/70 leading-relaxed max-w-md">
                Whether you're a thekedar with 50 workers or a contractor looking for skilled hands — Shramik gives you the tools to manage, find, and hire.
              </p>

              <div className="mt-8 space-y-4">
                {thekedarBenefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <b.icon size={20} className="text-saffron" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{b.title}</h4>
                      <p className="text-xs text-blue-100/60 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={onRegister} className="mt-8 px-8 py-3.5 bg-saffron text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-saffron/20 inline-flex items-center gap-2">
                <UserPlus size={18} /> Register as Thekedar
              </button>
            </div>

            <div className="hidden md:block">
              <div className="relative">
                {/* Dashboard preview card */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-saffron rounded-xl flex items-center justify-center text-white font-bold">V</div>
                      <div>
                        <p className="text-sm font-bold">Vijay Thekedar</p>
                        <p className="text-[10px] text-blue-100/50">15 workers in team</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse-dot" />
                      Active
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-blue-100/60 uppercase tracking-wider">My Team</p>
                    {[
                      { name: 'Rajesh Patil', skill: 'Electrician', status: 'On Site' },
                      { name: 'Mahesh Jadhav', skill: 'Mason', status: 'Available' },
                      { name: 'Suresh Gaikwad', skill: 'Plumber', status: 'On Site' },
                      { name: 'Anil Pawar', skill: 'Carpenter', status: 'Available' },
                    ].map((m, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <span className="text-sm font-semibold">{m.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-blue-100/50">{m.skill}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.status === 'Available' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-300'}`}>
                            {m.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="mt-4 w-full py-2.5 border border-white/20 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-colors">
                    + Add Workers
                  </button>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-float">
                  Live Dashboard
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 6. WHATSAPP INTEGRATION ═══════ */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[11px] font-black tracking-[0.15em] uppercase text-green-600">WhatsApp</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy mt-2 leading-tight">
                Jobs Come to You on{' '}
                <span className="text-green-500">WhatsApp</span>
              </h2>
              <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                No need to check the app every day. When a matching job is posted, you get an instant alert on WhatsApp. Just tap and apply.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  { icon: Bell, text: 'Instant job alerts matching your skill' },
                  { icon: Zap, text: 'Apply with one tap — no forms' },
                  { icon: Share2, text: 'Share your profile with any contractor' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                      <item.icon size={16} className="text-green-600" />
                    </div>
                    <span className="text-sm text-slate-600">{item.text}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => setShowWhatsApp(true)} className="mt-6 px-6 py-3 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-all shadow-md inline-flex items-center gap-2">
                <MessageSquare size={18} /> {t('wa_cta')}
              </button>
            </div>

            {/* Phone mockup */}
            <div className="hidden md:flex justify-center">
              <div className="w-64 bg-white rounded-3xl shadow-2xl border-4 border-slate-200 overflow-hidden">
                <div className="bg-green-500 p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>
                  <div>
                    <p className="text-sm font-bold text-white">Shramik Jobs</p>
                    <p className="text-[10px] text-green-100">Online • 200+ workers</p>
                  </div>
                </div>
                <div className="p-4 space-y-2 min-h-[300px] bg-[#e8f4e8]">
                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                    <p className="text-xs font-bold text-navy">⚡ New Job Alert!</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Electrician needed at Ambad MIDC</p>
                    <p className="text-[11px] font-bold text-green-600 mt-1">₹900/day</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%] ml-auto">
                    <p className="text-[11px] text-slate-500">Great! I'm available</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                    <p className="text-xs font-bold text-navy">🏗️ Urgent: 3 Masons needed</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Satpur MIDC, ₹850/day</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] font-bold bg-saffron text-white px-2 py-0.5 rounded-full">Apply</span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">View</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%] ml-auto">
                    <p className="text-[11px] text-slate-500">Applied! 🙌</p>
                  </div>
                </div>
                <div className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white">
                  <input className="flex-1 bg-slate-50 rounded-full px-4 py-2 text-xs outline-none" placeholder="Type a message..." />
                  <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageSquare size={16} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 7. TESTIMONIALS ═══════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <span className="text-[11px] font-black tracking-[0.15em] uppercase text-saffron">TESTIMONIALS</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy mt-2">What People Say</h2>

          <div className="mt-10 relative">
            <div className="bg-slate-50 rounded-2xl p-6 md:p-10 border border-slate-100 max-w-xl mx-auto">
              <Quote size={32} className="text-saffron/20 mx-auto mb-4" />
              <p className="text-sm md:text-base text-slate-600 leading-relaxed italic">
                "{testimonials[testimonialIndex].text}"
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-navy to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {testimonials[testimonialIndex].name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-navy">{testimonials[testimonialIndex].name}</p>
                  <p className="text-[11px] text-slate-400">{testimonials[testimonialIndex].role}</p>
                </div>
              </div>
              <div className="flex justify-center gap-1 mt-3">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} className="text-amber-400" fill="currentColor" />
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === testimonialIndex ? 'bg-saffron w-6' : 'bg-slate-200 hover:bg-slate-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 8. FAQ ═══════ */}
      <section id="faq" className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy tracking-tight">{t('faq_title')}</h2>
            <p className="text-sm text-slate-400 mt-2">Everything you need to know</p>
          </div>
          <div className="space-y-2">
            {[
              { q: t('faq_q1'), a: t('faq_a1') },
              { q: t('faq_q2'), a: t('faq_a2') },
              { q: t('faq_q3'), a: t('faq_a3') },
              { q: t('faq_q4'), a: t('faq_a4') },
              { q: t('faq_q5'), a: t('faq_a5') },
            ].map((item, i) => (
              <details key={i} className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 transition-colors">
                <summary className="flex items-center justify-between p-4 md:p-5 cursor-pointer list-none">
                  <span className="text-sm font-bold text-navy pr-4">{item.q}</span>
                  <ChevronRight size={16} className="text-slate-300 shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-4 md:px-5 pb-4 md:pb-5">
                  <p className="text-sm text-slate-500 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 9. CTA ═══════ */}
      <section className="bg-gradient-to-br from-navy via-navy to-[#0a1e3d] text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
          <div className="w-16 h-16 bg-saffron/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users size={30} className="text-saffron" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
            Ready to Find{' '}
            <span className="text-saffron">Your Next Job</span>?
          </h2>
          <p className="text-sm md:text-base text-blue-100/60 mb-8 max-w-md mx-auto">
            200+ workers already earning. Register in 2 minutes. No fees. No middlemen.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={onRegister} className="px-10 py-4 bg-saffron text-white rounded-xl font-bold text-base shadow-lg hover:bg-orange-600 transition-all active:scale-[0.97] inline-flex items-center gap-2">
              <UserPlus size={20} /> {t('cta_btn')}
            </button>
            <button onClick={onLogin} className="px-10 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-bold text-sm hover:bg-white/20 transition-all">
              {t('login_title')}
            </button>
          </div>
          <p className="mt-6 text-xs text-blue-200/30">
            {t('cta_login')}{' '}
            <button onClick={onLogin} className="text-saffron font-bold hover:underline">{t('cta_login_link')}</button>
          </p>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-[#0a1e3d] text-white/50 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/Shramik-Logo.png" alt="" width={24} height={24} className="rounded" />
              <span className="text-sm font-bold text-white">Shramik</span>
            </div>
            <div className="flex gap-6 text-xs text-white/30">
              <span>MSME Registered</span>
              <span>Nashik, Maharashtra</span>
              <span>&copy; 2026</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
