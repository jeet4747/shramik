import { useState } from "react";
import { supabase } from "../supabaseClient";
import { User, Phone, MapPin, Wrench, X, ArrowRight, ShieldCheck } from "lucide-react";

const Register = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState("details");
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    role: "worker",
    skill: "",
    city: "",
  });
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: "+91" + formData.phone.trim(),
    });

    if (otpError) {
      setError(otpError.message);
      setIsLoading(false);
    } else {
      setStep("otp");
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      phone: "+91" + formData.phone.trim(),
      token: otp,
      type: "sms",
    });

    if (verifyError) {
      setError(verifyError.message);
      setIsLoading(false);
      return;
    }

    const { error: dbError } = await supabase.from("users").upsert(
      {
        id: data.user.id,
        phone: formData.phone.trim(),
        full_name: formData.full_name,
        role: formData.role,
        skill: formData.skill || null,
        city: formData.city,
      },
      { onConflict: "id" }
    );

    setIsLoading(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    onSuccess(data.user);
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
          <div className="w-10 h-10 bg-navy text-white rounded-xl flex items-center justify-center mx-auto mb-3">
            {step === "otp" ? <ShieldCheck size={20} /> : <User size={20} />}
          </div>
          <h2 className="text-xl font-black text-navy">
            {step === "otp" ? "Verify OTP" : "Create Account"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {step === "otp"
              ? `Enter the code sent to +91 ${formData.phone}`
              : "Join India's trusted workforce network"}
          </p>
        </div>

        {step === "details" ? (
          <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-3.5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold">
                {error}
              </div>
            )}

            <div className="flex p-0.5 bg-slate-100 rounded-lg">
              {["worker", "contractor"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r })}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    formData.role === r
                      ? "bg-white text-navy shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {r === "worker" ? "Worker" : "Contractor"}
                </button>
              ))}
            </div>

            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-navy placeholder:text-slate-300 focus:border-navy/30 outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-navy placeholder:text-slate-300 focus:border-navy/30 outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-navy placeholder:text-slate-300 focus:border-navy/30 outline-none transition-colors"
              />
            </div>

            {formData.role === "worker" && (
              <div className="relative">
                <Wrench size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="text"
                  name="skill"
                  placeholder="Skill (e.g. Electrician, Plumber)"
                  value={formData.skill}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-navy placeholder:text-slate-300 focus:border-navy/30 outline-none transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || formData.phone.length < 10}
              className="w-full py-3 bg-saffron hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="p-6 pt-4 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                One Time Password
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-center text-lg font-bold tracking-[0.3em] text-navy placeholder:text-slate-300 focus:border-navy/30 outline-none transition-colors"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full py-3 bg-saffron hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Verify & Create Account <ShieldCheck size={16} /></>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep("details")}
              className="w-full text-xs font-bold text-saffron hover:text-orange-600 transition-colors"
            >
              Change number or details
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
