import { useState } from 'react'
import {
  ArrowRight, CheckCircle2, Users, Briefcase, Building, IndianRupee, Menu, X, ChevronRight, Phone, MapPin, MessageSquare, Star, Share2, UserPlus, ShieldCheck, Wifi, BadgeCheck
} from 'lucide-react'
import Wordmark from './Wordmark'
import WhatsAppModal from './WhatsAppModal'

const LandingPage = ({ onLogin, onRegister }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showWhatsApp, setShowWhatsApp] = useState(false)

  const nav = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen bg-white selection:bg-saffron/20">

      {showWhatsApp && <WhatsAppModal onClose={() => setShowWhatsApp(false)} />}

      {/* ═══ SIMPLE HEADER ═══ */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-14">
          <Wordmark />
          <nav className="hidden md:flex items-center gap-5">
            <button onClick={() => nav('how')} className="text-sm font-semibold text-slate-500 hover:text-navy transition-colors">कसे काम करते</button>
            <button onClick={() => nav('trust')} className="text-sm font-semibold text-slate-500 hover:text-navy transition-colors">विश्वास</button>
            <button onClick={() => nav('faq')} className="text-sm font-semibold text-slate-500 hover:text-navy transition-colors">मदत</button>
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={onLogin} className="text-sm font-bold text-navy px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors">साइन इन</button>
            <button onClick={onRegister} className="text-sm font-bold bg-saffron hover:bg-orange-600 text-white px-5 py-2 rounded-lg shadow-sm transition-all active:scale-95">
              फ्री रजिस्टर
            </button>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-navy -mr-2">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 px-4 py-3 space-y-2 bg-white">
            <button onClick={() => nav('how')} className="block w-full text-left font-semibold text-slate-600 py-2 text-sm">कसे काम करते</button>
            <button onClick={() => nav('trust')} className="block w-full text-left font-semibold text-slate-600 py-2 text-sm">विश्वास</button>
            <button onClick={() => nav('faq')} className="block w-full text-left font-semibold text-slate-600 py-2 text-sm">मदत</button>
            <div className="flex gap-2 pt-2">
              <button onClick={() => { onLogin(); setMobileOpen(false) }} className="flex-1 py-2.5 border border-navy text-navy rounded-lg font-bold text-sm">साइन इन</button>
              <button onClick={() => { onRegister(); setMobileOpen(false) }} className="flex-1 py-2.5 bg-saffron text-white rounded-lg font-bold text-sm">फ्री रजिस्टर</button>
            </div>
          </div>
        )}
      </header>

      {/* ═══ HERO — LOCAL FIRST ═══ */}
      <section className="bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-16 md:pt-20 md:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[11px] font-bold tracking-wider mb-5 border border-green-100">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              नाशिक मध्ये सुरू! फक्त ३ सेकंदात रजिस्टर
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-navy leading-[1.1] tracking-tight">
              काम हवंय का?{' '}
              <span className="text-saffron">Shramik</span> जॉईन करा
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
              कोणतेही शुल्क नाही. एजंट नाही. फक्त तुम्ही आणि तुमचे कौशल्य.
              नाशिकमधील २००+ कामगार आधीच जॉईन झाले आहेत.
            </p>

            {/* Big prominent CTA */}
            <div className="mt-8">
              <button
                onClick={onRegister}
                className="w-full sm:w-auto px-10 py-4 bg-saffron text-white rounded-xl font-bold text-base shadow-lg shadow-saffron/30 hover:bg-orange-600 transition-all active:scale-[0.97] flex items-center justify-center gap-2 mx-auto text-lg"
              >
                <UserPlus size={22} />
                फ्री रजिस्टर करा — २ मिनिटात
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-3 flex-wrap">
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> आधार वेरिफाइड</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> कोणतेही शुल्क नाही</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> नाशिक मध्ये सुरू</span>
            </p>

            {/* Trusted by count */}
            <div className="mt-6 flex items-center justify-center gap-1.5">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">
                    <img src={`https://ui-avatars.com/api/?name=User+${i}&background=f97316&color=fff&size=32`} alt="" className="w-full h-full rounded-full" />
                  </div>
                ))}
              </div>
              <span className="text-sm font-bold text-navy ml-1">२००+ <span className="font-normal text-slate-400">workers joined</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ REAL STATS ═══ */}
      <section className="border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, value: '२००+', label: 'Workers' },
              { icon: Briefcase, value: '५०+', label: 'Jobs Available' },
              { icon: Building, value: '१५+', label: 'Contractors' },
              { icon: MapPin, value: 'नाशिक', label: 'Current City' },
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

      {/* ═══ HOW IT WORKS — SIMPLE ═══ */}
      <section id="how" className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <span className="text-[11px] font-black tracking-[0.15em] uppercase text-saffron">सोपी प्रक्रिया</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy mt-2">हे कसे काम करते?</h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {[
              {
                icon: UserPlus,
                title: 'फ्री रजिस्टर करा',
                desc: 'तुमचं नाव, फोन नंबर आणि स्किल टाका. २ मिनिटात रजिस्टर पूर्ण.',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                icon: Phone,
                title: 'जॉब अलर्ट मिळवा',
                desc: 'तुमच्या स्किलचे जॉब तुम्हाला WhatsApp वर मिळतील. कोणतीही फी नाही.',
                color: 'bg-green-50 text-green-600',
              },
              {
                icon: Briefcase,
                title: 'डायरेक्ट काम मिळवा',
                desc: 'कॉन्ट्रॅक्टर तुम्हाला डायरेक्ट हायर करतील. एजंटचं कमिशन नाही.',
                color: 'bg-saffron/10 text-saffron',
              },
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

      {/* ═══ WHATSAPP — VIRAL GROWTH ═══ */}
      <section className="py-14 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100">
        <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
            <MessageSquare size={30} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight">
            तुमच्या मित्रांनाही संधी द्या
          </h2>
          <p className="text-sm text-slate-500 mt-2 mb-6 max-w-md mx-auto leading-relaxed">
            जास्त कामगार = जास्त जॉब. तुमच्या सोबत काम करणाऱ्या<br />
            लोकांना WhatsApp वर Shramik बद्दल सांगा.
          </p>
          <button
            onClick={() => setShowWhatsApp(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.97] shadow-md"
          >
            <Share2 size={18} />
            WhatsApp वर शेअर करा
          </button>
          <p className="text-xs text-green-700/60 mt-3 font-medium">
            एकट्याने नाही, सगळे मिळून पुढे जाऊ
          </p>
        </div>
      </section>

      {/* ═══ WHY TRUST ═══ */}
      <section id="trust" className="py-14 md:py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <span className="text-[11px] font-black tracking-[0.15em] uppercase text-saffron">विश्वास</span>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-2">Shramik का विश्वास करावा?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { icon: ShieldCheck, title: 'कोणतेही शुल्क नाही', desc: 'कामगारांसाठी पूर्णपणे फ्री. कधीही पैसे मागितले जाणार नाहीत.' },
              { icon: BadgeCheck, title: 'आधार वेरिफाइड', desc: 'प्रत्येक वर्करची आधारवरून पडताळणी केली जाते.' },
              { icon: Phone, title: 'सोपे वापर', desc: 'कोणत्याही स्मार्टफोन वर चालते. हळू इंटरनेट वर ही चालेल.' },
              { icon: MapPin, title: 'तुमच्या जवळचे काम', desc: 'नाशिकमधील कॉन्ट्रॅक्टर तुमच्या जवळच काम देतात.' },
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

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-14 md:py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight">वारंवार विचारले जाणारे प्रश्न</h2>
          </div>
          <div className="space-y-2">
            {[
              { q: 'रजिस्टर करण्यासाठी काय लागतं?', a: 'फक्त तुमचं नाव, फोन नंबर आणि तुमचं कौशल्य (स्किल). २ मिनिटात रजिस्टर होईल.' },
              { q: 'काही शुल्क आहे का?', a: 'नाही. कामगारांसाठी पूर्णपणे फ्री. कधीही कोणतेही पैसे मागितले जाणार नाहीत.' },
              { q: 'मला काम कसं मिळेल?', a: 'तुमच्या स्किलनुसार तुम्हाला जॉब अलर्ट मिळतील. तुम्ही वेबसाइट वर जाऊन जॉब सर्च ही करू शकता.' },
              { q: 'हे फक्त नाशिकसाठी आहे का?', a: 'होय, सध्या फक्त नाशिकमध्ये सुरू आहे. लवकरच इतर शहरात सुरू होईल.' },
              { q: 'कॉन्ट्रॅक्टर कसे जॉब पोस्ट करतील?', a: 'कॉन्ट्रॅक्टर सुद्धा फ्री रजिस्टर करतात आणि त्यांना हवे ते काम पोस्ट करतात.' },
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

      {/* ═══ FINAL CTA ═══ */}
      <section className="bg-gradient-to-b from-navy to-[#0a1e3d] text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center">
          <h2 className="text-2xl md:text-4xl font-black mb-3">
            आजच <span className="text-saffron">Shramik</span> वर रजिस्टर करा
          </h2>
          <p className="text-sm md:text-base text-blue-100/70 mb-6 max-w-lg mx-auto">
            २ मिनिटात रजिस्टर करा. कोणतेही शुल्क नाही. नाशिकमधील कॉन्ट्रॅक्टर तुम्हाला शोधतील.
          </p>
          <button
            onClick={onRegister}
            className="px-10 py-4 bg-saffron text-white rounded-xl font-bold text-base shadow-lg hover:bg-orange-600 transition-all active:scale-[0.97] inline-flex items-center gap-2"
          >
            <UserPlus size={20} />
            फ्री रजिस्टर करा
          </button>
          <p className="mt-6 text-xs text-blue-200/40 font-medium">
            आधीच रजिस्टर केलं आहे?{' '}
            <button onClick={onLogin} className="text-saffron font-bold hover:underline">साइन इन करा</button>
          </p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#0a1e3d] text-white/50 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center text-xs">
          <p className="text-white/30">&copy; 2026 Shramik. MSME Registered. नाशिक, महाराष्ट्र</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
