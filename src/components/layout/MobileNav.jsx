import { Home, Search, PlusCircle, User, LogOut, Users } from 'lucide-react'

export default function MobileNav({ role, activeTab, onTabChange, onLogout }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50">
      <button onClick={() => onTabChange('home')} className={`p-2 ${activeTab === 'home' ? 'text-navy' : 'text-slate-400'}`}>
        {role === 'thekedar' ? <Users size={24} /> : <Home size={24} />}
      </button>
      {role === 'worker' && (
        <button onClick={() => onTabChange('jobs')} className={`p-2 ${activeTab === 'jobs' ? 'text-navy' : 'text-slate-400'}`}>
          <Search size={24} />
        </button>
      )}
      {role === 'thekedar' && (
        <button onClick={() => onTabChange('find')} className={`p-2 ${activeTab === 'find' ? 'text-navy' : 'text-slate-400'}`}>
          <Search size={24} />
        </button>
      )}
      {role === 'contractor' && (
        <button onClick={() => onTabChange('post')} className={`p-2 ${activeTab === 'post' ? 'text-navy' : 'text-slate-400'}`}>
          <PlusCircle size={24} />
        </button>
      )}
      <button onClick={() => onTabChange('profile')} className={`p-2 ${activeTab === 'profile' ? 'text-navy' : 'text-slate-400'}`}>
        <User size={24} />
      </button>
      <button onClick={onLogout} className="p-2 text-red-400">
        <LogOut size={24} />
      </button>
    </div>
  )
}
