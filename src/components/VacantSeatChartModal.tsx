import React, { useState, useEffect } from 'react';
import {
  X,
  Train,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Copy,
  Info,
  ShieldCheck,
  ChevronRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import {
  BerthVacancy,
  getVacantBerthsForHop,
  VACANT_CHARTS_DATABASE,
} from '../data/vacantChartData.ts';
import { STATIONS } from '../data/railwayData.ts';

interface VacantSeatChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrainNumber?: string;
  initialFromStation?: string;
  initialToStation?: string;
}

export const VacantSeatChartModal: React.FC<VacantSeatChartModalProps> = ({
  isOpen,
  onClose,
  initialTrainNumber = '18234',
  initialFromStation = 'APR',
  initialToStation = 'JBP',
}) => {
  if (!isOpen) return null;

  const availableTrainNumbers = Object.keys(VACANT_CHARTS_DATABASE);
  const [selectedTrain, setSelectedTrain] = useState<string>(
    availableTrainNumbers.includes(initialTrainNumber) ? initialTrainNumber : '18234'
  );

  const coachesForTrain = VACANT_CHARTS_DATABASE[selectedTrain] || [];
  const [selectedCoach, setSelectedCoach] = useState<string>(
    coachesForTrain[0]?.coachCode || 'S3'
  );

  const [fromStation, setFromStation] = useState<string>(initialFromStation);
  const [toStation, setToStation] = useState<string>(initialToStation);

  const [selectedBerth, setSelectedBerth] = useState<BerthVacancy | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialTrainNumber && availableTrainNumbers.includes(initialTrainNumber)) {
      setSelectedTrain(initialTrainNumber);
      const coaches = VACANT_CHARTS_DATABASE[initialTrainNumber] || [];
      if (coaches.length > 0) {
        setSelectedCoach(coaches[0].coachCode);
      }
    }
    if (initialFromStation) setFromStation(initialFromStation);
    if (initialToStation) setToStation(initialToStation);
  }, [initialTrainNumber, initialFromStation, initialToStation, isOpen]);

  // Evaluate vacancy for selected hop
  const evaluation = getVacantBerthsForHop(selectedTrain, selectedCoach, fromStation, toStation);
  const currentCoach = coachesForTrain.find((c) => c.coachCode === selectedCoach) || coachesForTrain[0];

  // Helper station list for this train
  const trainHalts =
    selectedTrain === '18234'
      ? ['BSP', 'APR', 'KTE', 'JBP', 'ET', 'BPL', 'UJN', 'INDB']
      : selectedTrain === '11266'
      ? ['APR', 'KTE', 'JBP']
      : selectedTrain === '11703'
      ? ['KTE', 'DMO', 'SGO', 'BINA', 'BPL', 'UJN', 'INDB']
      : selectedTrain === '12853'
      ? ['APR', 'KTE', 'JBP', 'ET', 'BPL']
      : ['BPL', 'UJN', 'INDB'];

  const handleCopyBerth = (berth: BerthVacancy) => {
    const text = `Train ${selectedTrain} (${currentCoach?.trainName}), Coach ${berth.coach}, Berth ${berth.berthNumber} (${berth.berthTypeLabel}) is vacant between ${fromStation} and ${toStation}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center font-extrabold shadow-md shadow-emerald-500/20">
              <Train className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-white text-base">
                  Live Vacant Berth Chart
                </h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  IRCTC Integrated
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Find seats & berths vacant for short journey segments when direct trains show waitlisted
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

        {/* Train & Hop Selectors */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Train Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Select Train
              </label>
              <select
                value={selectedTrain}
                onChange={(e) => {
                  setSelectedTrain(e.target.value);
                  const firstCoach = VACANT_CHARTS_DATABASE[e.target.value]?.[0]?.coachCode || 'S1';
                  setSelectedCoach(firstCoach);
                  setSelectedBerth(null);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="18234">18234 Narmada Express</option>
                <option value="11703">11703 Rewa - Indore Intercity</option>
                <option value="11266">11266 Ambikapur - Jabalpur Intercity</option>
                <option value="12853">12853 Amarkantak Express</option>
                <option value="19324">19324 Bhopal - Indore Intercity</option>
              </select>
            </div>

            {/* From Station */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                From Station (Boarding)
              </label>
              <select
                value={fromStation}
                onChange={(e) => {
                  setFromStation(e.target.value);
                  setSelectedBerth(null);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {trainHalts.map((st) => (
                  <option key={st} value={st}>
                    {STATIONS[st]?.name || st} ({st})
                  </option>
                ))}
              </select>
            </div>

            {/* To Station */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                To Station (De-boarding)
              </label>
              <select
                value={toStation}
                onChange={(e) => {
                  setToStation(e.target.value);
                  setSelectedBerth(null);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {trainHalts.map((st) => (
                  <option key={st} value={st}>
                    {STATIONS[st]?.name || st} ({st})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Coach Switcher Tabs */}
          <div className="flex items-center space-x-2 pt-1 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Select Coach:</span>
            {coachesForTrain.map((c) => (
              <button
                key={c.coachCode}
                type="button"
                onClick={() => {
                  setSelectedCoach(c.coachCode);
                  setSelectedBerth(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCoach === c.coachCode
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                Coach {c.coachCode} ({c.coachClass})
              </button>
            ))}

            {/* Quick Segment Status Badge */}
            <div className="ml-auto shrink-0 flex items-center space-x-2 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-300 font-bold">
                {evaluation.vacantCount} Berths Vacant for {fromStation} ➔ {toStation}
              </span>
            </div>
          </div>
        </div>

        {/* Coach Layout Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Explanation Alert */}
          <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-800/40 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-slate-300">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Short-Distance Vacant Berths:</strong> Click on any green berth to view its exact vacant time window. Even when end-to-end direct tickets show WL (Waitlist), these specific berths are vacant between <strong>{fromStation}</strong> and <strong>{toStation}</strong> and can be booked via Current Booking or allocated directly by the train TTE!
            </div>
          </div>

          {/* Coach Grid: 2D Railway Bay Representation */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Train className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  Coach {currentCoach?.coachCode} Layout ({currentCoach?.coachClass} Class)
                </span>
              </span>

              {/* Legend */}
              <div className="flex items-center space-x-3 text-[11px]">
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                  <span className="text-slate-300">Vacant for Hop</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700"></span>
                  <span className="text-slate-400">Occupied</span>
                </div>
              </div>
            </div>

            {/* Grid of Berths */}
            <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-9 gap-2">
              {evaluation.berths.map(({ berth, isVacant }) => {
                const isSelected = selectedBerth?.berthNumber === berth.berthNumber;

                return (
                  <button
                    key={berth.berthNumber}
                    type="button"
                    onClick={() => setSelectedBerth(berth)}
                    className={`p-2 rounded-xl text-center border transition-all flex flex-col items-center justify-center relative ${
                      isSelected
                        ? 'ring-2 ring-cyan-400 scale-105 z-10'
                        : ''
                    } ${
                      isVacant
                        ? 'bg-emerald-950/80 border-emerald-600/70 text-emerald-200 hover:bg-emerald-900/60 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-xs font-black">{berth.berthNumber}</span>
                    <span className="text-[9px] font-semibold opacity-90">{berth.berthType}</span>

                    {isVacant && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Berth Inspector Panel */}
          {selectedBerth && (
            <div className="bg-slate-950 border border-cyan-800/60 rounded-xl p-4 space-y-3 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex flex-col items-center justify-center">
                    <span className="text-xs font-extrabold leading-none">{selectedBerth.berthNumber}</span>
                    <span className="text-[9px] font-bold">{selectedBerth.berthType}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">
                      Coach {selectedBerth.coach} • Berth {selectedBerth.berthNumber} ({selectedBerth.berthTypeLabel})
                    </h4>
                    <p className="text-xs text-slate-400">
                      Cabin / Bay {selectedBerth.cabinBayNumber} • {currentCoach?.coachClass} Class
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleCopyBerth(selectedBerth)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied Details</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy for TTE</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://www.irctc.co.in/online-charts/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <span>IRCTC Official Chart</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                </div>
              </div>

              {/* Station-by-station occupancy timeline for this berth */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Station Hop Occupancy Schedule:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 text-xs">
                  {selectedBerth.occupancyHistory.map((hop, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border text-center ${
                        hop.isVacant
                          ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="text-[10px] font-bold">
                        {hop.segmentFrom} ➔ {hop.segmentTo}
                      </div>
                      <div className="text-[10px] font-extrabold mt-0.5">
                        {hop.isVacant ? 'VACANT ✓' : 'BOOKED'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="text-slate-400">
            Current booking berths are synchronized with IRCTC chart generation 4 hours prior to departure.
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors"
          >
            Close Chart
          </button>
        </div>
      </div>
    </div>
  );
};
