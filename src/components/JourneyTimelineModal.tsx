import React from 'react';
import { X, Clock, Train, ArrowRight, ShieldCheck, MapPin, Coffee, CheckCircle2 } from 'lucide-react';
import { JourneyRoute } from '../services/routeEngine.ts';

interface JourneyTimelineModalProps {
  route: JourneyRoute | null;
  onClose: () => void;
}

export const JourneyTimelineModal: React.FC<JourneyTimelineModalProps> = ({ route, onClose }) => {
  if (!route) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Visual Journey Timeline</h3>
              <p className="text-xs text-slate-400">
                Total Duration: <strong className="text-cyan-300">{route.totalDurationFormatted}</strong> • Total
                Distance: <strong className="text-slate-200">{route.totalDistanceKm} km</strong>
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

        {/* Timeline Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="relative border-l-2 border-slate-700 ml-4 pl-6 space-y-8">
            {route.legs.map((leg, index) => {
              const interchange = route.interchanges[index];

              return (
                <React.Fragment key={index}>
                  {/* Origin Event */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-md"></div>
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                          Board Train {index + 1}
                        </span>
                        <span className="text-xs font-extrabold text-white bg-slate-800 px-2.5 py-0.5 rounded">
                          {leg.origin.departureTime}
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-white">
                        {leg.origin.stationName} ({leg.origin.stationCode})
                      </div>
                      <div className="text-xs text-slate-400">
                        Board <strong>{leg.trainNumber} {leg.trainName}</strong> • Class:{' '}
                        <strong className="text-slate-200">{leg.travelClass}</strong> • Status:{' '}
                        <strong className="text-emerald-400">{leg.seatStatus.rawLabel}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Travel in progress */}
                  <div className="relative py-1">
                    <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500/60 border-2 border-slate-900 flex items-center justify-center text-[8px] text-white">
                      •
                    </div>
                    <div className="bg-blue-950/30 border border-blue-900/40 rounded-lg px-4 py-2 text-xs text-slate-300 flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <Train className="w-3.5 h-3.5 text-blue-400" />
                        <span>Travel Duration: <strong>{leg.durationFormatted}</strong></span>
                      </span>
                      <span className="text-slate-400">{leg.distanceKm} km</span>
                    </div>
                  </div>

                  {/* Arrival at Destination or Interchange */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-cyan-500 border-2 border-slate-900 shadow-md"></div>
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                          {interchange ? 'Arrive at Interchange' : 'Arrive at Destination'}
                        </span>
                        <span className="text-xs font-extrabold text-white bg-slate-800 px-2.5 py-0.5 rounded">
                          {leg.destination.arrivalTime}
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-white">
                        {leg.destination.stationName} ({leg.destination.stationCode})
                      </div>
                      <div className="text-xs text-slate-400">
                        {interchange
                          ? `Prepare for transfer to your connecting train`
                          : `Journey complete! You have arrived at your destination.`}
                      </div>
                    </div>
                  </div>

                  {/* Interchange Buffer Box */}
                  {interchange && (
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-900 shadow-md"></div>
                      <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            <span>Connection Buffer: {interchange.waitingFormatted}</span>
                          </span>
                          <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                            {interchange.safety} MARGIN
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {interchange.safetyAdvice}
                        </p>
                        <div className="text-xs text-slate-400 border-t border-amber-900/50 pt-2 space-y-1">
                          <div>
                            <strong>Platform Advice:</strong> {interchange.platformTransferAdvice}
                          </div>
                          <div>
                            <strong>Station Food Plaza:</strong>{' '}
                            {interchange.amenities.foodPlaza.join(', ') || 'IRCTC Refreshment stalls'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Total Fare: <strong className="text-white">₹{route.totalFare}</strong> • Guaranteed Confirmed Berths
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close Timeline
          </button>
        </div>
      </div>
    </div>
  );
};
