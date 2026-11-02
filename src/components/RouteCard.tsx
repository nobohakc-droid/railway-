import React from 'react';
import {
  Train,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  Zap,
  Coffee,
  CheckCircle2,
  Calendar,
  Ticket,
  ChevronRight,
  Building,
} from 'lucide-react';
import { JourneyRoute } from '../services/routeEngine.ts';

interface RouteCardProps {
  route: JourneyRoute;
  onOpenTimeline: (route: JourneyRoute) => void;
  onOpenAiAdvice: (route: JourneyRoute) => void;
  onOpenBooking: (route: JourneyRoute) => void;
  onOpenVacantChart?: (trainNumber: string, fromCode: string, toCode: string) => void;
  isSelected: boolean;
  onSelectRoute: (route: JourneyRoute) => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  onOpenTimeline,
  onOpenAiAdvice,
  onOpenBooking,
  onOpenVacantChart,
  isSelected,
  onSelectRoute,
}) => {
  const isDirect = route.isDirect;
  const isConfirmed = route.overallSeatStatus === 'CONFIRMED';
  const isRAC = route.overallSeatStatus === 'RAC';
  const isWL = route.overallSeatStatus === 'WAITLIST';

  const firstLeg = route.legs[0];
  const lastLeg = route.legs[route.legs.length - 1];

  return (
    <div
      onClick={() => onSelectRoute(route)}
      className={`rounded-2xl border transition-all cursor-pointer shadow-lg overflow-hidden ${
        isSelected
          ? 'bg-slate-900/95 border-cyan-500/80 ring-2 ring-cyan-500/30 shadow-cyan-500/10'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/95'
      }`}
    >
      {/* Top Header Badge Bar */}
      <div className="px-5 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 bg-slate-950/60">
        <div className="flex flex-wrap items-center gap-2">
          {/* Confirmed / RAC / WL Status Pill */}
          {isConfirmed ? (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% CONFIRMED BERTH</span>
            </span>
          ) : isRAC ? (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>RAC STATUS (Confirmed Sitting)</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/20 text-red-300 border border-red-500/40">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>DIRECT IS WAITLISTED (NO BERTH)</span>
            </span>
          )}

          {/* Recommended Tag */}
          {route.recommendedBadge && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {route.recommendedBadge}
            </span>
          )}

          {/* Intercity Tag */}
          {route.hasIntercityLeg && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Train className="w-3 h-3 text-cyan-400" />
              <span>Intercity Vacant Berths</span>
            </span>
          )}

          {/* Route Type */}
          {isDirect ? (
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
              Direct Train (0 Changes)
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-slate-200 bg-blue-950/80 border border-blue-800/60 px-2.5 py-0.5 rounded-full">
              1 Transfer (via {route.interchanges[0]?.station.name.split(' ')[0]})
            </span>
          )}
        </div>

        {/* Fare and Duration */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Fare</span>
            <span className="text-base font-extrabold text-white">₹{route.totalFare}</span>
          </div>
          <div className="text-right pl-3 border-l border-slate-800">
            <span className="text-xs text-slate-400 block">Journey Time</span>
            <span className="text-sm font-bold text-cyan-300 flex items-center justify-end">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {route.totalDurationFormatted}
            </span>
          </div>
        </div>
      </div>

      {/* Main Body: Segments Timeline Flow */}
      <div className="p-5 space-y-4">
        {/* Legs and Interchanges */}
        <div className="space-y-3">
          {route.legs.map((leg, index) => {
            const interchange = route.interchanges[index];
            const isIntercity = leg.trainType === 'INTERCITY';

            return (
              <React.Fragment key={`leg-${leg.trainNumber}-${index}`}>
                {/* Train Leg Card */}
                <div className={`border rounded-xl p-4 ${isIntercity ? 'bg-slate-950/90 border-cyan-900/60 shadow-md shadow-cyan-950/20' : 'bg-slate-950/70 border-slate-800/90'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Left: Train Info */}
                    <div className="flex items-start space-x-3">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${isIntercity ? 'bg-cyan-900/40 border-cyan-700/60 text-cyan-300' : 'bg-blue-900/50 border-blue-700/50 text-blue-300'}`}>
                        <Train className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-white text-sm">
                            {leg.trainNumber} {leg.trainName}
                          </span>
                          {isIntercity ? (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 flex items-center space-x-1">
                              <span>INTERCITY</span>
                              <span className="text-emerald-400 font-extrabold">• HIGH VACANCY</span>
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {leg.trainType}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center space-x-2 pt-0.5">
                          <span>
                            Class: <strong className="text-slate-200">{leg.travelClass}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Punctuality: <strong className="text-emerald-400">{leg.onTimeRating}%</strong>
                          </span>
                          {leg.pantryAvailable && (
                            <>
                              <span>•</span>
                              <span className="text-amber-400">Pantry Car</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Dep / Arr Timings */}
                    <div className="flex items-center space-x-4 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
                      <div>
                        <div className="text-xs font-extrabold text-white">{leg.origin.departureTime}</div>
                        <div className="text-[11px] text-slate-400">{leg.origin.stationCode}</div>
                      </div>

                      <div className="flex flex-col items-center px-1">
                        <span className="text-[10px] text-slate-400">{leg.durationFormatted}</span>
                        <div className="w-16 h-0.5 bg-slate-700 relative flex items-center justify-center my-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                        </div>
                        <span className="text-[9px] text-slate-400">{leg.distanceKm} km</span>
                      </div>

                      <div>
                        <div className="text-xs font-extrabold text-white">{leg.destination.arrivalTime}</div>
                        <div className="text-[11px] text-slate-400">{leg.destination.stationCode}</div>
                      </div>
                    </div>

                    {/* Right: Availability Badge */}
                    <div className="text-right shrink-0 flex flex-col items-end">
                      <div className="text-xs text-slate-400">Leg Availability</div>
                      {leg.seatStatus.status === 'CNF' ? (
                        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>CNF {leg.seatStatus.count} Berths</span>
                        </div>
                      ) : leg.seatStatus.status === 'RAC' ? (
                        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold mt-0.5">
                          <span>RAC {leg.seatStatus.count}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold mt-0.5">
                          <span>WL {leg.seatStatus.count} (Waitlisted)</span>
                        </div>
                      )}

                      {onOpenVacantChart && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenVacantChart(leg.trainNumber, leg.origin.stationCode, leg.destination.stationCode);
                          }}
                          className="mt-1.5 flex items-center space-x-1 text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 px-2 py-0.5 rounded transition-all shadow-sm"
                          title={`Inspect vacant seat/berth layout for Train ${leg.trainNumber} between ${leg.origin.stationCode} and ${leg.destination.stationCode}`}
                        >
                          <span>📊 Vacant Chart</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interchange Junction Strip (if there is a connection) */}
                {interchange && (
                  <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/30 border border-amber-800/40 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-amber-200">
                            Interchange at {interchange.station.name} ({interchange.station.code})
                          </span>
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-extrabold text-[11px]">
                            {interchange.waitingFormatted} Layover
                          </span>
                          <span className="text-emerald-400 font-semibold text-[11px]">
                            ✓ {interchange.safety} Buffer
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] pt-1">
                          {interchange.safetyAdvice}
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          <strong>Transfer Advice:</strong> {interchange.platformTransferAdvice}
                        </p>
                      </div>
                    </div>

                    {/* Junction Amenities Highlights */}
                    <div className="flex items-center space-x-2 shrink-0 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                      {interchange.amenities.retiringRooms && (
                        <span className="flex items-center space-x-1 text-slate-300 text-[11px]" title="Retiring Rooms Available">
                          <Building className="w-3.5 h-3.5 text-blue-400" />
                          <span>Retiring Rms</span>
                        </span>
                      )}
                      {interchange.amenities.foodPlaza.length > 0 && (
                        <span className="flex items-center space-x-1 text-slate-300 text-[11px]" title="IRCTC Food Plaza Available">
                          <Coffee className="w-3.5 h-3.5 text-amber-400" />
                          <span>Food Plaza</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Highlights Row */}
        {route.highlights.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {route.highlights.map((h, i) => (
              <span
                key={i}
                className="bg-slate-800/80 text-slate-300 border border-slate-700/60 px-2.5 py-0.5 rounded-md"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Visual Timeline Trigger */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenTimeline(route);
              }}
              className="flex items-center space-x-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Journey Timeline</span>
            </button>

            {/* AI Copilot Advice */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAiAdvice(route);
              }}
              className="flex items-center space-x-1.5 text-xs font-semibold bg-gradient-to-r from-blue-900/60 to-indigo-900/60 hover:from-blue-800/80 hover:to-indigo-800/80 text-cyan-300 px-3 py-1.5 rounded-lg border border-blue-700/50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Route Copilot</span>
            </button>

            {/* In-Browser Vacant Berth Chart */}
            {onOpenVacantChart && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenVacantChart(
                    firstLeg.trainNumber,
                    firstLeg.origin.stationCode,
                    firstLeg.destination.stationCode
                  );
                }}
                className="flex items-center space-x-1.5 text-xs font-bold bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-600/60 transition-all shadow-sm"
                title="View interactive in-browser seat chart showing vacant berths on this route"
              >
                <span>📊 Vacant Chart</span>
              </button>
            )}
          </div>

          {/* Book on IRCTC button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenBooking(route);
            }}
            className="flex items-center space-x-1.5 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg shadow-md shadow-emerald-600/20 transition-all"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Tickets (IRCTC Guide)</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-75" />
          </button>
        </div>
      </div>
    </div>
  );
};
