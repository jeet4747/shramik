import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Phone, ShieldCheck, X, ArrowRight, MessageSquare, Smartphone } from "lucide-react";

export default function PhoneLogin({ onLoginSuccess, onClose }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOTP = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOtp({
      phone: '+91' + phone.trim()
    });
    if (error) setError(error.message);
    else setStep('otp');
    setLoading(false);
  };

  const verifyOTP = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.verifyOtp({
      phone: '+91' + phone.trim(),
      token: otp,
      type: 'sms'
    });
    if (error) setError(error.message);
    else onLoginSuccess(data.user);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f2b5b]/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-[#0f2b5b] p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:rotate-90"
          >
            <X size={20} />
          </button>
          
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
            {step === 'phone' ? (
              <Smartphone size={32} className="text-saffron" />
            ) : (
              <ShieldCheck size={32} className="text-saffron" />
            )}
          </div>
          
          <h2 className="text-3xl font-black mb-2">Shramik Login</h2>
          <p className="text-blue-100/70 text-sm font-medium tracking-wide">
            {step === 'phone' ? 'Enter your mobile number to continue' : 'Verify the code sent to your phone'}
          </p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center gap-3 animate-pulse">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={sendOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Mobile Number</label>
                <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus-within:border-navy/20 focus-within:ring-4 focus-within:ring-navy/5 transition-all">
                  <span className="font-bold text-navy border-r border-slate-200 pr-3">+91</span>
                  <input
                    type="tel"
                    placeholder="10 digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    className="flex-1 bg-transparent font-bold text-lg text-navy placeholder:text-slate-400 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full py-4 bg-[#f97316] hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Send OTP <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOTP} className="space-y-6">
              <div className="space-y-2 text-center">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">One Time Password</label>
                <div className="flex justify-center mt-2">
                  <input
                    type="text"
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-center text-3xl font-black tracking-[0.5em] text-navy placeholder:text-slate-200 focus:border-saffron/30 focus:ring-4 focus:ring-saffron/5 outline-none transition-all"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-slate-500 font-medium mt-4">
                  Sent to <span className="font-bold text-navy">+91 {phone}</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-4 bg-navy hover:bg-[#1a3c6e] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-black text-lg shadow-xl shadow-navy/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Verify & Login <ShieldCheck size={22} /></>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm font-bold text-[#f97316] hover:text-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                ← Change Phone Number
              </button>
            </form>
          )}
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium">
            Secure login powered by Shramik Identity Services
          </p>
        </div>
      </div>
    </div>
  );
}