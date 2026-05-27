import { useState } from 'react'
import {
  ArrowRight, CheckCircle2, Users, Briefcase, Building, IndianRupee,
  Menu, X, ChevronRight, Phone, MapPin, MessageSquare, UserPlus, ShieldCheck, BadgeCheck
} from 'lucide-react'
import Wordmark from './Wordmark'
import WhatsAppModal from './WhatsAppModal'
import LangToggle from './LangToggle'
import { useLang } from '../context/LanguageContext'

const LandingPage = ({ onLogin, onRegister }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const { t } = useLang()

  const nav = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen bg-white selection:bg-saffron/20">

      {showWhatsApp && <WhatsAppModal onClose={() => setShowWhatsApp(false)} />}

      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-14">
          <Wordmark />
          <nav className="hidden md:flex items-center gap-5">
            <button onClick={() => nav('how')} className="text-sm font-semibold text-slate-500 hover:text-navy transition-colors">{t('nav_how')}</button>
            <button onClick={() => nav('trust')} className="text-sm font-semibold text-slate-500 hover:text-navy transition-colors">{t('nav_trust')}</button>
            <button onClick={() => nav('faq')} className="text-sm font-semibold text-slate-500 hover:text-navy transition-colors">{t('nav_faq')}</button>
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <LangToggle />
            <button onClick={onLogin} className="text-sm font-bold text-navy px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors">{t('login_title')}</button>
            <button onClick={onRegister} className="text-sm font-bold bg-saffron hover:bg-orange-600 text-white px-5 py-2 rounded-lg shadow-sm transition-all active:scale-95">
              {t('hero_cta')}
            </button>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-navy -mr-2">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 px-4 py-3 space-y-2 bg-white">
            <button onClick={() => nav('how')} className="block w-full text-left font-semibold text-slate-600 py-2 text-sm">{t('nav_how')}</button>
            <button onClick={() => nav('trust')} className="block w-full text-left font-semibold text-slate-600 py-2 text-sm">{t('nav_trust')}</button>
            <button onClick={() => nav('faq')} className="block w-full text-left font-semibold text-slate-600 py-2 text-sm">{t('nav_faq')}</button>
            <div className="flex items-center gap-2 pt-2">
              <LangToggle />
            </div>
            <div className="flex gap-2">
              <button onClick={() => { onLogin(); setMobileOpen(false) }} className="flex-1 py-2.5 border border-navy text-navy rounded-lg font-bold text-sm">{t('login_title')}</button>
              <button onClick={() => { onRegister(); setMobileOpen(false) }} className="flex-1 py-2.5 bg-saffron text-white rounded-lg font-bold text-sm">{t('hero_cta')}</button>
            </div>
          </div>
        )}
      </header>

      <section className="bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-16 md:pt-20 md:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[11px] font-bold tracking-wider mb-5 border border-green-100">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {t('hero_badge')}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-navy leading-[1.1] tracking-tight">
              {t('hero_title')}{' '}
              <span className="text-saffron">{t('hero_title_highlight')}</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
              {t('hero_subtitle')}
            </p>
            <div className="mt-8">
              <button
                onClick={onRegister}
                className="w-full sm:w-auto px-10 py-4 bg-saffron text-white rounded-xl font-bold text-base shadow-lg shadow-saffron/30 hover:bg-orange-600 transition-all active:scale-[0.97] flex items-center justify-center gap-2 mx-auto text-lg"
              >
                <UserPlus size={22} />
                {t('hero_cta')}
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
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=User+${i}&background=f97316&color=fff&size=32`} alt="" className="w-full h-full" />
                  </div>
                ))}
              </div>
              <span className="text-sm font-bold text-navy ml-1">{t('hero_count')} <span className="font-normal text-slate-400">{t('hero_workers_joined')}</span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, value: t('stat_value_workers'), label: t('stat_workers') },
              { icon: Briefcase, value: t('stat_value_jobs'), label: t('stat_jobs') },
              { icon: Building, value: t('stat_value_contractors'), label: t('stat_contractors') },
              { icon: MapPin, value: t('stat_value_city'), label: t('stat_city') },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <s.icon size={18} className="text-saffron mx-auto mb-1" />
                <p className="text-xl md:text-2xl font-black text-navy">{s.value}</p>
                <p className="text-[11px] text-slate-400 font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <span className="text-[11px] font-black tracking-[0.15em] uppercase text-saffron">{t('how_label')}</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy mt-2">{t('how_title')}</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {[
              { icon: UserPlus, title: t('step1_title'), desc: t('step1_desc'), color: 'bg-blue-50 text-blue-600' },
              { icon: Phone, title: t('step2_title'), desc: t('step2_desc'), color: 'bg-green-50 text-green-600' },
              { icon: Briefcase, title: t('step3_title'), desc: t('step3_desc'), color: 'bg-saffron/10 text-saffron' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-navy text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100">
        <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
            <MessageSquare size={30} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight">
            {t('wa_title')}
          </h2>
          <p className="text-sm text-slate-500 mt-2 mb-6 max-w-md mx-auto leading-relaxed">
            {t('wa_subtitle')}
          </p>
          <button
            onClick={() => setShowWhatsApp(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.97] shadow-md"
          >
            <MessageSquare size={18} />
            {t('wa_cta')}
          </button>
          <p className="text-xs text-green-700/60 mt-3 font-medium">
            {t('wa_tagline')}
          </p>
        </div>
      </section>

      <section id="trust" className="py-14 md:py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <span className="text-[11px] font-black tracking-[0.15em] uppercase text-saffron">{t('trust_label')}</span>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-2">{t('trust_title')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { icon: ShieldCheck, title: t('trust_item1_title'), desc: t('trust_item1_desc') },
              { icon: BadgeCheck, title: t('trust_item2_title'), desc: t('trust_item2_desc') },
              { icon: Phone, title: t('trust_item3_title'), desc: t('trust_item3_desc') },
              { icon: MapPin, title: t('trust_item4_title'), desc: t('trust_item4_desc') },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <item.icon size={22} className="text-saffron mb-3" />
                <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-blue-100/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-14 md:py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight">{t('faq_title')}</h2>
          </div>
          <div className="space-y-2">
            {[
              { q: t('faq_q1'), a: t('faq_a1') },
              { q: t('faq_q2'), a: t('faq_a2') },
              { q: t('faq_q3'), a: t('faq_a3') },
              { q: t('faq_q4'), a: t('faq_a4') },
              { q: t('faq_q5'), a: t('faq_a5') },
            ].map((item, i) => (
              <details key={i} className="group bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                  <span className="text-sm font-bold text-navy pr-4">{item.q}</span>
                  <ChevronRight size={16} className="text-slate-300 shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-xs text-slate-500 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-navy to-[#0a1e3d] text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center">
          <h2 className="text-2xl md:text-4xl font-black mb-3">
            {t('cta_title')} <span className="text-saffron">{t('cta_title_highlight')}</span>
          </h2>
          <p className="text-sm md:text-base text-blue-100/70 mb-6 max-w-lg mx-auto">
            {t('cta_subtitle')}
          </p>
          <button
            onClick={onRegister}
            className="px-10 py-4 bg-saffron text-white rounded-xl font-bold text-base shadow-lg hover:bg-orange-600 transition-all active:scale-[0.97] inline-flex items-center gap-2"
          >
            <UserPlus size={20} />
            {t('cta_btn')}
          </button>
          <p className="mt-6 text-xs text-blue-200/40 font-medium">
            {t('cta_login')}{' '}
            <button onClick={onLogin} className="text-saffron font-bold hover:underline">{t('cta_login_link')}</button>
          </p>
        </div>
      </section>

      <footer className="bg-[#0a1e3d] text-white/50 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center text-xs">
          <p className="text-white/30">{t('footer_text')}</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
