import React from 'react';
import { X, ExternalLink, Ticket, ShieldCheck, CheckCircle2, AlertCircle, Copy, Info } from 'lucide-react';
import { JourneyRoute } from '../services/routeEngine.ts';

interface IrctcBookingModalProps {
  route: JourneyRoute | null;
  onClose: () => void;
}

export const IrctcBookingModal: React.FC<IrctcBookingModalProps> = ({ route, onClose }) => {
  if (!route) return null;

  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const copyTrainDetails = (trainText: string, index: number) => {
    navigator.clipboard.writeText(trainText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">IRCTC Ticket Booking Guide</h3>
              <p className="text-xs text-slate-400">
                Direct booking links & official Indian Railways Connecting PNR protection
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
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Official Indian Railway Protection Notice */}
          <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-blue-950/40 border border-blue-800/50 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-blue-300 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Official IRCTC Connecting Journey Feature</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Under Railway Board guidelines, passengers can link two PNRs using the <strong>"Connecting Journey Booking"</strong> option on IRCTC. If your first train is delayed and you miss the connecting train, <strong>full refund of the second ticket is provided with zero cancellation charges</strong>!
            </p>
          </div>

          {/* Individual Leg Booking Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Book Each Leg on IRCTC / Partner Portals:
            </h4>

            {route.legs.map((leg, i) => {
              const bookingText = `Train ${leg.trainNumber} (${leg.trainName}) from ${leg.origin.stationCode} to ${leg.destination.stationCode}, Class: ${leg.travelClass}`;

              return (
                <div
                  key={i}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded">
                        Leg {i + 1}
                      </span>
                      <span className="text-sm font-extrabold text-white">
                        {leg.trainNumber} {leg.trainName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      <strong>{leg.origin.stationCode}</strong> ({leg.origin.departureTime}) ➔{' '}
                      <strong>{leg.destination.stationCode}</strong> ({leg.destination.arrivalTime})
                    </div>
                    <div className="text-xs">
                      Class: <strong className="text-slate-200">{leg.travelClass}</strong> • Availability:{' '}
                      <strong className="text-emerald-400">{leg.seatStatus.rawLabel}</strong> • Est. Fare:{' '}
                      <strong className="text-white">₹{leg.fareEstimate}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => copyTrainDetails(bookingText, i)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center space-x-1 border border-slate-700"
                      title="Copy train details"
                    >
                      {copiedIndex === i ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://www.irctc.co.in/nget/booking/train-list?fromStation=${leg.origin.stationCode}&toStation=${leg.destination.stationCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-600/20"
                    >
                      <span>Book Leg {i + 1}</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Steps to Link PNRs on IRCTC */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2 text-xs">
            <h5 className="font-bold text-white flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>How to Link Both Tickets on IRCTC:</span>
            </h5>
            <ol className="list-decimal list-inside text-slate-300 space-y-1 pl-1 leading-relaxed">
              <li>Book your first train ticket on IRCTC and copy the PNR number.</li>
              <li>When booking the second train, check the checkbox: <strong>"Connecting Journey Booking"</strong>.</li>
              <li>Paste the first PNR number when prompted.</li>
              <li>Your two tickets are now officially linked by Indian Railways!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <a
            href="https://www.irctc.co.in/nget/train-search"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:underline flex items-center space-x-1 font-semibold"
          >
            <span>Open IRCTC Official Website</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
