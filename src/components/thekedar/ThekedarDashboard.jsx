import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { Users, Briefcase, Search, UserPlus, X, MapPin, Phone, Wrench, Clock } from 'lucide-react'
import { useLang } from '../../context/LanguageContext'

const SKILLS_MR = {
  electrician: 'इलेक्ट्रिशियन', plumber: 'प्लंबर', carpenter: 'सुतार',
  painter: 'पेंटर', mason: 'मिस्त्री', welder: 'वेल्डर', driver: 'ड्रायव्हर', helper: 'हेल्पर',
}

export default function ThekedarDashboard({ user, addToast }) {
  const { t } = useLang()
  const [tab, setTab] = useState('team')
  const [team, setTeam] = useState([])
  const [workers, setWorkers] = useState([])
  const [showAddWorker, setShowAddWorker] = useState(false)

  const fetchTeam = async () => {
    const { data } = await supabase.from('users').select('*').eq('thekedar_id', user.id)
    if (Array.isArray(data)) setTeam(data)
  }

  const fetchAvailableWorkers = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'worker')
      .is('thekedar_id', null)
    if (Array.isArray(data)) setWorkers(data.filter(w => w.id !== user.id))
  }

  useEffect(() => {
    fetchTeam()
    fetchAvailableWorkers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const addToTeam = async (workerId) => {
    const { error } = await supabase.from('users').update({ thekedar_id: user.id }).eq('id', workerId)
    if (error) { addToast(error.message, 'error'); return }
    addToast('Worker added to your team', 'success')
    fetchTeam()
    fetchAvailableWorkers()
    setShowAddWorker(false)
  }

  const removeFromTeam = async (workerId) => {
    await supabase.from('users').update({ thekedar_id: null }).eq('id', workerId)
    addToast('Worker removed from team', 'info')
    fetchTeam()
    fetchAvailableWorkers()
  }

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl max-w-md">
        {[
          { key: 'team', label: `${t('th_my_team')} (${team.length})`, icon: Users },
          { key: 'find', label: t('th_find_workers'), icon: Search },
        ].map(tabItem => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === tabItem.key ? 'bg-white text-navy shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tabItem.icon size={14} /> {tabItem.label}
          </button>
        ))}
      </div>

      {tab === 'team' && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy">Your Team</h3>
            <button
              onClick={() => setShowAddWorker(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-saffron text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-all"
            >
              <UserPlus size={14} /> Add Worker
            </button>
          </div>

          {team.length === 0 ? (
            <div className="bg-slate-50 rounded-xl p-8 text-center border border-dashed border-slate-200">
              <Users size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-navy">{t('th_no_team')}</p>
              <p className="text-xs text-slate-400 mt-1">{t('th_no_team_desc')}</p>
            </div>
          ) : (
            <div className="grid gap-2">
              {team.map(w => (
                <div key={w.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-navy">{w.full_name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      {w.skill && <span className="flex items-center gap-1"><Wrench size={12} /> {w.skill}</span>}
                      <span className="flex items-center gap-1"><Phone size={12} /> {w.phone}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${w.available ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                        {w.available ? t('th_available') : t('th_busy')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromTeam(w.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from team"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'find' && (
        <>
          <h3 className="text-sm font-bold text-navy">Available Workers</h3>
          {workers.length === 0 ? (
            <div className="bg-slate-50 rounded-xl p-8 text-center border border-dashed border-slate-200">
              <Search size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-navy">{t('th_no_workers')}</p>
              <p className="text-xs text-slate-400 mt-1">{t('th_no_team_desc')}</p>
            </div>
          ) : (
            <div className="grid gap-2">
              {workers.map(w => (
                <div key={w.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-navy">{w.full_name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        {w.skill && <span className="flex items-center gap-1"><Wrench size={12} /> {w.skill}</span>}
                        <span className="flex items-center gap-1"><MapPin size={12} /> {w.city || 'Nashik'}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${w.available !== false ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                          {                          w.available !== false ? t('th_available') : t('th_busy')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => addToTeam(w.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-bold hover:bg-navy-light transition-all"
                    >
                      <UserPlus size={14} /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Worker Modal */}
      {showAddWorker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowAddWorker(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-[80vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-navy text-sm">Add Worker to Team</h3>
              <button onClick={() => setShowAddWorker(false)} className="p-1 text-slate-300 hover:text-slate-500"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-2">
              {workers.filter(w => w.role === 'worker').length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No workers available to add</p>
              ) : (
                workers.filter(w => w.role === 'worker').map(w => (
                  <div key={w.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-navy">{w.full_name}</p>
                      <p className="text-xs text-slate-400">{w.skill || 'No skill'} — {w.phone}</p>
                    </div>
                    <button
                      onClick={() => addToTeam(w.id)}
                      className="px-3 py-1.5 bg-saffron text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-all"
                    >
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
