import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, AlertOctagon, Scale, BookOpen, Train } from 'lucide-react';

interface RailwayRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RailwayRulesModal: React.FC<RailwayRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Indian Railway Rules & Integrity Constitution</h3>
              <p className="text-xs text-slate-400">
                Ethical algorithms and strict compliance with Indian Railways (IRCTC) passenger guidelines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Rule 1: Never show waitlist as confirmed */}
          <div className="bg-slate-950/80 border border-emerald-900/40 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>1. Zero-Deception Quota Integrity (No False Confirmations)</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-6">
              A waitlisted (WL) ticket is strictly <strong>NEVER</strong> tagged as confirmed. If a direct train is in Waitlist status (like Narmada Express WL 48 / Regret), RailConnect AI explicitly labels it as waitlisted and marks the route in red. Only berths with verifiable <strong>CNF</strong> status are displayed as confirmed.
            </p>
          </div>

          {/* Rule 2: RAC separate from CNF */}
          <div className="bg-slate-950/80 border border-amber-900/40 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>2. Reservation Against Cancellation (RAC) Distinction</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-6">
              RAC ensures boarding rights and split seat allocation, but not a full sleeper berth until final charting. Therefore, RAC is color-coded amber and tracked separately from guaranteed CNF berths.
            </p>
          </div>

          {/* Rule 3: Independent Segment Verification */}
          <div className="bg-slate-950/80 border border-blue-900/40 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center space-x-2 text-blue-400 font-bold">
              <Train className="w-4 h-4 shrink-0" />
              <span>3. Independent Multi-Segment Verification</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-6">
              Every leg of a connecting journey is verified independently. A 2-train journey is only declared "100% Confirmed" when <strong>Leg 1 is CNF AND Leg 2 is CNF</strong>.
            </p>
          </div>

          {/* Rule 4: Interchange Buffer Safety */}
          <div className="bg-slate-950/80 border border-cyan-900/40 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>4. Safety Buffers & Delay Buffer Thresholds</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-6">
              RailConnect AI enforces a minimum connection buffer (default 40-45 minutes; recommended 60-90 minutes). Connections where the next train departs before arrival or with unsafe buffer margins are automatically discarded by the graph engine.
            </p>
          </div>

          {/* Rule 5: Transparent Data labeling */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center space-x-2 text-slate-300 font-bold">
              <BookOpen className="w-4 h-4 shrink-0 text-slate-400" />
              <span>5. Transparent Timetable & Availability Verification</span>
            </div>
            <p className="text-slate-400 leading-relaxed pl-6">
              Schedules reflect authorized Indian Railways passenger timetables. When external live API rate limits are encountered, all simulation parameters are clearly identified to maintain 100% passenger transparency.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
