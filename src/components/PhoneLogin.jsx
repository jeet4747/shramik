import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Mail, X, ShieldCheck, ArrowRight } from "lucide-react";

export default function PhoneLogin({ onLoginSuccess, onClose }) {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        const { error } = await supabase.auth.signInWithOtp({ email })
        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({ type: 'success', text: 'Email check karo! Magic link bhej diya gaya hai.' })
        }
        setLoading(false)
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f2b5b]/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-[#0f2b5b] p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                        <ShieldCheck size={28} className="text-[#f97316]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1">Shramik Login</h2>
                    <p className="text-white/70 text-sm font-medium">Access your dashboard securely</p>
                </div>

                <form onSubmit={handleLogin} className="p-6 space-y-5">
                    {message && (
                        <div className={`p-3 rounded-xl text-sm font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:border-[#0f2b5b]/20 focus:bg-white focus:ring-2 focus:ring-[#0f2b5b]/10 transition-all font-medium text-slate-700 placeholder:text-slate-400 outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#f97316] hover:bg-orange-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>Send Magic Link <ArrowRight size={20} /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}