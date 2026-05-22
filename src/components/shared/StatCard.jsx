// eslint-disable-next-line no-unused-vars
export default function StatCard({ title, value, icon: Icon, trend, loading = false }) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
        <div className="h-10 w-10 bg-slate-200 rounded-lg mb-4" />
        <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
        <div className="h-7 w-16 bg-slate-200 rounded" />
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg text-navy">
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
  )
}
