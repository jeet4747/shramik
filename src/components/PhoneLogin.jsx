import { useState } from 'react';
import { supabase, formatPhone, USE_DUMMY_OTP } from '../supabaseClient';
import { X, ArrowRight, Smartphone, MessageSquare, Check } from "lucide-react";
import { useLang } from '../context/LanguageContext';

export default function PhoneLogin({ onLoginSuccess, onClose, onSwitchToRegister }) {
  const { t } = useLang();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('phone');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const startCooldown = () => {
    setCooldown(30)
    const interval = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const isValidPhone = (p) => /^[6-9]\d{9}$/.test(p.replace(/\D/g, ''));

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!isValidPhone(phone)) {
      setError('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fPhone = formatPhone(phone);

      if (USE_DUMMY_OTP) {
        setStep('otp');
        startCooldown();
        return
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: fPhone,
        options: { shouldCreateUser: false },
      });
      if (otpError) throw otpError;
      setStep('otp');
      startCooldown();
    } catch (err) {
      if (err.message?.includes('not found') || err.message?.includes('disabled')) {
        setError('This number is not registered. Please register first.');
      } else {
        setError(err.message || 'Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fPhone = formatPhone(phone);

      if (USE_DUMMY_OTP) {
        if (otp.trim() !== '123456') {
          setError('Invalid OTP. Please try again.');
          setLoading(false);
          return
        }
        const dummyId = crypto.randomUUID()
        const dummyData = {
          id: dummyId, phone, full_name: 'User', role: 'worker',
          is_verified: false, available: true,
        }
        localStorage.setItem("shramik_user", JSON.stringify({ id: dummyId, phone, role: 'worker' }))
        localStorage.setItem("shramik_dummy_data", JSON.stringify(dummyData))
        onLoginSuccess(dummyData)
        onClose()
        return
      }

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: fPhone,
        token: otp.trim(),
        type: 'sms',
      });
      if (verifyError) throw verifyError;

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      const session = {
        id: data.user.id,
        phone: phone,
        role: userData?.role || 'worker',
      };
      localStorage.setItem('shramik_user', JSON.stringify(session));

      onLoginSuccess(userData || { id: data.user.id, phone, role: 'worker' });
      onClose();
    } catch (err) {
      if (err.message?.includes('token')) {
        setError('Invalid OTP. Please try again.');
      } else {
        setError(err.message || 'Verification failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const fPhone = formatPhone(phone);

      if (USE_DUMMY_OTP) {
        startCooldown();
        return
      }

      await supabase.auth.signInWithOtp({ phone: fPhone });
      startCooldown();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-lg transition-colors z-10">
          <X size={18} />
        </button>

        {step === 'phone' && (
          <>
            <div className="p-6 pb-2 text-center">
              <div className="w-12 h-12 bg-navy text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Smartphone size={22} />
              </div>
              <h2 className="text-xl font-black text-navy">{t('login_title')}</h2>
              <p className="text-xs text-slate-400 mt-1">{t('login_subtitle')}</p>
            </div>

            <form onSubmit={sendOtp} className="p-6 pt-4 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold flex items-center gap-2">
                  <X size={14} /> {error}
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">{t('login_phone_label')}</label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-3 focus-within:border-navy/30 transition-colors">
                  <span className="text-sm font-bold text-navy">+91</span>
                  <div className="w-px h-5 bg-slate-200" />
                  <input type="tel" placeholder={t('login_phone_placeholder')} value={phone}
                    onChange={(e) => setPhone(e.target.value)} maxLength={10}
                    className="flex-1 bg-transparent text-sm font-semibold text-navy placeholder:text-slate-300 outline-none" autoFocus />
                </div>
              </div>

              <button type="submit" disabled={loading || cooldown > 0 || !isValidPhone(phone)}
                className="w-full py-3.5 bg-saffron hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : cooldown > 0 ? (
                  `Resend in ${cooldown}s`
                ) : (
                  <>{t('login_btn')} <ArrowRight size={16} /></>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-400">
                {t('login_register_link')}{" "}
                <button type="button" onClick={onSwitchToRegister} className="text-saffron font-bold hover:underline">
                  {t('login_register_link_btn')}
                </button>
              </p>
            </form>
          </>
        )}

        {step === 'otp' && (
          <div className="p-6 space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <MessageSquare size={22} />
              </div>
              <h2 className="text-xl font-black text-navy">Verify OTP</h2>
              <p className="text-xs text-slate-400 mt-1">Enter the code sent to {phone}</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold">{error}</div>
            )}

            <input type="text" inputMode="numeric" maxLength={6} placeholder="000000" value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} autoFocus
              className="w-full text-center text-2xl tracking-[0.5em] font-bold py-4 border border-slate-200 rounded-xl focus:border-navy/30 outline-none transition-colors" />

            <button onClick={verifyOtp} disabled={loading || otp.length !== 6}
              className="w-full py-3.5 bg-saffron hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Check size={18} /> Verify & Sign In</>
              )}
            </button>

            <p className="text-xs text-center text-slate-400">
              Didn't receive OTP?{" "}
              <button onClick={resendOtp} disabled={loading || cooldown > 0} className="text-saffron font-bold hover:underline">{cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend'}</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
