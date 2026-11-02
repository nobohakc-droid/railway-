import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { BenchmarkBanner } from './components/BenchmarkBanner.tsx';
import { SearchSection } from './components/SearchSection.tsx';
import { RailwayMap } from './components/RailwayMap.tsx';
import { RouteCard } from './components/RouteCard.tsx';
import { JourneyTimelineModal } from './components/JourneyTimelineModal.tsx';
import { AiCopilotModal } from './components/AiCopilotModal.tsx';
import { IrctcBookingModal } from './components/IrctcBookingModal.tsx';
import { StationDetailsModal } from './components/StationDetailsModal.tsx';
import { RailwayRulesModal } from './components/RailwayRulesModal.tsx';
import { VacantSeatChartModal } from './components/VacantSeatChartModal.tsx';
import { JourneyRoute, RouteSearchParams, SearchResultSummary, searchRailwayRoutes } from './services/routeEngine.ts';
import { RailwayStation, STATIONS } from './data/railwayData.ts';
import {
  Sparkles,
  Train,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Layers,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';

export default function App() {
  // Benchmark initial parameters: APR to INDB, Nov 5 2026, Sleeper, Confirmed Only
  const [searchParams, setSearchParams] = useState<RouteSearchParams>({
    fromStation: 'APR',
    toStation: 'INDB',
    travelDate: '2026-11-05',
    travelClass: 'SL',
    preference: 'CONFIRMED_ONLY',
    maxChanges: 1,
    minBufferMins: 45,
    maxBufferHours: 8,
    passengerCount: 1,
    prioritizeIntercity: true,
  });

  const [searchResult, setSearchResult] = useState<SearchResultSummary | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<JourneyRoute | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CONFIRMED' | 'INTERCITY' | 'FASTEST' | 'MIN_WAIT'>('ALL');

  // Modals state
  const [timelineRoute, setTimelineRoute] = useState<JourneyRoute | null>(null);
  const [copilotRoute, setCopilotRoute] = useState<JourneyRoute | null>(null);
  const [bookingRoute, setBookingRoute] = useState<JourneyRoute | null>(null);
  const [inspectedStation, setInspectedStation] = useState<RailwayStation | null>(null);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [vacantChartOpen, setVacantChartOpen] = useState<boolean>(false);
  const [vacantChartTrain, setVacantChartTrain] = useState<string>('18234');
  const [vacantChartFrom, setVacantChartFrom] = useState<string>('APR');
  const [vacantChartTo, setVacantChartTo] = useState<string>('JBP');

  const handleOpenVacantChart = (trainNumber?: string, fromCode?: string, toCode?: string) => {
    if (trainNumber) setVacantChartTrain(trainNumber);
    if (fromCode) setVacantChartFrom(fromCode);
    if (toCode) setVacantChartTo(toCode);
    setVacantChartOpen(true);
  };

  // Execute initial search on mount (benchmark APR to INDB)
  useEffect(() => {
    executeSearch(searchParams);
  }, []);

  const executeSearch = (params: RouteSearchParams) => {
    setIsLoading(true);
    setSearchParams(params);

    // Call server search endpoint or route engine
    fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data: SearchResultSummary) => {
        setSearchResult(data);
        if (data.routes.length > 0) {
          setSelectedRoute(data.routes[0]);
        } else {
          setSelectedRoute(null);
        }
        setIsLoading(false);
      })
      .catch((_err) => {
        // In-browser fallback if backend unavailable
        const localData = searchRailwayRoutes(params);
        setSearchResult(localData);
        if (localData.routes.length > 0) {
          setSelectedRoute(localData.routes[0]);
        }
        setIsLoading(false);
      });
  };

  // Benchmark one-click preset trigger
  const handleLoadBenchmark = () => {
    const benchParams: RouteSearchParams = {
      fromStation: 'APR',
      toStation: 'INDB',
      travelDate: '2026-11-05',
      travelClass: 'SL',
      preference: 'CONFIRMED_ONLY',
      maxChanges: 1,
      minBufferMins: 45,
      maxBufferHours: 8,
      passengerCount: 1,
      prioritizeIntercity: true,
    };
    executeSearch(benchParams);
  };

  // AI Prompt search handler
  const handleAiPromptSearch = async (prompt: string) => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/parse-nl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: prompt }),
      });
      const json = await res.json();

      const parsed = json.data || json.fallback;
      if (parsed) {
        const newParams: RouteSearchParams = {
          fromStation: parsed.fromStation || 'APR',
          toStation: parsed.toStation || 'INDB',
          travelDate: parsed.travelDate || '2026-11-05',
          travelClass: parsed.travelClass || 'SL',
          preference: parsed.preference || 'CONFIRMED_ONLY',
          maxChanges: 1,
          minBufferMins: 45,
          maxBufferHours: 8,
          passengerCount: parsed.passengerCount || 1,
        };
        executeSearch(newParams);
      }
    } catch (e) {
      console.error(e);
      handleLoadBenchmark();
    } finally {
      setAiLoading(false);
    }
  };

  // Filter routes according to selected filter tab
  const getFilteredRoutes = () => {
    if (!searchResult) return [];
    let list = [...searchResult.routes];

    if (activeFilter === 'CONFIRMED') {
      list = list.filter((r) => r.overallSeatStatus === 'CONFIRMED');
    } else if (activeFilter === 'INTERCITY') {
      list = list.filter((r) => r.hasIntercityLeg && r.overallSeatStatus === 'CONFIRMED');
    } else if (activeFilter === 'FASTEST') {
      list = list
        .filter((r) => r.overallSeatStatus === 'CONFIRMED')
        .sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
    } else if (activeFilter === 'MIN_WAIT') {
      list = list
        .filter((r) => r.overallSeatStatus === 'CONFIRMED' && r.interchanges.length > 0)
        .sort((a, b) => a.totalWaitingMinutes - b.totalWaitingMinutes);
    }

    return list;
  };

  const filteredRoutes = getFilteredRoutes();
  const isBenchmarkCase = searchParams.fromStation === 'APR' && searchParams.toStation === 'INDB';

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        onLoadBenchmark={handleLoadBenchmark}
        onOpenRules={() => setShowRulesModal(true)}
        onOpenVacantChart={() => handleOpenVacantChart()}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Benchmark Highlight Banner */}
        <BenchmarkBanner
          onLoadBenchmark={handleLoadBenchmark}
          activeBenchmark={isBenchmarkCase}
        />

        {/* Search & AI Input Card */}
        <SearchSection
          searchParams={searchParams}
          onSearch={executeSearch}
          isLoading={isLoading}
          onAiPromptSearch={handleAiPromptSearch}
          aiLoading={aiLoading}
        />

        {/* Interactive Railway Network Map */}
        <RailwayMap
          selectedRoute={selectedRoute}
          onSelectStation={(station) => setInspectedStation(station)}
          fromStationCode={searchParams.fromStation}
          toStationCode={searchParams.toStation}
        />

        {/* Results Summary Dashboard Bar */}
        {searchResult && (
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
                    <span>
                      {STATIONS[searchParams.fromStation]?.city || searchParams.fromStation} ({searchParams.fromStation})
                    </span>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                    <span>
                      {STATIONS[searchParams.toStation]?.city || searchParams.toStation} ({searchParams.toStation})
                    </span>
                  </h2>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-semibold">
                    {searchParams.travelClass} Class
                  </span>
                </div>
                <p className="text-xs text-slate-400 pt-0.5">
                  Travel Date: <strong className="text-slate-200">{searchParams.travelDate}</strong> • Preference:{' '}
                  <strong className="text-emerald-400">{searchParams.preference.replace('_', ' ')}</strong>
                </p>
              </div>

              {/* Stat Chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Direct Status Chip */}
                {searchResult.directTrainHasConfirmedSeats ? (
                  <div className="bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Direct Train Has Berths</span>
                  </div>
                ) : (
                  <div className="bg-red-950/40 border border-red-800/60 text-red-300 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Direct Train: 0 Confirmed (Waitlist)</span>
                  </div>
                )}

                {/* Intercity Options Chip */}
                {searchResult.intercityRouteCount > 0 && (
                  <div className="bg-indigo-950/50 border border-indigo-700/60 text-indigo-200 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 shadow-sm">
                    <Train className="w-4 h-4 text-cyan-400" />
                    <span>{searchResult.intercityRouteCount} Intercity Vacant Options</span>
                  </div>
                )}

                {/* Confirmed Routes Found Chip */}
                <div className="bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-800/60 text-cyan-200 px-3.5 py-1.5 rounded-xl font-extrabold flex items-center space-x-1.5 shadow-md">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>{searchResult.confirmedRouteCount} Confirmed Routes Unlocked!</span>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs font-semibold">
              <span className="text-slate-400 flex items-center space-x-1 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </span>

              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeFilter === 'ALL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Routes ({searchResult.routes.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('CONFIRMED')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
                  activeFilter === 'CONFIRMED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Confirmed ({searchResult.confirmedRouteCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('INTERCITY')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                  activeFilter === 'INTERCITY'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Train className="w-3.5 h-3.5 text-cyan-400" />
                <span>🚆 Intercity Vacant Berths ({searchResult.intercityRouteCount || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('FASTEST')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeFilter === 'FASTEST'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                ⚡ Fastest Travel Time
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('MIN_WAIT')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeFilter === 'MIN_WAIT'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                ⏱️ Minimum Waiting Time
              </button>
            </div>
          </div>
        )}

        {/* Routes List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-slate-300">
                Searching Railway graph & validating seat quotas...
              </p>
            </div>
          ) : filteredRoutes.length > 0 ? (
            filteredRoutes.map((route) => (
              <RouteCard
                key={route.routeId}
                route={route}
                isSelected={selectedRoute?.routeId === route.routeId}
                onSelectRoute={(r) => setSelectedRoute(r)}
                onOpenTimeline={(r) => setTimelineRoute(r)}
                onOpenAiAdvice={(r) => setCopilotRoute(r)}
                onOpenBooking={(r) => setBookingRoute(r)}
                onOpenVacantChart={(trainNum, from, to) => handleOpenVacantChart(trainNum, from, to)}
              />
            ))
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No routes matched current filter criteria</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try widening your connection buffer, allowing RAC seats, or switching to "All Options" to view available alternatives.
              </p>
              <button
                onClick={handleLoadBenchmark}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Reset to APR → INDB Benchmark
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white text-sm">RailConnect AI</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">v2.5 Production</span>
              </div>
              <p className="text-slate-400 text-xs">
                Indian Railway Connecting Train Finder & Graph Route Optimizer
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <button
                onClick={() => setShowRulesModal(true)}
                className="hover:text-white transition-colors underline"
              >
                IRCTC Rules & Quota Constitution
              </button>
              <span className="text-slate-600">•</span>
              <a
                href="https://www.irctc.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                IRCTC Official Portal
              </a>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 flex items-center">
                <Shield className="w-3.5 h-3.5 mr-1" />
                Zero-Deception Guaranteed (No False CNF)
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div>
              Algorithmic graph routing engine modeled on Indian Railways network (SECR / WCR / WR / NR / CR). Powered by Gemini 3.8 Flash.
            </div>
            <div>
              RailConnect AI © 2026. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <JourneyTimelineModal
        route={timelineRoute}
        onClose={() => setTimelineRoute(null)}
      />

      <AiCopilotModal
        route={copilotRoute}
        onClose={() => setCopilotRoute(null)}
      />

      <IrctcBookingModal
        route={bookingRoute}
        onClose={() => setBookingRoute(null)}
      />

      <StationDetailsModal
        station={inspectedStation}
        onClose={() => setInspectedStation(null)}
      />

      <RailwayRulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />

      <VacantSeatChartModal
        isOpen={vacantChartOpen}
        onClose={() => setVacantChartOpen(false)}
        initialTrainNumber={vacantChartTrain}
        initialFromStation={vacantChartFrom}
        initialToStation={vacantChartTo}
      />
    </div>
  );
}
