import React from 'react';
import { Train, Sparkles, ShieldCheck, MapPin, Info, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onLoadBenchmark: () => void;
  onOpenRules: () => void;
  onOpenVacantChart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadBenchmark,
  onOpenRules,
  onOpenVacantChart,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Train className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                RailConnect <span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-900/80 text-blue-300 border border-blue-700/60 px-2 py-0.5 rounded-full">
                Indian Railways
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Smart Connecting Train & Confirmed Berth Optimization
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Live Vacant Berth Chart Button */}
          <button
            onClick={onOpenVacantChart}
            className="flex items-center space-x-1.5 text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg transition-all shadow-sm group"
            title="Open Live In-Browser Vacant Berth Chart"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">📊 Vacant Berth Chart</span>
            <span className="sm:hidden">📊 Chart</span>
          </button>

          {/* Preset Benchmark Button */}
          <button
            onClick={onLoadBenchmark}
            className="flex items-center space-x-1.5 text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg transition-all shadow-sm"
            title="Load benchmark case: Anuppur (APR) to Indore (INDB) - Narmada Exp Alternative"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden md:inline">Benchmark:</span>
            <span>APR → INDB</span>
          </button>

          {/* IRCTC Rulebook Modal Button */}
          <button
            onClick={onOpenRules}
            className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Railway Rules</span>
          </button>
        </div>
      </div>
    </header>
  );
};
