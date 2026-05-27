import { useLang } from '../context/LanguageContext'
import { Globe } from 'lucide-react'

export default function LangToggle() {
  const { lang, toggleLang, t } = useLang()

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
      title={lang === 'en' ? 'Switch to Marathi' : 'Switch to English'}
    >
      <Globe size={14} className="text-slate-400" />
      <span className="text-slate-600">{lang === 'en' ? t('nav_marathi') : t('nav_english')}</span>
    </button>
  )
}
