import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../i18n'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('shramik_lang') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('shramik_lang', lang)
  }, [lang])

  const toggleLang = () => setLang(prev => prev === 'en' ? 'mr' : 'en')

  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
