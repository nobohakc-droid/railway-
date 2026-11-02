import React from 'react';
import { X, Building2, Coffee, ShieldCheck, MapPin, Bed, Utensils, Wifi, Car } from 'lucide-react';
import { RailwayStation } from '../data/railwayData.ts';

interface StationDetailsModalProps {
  station: RailwayStation | null;
  onClose: () => void;
}

export const StationDetailsModal: React.FC<StationDetailsModalProps> = ({ station, onClose }) => {
  if (!station) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                {station.name} ({station.code})
              </h3>
              <p className="text-xs text-slate-400">
                {station.hindiName ? `${station.hindiName} • ` : ''}
                {station.city}, {station.state} ({station.zone} Zone)
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
        <div className="p-6 space-y-4 text-xs">
          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
              <span className="text-slate-400 block text-[10px] uppercase">Platforms</span>
              <span className="text-base font-extrabold text-white">{station.platforms}</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
              <span className="text-slate-400 block text-[10px] uppercase">Punctuality</span>
              <span className="text-base font-extrabold text-emerald-400">{station.avgPunctualityScore}%</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
              <span className="text-slate-400 block text-[10px] uppercase">Safety Score</span>
              <span className="text-base font-extrabold text-amber-300">
                {station.interchangeSafetyRating} / 5.0
              </span>
            </div>
          </div>

          {/* Retiring Rooms & Dormitory */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-white flex items-center space-x-1.5 text-xs">
              <Bed className="w-4 h-4 text-cyan-400" />
              <span>Resting Facilities & Retiring Rooms:</span>
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {station.amenities.retiringRooms && (
                <span className="px-2.5 py-1 rounded bg-blue-950/80 border border-blue-800/60 text-blue-300 font-semibold">
                  ✓ AC Retiring Rooms
                </span>
              )}
              {station.amenities.dormitory && (
                <span className="px-2.5 py-1 rounded bg-blue-950/80 border border-blue-800/60 text-blue-300 font-semibold">
                  ✓ Dormitory Available
                </span>
              )}
              {station.amenities.cloakRoom && (
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200">
                  ✓ Luggage Cloak Room
                </span>
              )}
              {station.amenities.wifi && (
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200">
                  ✓ RailWire Free Wi-Fi
                </span>
              )}
              {station.amenities.batteryCar && (
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200">
                  ✓ Battery Operated Cart
                </span>
              )}
            </div>
          </div>

          {/* Food Plazas */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-white flex items-center space-x-1.5 text-xs">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Dining & Food Plazas at Station:</span>
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {station.amenities.foodPlaza.map((f, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Waiting Halls */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-white flex items-center space-x-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Waiting Lounges:</span>
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {station.amenities.waitingHalls.map((w, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
