import React from 'react';
import { Hammer, Briefcase, ArrowRight } from 'lucide-react';

const RoleSelection = ({ onSelect }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f2b5b] mb-4 tracking-tight">Aap kaun hain?</h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Select your profile to continue to your dashboard.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <button
          onClick={() => onSelect('worker')}
          className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-saffron hover:shadow-xl transition-all duration-300 text-left relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-saffron"></div>
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-saffron mb-6 group-hover:bg-saffron/10 transition-colors">
            <Hammer size={26} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Worker / Shramik</h3>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">Continue to find employment, track earnings, and manage your availability.</p>
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
          <h3 className="text-xl font-bold text-slate-900 mb-2">Contractor / Employer</h3>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">Continue to post requirements, hire workers, and manage labor compliance.</p>
          <div className="flex items-center justify-between w-full border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Contractor</span>
            <ArrowRight size={18} className="text-[#0f2b5b] group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
