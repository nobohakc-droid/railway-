import React from 'react';
import { AlertCircle, CheckCircle2, ArrowRight, Zap, Split, Route } from 'lucide-react';

interface BenchmarkBannerProps {
  onLoadBenchmark: () => void;
  activeBenchmark: boolean;
}

export const BenchmarkBanner: React.FC<BenchmarkBannerProps> = ({ onLoadBenchmark, activeBenchmark }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/70 to-slate-900 border border-blue-800/40 p-4 sm:p-5 shadow-xl">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Explanation */}
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Zap className="w-3 h-3 text-amber-400 mr-1" />
              Verified Benchmark Case
            </span>
            <span className="text-xs text-slate-400">
              Source: <strong className="text-white">Anuppur (APR)</strong> → Destination: <strong className="text-white">Indore (INDB)</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* The Direct Train Problem */}
            <div className="flex items-start space-x-3 bg-red-950/30 border border-red-900/40 rounded-xl p-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-200">Direct Train Problem:</p>
                <p className="text-xs text-red-300/90 leading-relaxed">
                  <strong>18234 Narmada Express</strong> has zero confirmed Sleeper berths (<span className="text-red-400 font-semibold underline">WL 48 / Regret</span>). Direct passengers are stranded or forced onto waitlists.
                </p>
              </div>
            </div>

            {/* RailConnect AI Solution */}
            <div className="flex items-start space-x-3 bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-200">RailConnect AI Solution:</p>
                <p className="text-xs text-emerald-300/90 leading-relaxed">
                  Automatically unlocks confirmed routes through <strong>Jabalpur (JBP)</strong>, <strong>Bhopal (BPL)</strong>, <strong>Katni (KTE)</strong> & <strong>Itarsi (ET)</strong> with guaranteed confirmed berths!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={onLoadBenchmark}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
              activeBenchmark
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 ring-2 ring-blue-400'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20'
            }`}
          >
            <Route className="w-4 h-4" />
            <span>{activeBenchmark ? 'Benchmark Active: APR → INDB' : 'Run APR → INDB Benchmark'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
