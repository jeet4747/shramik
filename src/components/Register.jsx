import { useState } from "react";
import { supabase } from "../supabaseClient";
import { User, Phone, MapPin, Wrench, X, ArrowRight, CheckCircle, Users } from "lucide-react";
import { useLang } from "../context/LanguageContext";

const SKILLS_KEY = ['electrician', 'plumber', 'carpenter', 'painter', 'mason', 'welder', 'driver', 'helper', 'other'];

const NASHIK_CHOWKS = [
  'Nashik MIDC', 'Ambad MIDC', 'Satpur MIDC', 'Gangapur Road',
  'Panchavati', 'CIDCO', 'Trimbak Road', 'Dindori Road',
  'College Road', 'Mhasrul', 'Dwarka', 'Indira Nagar',
  'Bhadrakali', 'Ravivar Karanja', 'Other',
];

const Register = ({ onClose, onSuccess }) => {
  const { t } = useLang();
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    role: "worker",
    skill: "",
    city: "नाशिक",
    chowk: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSkillPicker, setShowSkillPicker] = useState(false);
  const [showChowkPicker, setShowChowkPicker] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const id = crypto.randomUUID();

    const payload = {
      id, phone: formData.phone.trim(), full_name: formData.full_name.trim(),
      role: formData.role, city: formData.city.trim(),
      is_verified: false,
    };
    if (formData.role === 'worker') {
      payload.skill = formData.skill.trim() || null;
      payload.chowk = formData.chowk || null;
    }

    const { data, error: dbError } = await supabase
      .from("users").insert(payload).select().single();

    setIsLoading(false);

    if (dbError) {
      if (dbError.code === "23505") {
        setError(t('reg_error_duplicate'));
      } else {
        setError(dbError.message);
      }
      return;
    }

    const session = { id: data.id, phone: data.phone, role: data.role };
    localStorage.setItem("shramik_user", JSON.stringify(session));
    onSuccess(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-lg transition-colors z-10"><X size={18} /></button>

        <div className="p-6 pb-2 text-center">
          <div className="w-12 h-12 bg-saffron text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <User size={22} />
          </div>
          <h2 className="text-xl font-black text-navy">{t('reg_title')}</h2>
          <p className="text-xs text-slate-400 mt-1">{t('reg_subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-3">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold flex items-center gap-2"><X size={14} /> {error}</div>
          )}

          <div className="flex p-0.5 bg-slate-100 rounded-lg">
            {[
              { key: "worker", label: t('reg_worker') },
              { key: "thekedar", label: t('reg_contractor') },
            ].map((r) => (
              <button key={r.key} type="button"
                onClick={() => setFormData({ ...formData, role: r.key, skill: '', chowk: '' })}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${formData.role === r.key ? "bg-white text-navy shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
            <input type="text" name="full_name" placeholder={t('reg_name_placeholder')} value={formData.full_name} onChange={handleChange} required
              className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-navy placeholder:text-slate-300 focus:border-navy/30 outline-none transition-colors" />
          </div>

          <div className="relative">
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
            <input type="tel" name="phone" placeholder={t('reg_phone_placeholder')} value={formData.phone} onChange={handleChange} required
              className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-navy placeholder:text-slate-300 focus:border-navy/30 outline-none transition-colors" />
          </div>

          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
            <input type="text" name="city" placeholder={t('reg_city_placeholder')} value={formData.city} onChange={handleChange} required
              className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-navy placeholder:text-slate-300 focus:border-navy/30 outline-none transition-colors" />
          </div>

          {formData.role === "worker" && (
            <>
              {/* Chowk picker */}
              <div className="relative">
                <Users size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 z-10" />
                <div onClick={() => { setShowChowkPicker(!showChowkPicker); setShowSkillPicker(false) }}
                  className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-navy cursor-pointer flex items-center justify-between"
                >
                  <span className={formData.chowk ? "text-navy" : "text-slate-300"}>{formData.chowk || 'तुमचं चौक निवडा'}</span>
                  <ArrowRight size={14} className={`text-slate-300 transition-transform ${showChowkPicker ? "rotate-90" : ""}`} />
                </div>
                {showChowkPicker && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-2 max-h-48 overflow-y-auto">
                    {NASHIK_CHOWKS.map((c) => (
                      <button key={c} type="button" onClick={() => { setFormData({ ...formData, chowk: c }); setShowChowkPicker(false) }}
                        className={`w-full p-2 rounded-lg text-xs font-bold text-left transition-colors ${formData.chowk === c ? "bg-navy text-white" : "text-slate-600 hover:bg-slate-50"}`}
                      >{c}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Skill picker */}
              <div className="relative">
                <Wrench size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 z-10" />
                <div onClick={() => { setShowSkillPicker(!showSkillPicker); setShowChowkPicker(false) }}
                  className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-navy cursor-pointer flex items-center justify-between"
                >
                  <span className={formData.skill ? "text-navy" : "text-slate-300"}>{formData.skill || t('reg_skill_placeholder')}</span>
                  <ArrowRight size={14} className={`text-slate-300 transition-transform ${showSkillPicker ? "rotate-90" : ""}`} />
                </div>
                {showSkillPicker && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-2 grid grid-cols-2 gap-1">
                    {SKILLS_KEY.map((s) => (
                      <button key={s} type="button" onClick={() => { setFormData({ ...formData, skill: s === "other" ? "" : t(`reg_skill_${s}`) }); setShowSkillPicker(false) }}
                        className={`p-2 rounded-lg text-xs font-bold transition-colors ${formData.skill === t(`reg_skill_${s}`) ? "bg-saffron text-white" : "text-slate-600 hover:bg-slate-50"}`}
                      >{t(`reg_skill_${s}`)}</button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <button type="submit" disabled={isLoading || formData.phone.length < 10 || !formData.full_name.trim()}
            className="w-full py-3.5 bg-saffron hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><CheckCircle size={18} /> {t('reg_btn')}</>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-400 pt-1">
            {t('reg_login_link')}{" "}
            <button type="button" onClick={onClose} className="text-saffron font-bold hover:underline">{t('reg_login_link_btn')}</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
