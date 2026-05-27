import { X, MessageSquare, Link as LinkIcon, Check } from 'lucide-react'
import { useState } from 'react'

const SHARE_TEXT = encodeURIComponent(
  '🚀 नोकरी हवी आहे का? Shramik app वर फ्री रजिस्टर करा! कोणतेही शुल्क नाही. फक्त २ मिनिटात रजिस्टर करा.\n\nलिंक: https://shramik-eta.vercel.app'
)

export default function WhatsAppModal({ onClose }) {
  const [copied, setCopied] = useState(false)

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${SHARE_TEXT}`, '_blank')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://shramik-eta.vercel.app')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('लिंक कॉपी करण्यात अडचण आली. लिंक: https://shramik-eta.vercel.app')
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-lg transition-colors z-10">
          <X size={18} />
        </button>

        <div className="p-6 pb-2 text-center">
          <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MessageSquare size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-black text-navy">तुमच्या मित्रांना सांगा!</h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            तुमच्या सोबत काम करणाऱ्या लोकांना Shramik बद्दल सांगा. <br />
            त्यांनाही फ्री मध्ये नोकरीच्या संधी मिळतील.
          </p>
        </div>

        <div className="p-6 pt-2 space-y-3">
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md"
          >
            <MessageSquare size={18} />
            WhatsApp वर शेअर करा
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-navy rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check size={18} className="text-green-600" />
                लिंक कॉपी झाली!
              </>
            ) : (
              <>
                <LinkIcon size={18} />
                लिंक कॉपी करा
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-400 text-center pt-1">
            जास्त लोक जोडले = सगळ्यांसाठी जास्त काम
          </p>
        </div>
      </div>
    </div>
  )
}
