import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import ErrorState from '../shared/ErrorState'
import { CardSkeleton } from '../shared/LoadingSkeleton'

export default function Earnings({ user }) {
  const [earningsData, setEarningsData] = useState([])
  const [totalWeek, setTotalWeek] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetchEarnings = async () => {
      setLoading(true)
      try {
        const today = new Date()
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)

        const { data, error: err } = await supabase
          .from('earnings')
          .select('amount, paid_at')
          .eq('worker_id', user.id)
          .eq('status', 'paid')
          .gte('paid_at', weekAgo.toISOString())

        if (err) throw err

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const weekMap = {}
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today)
          d.setDate(d.getDate() - i)
          weekMap[d.toDateString()] = { day: dayNames[d.getDay()], amount: 0 }
        }

        let total = 0
        data?.forEach((e) => {
          const d = new Date(e.paid_at).toDateString()
          if (weekMap[d]) {
            weekMap[d].amount += e.amount || 0
          }
          total += e.amount || 0
        })

        if (mounted) {
          setEarningsData(Object.values(weekMap))
          setTotalWeek(total)
        }
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchEarnings()
    return () => { mounted = false }
  }, [user.id])

  if (loading) return <div className="grid grid-cols-1 gap-4"><CardSkeleton /><CardSkeleton /></div>
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-slate-500 font-medium mb-1">Total This Week</h3>
        <h2 className="text-4xl font-black text-navy mb-8">₹{totalWeek.toLocaleString('en-IN')}</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {earningsData.map((entry, index) => (
                  <Cell key={index} fill={entry.amount > 0 ? '#1a3c6e' : '#e2e8f0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
