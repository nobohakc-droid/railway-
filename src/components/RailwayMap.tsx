import React, { useState } from 'react';
import { MapPin, Train, Info, Layers, Eye, Zap, ShieldCheck } from 'lucide-react';
import { RailwayStation, STATIONS } from '../data/railwayData.ts';
import { JourneyRoute } from '../services/routeEngine.ts';

interface RailwayMapProps {
  selectedRoute: JourneyRoute | null;
  onSelectStation: (station: RailwayStation) => void;
  fromStationCode: string;
  toStationCode: string;
}

// Coordinate projection helper (India bounds: Lat 8 to 35, Lng 68 to 92)
// For central India focus (Lat 21 to 27, Lng 75 to 84)
function project(lat: number, lng: number, width: number, height: number) {
  // Normalize to regional coordinate box
  const minLat = 20.5;
  const maxLat = 27.5;
  const minLng = 74.5;
  const maxLng = 83.5;

  const x = ((lng - minLng) / (maxLng - minLng)) * (width - 100) + 50;
  // Invert y since SVG y increases downwards
  const y = height - (((lat - minLat) / (maxLat - minLat)) * (height - 80) + 40);

  return { x: Math.max(30, Math.min(width - 30, x)), y: Math.max(30, Math.min(height - 30, y)) };
}

export const RailwayMap: React.FC<RailwayMapProps> = ({
  selectedRoute,
  onSelectStation,
  fromStationCode,
  toStationCode,
}) => {
  const width = 800;
  const height = 400;

  const [hoveredStation, setHoveredStation] = useState<RailwayStation | null>(null);

  // Relevant central corridor stations
  const corridorCodes = ['APR', 'KTE', 'JBP', 'ET', 'BPL', 'RKMP', 'UJN', 'INDB', 'BSP', 'DMO', 'SGO', 'BINA', 'R'];
  const stationsToDisplay = corridorCodes.map((code) => STATIONS[code]).filter(Boolean);

  // Identify path stations for the selected route
  const pathStationCodes: string[] = [];
  if (selectedRoute) {
    for (const leg of selectedRoute.legs) {
      if (!pathStationCodes.includes(leg.origin.stationCode)) {
        pathStationCodes.push(leg.origin.stationCode);
      }
      if (!pathStationCodes.includes(leg.destination.stationCode)) {
        pathStationCodes.push(leg.destination.stationCode);
      }
    }
  } else {
    pathStationCodes.push(fromStationCode, toStationCode);
  }

  // Network edges (Central India Railway main lines)
  const networkLines = [
    ['APR', 'KTE'],
    ['APR', 'BSP'],
    ['KTE', 'JBP'],
    ['KTE', 'DMO'],
    ['DMO', 'SGO'],
    ['SGO', 'BINA'],
    ['BINA', 'BPL'],
    ['JBP', 'ET'],
    ['ET', 'BPL'],
    ['BPL', 'RKMP'],
    ['BPL', 'UJN'],
    ['UJN', 'INDB'],
    ['BSP', 'R'],
  ];

  // Active route path coordinates
  const activePathPoints: { x: number; y: number }[] = [];
  for (const code of pathStationCodes) {
    const st = STATIONS[code];
    if (st) {
      activePathPoints.push(project(st.lat, st.lng, width, height));
    }
  }

  const activePathString =
    activePathPoints.length > 1
      ? `M ${activePathPoints.map((p) => `${p.x},${p.y}`).join(' L ')}`
      : '';

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Header bar */}
      <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Interactive Railway Route Network</span>
              <span className="text-[10px] font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded-full">
                SECR / WCR / WR Corridors
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Visualizing junction nodes, connection paths, and transfer safety buffers
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300">Source</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="text-slate-300">Interchange</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span className="text-slate-300">Destination</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-[#080d1a] py-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[650px] select-none"
        >
          {/* Subtle Grid Lines */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
          </pattern>
          <rect width={width} height={height} fill="url(#grid)" />

          {/* Background Network Tracks */}
          {networkLines.map(([c1, c2], i) => {
            const s1 = STATIONS[c1];
            const s2 = STATIONS[c2];
            if (!s1 || !s2) return null;
            const p1 = project(s1.lat, s1.lng, width, height);
            const p2 = project(s2.lat, s2.lng, width, height);

            return (
              <g key={`net-${i}`}>
                {/* Track Base */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#1e293b"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Track Ties */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="2 6"
                />
              </g>
            );
          })}

          {/* Active Highlighted Route Path */}
          {activePathString && (
            <g>
              {/* Outer Glow */}
              <path
                d={activePathString}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="8"
                strokeOpacity="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Main Active Line */}
              <path
                d={activePathString}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Animated Dashed Pulse Line */}
              <path
                d={activePathString}
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-train-line"
              />
            </g>
          )}

          {/* Station Markers */}
          {stationsToDisplay.map((station) => {
            const p = project(station.lat, station.lng, width, height);
            const isSource = station.code === fromStationCode;
            const isDest = station.code === toStationCode;
            const isPath = pathStationCodes.includes(station.code);
            const isInterchange =
              isPath && !isSource && !isDest && selectedRoute?.interchanges.some((ic) => ic.station.code === station.code);

            let markerFill = '#475569';
            let markerRadius = 5;
            let strokeColor = '#0f172a';

            if (isSource) {
              markerFill = '#10b981';
              markerRadius = 9;
              strokeColor = '#ffffff';
            } else if (isDest) {
              markerFill = '#06b6d4';
              markerRadius = 9;
              strokeColor = '#ffffff';
            } else if (isInterchange) {
              markerFill = '#f59e0b';
              markerRadius = 8;
              strokeColor = '#ffffff';
            } else if (isPath) {
              markerFill = '#60a5fa';
              markerRadius = 6;
            }

            return (
              <g
                key={station.code}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => onSelectStation(station)}
                onMouseEnter={() => setHoveredStation(station)}
                onMouseLeave={() => setHoveredStation(null)}
              >
                {/* Pulse ring for key stations */}
                {(isSource || isDest || isInterchange) && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={markerRadius + 6}
                    fill={isSource ? '#10b981' : isDest ? '#06b6d4' : '#f59e0b'}
                    fillOpacity="0.25"
                    className="animate-pulse"
                  />
                )}

                {/* Main Circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={markerRadius}
                  fill={markerFill}
                  stroke={strokeColor}
                  strokeWidth="2"
                />

                {/* Station Label */}
                <text
                  x={p.x}
                  y={p.y - markerRadius - 6}
                  textAnchor="middle"
                  className={`text-[11px] font-bold select-none drop-shadow-md ${
                    isSource
                      ? 'fill-emerald-300'
                      : isDest
                      ? 'fill-cyan-300'
                      : isInterchange
                      ? 'fill-amber-300'
                      : 'fill-slate-300'
                  }`}
                >
                  {station.code}
                </text>

                {/* Sub-label for major stations */}
                {(isSource || isDest || isInterchange || station.isJunction) && (
                  <text
                    x={p.x}
                    y={p.y + markerRadius + 12}
                    textAnchor="middle"
                    className="text-[9px] font-medium fill-slate-400 select-none"
                  >
                    {station.city}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Station Floating Card */}
        {hoveredStation && (
          <div className="absolute bottom-3 left-4 bg-slate-900/95 border border-slate-700 px-3.5 py-2 rounded-xl shadow-2xl backdrop-blur-md pointer-events-none text-xs space-y-1">
            <div className="font-bold text-white flex items-center space-x-1.5">
              <span>{hoveredStation.name}</span>
              <span className="text-cyan-400">({hoveredStation.code})</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Zone: <strong className="text-slate-200">{hoveredStation.zone}</strong> | Platforms:{' '}
              <strong className="text-slate-200">{hoveredStation.platforms}</strong> | Punctuality:{' '}
              <strong className="text-emerald-400">{hoveredStation.avgPunctualityScore}%</strong>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center space-x-1">
              <Info className="w-3 h-3 text-blue-400" />
              <span>Click node for full junction amenities & retiring room status</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
