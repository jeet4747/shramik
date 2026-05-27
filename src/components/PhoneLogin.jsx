import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { X, ArrowRight, Smartphone } from "lucide-react";

export default function PhoneLogin({ onLoginSuccess, onClose, onSwitchToRegister }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: err } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone.trim())
      .maybeSingle();

    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    if (!data) {
      setError('हा नंबर रजिस्टर नाही. कृपया आधी रजिस्टर करा.');
      return;
    }

    const session = { id: data.id, phone: data.phone, role: data.role };
    localStorage.setItem('shramik_user', JSON.stringify(session));

    onLoginSuccess(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-lg transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="p-6 pb-2 text-center">
          <div className="w-12 h-12 bg-navy text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <Smartphone size={22} />
          </div>
          <h2 className="text-xl font-black text-navy">साइन इन</h2>
          <p className="text-xs text-slate-400 mt-1">तुमचा रजिस्टर केलेला मोबाइल नंबर टाका</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold flex items-center gap-2">
              <X size={14} /> {error}
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">मोबाइल नंबर</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-3 focus-within:border-navy/30 transition-colors">
              <span className="text-sm font-bold text-navy">+91</span>
              <div className="w-px h-5 bg-slate-200" />
              <input
                type="tel"
                placeholder="१० अंकी नंबर"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                className="flex-1 bg-transparent text-sm font-semibold text-navy placeholder:text-slate-300 outline-none"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || phone.length !== 10}
            className="w-full py-3.5 bg-saffron hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>साइन इन <ArrowRight size={16} /></>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-400">
            रजिस्टर केलं नाही?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-saffron font-bold hover:underline"
            >
              रजिस्टर करा
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
