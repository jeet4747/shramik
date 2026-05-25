import { useState } from "react";
import { supabase } from "../supabaseClient";
import { User, Phone, MapPin, Wrench, X, ArrowRight } from "lucide-react";

const Register = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    role: "worker",
    skill: "",
    city: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const id = crypto.randomUUID();

    const { data, error: dbError } = await supabase
      .from("users")
      .insert({
        id,
        phone: formData.phone.trim(),
        full_name: formData.full_name.trim(),
        role: formData.role,
        skill: formData.skill.trim() || null,
        city: formData.city.trim(),
      })
      .select()
      .single();

    setIsLoading(false);

    if (dbError) {
      if (dbError.code === "23505") {
        setError("This phone number is already registered. Please sign in.");
      } else {
        setError(dbError.message);
      }
      return;
    }

    // Store session
    const session = { id: data.id, phone: data.phone, role: data.role };
    localStorage.setItem("shramik_user", JSON.stringify(session));

    onSuccess(data);
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
            <User size={20} />
          </div>
          <h2 className="text-xl font-black text-navy">Create Account</h2>
          <p className="text-xs text-slate-400 mt-1">Join India's trusted workforce network</p>
        </div>

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
            disabled={isLoading || formData.phone.length < 10 || !formData.full_name.trim()}
            className="w-full py-3 bg-saffron hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Create Account <ArrowRight size={16} /></>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-400 pt-1">
            Already registered?{" "}
            <button
              type="button"
              onClick={onClose}
              className="text-saffron font-bold hover:underline"
            >
              Sign in instead
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
