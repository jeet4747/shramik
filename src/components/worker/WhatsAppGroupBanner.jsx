import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { MessageSquare, ExternalLink, X } from 'lucide-react'

export default function WhatsAppGroupBanner({ city }) {
  const [group, setGroup] = useState(null)
  const [dismissed, setDismissed] = useState(() => city ? !!localStorage.getItem(`wa_dismissed_${city}`) : false)

  useEffect(() => {
    if (!city || dismissed) return
    supabase
      .from('whatsapp_groups')
      .select('*')
      .eq('city', city)
      .eq('is_active', true)
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setGroup(data[0])
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city])

  if (!group || dismissed) return null

  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
        <MessageSquare size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-green-800">{group.group_name || `${group.city} Job Alerts`}</p>
        <p className="text-xs text-green-600">Join WhatsApp group for daily job updates in {group.city}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <a href={group.invite_link} target="_blank" rel="noopener noreferrer"
          className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors flex items-center gap-1">
          Join <ExternalLink size={12} />
        </a>
        <button onClick={() => { setDismissed(true); localStorage.setItem(`wa_dismissed_${city}`, '1') }}
          className="p-1 text-green-400 hover:text-green-600">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
