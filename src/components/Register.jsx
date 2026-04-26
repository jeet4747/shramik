import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { User, Phone, MapPin, Wrench, X, ShieldCheck, ArrowRight } from "lucide-react";

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { data, error: sbError } = await supabase
      .from("users")
      .insert([formData]);

    setIsLoading(false);

    if (sbError) {
      console.log("Error:", sbError.message);
      setError(sbError.message);
    } else {
      console.log("User Registered:", data);
      onSuccess("Registration Successful! Welcome to Shramik.");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f2b5b]/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">

        {/* Header */}
        <div className="bg-[#0f2b5b] p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full">
            <X size={20} />
          </button>

          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck size={28} className="text-[#f97316]" />
          </div>

          <h2 className="text-2xl font-bold">Join Shramik</h2>
          <p className="text-white/70 text-sm">Register for the Workforce Network</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Role */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "worker" })}
              className={`flex-1 py-2 rounded-lg ${formData.role === "worker" ? "bg-white shadow" : ""
                }`}
            >
              Worker
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "contractor" })}
              className={`flex-1 py-2 rounded-lg ${formData.role === "contractor" ? "bg-white shadow" : ""
                }`}
            >
              Contractor
            </button>
          </div>

          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 rounded-xl bg-gray-100"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 rounded-xl bg-gray-100"
            />
          </div>

          {/* City */}
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full pl-10 p-3 rounded-xl bg-gray-100"
            />
          </div>

          {/* Skill */}
          {formData.role === "worker" && (
            <div className="relative">
              <Wrench className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="skill"
                placeholder="Skill (Electrician, Plumber)"
                value={formData.skill}
                onChange={handleChange}
                required
                className="w-full pl-10 p-3 rounded-xl bg-gray-100"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold"
          >
            {isLoading ? "Loading..." : "Create Account"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Register;