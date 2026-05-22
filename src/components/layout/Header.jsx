import Wordmark from '../Wordmark'

export default function Header({ role, activeTab, userInitials, avatarUrl, available, onToggleAvailability, addToast }) {
  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-2 flex justify-between items-center z-10">
      <div className="md:hidden"><Wordmark /></div>
      <div className="hidden md:block">
        <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h1>
      </div>
      <div className="flex items-center gap-4">
        {role === 'worker' && (
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
            <span className={`w-2.5 h-2.5 rounded-full ${available ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-sm font-semibold text-slate-600">{available ? 'Available' : 'Busy'}</span>
            <button
              onClick={() => {
                onToggleAvailability()
                addToast?.(`Status changed to ${!available ? 'Available' : 'Busy'}`, 'info')
              }}
              className={`w-10 h-6 rounded-full relative transition-colors ${available ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${available ? 'left-5' : 'left-1'}`} />
            </button>
          </div>
        )}
        <div className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center font-bold overflow-hidden shadow-sm">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            userInitials
          )}
        </div>
      </div>
    </header>
  )
}
