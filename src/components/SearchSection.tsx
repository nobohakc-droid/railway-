import React, { useState } from 'react';
import {
  Search,
  ArrowRightLeft,
  Calendar,
  Users,
  Sparkles,
  SlidersHorizontal,
  Clock,
  Shield,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Train,
  Zap,
} from 'lucide-react';
import { BookingPreference, RouteSearchParams } from '../services/routeEngine.ts';
import { RailwayStation, STATIONS, TravelClass } from '../data/railwayData.ts';

interface SearchSectionProps {
  searchParams: RouteSearchParams;
  onSearch: (params: RouteSearchParams) => void;
  isLoading: boolean;
  onAiPromptSearch: (prompt: string) => Promise<void>;
  aiLoading: boolean;
}

const CLASS_OPTIONS: { code: TravelClass; name: string; desc: string }[] = [
  { code: 'SL', name: 'Sleeper (SL)', desc: 'Non-AC Berths' },
  { code: '3AC', name: '3 Tier AC (3A)', desc: 'AC 3 Tier Berths' },
  { code: '2AC', name: '2 Tier AC (2A)', desc: 'AC 2 Tier Berths' },
  { code: '1AC', name: 'First AC (1A)', desc: 'Luxury AC Coupes' },
  { code: 'CC', name: 'AC Chair (CC)', desc: 'Comfortable Seating' },
  { code: '2S', name: 'Second Sitting (2S)', desc: 'Reserved Seats' },
];

const PREFERENCE_OPTIONS: { value: BookingPreference; label: string; desc: string }[] = [
  { value: 'CONFIRMED_ONLY', label: 'Confirmed Only (CNF)', desc: 'Guaranteed berth on every leg' },
  { value: 'RAC_OK', label: 'RAC Acceptable', desc: 'Allows RAC & Confirmed seats' },
  { value: 'ALL', label: 'All Options (incl. WL)', desc: 'View waitlists & direct comparisons' },
];

export const SearchSection: React.FC<SearchSectionProps> = ({
  searchParams,
  onSearch,
  isLoading,
  onAiPromptSearch,
  aiLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'STANDARD' | 'AI'>('STANDARD');
  const [nlQuery, setNlQuery] = useState(
    'I want to travel from Anuppur (APR) to Indore (INDB) on 5 November 2026, Sleeper class with confirmed berth'
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Form local state
  const [fromCode, setFromCode] = useState(searchParams.fromStation);
  const [toCode, setToCode] = useState(searchParams.toStation);
  const [date, setDate] = useState(searchParams.travelDate);
  const [travelClass, setTravelClass] = useState<TravelClass>(searchParams.travelClass);
  const [preference, setPreference] = useState<BookingPreference>(searchParams.preference);
  const [maxChanges, setMaxChanges] = useState<number>(searchParams.maxChanges);
  const [minBufferMins, setMinBufferMins] = useState<number>(searchParams.minBufferMins);
  const [maxBufferHours, setMaxBufferHours] = useState<number>(searchParams.maxBufferHours);
  const [passengers, setPassengers] = useState<number>(searchParams.passengerCount);
  const [prioritizeIntercity, setPrioritizeIntercity] = useState<boolean>(searchParams.prioritizeIntercity ?? true);

  // Station dropdown helpers
  const stationList = Object.values(STATIONS);

  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      fromStation: fromCode,
      toStation: toCode,
      travelDate: date,
      travelClass,
      preference,
      maxChanges,
      minBufferMins,
      maxBufferHours,
      passengerCount: passengers,
      prioritizeIntercity,
    });
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlQuery.trim()) return;
    await onAiPromptSearch(nlQuery);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl p-5 md:p-6 backdrop-blur-md">
      {/* Mode Switch Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('STANDARD')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'STANDARD'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Smart Route Search</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AI')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'AI'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>AI Natural Language Search</span>
          </button>
        </div>

        {/* Quick Help Pill */}
        <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Never tags waitlist as confirmed</span>
        </div>
      </div>

      {/* AI Search Tab */}
      {activeTab === 'AI' ? (
        <form onSubmit={handleAiSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300">
              Describe your journey in plain English or conversational phrasing:
            </label>
            <div className="relative">
              <textarea
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-medium resize-none"
                placeholder="e.g. Find confirmed sleeper train from Anuppur to Indore on 5 November 2026. If Narmada is full, suggest routes via Bhopal or Jabalpur."
              />
              <div className="absolute right-3 bottom-3">
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {aiLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Parsing with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>AI Parse & Find Routes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400">Try quick AI queries:</span>
            <button
              type="button"
              onClick={() =>
                setNlQuery('Anuppur to Indore on 5 Nov 2026, Sleeper class with guaranteed confirmed berth only')
              }
              className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/40 px-2.5 py-1 rounded-md transition-colors"
            >
              "APR to INDB 5 Nov Confirmed Sleeper"
            </button>
            <button
              type="button"
              onClick={() =>
                setNlQuery('Find AC 3 Tier train from Jabalpur to Indore tomorrow with minimal layover')
              }
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md transition-colors"
            >
              "JBP to INDB 3AC with minimal layover"
            </button>
            <button
              type="button"
              onClick={() =>
                setNlQuery('Bhopal to Indore evening Vande Bharat or Intercity CC with confirmed seat')
              }
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md transition-colors"
            >
              "Bhopal to Indore Evening CC"
            </button>
          </div>
        </form>
      ) : (
        /* Standard Form */
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: From Station, Swap, To Station, Date */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            {/* From Station */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>From Station (Source)</span>
              </label>
              <select
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                {stationList.map((st) => (
                  <option key={st.code} value={st.code}>
                    {st.name} ({st.code}) - {st.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center py-1 md:py-0">
              <button
                type="button"
                onClick={handleSwap}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:rotate-180"
                title="Swap From and To stations"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To Station */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Destination Station</span>
              </label>
              <select
                value={toCode}
                onChange={(e) => setToCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-semibold"
              >
                {stationList.map((st) => (
                  <option key={st.code} value={st.code}>
                    {st.name} ({st.code}) - {st.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Journey Date */}
            <div className="md:col-span-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Journey Date</span>
                </label>
                <button
                  type="button"
                  onClick={() => setDate('2026-11-05')}
                  className="text-[10px] text-amber-300 hover:underline font-semibold"
                >
                  Nov 5 (Bench)
                </button>
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* Row 2: Class Pills & Booking Preference */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
            {/* Travel Class Pills */}
            <div className="lg:col-span-7 space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Travel Class
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {CLASS_OPTIONS.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setTravelClass(c.code)}
                    className={`px-2 py-2 rounded-xl text-center border transition-all ${
                      travelClass === c.code
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md font-bold'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 font-medium'
                    }`}
                  >
                    <div className="text-xs font-bold">{c.code}</div>
                    <div className="text-[10px] opacity-75 truncate">{c.name.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Preference */}
            <div className="lg:col-span-5 space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Booking Preference</span>
                {preference === 'CONFIRMED_ONLY' && (
                  <span className="text-[10px] text-emerald-400 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-0.5" /> 100% CNF Enforced
                  </span>
                )}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PREFERENCE_OPTIONS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPreference(p.value)}
                    className={`px-2 py-2 rounded-xl text-center border transition-all text-xs font-semibold ${
                      preference === p.value
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                    title={p.desc}
                  >
                    {p.label.split(' ')[0]}
                    <span className="block text-[9px] opacity-80">
                      {p.value === 'CONFIRMED_ONLY' ? 'CNF Only' : p.value === 'RAC_OK' ? 'RAC Ok' : 'All'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Intercity Express Vacant Berth Option */}
          <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/50 to-slate-900 border border-cyan-800/50 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <Train className="w-4 h-4" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-extrabold text-white">
                    Intercity Express Option (High Vacancy Berths)
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded font-bold">
                    ✓ Abundant Vacant Seats
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 pt-0.5 leading-relaxed">
                  Intercity trains (Ambikapur–Jabalpur, Bhopal–Indore, Rewa–Indore) feature dedicated regional quotas with confirmed vacant berths when long-distance mail/superfast trains are waitlisted.
                </p>
              </div>
            </div>

            <label className="flex items-center space-x-2.5 cursor-pointer bg-slate-900/90 border border-cyan-700/60 px-3 py-1.5 rounded-lg hover:border-cyan-500 transition-colors self-end sm:self-center shrink-0">
              <input
                type="checkbox"
                checked={prioritizeIntercity}
                onChange={(e) => setPrioritizeIntercity(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 bg-slate-950 border-slate-700 cursor-pointer accent-cyan-500"
              />
              <span className="text-xs font-bold text-cyan-300">Prioritize Intercity</span>
            </label>
          </div>

          {/* Advanced Filters Expandable */}
          <div>
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>
                  {showAdvanced ? 'Hide Advanced Route Parameters' : 'Show Advanced Connection & Layover Filters'}
                </span>
              </button>

              <div className="text-xs text-slate-400">
                Max Changes: <strong className="text-white">{maxChanges}</strong> | Min Buffer:{' '}
                <strong className="text-white">{minBufferMins}m</strong>
              </div>
            </div>

            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-950/70 border border-slate-800 rounded-xl p-4 mt-3">
                {/* Max Changes */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>Max Train Changes</span>
                  </label>
                  <select
                    value={maxChanges}
                    onChange={(e) => setMaxChanges(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value={1}>1 Change (2 Trains) - Recommended</option>
                    <option value={2}>2 Changes (3 Trains)</option>
                    <option value={0}>0 Changes (Direct Only)</option>
                  </select>
                </div>

                {/* Min Interchange Buffer */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Min Connection Buffer</span>
                  </label>
                  <select
                    value={minBufferMins}
                    onChange={(e) => setMinBufferMins(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value={30}>30 mins (Fast transfer)</option>
                    <option value={45}>45 mins (Balanced)</option>
                    <option value={60}>60 mins (Recommended safe)</option>
                    <option value={90}>90 mins (Delay proof)</option>
                  </select>
                </div>

                {/* Max Waiting Time */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Max Waiting Time</span>
                  </label>
                  <select
                    value={maxBufferHours}
                    onChange={(e) => setMaxBufferHours(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value={4}>Up to 4 hours</option>
                    <option value={6}>Up to 6 hours</option>
                    <option value={8}>Up to 8 hours</option>
                    <option value={12}>Up to 12 hours (Overnight allowed)</option>
                  </select>
                </div>

                {/* Passengers */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Passengers</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={passengers}
                    onChange={(e) => setPassengers(Math.max(1, Math.min(6, Number(e.target.value))))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold py-3.5 rounded-xl shadow-xl shadow-blue-600/25 flex items-center justify-center space-x-2 text-base transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Computing Graph Topology & Verifying Berths...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Find Confirmed Connecting Trains</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
