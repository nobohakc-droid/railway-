export interface RailwayStation {
  code: string;
  name: string;
  hindiName?: string;
  city: string;
  state: string;
  zone: string;
  lat: number;
  lng: number;
  isJunction: boolean;
  platforms: number;
  amenities: {
    retiringRooms: boolean;
    dormitory: boolean;
    cloakRoom: boolean;
    foodPlaza: string[];
    waitingHalls: string[];
    wifi: boolean;
    batteryCar: boolean;
  };
  interchangeSafetyRating: number; // 1-5
  avgPunctualityScore: number; // e.g. 88%
}

export type TravelClass = 'SL' | '3AC' | '2AC' | '1AC' | 'CC' | '2S';

export interface StationHalt {
  stationCode: string;
  stationName: string;
  arrivalTime: string; // "HH:mm" or "Source"
  departureTime: string; // "HH:mm" or "Dest"
  dayNumber: number; // 1, 2, 3
  distanceKm: number;
  platform?: string;
}

export interface SeatStatus {
  status: 'CNF' | 'RAC' | 'WL';
  count: number;
  probability?: number; // e.g. 0.95 for high WL confirmation
  coach?: string;
  rawLabel: string;
}

export interface TrainSchedule {
  trainNumber: string;
  trainName: string;
  trainType: 'SUPERFAST' | 'EXPRESS' | 'MAIL' | 'VANDE_BHARAT' | 'INTERCITY' | 'PASSENGER';
  runningDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  classes: TravelClass[];
  halts: StationHalt[];
  pantryAvailable: boolean;
  onTimeRating: number; // percentage, e.g. 89%
  typicalDelayMinutes: number; // e.g. 15 mins
  seatAvailabilityByClass: Record<TravelClass, Record<string, SeatStatus>>; // dateString -> SeatStatus
}

export const STATIONS: Record<string, RailwayStation> = {
  APR: {
    code: 'APR',
    name: 'Anuppur Junction',
    hindiName: 'अनूपपुर जंक्शन',
    city: 'Anuppur',
    state: 'Madhya Pradesh',
    zone: 'SECR',
    lat: 23.1042,
    lng: 81.6917,
    isJunction: true,
    platforms: 4,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['IRCTC Canteen', 'Local Refreshments Stall'],
      waitingHalls: ['Upper Class AC Waiting Room', 'General Waiting Hall'],
      wifi: true,
      batteryCar: false,
    },
    interchangeSafetyRating: 4.2,
    avgPunctualityScore: 84,
  },
  INDB: {
    code: 'INDB',
    name: 'Indore Junction',
    hindiName: 'इन्दौर जंक्शन',
    city: 'Indore',
    state: 'Madhya Pradesh',
    zone: 'WR',
    lat: 22.7196,
    lng: 75.8577,
    isJunction: true,
    platforms: 6,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['Comesum Food Court', 'Jan Aahar', 'Amul Outlet', 'Nescafe'],
      waitingHalls: ['Executive Lounge', 'AC Waiting Hall (PF 1)', 'Sleeper Hall'],
      wifi: true,
      batteryCar: true,
    },
    interchangeSafetyRating: 4.8,
    avgPunctualityScore: 92,
  },
  BPL: {
    code: 'BPL',
    name: 'Bhopal Junction',
    hindiName: 'भोपाल जंक्शन',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    zone: 'WCR',
    lat: 23.2599,
    lng: 77.4126,
    isJunction: true,
    platforms: 6,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['IRCTC Food Track', 'Haldirams Express', 'Jan Aahar', 'Sanchi Dairy'],
      waitingHalls: ['IRCTC Executive AC Lounge', 'Ladies Waiting Room', 'AC Upper Class Waiting Hall'],
      wifi: true,
      batteryCar: true,
    },
    interchangeSafetyRating: 4.9,
    avgPunctualityScore: 90,
  },
  RKMP: {
    code: 'RKMP',
    name: 'Rani Kamlapati (Habibganj)',
    hindiName: 'रानी कमलापति',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    zone: 'WCR',
    lat: 23.2081,
    lng: 77.4338,
    isJunction: false,
    platforms: 5,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['Modern Air-Concourse Food Court', 'Subway', 'Costa Coffee'],
      waitingHalls: ['World Class Concourse Lounge', 'AC VIP Waiting Hall'],
      wifi: true,
      batteryCar: true,
    },
    interchangeSafetyRating: 5.0,
    avgPunctualityScore: 95,
  },
  JBP: {
    code: 'JBP',
    name: 'Jabalpur Junction',
    hindiName: 'जबलपुर जंक्शन',
    city: 'Jabalpur',
    state: 'Madhya Pradesh',
    zone: 'WCR',
    lat: 23.1815,
    lng: 79.9864,
    isJunction: true,
    platforms: 6,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['IRCTC Food Plaza PF-1', 'Indian Coffee House', 'Jan Aahar'],
      waitingHalls: ['AC Waiting Hall PF-1', 'Upper Class Waiting Lounge'],
      wifi: true,
      batteryCar: true,
    },
    interchangeSafetyRating: 4.7,
    avgPunctualityScore: 89,
  },
  KTE: {
    code: 'KTE',
    name: 'Katni Junction',
    hindiName: 'कटनी जंक्शन',
    city: 'Katni',
    state: 'Madhya Pradesh',
    zone: 'WCR',
    lat: 23.8343,
    lng: 80.3995,
    isJunction: true,
    platforms: 5,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['Katni Food Court', 'Jan Aahar PF-2'],
      waitingHalls: ['AC Waiting Room', 'Common Passenger Hall'],
      wifi: true,
      batteryCar: false,
    },
    interchangeSafetyRating: 4.3,
    avgPunctualityScore: 83,
  },
  ET: {
    code: 'ET',
    name: 'Itarsi Junction',
    hindiName: 'इटारसी जंक्शन',
    city: 'Itarsi',
    state: 'Madhya Pradesh',
    zone: 'WCR',
    lat: 22.6139,
    lng: 77.7645,
    isJunction: true,
    platforms: 8,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['IRCTC Multi-Cuisine Food Track', 'Comesum', 'Sanchi Parlour'],
      waitingHalls: ['Air Conditioned Waiting Lounge PF-1', 'Sleeper Class Hall'],
      wifi: true,
      batteryCar: true,
    },
    interchangeSafetyRating: 4.8,
    avgPunctualityScore: 88,
  },
  BSP: {
    code: 'BSP',
    name: 'Bilaspur Junction',
    hindiName: 'बिलासपुर जंक्शन',
    city: 'Bilaspur',
    state: 'Chhattisgarh',
    zone: 'SECR',
    lat: 22.0797,
    lng: 82.1409,
    isJunction: true,
    platforms: 8,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['SECR Food Court', 'Jan Aahar', 'Amul'],
      waitingHalls: ['Executive Lounge', 'AC Waiting Hall'],
      wifi: true,
      batteryCar: true,
    },
    interchangeSafetyRating: 4.6,
    avgPunctualityScore: 86,
  },
  UJN: {
    code: 'UJN',
    name: 'Ujjain Junction',
    hindiName: 'उज्जैन जंक्शन',
    city: 'Ujjain',
    state: 'Madhya Pradesh',
    zone: 'WR',
    lat: 23.1765,
    lng: 75.7885,
    isJunction: true,
    platforms: 8,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['Mahakal Bhojanalaya IRCTC', 'Sanchi Dairy Bar', 'Jan Aahar'],
      waitingHalls: ['Pilgrim AC Waiting Lounge', 'Upper Class Waiting Room'],
      wifi: true,
      batteryCar: true,
    },
    interchangeSafetyRating: 4.7,
    avgPunctualityScore: 91,
  },
  R: {
    code: 'R',
    name: 'Raipur Junction',
    hindiName: 'रायपुर जंक्शन',
    city: 'Raipur',
    state: 'Chhattisgarh',
    zone: 'SECR',
    lat: 21.2514,
    lng: 81.6296,
    isJunction: true,
    platforms: 7,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['IRCTC Food Court', 'Jan Aahar'],
      waitingHalls: ['Executive Lounge', 'AC Waiting Hall'],
      wifi: true,
      batteryCar: true,
    },
    interchangeSafetyRating: 4.7,
    avgPunctualityScore: 89,
  },
  DURG: {
    code: 'DURG',
    name: 'Durg Junction',
    hindiName: 'दुर्ग जंक्शन',
    city: 'Durg',
    state: 'Chhattisgarh',
    zone: 'SECR',
    lat: 21.1904,
    lng: 81.2849,
    isJunction: true,
    platforms: 6,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['Food Track', 'Canteen'],
      waitingHalls: ['AC Upper Class Waiting Hall'],
      wifi: true,
      batteryCar: false,
    },
    interchangeSafetyRating: 4.5,
    avgPunctualityScore: 87,
  },
  BINA: {
    code: 'BINA',
    name: 'Bina Junction',
    hindiName: 'बीना जंक्शन',
    city: 'Bina',
    state: 'Madhya Pradesh',
    zone: 'WCR',
    lat: 24.175,
    lng: 78.188,
    isJunction: true,
    platforms: 5,
    amenities: {
      retiringRooms: true,
      dormitory: false,
      cloakRoom: true,
      foodPlaza: ['Station Refreshment Room'],
      waitingHalls: ['AC Waiting Hall'],
      wifi: true,
      batteryCar: false,
    },
    interchangeSafetyRating: 4.1,
    avgPunctualityScore: 82,
  },
  SGO: {
    code: 'SGO',
    name: 'Saugor (Sagar)',
    hindiName: 'सागर',
    city: 'Sagar',
    state: 'Madhya Pradesh',
    zone: 'WCR',
    lat: 23.8388,
    lng: 78.7378,
    isJunction: false,
    platforms: 3,
    amenities: {
      retiringRooms: true,
      dormitory: false,
      cloakRoom: true,
      foodPlaza: ['Local Canteen'],
      waitingHalls: ['Waiting Hall'],
      wifi: true,
      batteryCar: false,
    },
    interchangeSafetyRating: 4.0,
    avgPunctualityScore: 84,
  },
  DMO: {
    code: 'DMO',
    name: 'Damoh',
    hindiName: 'दमोह',
    city: 'Damoh',
    state: 'Madhya Pradesh',
    zone: 'WCR',
    lat: 23.832,
    lng: 79.442,
    isJunction: false,
    platforms: 3,
    amenities: {
      retiringRooms: false,
      dormitory: false,
      cloakRoom: true,
      foodPlaza: ['Tea & Snacks Stall'],
      waitingHalls: ['General Waiting Room'],
      wifi: true,
      batteryCar: false,
    },
    interchangeSafetyRating: 3.9,
    avgPunctualityScore: 81,
  },
  STA: {
    code: 'STA',
    name: 'Satna Junction',
    hindiName: 'सतना जंक्शन',
    city: 'Satna',
    state: 'Madhya Pradesh',
    zone: 'WCR',
    lat: 24.5804,
    lng: 80.829,
    isJunction: true,
    platforms: 3,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['IRCTC Canteen', 'Jan Aahar'],
      waitingHalls: ['AC Waiting Hall'],
      wifi: true,
      batteryCar: false,
    },
    interchangeSafetyRating: 4.3,
    avgPunctualityScore: 85,
  },
  GWL: {
    code: 'GWL',
    name: 'Gwalior Junction',
    hindiName: 'ग्वालियर जंक्शन',
    city: 'Gwalior',
    state: 'Madhya Pradesh',
    zone: 'NCR',
    lat: 26.2183,
    lng: 78.1828,
    isJunction: true,
    platforms: 5,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['Comesum Food Plaza', 'Jan Aahar'],
      waitingHalls: ['AC Executive Lounge', 'Upper Class Waiting Room'],
      wifi: true,
      batteryCar: true,
    },
    interchangeSafetyRating: 4.6,
    avgPunctualityScore: 87,
  },
  NDLS: {
    code: 'NDLS',
    name: 'New Delhi Railway Station',
    hindiName: 'नई दिल्ली',
    city: 'New Delhi',
    state: 'Delhi',
    zone: 'NR',
    lat: 28.6139,
    lng: 77.209,
    isJunction: true,
    platforms: 16,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['IRCTC Executive Food Court', 'Haldiram', 'KFC', 'Costa'],
      waitingHalls: ['Paharganj AC Executive Lounge', 'Ajmeri Gate VIP Lounge'],
      wifi: true,
      batteryCar: true,
    },
    interchangeSafetyRating: 4.9,
    avgPunctualityScore: 92,
  },
  CSMT: {
    code: 'CSMT',
    name: 'Chhatrapati Shivaji Maharaj Terminus (Mumbai)',
    hindiName: 'छत्रपति शिवाजी महाराज टर्मिनस',
    city: 'Mumbai',
    state: 'Maharashtra',
    zone: 'CR',
    lat: 18.9402,
    lng: 72.8356,
    isJunction: true,
    platforms: 18,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['Heritage Food Court', 'Jan Aahar', 'McDonalds'],
      waitingHalls: ['Heritage AC Lounge', 'First Class Waiting Hall'],
      wifi: true,
      batteryCar: true,
    },
    interchangeSafetyRating: 4.9,
    avgPunctualityScore: 94,
  },
  NGP: {
    code: 'NGP',
    name: 'Nagpur Junction',
    hindiName: 'नागपुर जंक्शन',
    city: 'Nagpur',
    state: 'Maharashtra',
    zone: 'CR',
    lat: 21.1524,
    lng: 79.0882,
    isJunction: true,
    platforms: 8,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['IRCTC Food Track', 'Haldirams'],
      waitingHalls: ['AC Executive Lounge', 'Upper Class Hall'],
      wifi: true,
      batteryCar: true,
    },
    interchangeSafetyRating: 4.8,
    avgPunctualityScore: 90,
  },
  BSB: {
    code: 'BSB',
    name: 'Varanasi Junction',
    hindiName: 'वाराणसी जंक्शन',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    zone: 'NR',
    lat: 25.3284,
    lng: 82.9868,
    isJunction: true,
    platforms: 9,
    amenities: {
      retiringRooms: true,
      dormitory: true,
      cloakRoom: true,
      foodPlaza: ['Jan Aahar', 'Bhojanalaya'],
      waitingHalls: ['Kashi AC Waiting Lounge'],
      wifi: true,
      batteryCar: true,
    },
    interchangeSafetyRating: 4.5,
    avgPunctualityScore: 86,
  },
};

// Base Fare structure in INR per km
export const BASE_FARES: Record<TravelClass, { base: number; perKm: number }> = {
  '2S': { base: 60, perKm: 0.28 },
  'SL': { base: 140, perKm: 0.45 },
  'CC': { base: 260, perKm: 0.95 },
  '3AC': { base: 450, perKm: 1.25 },
  '2AC': { base: 680, perKm: 1.85 },
  '1AC': { base: 1100, perKm: 3.10 },
};

export const TRAINS_DATA: TrainSchedule[] = [
  // 1. Direct benchmark train: 18234 Narmada Express
  {
    trainNumber: '18234',
    trainName: 'Narmada Express',
    trainType: 'EXPRESS',
    runningDays: [0, 1, 2, 3, 4, 5, 6], // Daily
    classes: ['SL', '3AC', '2AC', '1AC', '2S'],
    pantryAvailable: false,
    onTimeRating: 82,
    typicalDelayMinutes: 25,
    halts: [
      { stationCode: 'BSP', stationName: 'Bilaspur Jn', arrivalTime: 'Source', departureTime: '10:30', dayNumber: 1, distanceKm: 0 },
      { stationCode: 'APR', stationName: 'Anuppur Jn', arrivalTime: '13:35', departureTime: '13:40', dayNumber: 1, distanceKm: 151 },
      { stationCode: 'KTE', stationName: 'Katni Jn', arrivalTime: '16:45', departureTime: '16:50', dayNumber: 1, distanceKm: 317 },
      { stationCode: 'JBP', stationName: 'Jabalpur Jn', arrivalTime: '19:30', departureTime: '19:40', dayNumber: 1, distanceKm: 408 },
      { stationCode: 'ET', stationName: 'Itarsi Jn', arrivalTime: '23:30', departureTime: '23:45', dayNumber: 1, distanceKm: 652 },
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrivalTime: '01:30', departureTime: '01:35', dayNumber: 2, distanceKm: 744 },
      { stationCode: 'UJN', stationName: 'Ujjain Jn', arrivalTime: '04:30', departureTime: '04:45', dayNumber: 2, distanceKm: 927 },
      { stationCode: 'INDB', stationName: 'Indore Jn', arrivalTime: '06:15', departureTime: 'Dest', dayNumber: 2, distanceKm: 1006 },
    ],
    seatAvailabilityByClass: {
      SL: {
        'APR_INDB': { status: 'WL', count: 48, rawLabel: 'WL 48 / REGRET (No direct confirmed seats)' },
        'APR_ET': { status: 'CNF', count: 16, rawLabel: 'AVAILABLE 16' },
        'APR_JBP': { status: 'CNF', count: 28, rawLabel: 'AVAILABLE 28' },
        'APR_KTE': { status: 'CNF', count: 35, rawLabel: 'AVAILABLE 35' },
        'ET_INDB': { status: 'CNF', count: 22, rawLabel: 'AVAILABLE 22' },
        'BPL_INDB': { status: 'CNF', count: 40, rawLabel: 'AVAILABLE 40' },
      },
      '3AC': {
        'APR_INDB': { status: 'WL', count: 18, rawLabel: 'WL 18 / RAC 12' },
        'APR_ET': { status: 'CNF', count: 8, rawLabel: 'AVAILABLE 8' },
        'APR_JBP': { status: 'CNF', count: 12, rawLabel: 'AVAILABLE 12' },
        'ET_INDB': { status: 'CNF', count: 14, rawLabel: 'AVAILABLE 14' },
      },
      '2AC': {
        'APR_INDB': { status: 'WL', count: 6, rawLabel: 'WL 6' },
        'APR_ET': { status: 'CNF', count: 4, rawLabel: 'AVAILABLE 4' },
      },
      '1AC': {
        'APR_INDB': { status: 'WL', count: 2, rawLabel: 'WL 2' },
      },
      '2S': {
        'APR_INDB': { status: 'WL', count: 30, rawLabel: 'WL 30' },
      },
      CC: {},
    },
  },

  // 2. 12853 Amarkantak Express (APR -> BPL via JBP, ET)
  {
    trainNumber: '12853',
    trainName: 'Amarkantak Express (Superfast)',
    trainType: 'SUPERFAST',
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: ['SL', '3AC', '2AC', '1AC', '2S'],
    pantryAvailable: true,
    onTimeRating: 91,
    typicalDelayMinutes: 10,
    halts: [
      { stationCode: 'DURG', stationName: 'Durg Jn', arrivalTime: 'Source', departureTime: '18:25', dayNumber: 1, distanceKm: 0 },
      { stationCode: 'R', stationName: 'Raipur Jn', arrivalTime: '19:00', departureTime: '19:05', dayNumber: 1, distanceKm: 37 },
      { stationCode: 'BSP', stationName: 'Bilaspur Jn', arrivalTime: '21:00', departureTime: '21:10', dayNumber: 1, distanceKm: 148 },
      { stationCode: 'APR', stationName: 'Anuppur Jn', arrivalTime: '23:30', departureTime: '23:35', dayNumber: 1, distanceKm: 299 },
      { stationCode: 'KTE', stationName: 'Katni Jn', arrivalTime: '02:05', departureTime: '02:10', dayNumber: 2, distanceKm: 465 },
      { stationCode: 'JBP', stationName: 'Jabalpur Jn', arrivalTime: '04:10', departureTime: '04:20', dayNumber: 2, distanceKm: 556 },
      { stationCode: 'ET', stationName: 'Itarsi Jn', arrivalTime: '08:00', departureTime: '08:15', dayNumber: 2, distanceKm: 800 },
      { stationCode: 'RKMP', stationName: 'Rani Kamlapati', arrivalTime: '10:05', departureTime: '10:07', dayNumber: 2, distanceKm: 885 },
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrivalTime: '10:30', departureTime: 'Dest', dayNumber: 2, distanceKm: 892 },
    ],
    seatAvailabilityByClass: {
      SL: {
        'APR_BPL': { status: 'CNF', count: 32, rawLabel: 'AVAILABLE 32 (Confirmed)' },
        'APR_RKMP': { status: 'CNF', count: 36, rawLabel: 'AVAILABLE 36' },
        'APR_ET': { status: 'CNF', count: 24, rawLabel: 'AVAILABLE 24' },
        'APR_JBP': { status: 'CNF', count: 48, rawLabel: 'AVAILABLE 48' },
        'APR_KTE': { status: 'CNF', count: 50, rawLabel: 'AVAILABLE 50' },
      },
      '3AC': {
        'APR_BPL': { status: 'CNF', count: 18, rawLabel: 'AVAILABLE 18' },
        'APR_JBP': { status: 'CNF', count: 22, rawLabel: 'AVAILABLE 22' },
        'APR_ET': { status: 'CNF', count: 15, rawLabel: 'AVAILABLE 15' },
      },
      '2AC': {
        'APR_BPL': { status: 'CNF', count: 8, rawLabel: 'AVAILABLE 8' },
      },
      '1AC': {
        'APR_BPL': { status: 'CNF', count: 2, rawLabel: 'AVAILABLE 2' },
      },
      '2S': {
        'APR_BPL': { status: 'CNF', count: 70, rawLabel: 'AVAILABLE 70' },
      },
      CC: {},
    },
  },

  // 3. 11266 Ambikapur - Jabalpur Intercity Express
  {
    trainNumber: '11266',
    trainName: 'Ambikapur - Jabalpur Intercity Express',
    trainType: 'INTERCITY',
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: ['SL', '3AC', '2S', 'CC'],
    pantryAvailable: false,
    onTimeRating: 88,
    typicalDelayMinutes: 12,
    halts: [
      { stationCode: 'APR', stationName: 'Anuppur Jn', arrivalTime: '08:45', departureTime: '08:50', dayNumber: 1, distanceKm: 0 },
      { stationCode: 'KTE', stationName: 'Katni Jn', arrivalTime: '12:20', departureTime: '12:25', dayNumber: 1, distanceKm: 166 },
      { stationCode: 'JBP', stationName: 'Jabalpur Jn', arrivalTime: '14:20', departureTime: 'Dest', dayNumber: 1, distanceKm: 257 },
    ],
    seatAvailabilityByClass: {
      SL: {
        'APR_JBP': { status: 'CNF', count: 64, rawLabel: 'AVAILABLE 64 (Confirmed)' },
        'APR_KTE': { status: 'CNF', count: 82, rawLabel: 'AVAILABLE 82' },
      },
      '3AC': {
        'APR_JBP': { status: 'CNF', count: 24, rawLabel: 'AVAILABLE 24' },
      },
      '2AC': {},
      '1AC': {},
      CC: {
        'APR_JBP': { status: 'CNF', count: 32, rawLabel: 'AVAILABLE 32' },
      },
      '2S': {
        'APR_JBP': { status: 'CNF', count: 120, rawLabel: 'AVAILABLE 120' },
      },
    },
  },

  // 4. 18247 Bilaspur - Rewa Express (APR -> Katni)
  {
    trainNumber: '18247',
    trainName: 'Bilaspur - Rewa Express',
    trainType: 'EXPRESS',
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: ['SL', '3AC', '2AC', '2S'],
    pantryAvailable: false,
    onTimeRating: 84,
    typicalDelayMinutes: 15,
    halts: [
      { stationCode: 'BSP', stationName: 'Bilaspur Jn', arrivalTime: 'Source', departureTime: '19:20', dayNumber: 1, distanceKm: 0 },
      { stationCode: 'APR', stationName: 'Anuppur Jn', arrivalTime: '22:10', departureTime: '22:15', dayNumber: 1, distanceKm: 151 },
      { stationCode: 'KTE', stationName: 'Katni Jn', arrivalTime: '01:50', departureTime: '02:00', dayNumber: 2, distanceKm: 317 },
      { stationCode: 'STA', stationName: 'Satna Jn', arrivalTime: '03:40', departureTime: '03:50', dayNumber: 2, distanceKm: 415 },
    ],
    seatAvailabilityByClass: {
      SL: {
        'APR_KTE': { status: 'CNF', count: 54, rawLabel: 'AVAILABLE 54 (Confirmed)' },
      },
      '3AC': {
        'APR_KTE': { status: 'CNF', count: 18, rawLabel: 'AVAILABLE 18' },
      },
      '2AC': {},
      '1AC': {},
      '2S': {
        'APR_KTE': { status: 'CNF', count: 85, rawLabel: 'AVAILABLE 85' },
      },
      CC: {},
    },
  },

  // 5. 18236 Bilaspur - Bhopal Express (via Katni, Damoh, Saugor, Bina)
  {
    trainNumber: '18236',
    trainName: 'Bilaspur - Bhopal Express',
    trainType: 'EXPRESS',
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: ['SL', '3AC', '2S'],
    pantryAvailable: false,
    onTimeRating: 80,
    typicalDelayMinutes: 20,
    halts: [
      { stationCode: 'BSP', stationName: 'Bilaspur Jn', arrivalTime: 'Source', departureTime: '17:30', dayNumber: 1, distanceKm: 0 },
      { stationCode: 'APR', stationName: 'Anuppur Jn', arrivalTime: '20:25', departureTime: '20:30', dayNumber: 1, distanceKm: 151 },
      { stationCode: 'KTE', stationName: 'Katni Jn', arrivalTime: '00:20', departureTime: '00:30', dayNumber: 2, distanceKm: 317 },
      { stationCode: 'DMO', stationName: 'Damoh', arrivalTime: '02:20', departureTime: '02:25', dayNumber: 2, distanceKm: 427 },
      { stationCode: 'SGO', stationName: 'Saugor', arrivalTime: '03:40', departureTime: '03:45', dayNumber: 2, distanceKm: 504 },
      { stationCode: 'BINA', stationName: 'Bina Jn', arrivalTime: '05:40', departureTime: '05:50', dayNumber: 2, distanceKm: 579 },
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrivalTime: '08:20', departureTime: 'Dest', dayNumber: 2, distanceKm: 718 },
    ],
    seatAvailabilityByClass: {
      SL: {
        'APR_KTE': { status: 'CNF', count: 38, rawLabel: 'AVAILABLE 38' },
        'APR_BPL': { status: 'CNF', count: 26, rawLabel: 'AVAILABLE 26' },
      },
      '3AC': {
        'APR_BPL': { status: 'CNF', count: 12, rawLabel: 'AVAILABLE 12' },
      },
      '2AC': {},
      '1AC': {},
      '2S': {
        'APR_BPL': { status: 'CNF', count: 65, rawLabel: 'AVAILABLE 65' },
      },
      CC: {},
    },
  },

  // 6. 22192 Jabalpur - Indore Overnight Superfast Express (Key leg JBP -> INDB!)
  {
    trainNumber: '22192',
    trainName: 'Jabalpur - Indore Overnight Superfast',
    trainType: 'SUPERFAST',
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: ['SL', '3AC', '2AC', '1AC', '2S'],
    pantryAvailable: true,
    onTimeRating: 94,
    typicalDelayMinutes: 8,
    halts: [
      { stationCode: 'JBP', stationName: 'Jabalpur Jn', arrivalTime: 'Source', departureTime: '23:30', dayNumber: 1, distanceKm: 0 },
      { stationCode: 'ET', stationName: 'Itarsi Jn', arrivalTime: '03:15', departureTime: '03:30', dayNumber: 2, distanceKm: 244 },
      { stationCode: 'RKMP', stationName: 'Rani Kamlapati', arrivalTime: '05:00', departureTime: '05:05', dayNumber: 2, distanceKm: 330 },
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrivalTime: '05:25', departureTime: '05:30', dayNumber: 2, distanceKm: 336 },
      { stationCode: 'UJN', stationName: 'Ujjain Jn', arrivalTime: '08:00', departureTime: '08:15', dayNumber: 2, distanceKm: 519 },
      { stationCode: 'INDB', stationName: 'Indore Jn', arrivalTime: '09:35', departureTime: 'Dest', dayNumber: 2, distanceKm: 598 },
    ],
    seatAvailabilityByClass: {
      SL: {
        'JBP_INDB': { status: 'CNF', count: 88, rawLabel: 'AVAILABLE 88 (Confirmed)' },
        'ET_INDB': { status: 'CNF', count: 45, rawLabel: 'AVAILABLE 45' },
        'BPL_INDB': { status: 'CNF', count: 60, rawLabel: 'AVAILABLE 60' },
      },
      '3AC': {
        'JBP_INDB': { status: 'CNF', count: 32, rawLabel: 'AVAILABLE 32' },
        'BPL_INDB': { status: 'CNF', count: 20, rawLabel: 'AVAILABLE 20' },
      },
      '2AC': {
        'JBP_INDB': { status: 'CNF', count: 14, rawLabel: 'AVAILABLE 14' },
      },
      '1AC': {
        'JBP_INDB': { status: 'CNF', count: 4, rawLabel: 'AVAILABLE 4' },
      },
      '2S': {
        'JBP_INDB': { status: 'CNF', count: 110, rawLabel: 'AVAILABLE 110' },
      },
      CC: {},
    },
  },

  // 7. 19344 Panchvalley Express (KTE -> INDB via Bhopal)
  {
    trainNumber: '19344',
    trainName: 'Panchvalley Express',
    trainType: 'EXPRESS',
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: ['SL', '3AC', '2S'],
    pantryAvailable: false,
    onTimeRating: 85,
    typicalDelayMinutes: 20,
    halts: [
      { stationCode: 'KTE', stationName: 'Katni Jn', arrivalTime: 'Source', departureTime: '02:40', dayNumber: 1, distanceKm: 0 },
      { stationCode: 'DMO', stationName: 'Damoh', arrivalTime: '04:15', departureTime: '04:20', dayNumber: 1, distanceKm: 110 },
      { stationCode: 'SGO', stationName: 'Saugor', arrivalTime: '05:35', departureTime: '05:40', dayNumber: 1, distanceKm: 187 },
      { stationCode: 'BINA', stationName: 'Bina Jn', arrivalTime: '07:20', departureTime: '07:30', dayNumber: 1, distanceKm: 262 },
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrivalTime: '09:40', departureTime: '09:50', dayNumber: 1, distanceKm: 401 },
      { stationCode: 'UJN', stationName: 'Ujjain Jn', arrivalTime: '12:35', departureTime: '12:45', dayNumber: 1, distanceKm: 584 },
      { stationCode: 'INDB', stationName: 'Indore Jn', arrivalTime: '13:55', departureTime: 'Dest', dayNumber: 1, distanceKm: 663 },
    ],
    seatAvailabilityByClass: {
      SL: {
        'KTE_INDB': { status: 'CNF', count: 36, rawLabel: 'AVAILABLE 36 (Confirmed)' },
        'BPL_INDB': { status: 'CNF', count: 42, rawLabel: 'AVAILABLE 42' },
      },
      '3AC': {
        'KTE_INDB': { status: 'CNF', count: 16, rawLabel: 'AVAILABLE 16' },
      },
      '2AC': {},
      '1AC': {},
      '2S': {
        'KTE_INDB': { status: 'CNF', count: 68, rawLabel: 'AVAILABLE 68' },
      },
      CC: {},
    },
  },

  // 8. 19314 Patna - Indore Express (via Katni, Jabalpur, Bhopal, Ujjain, Indore)
  {
    trainNumber: '19314',
    trainName: 'Patna - Indore Express',
    trainType: 'EXPRESS',
    runningDays: [3, 5], // Wed, Fri (Nov 5 2026 is Thursday/Friday window)
    classes: ['SL', '3AC', '2AC', '2S'],
    pantryAvailable: true,
    onTimeRating: 81,
    typicalDelayMinutes: 30,
    halts: [
      { stationCode: 'STA', stationName: 'Satna Jn', arrivalTime: '01:50', departureTime: '01:55', dayNumber: 2, distanceKm: 620 },
      { stationCode: 'KTE', stationName: 'Katni Jn', arrivalTime: '03:15', departureTime: '03:20', dayNumber: 2, distanceKm: 718 },
      { stationCode: 'JBP', stationName: 'Jabalpur Jn', arrivalTime: '04:50', departureTime: '05:00', dayNumber: 2, distanceKm: 809 },
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrivalTime: '10:45', departureTime: '10:55', dayNumber: 2, distanceKm: 1145 },
      { stationCode: 'UJN', stationName: 'Ujjain Jn', arrivalTime: '13:40', departureTime: '13:50', dayNumber: 2, distanceKm: 1328 },
      { stationCode: 'INDB', stationName: 'Indore Jn', arrivalTime: '15:10', departureTime: 'Dest', dayNumber: 2, distanceKm: 1407 },
    ],
    seatAvailabilityByClass: {
      SL: {
        'KTE_INDB': { status: 'CNF', count: 24, rawLabel: 'AVAILABLE 24' },
        'JBP_INDB': { status: 'CNF', count: 32, rawLabel: 'AVAILABLE 32' },
      },
      '3AC': {
        'KTE_INDB': { status: 'CNF', count: 10, rawLabel: 'AVAILABLE 10' },
      },
      '2AC': {},
      '1AC': {},
      '2S': {},
      CC: {},
    },
  },

  // 9. 19324 Bhopal - Indore Intercity Express (High Vacant Berths & Seats)
  {
    trainNumber: '19324',
    trainName: 'Bhopal - Indore Intercity Express',
    trainType: 'INTERCITY',
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: ['SL', '3AC', 'CC', '2S'],
    pantryAvailable: false,
    onTimeRating: 93,
    typicalDelayMinutes: 5,
    halts: [
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrivalTime: 'Source', departureTime: '17:00', dayNumber: 1, distanceKm: 0 },
      { stationCode: 'UJN', stationName: 'Ujjain Jn', arrivalTime: '20:10', departureTime: '20:20', dayNumber: 1, distanceKm: 183 },
      { stationCode: 'INDB', stationName: 'Indore Jn', arrivalTime: '21:30', departureTime: 'Dest', dayNumber: 1, distanceKm: 262 },
    ],
    seatAvailabilityByClass: {
      SL: {
        'BPL_INDB': { status: 'CNF', count: 68, rawLabel: 'AVAILABLE 68 (Intercity Confirmed Sleeper)' },
      },
      '3AC': {
        'BPL_INDB': { status: 'CNF', count: 24, rawLabel: 'AVAILABLE 24 (Intercity 3AC Berth)' },
      },
      CC: {
        'BPL_INDB': { status: 'CNF', count: 52, rawLabel: 'AVAILABLE 52 (Intercity AC Chair)' },
      },
      '2S': {
        'BPL_INDB': { status: 'CNF', count: 180, rawLabel: 'AVAILABLE 180 (Intercity 2S Confirmed)' },
      },
      '2AC': {},
      '1AC': {},
    },
  },

  // 10. 19304 Bhopal - Indore Express (Late Night connecting train from Bhopal)
  {
    trainNumber: '19304',
    trainName: 'Bhopal - Indore Express',
    trainType: 'EXPRESS',
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: ['SL', '3AC', '2AC', '1AC', '2S'],
    pantryAvailable: false,
    onTimeRating: 90,
    typicalDelayMinutes: 10,
    halts: [
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrivalTime: 'Source', departureTime: '23:10', dayNumber: 1, distanceKm: 0 },
      { stationCode: 'UJN', stationName: 'Ujjain Jn', arrivalTime: '03:15', departureTime: '03:30', dayNumber: 2, distanceKm: 183 },
      { stationCode: 'INDB', stationName: 'Indore Jn', arrivalTime: '05:10', departureTime: 'Dest', dayNumber: 2, distanceKm: 262 },
    ],
    seatAvailabilityByClass: {
      SL: {
        'BPL_INDB': { status: 'CNF', count: 52, rawLabel: 'AVAILABLE 52 (Confirmed Sleeper)' },
      },
      '3AC': {
        'BPL_INDB': { status: 'CNF', count: 22, rawLabel: 'AVAILABLE 22' },
      },
      '2AC': {
        'BPL_INDB': { status: 'CNF', count: 8, rawLabel: 'AVAILABLE 8' },
      },
      '1AC': {},
      '2S': {
        'BPL_INDB': { status: 'CNF', count: 76, rawLabel: 'AVAILABLE 76' },
      },
      CC: {},
    },
  },

  // 11. 12920 Malwa Superfast Express (Key connection from Itarsi / Bhopal to Indore)
  {
    trainNumber: '12920',
    trainName: 'Malwa Superfast Express',
    trainType: 'SUPERFAST',
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: ['SL', '3AC', '2AC', '1AC', '2S'],
    pantryAvailable: true,
    onTimeRating: 89,
    typicalDelayMinutes: 18,
    halts: [
      { stationCode: 'GWL', stationName: 'Gwalior Jn', arrivalTime: '23:10', departureTime: '23:15', dayNumber: 1, distanceKm: 318 },
      { stationCode: 'BINA', stationName: 'Bina Jn', arrivalTime: '05:30', departureTime: '05:35', dayNumber: 2, distanceKm: 569 },
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrivalTime: '07:45', departureTime: '07:55', dayNumber: 2, distanceKm: 708 },
      { stationCode: 'UJN', stationName: 'Ujjain Jn', arrivalTime: '11:10', departureTime: '11:20', dayNumber: 2, distanceKm: 891 },
      { stationCode: 'INDB', stationName: 'Indore Jn', arrivalTime: '12:45', departureTime: 'Dest', dayNumber: 2, distanceKm: 970 },
    ],
    seatAvailabilityByClass: {
      SL: {
        'BPL_INDB': { status: 'CNF', count: 34, rawLabel: 'AVAILABLE 34' },
        'BINA_INDB': { status: 'CNF', count: 28, rawLabel: 'AVAILABLE 28' },
      },
      '3AC': {
        'BPL_INDB': { status: 'CNF', count: 16, rawLabel: 'AVAILABLE 16' },
      },
      '2AC': {
        'BPL_INDB': { status: 'CNF', count: 6, rawLabel: 'AVAILABLE 6' },
      },
      '1AC': {},
      '2S': {
        'BPL_INDB': { status: 'CNF', count: 65, rawLabel: 'AVAILABLE 65' },
      },
      CC: {},
    },
  },

  // 12. 20912 Vande Bharat Express (Bhopal to Indore)
  {
    trainNumber: '20912',
    trainName: 'Bhopal - Indore Vande Bharat Express',
    trainType: 'VANDE_BHARAT',
    runningDays: [1, 2, 3, 4, 5, 6], // Except Sun
    classes: ['CC'],
    pantryAvailable: true,
    onTimeRating: 97,
    typicalDelayMinutes: 2,
    halts: [
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrivalTime: 'Source', departureTime: '19:25', dayNumber: 1, distanceKm: 0 },
      { stationCode: 'UJN', stationName: 'Ujjain Jn', arrivalTime: '21:30', departureTime: '21:35', dayNumber: 1, distanceKm: 183 },
      { stationCode: 'INDB', stationName: 'Indore Jn', arrivalTime: '22:30', departureTime: 'Dest', dayNumber: 1, distanceKm: 262 },
    ],
    seatAvailabilityByClass: {
      CC: {
        'BPL_INDB': { status: 'CNF', count: 58, rawLabel: 'AVAILABLE 58 (Vande Bharat CC)' },
      },
      SL: {},
      '3AC': {},
      '2AC': {},
      '1AC': {},
      '2S': {},
    },
  },

  // 13. 12062 Jabalpur - Rani Kamlapati Janshatabdi
  {
    trainNumber: '12062',
    trainName: 'Jabalpur - Rani Kamlapati Jan Shatabdi Express',
    trainType: 'SUPERFAST',
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: ['CC', '2S'],
    pantryAvailable: false,
    onTimeRating: 95,
    typicalDelayMinutes: 4,
    halts: [
      { stationCode: 'JBP', stationName: 'Jabalpur Jn', arrivalTime: 'Source', departureTime: '05:30', dayNumber: 1, distanceKm: 0 },
      { stationCode: 'ET', stationName: 'Itarsi Jn', arrivalTime: '08:50', departureTime: '09:00', dayNumber: 1, distanceKm: 244 },
      { stationCode: 'RKMP', stationName: 'Rani Kamlapati', arrivalTime: '11:15', departureTime: 'Dest', dayNumber: 1, distanceKm: 330 },
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrivalTime: '11:35', departureTime: 'Dest', dayNumber: 1, distanceKm: 336 },
    ],
    seatAvailabilityByClass: {
      CC: {
        'JBP_BPL': { status: 'CNF', count: 42, rawLabel: 'AVAILABLE 42' },
        'JBP_RKMP': { status: 'CNF', count: 48, rawLabel: 'AVAILABLE 48' },
      },
      '2S': {
        'JBP_BPL': { status: 'CNF', count: 180, rawLabel: 'AVAILABLE 180' },
      },
      SL: {},
      '3AC': {},
      '2AC': {},
      '1AC': {},
    },
  },

  // 14. 12833 Ahmedabad - Howrah Express (connecting BSP, R, NGP, BRC)
  {
    trainNumber: '12833',
    trainName: 'Ahmedabad - Howrah Superfast Express',
    trainType: 'SUPERFAST',
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: ['SL', '3AC', '2AC', '2S'],
    pantryAvailable: true,
    onTimeRating: 86,
    typicalDelayMinutes: 22,
    halts: [
      { stationCode: 'NGP', stationName: 'Nagpur Jn', arrivalTime: '17:50', departureTime: '18:00', dayNumber: 1, distanceKm: 850 },
      { stationCode: 'DURG', stationName: 'Durg Jn', arrivalTime: '22:15', departureTime: '22:20', dayNumber: 1, distanceKm: 1115 },
      { stationCode: 'R', stationName: 'Raipur Jn', arrivalTime: '23:05', departureTime: '23:15', dayNumber: 1, distanceKm: 1152 },
      { stationCode: 'BSP', stationName: 'Bilaspur Jn', arrivalTime: '01:25', departureTime: '01:40', dayNumber: 2, distanceKm: 1263 },
    ],
    seatAvailabilityByClass: {
      SL: {
        'R_BSP': { status: 'CNF', count: 62, rawLabel: 'AVAILABLE 62' },
        'NGP_R': { status: 'CNF', count: 35, rawLabel: 'AVAILABLE 35' },
      },
      '3AC': {
        'R_BSP': { status: 'CNF', count: 20, rawLabel: 'AVAILABLE 20' },
      },
      '2AC': {},
      '1AC': {},
      '2S': {},
      CC: {},
    },
  },

  // 15. 12138 Punjab Mail
  {
    trainNumber: '12138',
    trainName: 'Punjab Mail',
    trainType: 'SUPERFAST',
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: ['SL', '3AC', '2AC', '1AC', '2S'],
    pantryAvailable: true,
    onTimeRating: 87,
    typicalDelayMinutes: 18,
    halts: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '05:15', departureTime: '05:30', dayNumber: 1, distanceKm: 0 },
      { stationCode: 'GWL', stationName: 'Gwalior Jn', arrivalTime: '10:18', departureTime: '10:23', dayNumber: 1, distanceKm: 318 },
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrivalTime: '16:35', departureTime: '16:40', dayNumber: 1, distanceKm: 708 },
      { stationCode: 'ET', stationName: 'Itarsi Jn', arrivalTime: '18:40', departureTime: '18:50', dayNumber: 1, distanceKm: 800 },
      { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arrivalTime: '07:35', departureTime: 'Dest', dayNumber: 2, distanceKm: 1544 },
    ],
    seatAvailabilityByClass: {
      SL: {
        'NDLS_BPL': { status: 'CNF', count: 45, rawLabel: 'AVAILABLE 45' },
        'BPL_CSMT': { status: 'CNF', count: 38, rawLabel: 'AVAILABLE 38' },
      },
      '3AC': {
        'NDLS_BPL': { status: 'CNF', count: 24, rawLabel: 'AVAILABLE 24' },
      },
      '2AC': {},
      '1AC': {},
      '2S': {},
      CC: {},
    },
  },

  // 16. 12951 Mumbai Tejas Rajdhani Express
  {
    trainNumber: '12951',
    trainName: 'Mumbai Tejas Rajdhani Express',
    trainType: 'SUPERFAST',
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: ['3AC', '2AC', '1AC'],
    pantryAvailable: true,
    onTimeRating: 98,
    typicalDelayMinutes: 0,
    halts: [
      { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arrivalTime: 'Source', departureTime: '17:00', dayNumber: 1, distanceKm: 0 },
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '08:32', departureTime: 'Dest', dayNumber: 2, distanceKm: 1386 },
    ],
    seatAvailabilityByClass: {
      '3AC': { 'CSMT_NDLS': { status: 'CNF', count: 40, rawLabel: 'AVAILABLE 40' } },
      '2AC': { 'CSMT_NDLS': { status: 'CNF', count: 18, rawLabel: 'AVAILABLE 18' } },
      '1AC': { 'CSMT_NDLS': { status: 'CNF', count: 6, rawLabel: 'AVAILABLE 6' } },
      SL: {},
      '2S': {},
      CC: {},
    },
  },

  // 17. 11703 Rewa - Indore Intercity Express (Famous connection via Katni, Damoh, Saugor, Bina, Bhopal to Indore)
  {
    trainNumber: '11703',
    trainName: 'Rewa - Indore Intercity Express',
    trainType: 'INTERCITY',
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: ['SL', '3AC', '2AC', '2S'],
    pantryAvailable: true,
    onTimeRating: 92,
    typicalDelayMinutes: 8,
    halts: [
      { stationCode: 'STA', stationName: 'Satna Jn', arrivalTime: '00:05', departureTime: '00:10', dayNumber: 1, distanceKm: 50 },
      { stationCode: 'KTE', stationName: 'Katni Jn', arrivalTime: '01:20', departureTime: '01:25', dayNumber: 1, distanceKm: 148 },
      { stationCode: 'DMO', stationName: 'Damoh', arrivalTime: '02:50', departureTime: '02:55', dayNumber: 1, distanceKm: 258 },
      { stationCode: 'SGO', stationName: 'Saugor', arrivalTime: '04:05', departureTime: '04:10', dayNumber: 1, distanceKm: 335 },
      { stationCode: 'BINA', stationName: 'Bina Jn', arrivalTime: '05:40', departureTime: '05:45', dayNumber: 1, distanceKm: 410 },
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrivalTime: '07:35', departureTime: '07:45', dayNumber: 1, distanceKm: 549 },
      { stationCode: 'UJN', stationName: 'Ujjain Jn', arrivalTime: '10:30', departureTime: '10:40', dayNumber: 1, distanceKm: 732 },
      { stationCode: 'INDB', stationName: 'Indore Jn', arrivalTime: '11:55', departureTime: 'Dest', dayNumber: 1, distanceKm: 811 },
    ],
    seatAvailabilityByClass: {
      SL: {
        'KTE_INDB': { status: 'CNF', count: 76, rawLabel: 'AVAILABLE 76 (Intercity Vacant Sleeper Berths)' },
        'DMO_INDB': { status: 'CNF', count: 54, rawLabel: 'AVAILABLE 54 (Vacant Berths)' },
        'SGO_INDB': { status: 'CNF', count: 62, rawLabel: 'AVAILABLE 62 (Vacant Berths)' },
        'BPL_INDB': { status: 'CNF', count: 85, rawLabel: 'AVAILABLE 85 (Vacant Berths)' },
      },
      '3AC': {
        'KTE_INDB': { status: 'CNF', count: 28, rawLabel: 'AVAILABLE 28 (Vacant AC Berths)' },
        'BPL_INDB': { status: 'CNF', count: 34, rawLabel: 'AVAILABLE 34 (Vacant AC Berths)' },
      },
      '2AC': {
        'KTE_INDB': { status: 'CNF', count: 12, rawLabel: 'AVAILABLE 12' },
      },
      '1AC': {},
      '2S': {
        'KTE_INDB': { status: 'CNF', count: 160, rawLabel: 'AVAILABLE 160 (Confirmed 2S Seats)' },
      },
      CC: {},
    },
  },

  // 18. 22188 Jabalpur - Rani Kamlapati / Bhopal Intercity Express
  {
    trainNumber: '22188',
    trainName: 'Jabalpur - Bhopal Intercity Superfast',
    trainType: 'INTERCITY',
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: ['SL', '3AC', 'CC', '2S'],
    pantryAvailable: false,
    onTimeRating: 94,
    typicalDelayMinutes: 5,
    halts: [
      { stationCode: 'JBP', stationName: 'Jabalpur Jn', arrivalTime: 'Source', departureTime: '15:45', dayNumber: 1, distanceKm: 0 },
      { stationCode: 'ET', stationName: 'Itarsi Jn', arrivalTime: '18:50', departureTime: '19:00', dayNumber: 1, distanceKm: 244 },
      { stationCode: 'RKMP', stationName: 'Rani Kamlapati', arrivalTime: '20:55', departureTime: '21:00', dayNumber: 1, distanceKm: 330 },
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrivalTime: '21:30', departureTime: 'Dest', dayNumber: 1, distanceKm: 336 },
    ],
    seatAvailabilityByClass: {
      SL: {
        'JBP_BPL': { status: 'CNF', count: 84, rawLabel: 'AVAILABLE 84 (Intercity Vacant Sleeper)' },
        'JBP_RKMP': { status: 'CNF', count: 90, rawLabel: 'AVAILABLE 90' },
      },
      '3AC': {
        'JBP_BPL': { status: 'CNF', count: 32, rawLabel: 'AVAILABLE 32' },
      },
      CC: {
        'JBP_BPL': { status: 'CNF', count: 48, rawLabel: 'AVAILABLE 48' },
      },
      '2S': {
        'JBP_BPL': { status: 'CNF', count: 195, rawLabel: 'AVAILABLE 195' },
      },
      '2AC': {},
      '1AC': {},
    },
  },
];
