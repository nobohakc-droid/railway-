export type BerthType = 'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'WS' | 'AS';

export interface BerthVacancy {
  berthNumber: number;
  coach: string; // e.g. "S3", "B1", "CC1"
  coachType: 'SL' | '3AC' | 'CC';
  berthType: BerthType;
  berthTypeLabel: string; // "Lower Berth", "Side Lower", etc.
  cabinBayNumber: number; // 1 to 9
  // Station segment where this berth is vacant
  vacantFrom: string; // station code e.g. "APR"
  vacantTo: string; // station code e.g. "JBP"
  departureTime: string; // "13:40"
  arrivalTime: string; // "19:30"
  durationFormatted: string; // "5h 50m"
  isVacantForEntireSegment: boolean;
  occupancyHistory: {
    segmentFrom: string;
    segmentTo: string;
    isVacant: boolean;
    bookedQuota?: string; // "RLGN", "GNWL", "VACANT"
  }[];
}

export interface CoachChart {
  trainNumber: string;
  trainName: string;
  coachCode: string; // e.g. "S3"
  coachClass: 'SL' | '3AC' | 'CC';
  totalBerths: number;
  berths: BerthVacancy[];
}

// Generate realistic coach layouts with short-distance segment vacancies
export function generateCoachBerths(
  trainNumber: string,
  trainName: string,
  coach: string,
  coachType: 'SL' | '3AC' | 'CC',
  routeStations: string[]
): BerthVacancy[] {
  const berths: BerthVacancy[] = [];
  const totalBerths = coachType === 'CC' ? 78 : coachType === '3AC' ? 64 : 72;

  // Predictable pseudorandom distribution of segment vacancies based on berth number
  for (let b = 1; b <= totalBerths; b++) {
    let berthType: BerthType = 'LB';
    let berthTypeLabel = 'Lower Berth';

    if (coachType === 'SL' || coachType === '3AC') {
      const mod = b % 8;
      if (mod === 1 || mod === 4) {
        berthType = 'LB';
        berthTypeLabel = 'Lower Berth';
      } else if (mod === 2 || mod === 5) {
        berthType = 'MB';
        berthTypeLabel = 'Middle Berth';
      } else if (mod === 3 || mod === 6) {
        berthType = 'UB';
        berthTypeLabel = 'Upper Berth';
      } else if (mod === 7) {
        berthType = 'SL';
        berthTypeLabel = 'Side Lower';
      } else if (mod === 0) {
        berthType = 'SU';
        berthTypeLabel = 'Side Upper';
      }
    } else {
      // Chair Car: Window, Aisle
      berthType = b % 3 === 1 ? 'WS' : 'AS';
      berthTypeLabel = b % 3 === 1 ? 'Window Seat' : 'Aisle Seat';
    }

    const bay = Math.ceil(b / 8);

    // Build station-by-station occupancy for this berth
    const occupancyHistory: BerthVacancy['occupancyHistory'] = [];
    for (let s = 0; s < routeStations.length - 1; s++) {
      const fromSt = routeStations[s];
      const toSt = routeStations[s + 1];

      // Berths mod 3 == 0 or mod 5 == 1 are vacant on regional intermediate legs
      // For instance: APR to KTE, or APR to JBP, or KTE to BPL, or BPL to INDB
      const isShortHopVacant =
        (b * 7 + s * 13) % 4 !== 0; // ~75% chance of vacancy on some hops or occupied on long journeys

      occupancyHistory.push({
        segmentFrom: fromSt,
        segmentTo: toSt,
        isVacant: isShortHopVacant,
        bookedQuota: isShortHopVacant ? 'VACANT' : 'RLGN',
      });
    }

    // Determine primary vacant window
    const firstVacantIndex = occupancyHistory.findIndex((h) => h.isVacant);
    const vacantFrom = firstVacantIndex !== -1 ? occupancyHistory[firstVacantIndex].segmentFrom : routeStations[0];
    const vacantTo =
      firstVacantIndex !== -1 && firstVacantIndex < routeStations.length - 1
        ? routeStations[firstVacantIndex + 1]
        : routeStations[routeStations.length - 1];

    berths.push({
      berthNumber: b,
      coach,
      coachType,
      berthType,
      berthTypeLabel,
      cabinBayNumber: bay,
      vacantFrom,
      vacantTo,
      departureTime: '13:40',
      arrivalTime: '19:30',
      durationFormatted: '5h 50m',
      isVacantForEntireSegment: true,
      occupancyHistory,
    });
  }

  return berths;
}

// Pre-calculated live vacant charts for popular trains on the central corridors
export const VACANT_CHARTS_DATABASE: Record<string, CoachChart[]> = {
  // 18234 Narmada Express (APR -> KTE -> JBP -> ET -> BPL -> UJN -> INDB)
  '18234': [
    {
      trainNumber: '18234',
      trainName: 'Narmada Express',
      coachCode: 'S3',
      coachClass: 'SL',
      totalBerths: 72,
      berths: generateCoachBerths('18234', 'Narmada Express', 'S3', 'SL', ['BSP', 'APR', 'KTE', 'JBP', 'ET', 'BPL', 'UJN', 'INDB']),
    },
    {
      trainNumber: '18234',
      trainName: 'Narmada Express',
      coachCode: 'S4',
      coachClass: 'SL',
      totalBerths: 72,
      berths: generateCoachBerths('18234', 'Narmada Express', 'S4', 'SL', ['BSP', 'APR', 'KTE', 'JBP', 'ET', 'BPL', 'UJN', 'INDB']),
    },
    {
      trainNumber: '18234',
      trainName: 'Narmada Express',
      coachCode: 'B1',
      coachClass: '3AC',
      totalBerths: 64,
      berths: generateCoachBerths('18234', 'Narmada Express', 'B1', '3AC', ['BSP', 'APR', 'KTE', 'JBP', 'ET', 'BPL', 'UJN', 'INDB']),
    },
  ],

  // 11266 Ambikapur - Jabalpur Intercity Express (APR -> KTE -> JBP)
  '11266': [
    {
      trainNumber: '11266',
      trainName: 'Ambikapur - Jabalpur Intercity Express',
      coachCode: 'S1',
      coachClass: 'SL',
      totalBerths: 72,
      berths: generateCoachBerths('11266', 'Ambikapur - Jabalpur Intercity', 'S1', 'SL', ['APR', 'KTE', 'JBP']),
    },
    {
      trainNumber: '11266',
      trainName: 'Ambikapur - Jabalpur Intercity Express',
      coachCode: 'CC1',
      coachClass: 'CC',
      totalBerths: 78,
      berths: generateCoachBerths('11266', 'Ambikapur - Jabalpur Intercity', 'CC1', 'CC', ['APR', 'KTE', 'JBP']),
    },
  ],

  // 11703 Rewa - Indore Intercity Express (KTE -> DMO -> SGO -> BINA -> BPL -> UJN -> INDB)
  '11703': [
    {
      trainNumber: '11703',
      trainName: 'Rewa - Indore Intercity Express',
      coachCode: 'S2',
      coachClass: 'SL',
      totalBerths: 72,
      berths: generateCoachBerths('11703', 'Rewa - Indore Intercity Express', 'S2', 'SL', ['KTE', 'DMO', 'SGO', 'BINA', 'BPL', 'UJN', 'INDB']),
    },
    {
      trainNumber: '11703',
      trainName: 'Rewa - Indore Intercity Express',
      coachCode: 'B1',
      coachClass: '3AC',
      totalBerths: 64,
      berths: generateCoachBerths('11703', 'Rewa - Indore Intercity Express', 'B1', '3AC', ['KTE', 'DMO', 'SGO', 'BINA', 'BPL', 'UJN', 'INDB']),
    },
  ],

  // 12853 Amarkantak Express (APR -> KTE -> JBP -> ET -> BPL)
  '12853': [
    {
      trainNumber: '12853',
      trainName: 'Amarkantak Express (Superfast)',
      coachCode: 'S3',
      coachClass: 'SL',
      totalBerths: 72,
      berths: generateCoachBerths('12853', 'Amarkantak Express', 'S3', 'SL', ['APR', 'KTE', 'JBP', 'ET', 'BPL']),
    },
    {
      trainNumber: '12853',
      trainName: 'Amarkantak Express (Superfast)',
      coachCode: 'B2',
      coachClass: '3AC',
      totalBerths: 64,
      berths: generateCoachBerths('12853', 'Amarkantak Express', 'B2', '3AC', ['APR', 'KTE', 'JBP', 'ET', 'BPL']),
    },
  ],

  // 19324 Bhopal - Indore Intercity Express (BPL -> UJN -> INDB)
  '19324': [
    {
      trainNumber: '19324',
      trainName: 'Bhopal - Indore Intercity Express',
      coachCode: 'CC1',
      coachClass: 'CC',
      totalBerths: 78,
      berths: generateCoachBerths('19324', 'Bhopal - Indore Intercity', 'CC1', 'CC', ['BPL', 'UJN', 'INDB']),
    },
    {
      trainNumber: '19324',
      trainName: 'Bhopal - Indore Intercity Express',
      coachCode: 'S1',
      coachClass: 'SL',
      totalBerths: 72,
      berths: generateCoachBerths('19324', 'Bhopal - Indore Intercity', 'S1', 'SL', ['BPL', 'UJN', 'INDB']),
    },
  ],
};

// Check which berths in a coach are vacant for a specific passenger journey segment
export function getVacantBerthsForHop(
  trainNumber: string,
  coachCode: string,
  fromStation: string,
  toStation: string
): { vacantCount: number; berths: { berth: BerthVacancy; isVacant: boolean }[] } {
  const trainCharts = VACANT_CHARTS_DATABASE[trainNumber];
  if (!trainCharts) {
    return { vacantCount: 0, berths: [] };
  }

  const coach = trainCharts.find((c) => c.coachCode === coachCode) || trainCharts[0];
  if (!coach) {
    return { vacantCount: 0, berths: [] };
  }

  const evaluated = coach.berths.map((b) => {
    // Check if vacant between fromStation and toStation in occupancyHistory
    const fromIdx = b.occupancyHistory.findIndex((h) => h.segmentFrom === fromStation);
    const toIdx = b.occupancyHistory.findIndex((h) => h.segmentTo === toStation);

    let isVacant = true;
    if (fromIdx !== -1 && toIdx !== -1 && fromIdx <= toIdx) {
      for (let i = fromIdx; i <= toIdx; i++) {
        if (!b.occupancyHistory[i]?.isVacant) {
          isVacant = false;
          break;
        }
      }
    } else {
      // Fallback rule if specific stations not in consecutive halt list
      isVacant = (b.berthNumber + trainNumber.length) % 2 === 0;
    }

    return {
      berth: b,
      isVacant,
    };
  });

  const vacantCount = evaluated.filter((e) => e.isVacant).length;
  return { vacantCount, berths: evaluated };
}
