import { Home, Search, Briefcase, IndianRupee, User, BarChart3, PlusCircle, Users, CheckCircle2, ShieldCheck, TrendingUp, MapPin, LogOut } from 'lucide-react'
import Wordmark from '../Wordmark'

const navConfig = {
  worker: [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'jobs', label: 'Find Jobs', icon: Search },
    { id: 'mywork', label: 'My Work', icon: Briefcase },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
    { id: 'profile', label: 'Profile', icon: User },
  ],
  thekedar: [
    { id: 'home', label: 'My Team', icon: Users },
    { id: 'find', label: 'Find Workers', icon: Search },
    { id: 'profile', label: 'Profile', icon: User },
  ],
  contractor: [
    { id: 'home', label: 'Overview', icon: BarChart3 },
    { id: 'post', label: 'Post Job', icon: PlusCircle },
    { id: 'find', label: 'Find Workers', icon: Users },
    { id: 'myjobs', label: 'My Jobs', icon: Briefcase },
    { id: 'hired', label: 'Hired', icon: CheckCircle2 },
    { id: 'profile', label: 'Profile', icon: User },
  ],
  admin: [
    { id: 'stats', label: 'Platform Stats', icon: BarChart3 },
    { id: 'verify', label: 'Verifications', icon: ShieldCheck },
    { id: 'activity', label: 'Activity Feed', icon: TrendingUp },
    { id: 'cities', label: 'City Coverage', icon: MapPin },
    { id: 'profile', label: 'Profile', icon: User },
  ],
}

// eslint-disable-next-line no-unused-vars
function NavItem({ id, label, icon: Icon, active, onClick }) {
  const isActive = active === id
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-navy text-white shadow-lg'
          : 'text-slate-500 hover:bg-slate-100 hover:text-navy'
      }`}
    >
      <Icon size={20} />
      <span className="font-semibold">{label}</span>
    </button>
  )
}

export default function Sidebar({ role, activeTab, onTabChange, onLogout }) {
  const items = navConfig[role] || []

  return (
    <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 p-6 z-20">
      <div className="mb-10">
        <Wordmark />
      </div>
      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <NavItem key={item.id} {...item} active={activeTab} onClick={onTabChange} />
        ))}
      </nav>
      <button
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-semibold transition-colors"
      >
        <LogOut size={20} />
        <span>Exit Dashboard</span>
      </button>
    </aside>
  )
}
