import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { X, ArrowRight, Smartphone, ShieldCheck } from "lucide-react";

export default function PhoneLogin({ onLoginSuccess, onClose }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOTP = async (e) => {
    e.preventDefault();
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
    e.preventDefault();
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-lg transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="p-6 pb-2 text-center">
          <div className="w-10 h-10 bg-navy text-white rounded-xl flex items-center justify-center mx-auto mb-3">
            <Smartphone size={20} />
          </div>
          <h2 className="text-xl font-black text-navy">Sign In</h2>
          <p className="text-xs text-slate-400 mt-1">
            {step === 'phone' ? 'Enter your mobile number to continue' : 'Enter the code sent to your phone'}
          </p>
        </div>

        <div className="p-6 pt-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold">{error}</div>
          )}

          {step === 'phone' ? (
            <form onSubmit={sendOTP} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Mobile Number</label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-navy/30 transition-colors">
                  <span className="text-sm font-bold text-navy">+91</span>
                  <div className="w-px h-5 bg-slate-200" />
                  <input
                    type="tel"
                    placeholder="10 digit number"
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
                className="w-full py-3 bg-saffron hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send OTP <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOTP} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">One Time Password</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-center text-lg font-bold tracking-[0.3em] text-navy placeholder:text-slate-300 focus:border-navy/30 outline-none transition-colors"
                  autoFocus
                />
                <p className="text-[11px] text-slate-400 mt-2 text-center">
                  Sent to <span className="font-bold text-navy">+91 {phone}</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 bg-saffron hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Verify & Sign In <ShieldCheck size={16} /></>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-xs font-bold text-saffron hover:text-orange-600 transition-colors"
              >
                Change number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
