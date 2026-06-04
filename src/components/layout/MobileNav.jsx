import { Home, Search, Briefcase, IndianRupee, User, BarChart3, PlusCircle, Users, CheckCircle2, ShieldCheck, TrendingUp, MapPin, LogOut } from 'lucide-react'

const navConfig = {
  worker: [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'jobs', label: 'Jobs', icon: Search },
    { id: 'mywork', label: 'My Work', icon: Briefcase },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
  ],
  thekedar: [
    { id: 'home', label: 'Team', icon: Users },
    { id: 'find', label: 'Find', icon: Search },
  ],
  contractor: [
    { id: 'home', label: 'Home', icon: BarChart3 },
    { id: 'post', label: 'Post', icon: PlusCircle },
    { id: 'find', label: 'Find', icon: Users },
    { id: 'myjobs', label: 'Jobs', icon: Briefcase },
    { id: 'hired', label: 'Hired', icon: CheckCircle2 },
  ],
  admin: [
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'verify', label: 'Verify', icon: ShieldCheck },
    { id: 'activity', label: 'Activity', icon: TrendingUp },
    { id: 'cities', label: 'Cities', icon: MapPin },
  ],
}

export default function MobileNav({ role, activeTab, onTabChange, onLogout }) {
  const items = navConfig[role] || []

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 py-1 flex justify-between items-center z-50 overflow-x-auto gap-1">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-[48px] ${
            activeTab === item.id ? 'text-navy' : 'text-slate-400'
          }`}
        >
          <item.icon size={20} />
          <span className="text-[9px] font-bold leading-tight">{item.label}</span>
        </button>
      ))}
      <button
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-[48px] ${
          activeTab === 'profile' ? 'text-navy' : 'text-slate-400'
        }`}
      >
        <User size={20} />
        <span className="text-[9px] font-bold leading-tight">Profile</span>
      </button>
      <button onClick={onLogout} className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg min-w-[48px] text-red-400">
        <LogOut size={20} />
        <span className="text-[9px] font-bold leading-tight">Exit</span>
      </button>
    </div>
  )
}
