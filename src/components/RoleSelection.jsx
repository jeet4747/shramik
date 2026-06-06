import React, { useState } from 'react';
import { Hammer, Briefcase, ArrowRight, ShieldCheck, X } from 'lucide-react';

const RoleSelection = ({ onSelect }) => {
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const handleAdminClick = () => {
    setShowAdminCode(true);
    setAdminCode('');
    setCodeError('');
  };

  const ADMIN_CODE = import.meta.env.VITE_ADMIN_CODE

  const handleAdminCodeSubmit = () => {
    if (adminCode.trim() === ADMIN_CODE) {
      setShowAdminCode(false);
      onSelect('admin');
    } else {
      setCodeError('Invalid admin code');
    }
  };
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f2b5b] mb-4 tracking-tight">Select Your Access</h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Choose your role to continue to the Shramik platform.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <button
          onClick={() => onSelect('worker')}
          className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-saffron hover:shadow-xl transition-all duration-300 text-left relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-saffron"></div>
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-saffron mb-6 group-hover:bg-saffron/10 transition-colors">
            <Hammer size={26} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Worker</h3>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">Find employment, track earnings, and manage your skill profile.</p>
          <div className="flex items-center justify-between w-full border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Worker</span>
            <ArrowRight size={18} className="text-saffron group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onSelect('contractor')}
          className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-[#0f2b5b] hover:shadow-xl transition-all duration-300 text-left relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-[#0f2b5b]"></div>
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[#0f2b5b] mb-6 group-hover:bg-navy/10 transition-colors">
            <Briefcase size={26} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Contractor</h3>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">Post requirements, hire talent, and manage labor compliance.</p>
          <div className="flex items-center justify-between w-full border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Contractor</span>
            <ArrowRight size={18} className="text-[#0f2b5b] group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={handleAdminClick}
          className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-purple-600 hover:shadow-xl transition-all duration-300 text-left relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-50 transition-colors">
            <ShieldCheck size={26} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Platform Admin</h3>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">Monitor platform growth, verify workers, and manage site-wide activity.</p>
          <div className="flex items-center justify-between w-full border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Admin</span>
            <ArrowRight size={18} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {showAdminCode && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative">
            <button onClick={() => setShowAdminCode(false)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500"><X size={20} /></button>
            <h3 className="text-xl font-bold text-navy mb-2">Admin Access</h3>
            <p className="text-sm text-slate-500 mb-4">Enter admin code to access platform administration</p>
            <input
              type="password"
              placeholder="Admin code"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminCodeSubmit()}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-purple-600 mb-2"
              autoFocus
            />
            {codeError && <p className="text-xs text-red-500 mb-4">{codeError}</p>}
            <button
              onClick={handleAdminCodeSubmit}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors"
            >
              Verify Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelection;
