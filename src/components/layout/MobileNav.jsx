import { Home, Search, PlusCircle, User, LogOut, Users, BarChart3, CheckCircle } from 'lucide-react'

export default function MobileNav({ role, activeTab, onTabChange, onLogout }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 overflow-x-auto">
      <button onClick={() => onTabChange('home')} className={`p-2 min-w-fit ${activeTab === 'home' ? 'text-navy' : 'text-slate-400'}`}>
        {role === 'thekedar' ? <Users size={24} /> : role === 'admin' ? <BarChart3 size={24} /> : <Home size={24} />}
      </button>
      {role === 'worker' && (
        <button onClick={() => onTabChange('jobs')} className={`p-2 min-w-fit ${activeTab === 'jobs' ? 'text-navy' : 'text-slate-400'}`}>
          <Search size={24} />
        </button>
      )}
      {role === 'thekedar' && (
        <button onClick={() => onTabChange('find')} className={`p-2 min-w-fit ${activeTab === 'find' ? 'text-navy' : 'text-slate-400'}`}>
          <Search size={24} />
        </button>
      )}
      {role === 'contractor' && (
        <button onClick={() => onTabChange('post')} className={`p-2 min-w-fit ${activeTab === 'post' ? 'text-navy' : 'text-slate-400'}`}>
          <PlusCircle size={24} />
        </button>
      )}
      {role === 'admin' && (
        <button onClick={() => onTabChange('verify')} className={`p-2 min-w-fit ${activeTab === 'verify' ? 'text-navy' : 'text-slate-400'}`}>
          <CheckCircle size={24} />
        </button>
      )}
      <button onClick={() => onTabChange('profile')} className={`p-2 min-w-fit ${activeTab === 'profile' ? 'text-navy' : 'text-slate-400'}`}>
        <User size={24} />
      </button>
      <button onClick={onLogout} className="p-2 text-red-400 min-w-fit">
        <LogOut size={24} />
      </button>
    </div>
  )
}
