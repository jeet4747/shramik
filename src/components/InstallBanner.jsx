import { useState, useEffect } from 'react'
import { X, Smartphone } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

export default function InstallBanner() {
  const { t } = useLang()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)
  const [installed, setInstalled] = useState(
    () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  )

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setShow(false)
    })

    const timer = setTimeout(() => {
      if (!deferredPrompt && !installed) {
        setShow(true)
      }
    }, 3000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      if (result.outcome === 'accepted') {
        setInstalled(true)
        setShow(false)
      }
      setDeferredPrompt(null)
    } else {
      // Fallback for iOS or browsers that don't support beforeinstallprompt
      setShow(false)
    }
  }

  if (installed || !show) return null

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
          className="px-4 py-2 bg-saffron text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all shrink-0"
        >
          {t('install_btn')}
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
