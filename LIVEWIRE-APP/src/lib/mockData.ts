// Mock data for the application - used as default when live data is not available

export const mockTeamStats = {
  winRate: 68,
  winRateChange: 5,
  avgKD: 1.42,
  kdChange: 0.15,
  clutchRate: 34,
  clutchChange: 8,
  practiceHours: 142,
  practiceChange: 12,
};

export const mockPlayerStats = [
  {
    id: '1',
    name: 'Baemon',
    role: 'Duelist',
    kd: 1.52,
    acs: 278,
    adr: 168,
    kast: 74,
    rating: 1.28,
    avatar: '/placeholder.svg',
    status: 'online',
  },
  {
    id: '2',
    name: 'Onur',
    role: 'Initiator',
    kd: 1.21,
    acs: 215,
    adr: 142,
    kast: 78,
    rating: 1.15,
    avatar: '/placeholder.svg',
    status: 'online',
  },
  {
    id: '3',
    name: 'Aspas',
    role: 'Duelist',
    kd: 1.48,
    acs: 265,
    adr: 160,
    kast: 72,
    rating: 1.25,
    avatar: '/placeholder.svg',
    status: 'online',
  },
  {
    id: '4',
    name: 'Less',
    role: 'Initiator',
    kd: 1.15,
    acs: 208,
    adr: 138,
    kast: 76,
    rating: 1.12,
    avatar: '/placeholder.svg',
    status: 'online',
  },
  {
    id: '5',
    name: 'Saadhak',
    role: 'IGL/Initiator',
    kd: 1.08,
    acs: 192,
    adr: 128,
    kast: 82,
    rating: 1.05,
    avatar: '/placeholder.svg',
    status: 'away',
  },
];

export const mockRecentMatches = [
  {
    id: '1',
    opponent: 'Cloud9',
    result: 'WIN',
    score: '13-8',
    map: 'Ascent',
    date: '2024-01-15',
  },
  {
    id: '2',
    opponent: 'Sentinels',
    result: 'WIN',
    score: '13-11',
    map: 'Haven',
    date: '2024-01-14',
  },
  {
    id: '3',
    opponent: 'NRG',
    result: 'LOSS',
    score: '10-13',
    map: 'Split',
    date: '2024-01-13',
  },
  {
    id: '4',
    opponent: '100 Thieves',
    result: 'WIN',
    score: '13-5',
    map: 'Bind',
    date: '2024-01-12',
  },
  {
    id: '5',
    opponent: 'Evil Geniuses',
    result: 'WIN',
    score: '13-9',
    map: 'Lotus',
    date: '2024-01-11',
  },
];

export const mockPerformanceData = [
  { day: 'Mon', winRate: 65, avgKD: 1.35, practiceHours: 6 },
  { day: 'Tue', winRate: 72, avgKD: 1.42, practiceHours: 8 },
  { day: 'Wed', winRate: 58, avgKD: 1.28, practiceHours: 7 },
  { day: 'Thu', winRate: 75, avgKD: 1.48, practiceHours: 8 },
  { day: 'Fri', winRate: 68, avgKD: 1.38, practiceHours: 6 },
  { day: 'Sat', winRate: 80, avgKD: 1.55, practiceHours: 10 },
  { day: 'Sun', winRate: 70, avgKD: 1.40, practiceHours: 5 },
];

export const mockLeaks = [
  {
    id: '1',
    category: 'Positioning',
    description: 'Frequently over-peeking on defense rounds',
    severity: 'high',
    frequency: 12,
    recommendations: [
      'Hold tighter angles on defense',
      'Wait for utility before aggressive peeks',
      'Communicate with team before taking fights',
    ],
  },
  {
    id: '2',
    category: 'Economy',
    description: 'Force buying too often in eco rounds',
    severity: 'medium',
    frequency: 8,
    recommendations: [
      'Save for full buy rounds',
      'Coordinate economy with team',
      'Consider half-buy strategies',
    ],
  },
  {
    id: '3',
    category: 'Utility',
    description: 'Using flashes without team coordination',
    severity: 'low',
    frequency: 5,
    recommendations: [
      'Call out flash timings',
      'Practice pop flash lineups',
      'Wait for team ready calls',
    ],
  },
];

export const mockDrills = [
  {
    id: '1',
    name: 'Aim Lab - Gridshot',
    category: 'Aim Training',
    duration: 15,
    difficulty: 'Medium',
    completed: true,
    score: 85000,
  },
  {
    id: '2',
    name: 'Crosshair Placement Drill',
    category: 'Fundamentals',
    duration: 20,
    difficulty: 'Easy',
    completed: true,
    score: null,
  },
  {
    id: '3',
    name: 'Retake Scenarios',
    category: 'Team Play',
    duration: 30,
    difficulty: 'Hard',
    completed: false,
    score: null,
  },
  {
    id: '4',
    name: 'Smoke Lineups - Ascent',
    category: 'Utility',
    duration: 25,
    difficulty: 'Medium',
    completed: false,
    score: null,
  },
];

export const mockTrainingSessions = [
  {
    id: '1',
    title: 'Morning Aim Training',
    type: 'Individual',
    time: '09:00',
    duration: 60,
    participants: ['Aspas', 'Less'],
  },
  {
    id: '2',
    title: 'Team Scrim vs Cloud9',
    type: 'Scrim',
    time: '14:00',
    duration: 180,
    participants: ['Full Roster'],
  },
  {
    id: '3',
    title: 'VOD Review - VCT Match',
    type: 'Review',
    time: '18:00',
    duration: 90,
    participants: ['Full Roster'],
  },
];

export const mockAgendaItems = [
  {
    id: '1',
    title: 'Pre-match preparation',
    time: '13:00',
    type: 'meeting',
    attendees: ['Saadhak', 'Coach'],
  },
  {
    id: '2',
    title: 'Scrim vs Sentinels',
    time: '15:00',
    type: 'scrim',
    attendees: ['Full Roster'],
  },
  {
    id: '3',
    title: 'Individual review - Aspas',
    time: '19:00',
    type: 'review',
    attendees: ['Aspas', 'Coach'],
  },
];

export const mockVODList = [
  {
    id: '1',
    title: 'VCT Americas - vs Cloud9',
    map: 'Ascent',
    date: '2024-01-15',
    duration: '45:32',
    result: 'WIN',
    thumbnail: '/placeholder.svg',
  },
  {
    id: '2',
    title: 'Scrim - vs NRG',
    map: 'Haven',
    date: '2024-01-14',
    duration: '38:15',
    result: 'LOSS',
    thumbnail: '/placeholder.svg',
  },
  {
    id: '3',
    title: 'VCT Americas - vs Sentinels',
    map: 'Split',
    date: '2024-01-12',
    duration: '52:48',
    result: 'WIN',
    thumbnail: '/placeholder.svg',
  },
];
