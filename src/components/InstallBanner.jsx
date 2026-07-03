import { useState, useEffect } from 'react'
import { X, Smartphone } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

export default function InstallBanner() {
  const { t } = useLang()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Check if already in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true) {
      setInstalled(true)
      return
    }

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Also detected installed app
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setShow(false)
    })

    // Show banner after 3 seconds even without beforeinstallprompt (iOS fallback)
    const timer = setTimeout(() => {
      if (!deferredPrompt && !installed) {
        setShow(true)
      }
    }, 3000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(timer)
    }
  }, [])

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      if (result.outcome === 'accepted') {
        setInstalled(true)
        setShow(false)
      }
      setDeferredPrompt(null)
      return
    }
    if (isIOS || isSafari) {
      setIosMode(true)
    }
  }

  const [iosMode, setIosMode] = useState(false)

  if (installed || !show) return null

  if (iosMode) {
    return (
      <div className="fixed bottom-20 md:bottom-6 left-4 right-4 z-[150] animate-fadeIn">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-slate-100 p-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-bold text-navy">Install Shramik</p>
            <button onClick={() => setShow(false)} className="p-1 text-slate-300 hover:text-slate-500"><X size={16} /></button>
          </div>
          <ol className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2"><span className="w-5 h-5 bg-navy text-white rounded-full text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>Tap the <b>Share</b> button <span className="text-lg">⎙</span> in Safari</li>
            <li className="flex items-start gap-2"><span className="w-5 h-5 bg-navy text-white rounded-full text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>Scroll down and tap <b>Add to Home Screen</b></li>
            <li className="flex items-start gap-2"><span className="w-5 h-5 bg-navy text-white rounded-full text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>Tap <b>Add</b> in the top right corner</li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 z-[150] animate-fadeIn">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center shrink-0">
          <img src="/Shramik-Logo.png" alt="" className="w-7 h-7 rounded" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-navy">Shramik</p>
          <p className="text-[11px] text-slate-400">{t('install_desc')}</p>
        </div>
        <button
          onClick={handleInstall}
          className="px-4 py-2 bg-saffron text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all shrink-0 whitespace-nowrap"
        >
          {isIOS || isSafari ? 'How to Install' : t('install_btn')}
        </button>
        <button
          onClick={() => setShow(false)}
          className="p-1.5 text-slate-300 hover:text-slate-500 shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
