// In-memory mock datastore for frontend development prior to REST API integration.

export const mockUsers = [
  {
    id: 'user-joy',
    name: 'Joy M',
    email: 'bijoyhasan1612@gmail.com',
    password: '@1111111',
    phone: '+880 1706392496',
    bio: 'Love to explore',
    university: 'Daffodil International University',
    department: 'Software Engineering',
    createdAt: '2026-08-10T10:00:00Z',
  },
  {
    id: 'user-1',
    name: 'Mahmud Rana Tonmoy',
    email: 'ranatonmoy33@gmail.com',
    password: 'tonmoy1234',
    phone: '+880 1712-345678',
    bio: 'Software Engineering student organizing semester break trips.',
    university: 'Daffodil International University',
    department: 'Software Engineering',
    createdAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 'user-2',
    name: 'Arafat Hossain',
    email: 'arafat@campus.edu',
    password: 'password123',
    phone: '+880 1812-345679',
    bio: 'Route planner and sunrise hiker.',
    university: 'North South University',
    department: 'Computer Science',
    createdAt: '2026-08-16T11:30:00Z',
  },
  {
    id: 'user-3',
    name: 'Nadia Karim',
    email: 'nadia@campus.edu',
    password: 'password123',
    phone: '+880 1912-345680',
    bio: 'Always tracks receipts and group coffee runs.',
    university: 'BRAC University',
    department: 'Computer Science',
    createdAt: '2026-08-18T09:15:00Z',
  },
  {
    id: 'user-4',
    name: 'Tariq Hasan',
    email: 'tariq@campus.edu',
    password: 'password123',
    bio: 'Food spots, ferries, and camera gear.',
    university: 'BUET',
    department: 'Electrical Engineering',
    createdAt: '2026-08-19T14:40:00Z',
  },
  {
    id: 'user-5',
    name: 'Samira Chowdhury',
    email: 'samira@campus.edu',
    password: 'password123',
    bio: 'Checklist keeper and train timetable nerd.',
    university: 'Dhaka University',
    department: 'Information Technology',
    createdAt: '2026-08-21T16:10:00Z',
  },
];

export const mockTrips = [
  {
    id: 'trip-1',
    name: "Cox's Bazar Coastline Escape",
    destination: "Cox's Bazar & Saint Martin's",
    startDate: '2026-12-18',
    endDate: '2026-12-21',
    budget: 9600,
    description:
      'Post-finals group trip down Marine Drive with a ferry day to Saint Martin’s Island and relaxed beach evenings.',
    inviteCode: 'TF-COAST-402',
    createdBy: 'user-1',
    createdAt: '2026-10-20T09:00:00Z',
    coordinates: { lat: 21.4272, lng: 92.0058 },
  },
  {
    id: 'trip-2',
    name: 'Sylhet Tea & Waterfall Weekend',
    destination: 'Sylhet, Jaflong & Ratargul',
    startDate: '2027-01-15',
    endDate: '2027-01-17',
    budget: 6500,
    description:
      'Three-day winter train trip covering swamp forest boat rides, tea estate walks, and stone quarry viewpoints.',
    inviteCode: 'TF-SYLH-198',
    createdBy: 'user-1',
    createdAt: '2026-10-28T13:20:00Z',
    coordinates: { lat: 24.8949, lng: 91.8687 },
  },
  {
    id: 'trip-3',
    name: 'Bandarban Ridge Trail',
    destination: 'Bandarban & Boga Lake',
    startDate: '2027-02-05',
    endDate: '2027-02-07',
    budget: 9800,
    description:
      'Freshly created workspace for our February hill trek. Add activities, packing gear, and ideas together.',
    inviteCode: 'TF-RIDGE-731',
    createdBy: 'user-joy',
    createdAt: '2026-11-05T17:45:00Z',
    coordinates: { lat: 22.1953, lng: 92.2184 },
  },
  {
    id: 'trip-4',
    name: 'Sundarbans River Study Tour',
    destination: 'Khulna & Karamjal',
    startDate: '2027-03-12',
    endDate: '2027-03-14',
    budget: 8200,
    description:
      'Department eco-tour exploring mangrove trails, river launches, and wildlife observation towers.',
    inviteCode: 'TF-SUND-512',
    createdBy: 'user-joy',
    createdAt: '2026-11-01T11:00:00Z',
    coordinates: { lat: 22.4292, lng: 89.5914 },
  },
];

// Additional joinable trip for testing "Join by invite code" on Dashboard
export const mockJoinableTrips = [
  {
    id: 'trip-5',
    name: 'Sajek Valley Cloud Trek',
    destination: 'Sajek, Ruilui & Konglak',
    startDate: '2027-03-22',
    endDate: '2027-03-25',
    budget: 8500,
    description:
      'Cloud canopy trek along Ruilui Para, sunset at Konglak Peak, and indigenous bamboo cottage stays.',
    inviteCode: '6767',
    createdBy: 'user-3',
    createdAt: '2026-11-08T10:00:00Z',
    coordinates: { lat: 23.3821, lng: 92.2938 },
  },
];

export const mockMembersByTrip = {
  'trip-1': [
    { id: 'user-1', name: 'Mahmud Rana Tonmoy', email: 'ranatonmoy33@gmail.com', role: 'Trip Creator', joinedAt: '2026-10-20T09:00:00Z' },
    { id: 'user-joy', name: 'Joy M', email: 'bijoyhasan1612@gmail.com', role: 'Trip Member', joinedAt: '2026-10-21T09:00:00Z' },
    { id: 'user-2', name: 'Arafat Hossain', email: 'arafat@campus.edu', role: 'Trip Member', joinedAt: '2026-10-20T10:15:00Z' },
    { id: 'user-3', name: 'Nadia Karim', email: 'nadia@campus.edu', role: 'Trip Member', joinedAt: '2026-10-21T08:40:00Z' },
    { id: 'user-4', name: 'Tariq Hasan', email: 'tariq@campus.edu', role: 'Trip Member', joinedAt: '2026-10-21T19:05:00Z' },
  ],
  'trip-2': [
    { id: 'user-1', name: 'Mahmud Rana Tonmoy', email: 'ranatonmoy33@gmail.com', role: 'Trip Creator', joinedAt: '2026-10-28T13:20:00Z' },
    { id: 'user-2', name: 'Arafat Hossain', email: 'arafat@campus.edu', role: 'Trip Member', joinedAt: '2026-10-28T13:30:00Z' },
    { id: 'user-joy', name: 'Joy M', email: 'bijoyhasan1612@gmail.com', role: 'Trip Member', joinedAt: '2026-10-28T14:00:00Z' },
    { id: 'user-5', name: 'Samira Chowdhury', email: 'samira@campus.edu', role: 'Trip Member', joinedAt: '2026-10-29T09:10:00Z' },
  ],
  'trip-3': [
    { id: 'user-joy', name: 'Joy M', email: 'bijoyhasan1612@gmail.com', role: 'Trip Creator', joinedAt: '2026-11-05T17:45:00Z' },
    { id: 'user-1', name: 'Mahmud Rana Tonmoy', email: 'ranatonmoy33@gmail.com', role: 'Trip Member', joinedAt: '2026-11-05T18:00:00Z' },
    { id: 'user-2', name: 'Arafat Hossain', email: 'arafat@campus.edu', role: 'Trip Member', joinedAt: '2026-11-06T09:10:00Z' },
    { id: 'user-4', name: 'Tariq Hasan', email: 'tariq@campus.edu', role: 'Trip Member', joinedAt: '2026-11-07T11:20:00Z' },
  ],
  'trip-4': [
    { id: 'user-joy', name: 'Joy M', email: 'bijoyhasan1612@gmail.com', role: 'Trip Creator', joinedAt: '2026-11-01T11:00:00Z' },
    { id: 'user-1', name: 'Mahmud Rana Tonmoy', email: 'ranatonmoy33@gmail.com', role: 'Trip Member', joinedAt: '2026-11-01T11:15:00Z' },
    { id: 'user-3', name: 'Nadia Karim', email: 'nadia@campus.edu', role: 'Trip Member', joinedAt: '2026-11-01T14:00:00Z' },
    { id: 'user-4', name: 'Tariq Hasan', email: 'tariq@campus.edu', role: 'Trip Member', joinedAt: '2026-11-01T14:20:00Z' },
  ],
  'trip-5': [
    { id: 'user-3', name: 'Nadia Karim', email: 'nadia@campus.edu', role: 'Trip Creator', joinedAt: '2026-11-08T10:00:00Z' },
    { id: 'user-4', name: 'Tariq Hasan', email: 'tariq@campus.edu', role: 'Trip Member', joinedAt: '2026-11-08T12:00:00Z' },
  ],
};

export const mockJoinRequestsByTrip = {
  'trip-1': [],
  'trip-2': [],
  'trip-3': [
    {
      id: 'req-3-1',
      tripId: 'trip-3',
      tripName: 'Bandarban Ridge Trail',
      destination: 'Bandarban & Boga Lake',
      userId: 'user-5',
      name: 'Samira Chowdhury',
      email: 'samira@campus.edu',
      status: 'pending',
      requestedAt: '2026-11-10T14:30:00Z',
    },
  ],
  'trip-4': [],
  'trip-5': [],
};

export const mockItineraryByTrip = {
  'trip-1': [
    {
      id: 'act-101',
      day: 1,
      title: 'Morning bus arrival & hostel check-in',
      time: '08:30',
      location: 'Kolatoli Beach Road',
      cost: 1800,
      notes: 'Drop bags and grab breakfast nearby.',
    },
    {
      id: 'act-102',
      day: 1,
      title: 'Sunset walk along Laboni Point',
      time: '17:00',
      location: 'Laboni Beach',
      cost: 350,
      notes: 'Tea stalls and golden hour photos.',
    },
    {
      id: 'act-103',
      day: 2,
      title: 'Marine Drive scooter & jeep ride',
      time: '09:00',
      location: 'Inani & Himchari Coast',
      cost: 1400,
      notes: 'Stop at Himchari viewpoint on the way.',
    },
    {
      id: 'act-104',
      day: 2,
      title: 'Seafood group dinner',
      time: '19:30',
      location: 'Poushee Restaurant',
      cost: 950,
      notes: 'Reserve table for four ahead of time.',
    },
    {
      id: 'act-105',
      day: 3,
      title: 'Ferry crossing to Saint Martin’s Island',
      time: '07:15',
      location: 'Teknaf Ferry Terminal',
      cost: 1600,
      notes: 'Bring motion-sickness tablets and ID copies.',
    },
    {
      id: 'act-106',
      day: 3,
      title: 'Chera Dwip cycling & tide walk',
      time: '15:00',
      location: 'Chera Dwip South Point',
      cost: 400,
      notes: 'Return before high tide.',
    },
    {
      id: 'act-107',
      day: 4,
      title: 'Burmese market souvenir stop & return coach',
      time: '11:00',
      location: 'Tekpara Market',
      cost: 1100,
      notes: 'Board overnight AC bus back at 21:00.',
    },
  ],
  'trip-2': [
    {
      id: 'act-201',
      day: 1,
      title: 'Parabat Express arrival & Zindabazar breakfast',
      time: '07:45',
      location: 'Sylhet Railway Station',
      cost: 550,
      notes: 'Meet at platform exit.',
    },
    {
      id: 'act-202',
      day: 1,
      title: 'Ratargul Swamp Forest wooden boat tour',
      time: '11:30',
      location: 'Ratargul Swamp Forest',
      cost: 900,
      notes: 'Share one boat among three.',
    },
    {
      id: 'act-203',
      day: 2,
      title: 'Jaflong river crossing & tea garden trail',
      time: '09:30',
      location: 'Jaflong Zero Point',
      cost: 1650,
      notes: 'Wear grip shoes near river stones.',
    },
  ],
  'trip-3': [
    {
      id: 'act-301',
      day: 1,
      title: 'Chander Gari pickup & transfer to Ruma Bazaar',
      time: '08:30',
      location: 'Bandarban Town Stand',
      cost: 1500,
      notes: 'Army checkpost registration; carry student and national IDs.',
    },
    {
      id: 'act-302',
      day: 1,
      title: 'Afternoon trek up to Boga Lake tribal cottages',
      time: '14:00',
      location: 'Boga Lake Settlement',
      cost: 800,
      notes: 'Check into Siam Didi wooden cottage; lake walk before dusk.',
    },
    {
      id: 'act-303',
      day: 2,
      title: 'Keokradong peak sunrise trek & cloud canopy',
      time: '05:30',
      location: 'Keokradong Summit',
      cost: 500,
      notes: 'Early summit hike; carry water bottles, light windbreaker, and camera.',
    },
    {
      id: 'act-304',
      day: 2,
      title: 'Campfire barbecue & stargazing by the ridge',
      time: '19:30',
      location: 'Boga Lake Camp Point',
      cost: 700,
      notes: 'Local hill chicken roast, bamboo tea, and group acoustic songs.',
    },
    {
      id: 'act-305',
      day: 3,
      title: 'Descent to town & Golden Temple (Buddha Dhatu Jadi)',
      time: '10:00',
      location: 'Balaghata, Bandarban',
      cost: 450,
      notes: 'Final souvenir market shopping before evening coach.',
    },
  ],
  'trip-4': [
    {
      id: 'act-401',
      day: 1,
      title: 'Board river launch at Khulna Ghat',
      time: '07:00',
      location: 'BIWTA Launch Terminal',
      cost: 3200,
      notes: 'Safety briefing on deck.',
    },
  ],
  'trip-5': [],
};

export const mockIdeasByTrip = {
  'trip-1': [
    {
      id: 'idea-1',
      title: 'Sunrise kayak session near Patuartek',
      location: 'Patuartek Beach',
      estimatedCost: 450,
      notes: 'Calm water before 8 AM, rents by the hour.',
      authorId: 'user-2',
      authorName: 'Arafat Hossain',
      votes: { 'user-1': 1, 'user-2': 1, 'user-3': 1, 'user-4': -1 },
      addedToItinerary: false,
      createdAt: '2026-10-25T10:15:00Z',
    },
    {
      id: 'idea-2',
      title: 'Radiant Fish World aquarium visit',
      location: 'Jhautala Main Road',
      estimatedCost: 600,
      notes: 'Good backup if afternoon rain picks up.',
      authorId: 'user-3',
      authorName: 'Nadia Karim',
      votes: { 'user-1': 1, 'user-3': 1 },
      addedToItinerary: false,
      createdAt: '2026-10-26T15:40:00Z',
    },
    {
      id: 'idea-3',
      title: 'Chera Dwip cycling & tide walk',
      location: 'Chera Dwip South Point',
      estimatedCost: 400,
      notes: 'Rent bicycles near the main bazaar.',
      authorId: 'user-4',
      authorName: 'Tariq Hasan',
      votes: { 'user-1': 1, 'user-2': 1, 'user-4': 1 },
      addedToItinerary: true,
      createdAt: '2026-10-24T12:00:00Z',
    },
  ],
  'trip-2': [
    {
      id: 'idea-201',
      title: 'Sadapathor Bholaganj morning detour',
      location: 'Bholaganj',
      estimatedCost: 850,
      notes: 'Clear mountain stream if we leave by 7 AM.',
      authorId: 'user-5',
      authorName: 'Samira Chowdhury',
      votes: { 'user-1': 1, 'user-2': 1, 'user-5': 1 },
      addedToItinerary: false,
      createdAt: '2026-11-02T09:30:00Z',
    },
  ],
  'trip-3': [
    {
      id: 'idea-301',
      title: 'Nafakhum & Remakri river boat expedition',
      location: 'Remakri & Sangu River',
      estimatedCost: 1400,
      notes: 'Take traditional wooden engine boat through Sangu river gorge to reach Nafakhum falls.',
      authorId: 'user-joy',
      authorName: 'Joy M',
      votes: { 'user-joy': 1, 'user-1': 1, 'user-2': 1, 'user-4': 1 },
      addedToItinerary: false,
      createdAt: '2026-11-06T12:00:00Z',
    },
    {
      id: 'idea-302',
      title: 'Nilgiri sunrise view & cloud deck photography',
      location: 'Nilgiri Resort Hilltop',
      estimatedCost: 600,
      notes: 'Early morning viewpoint stop along Thanchi road on the way back to town.',
      authorId: 'user-1',
      authorName: 'Mahmud Rana Tonmoy',
      votes: { 'user-joy': 1, 'user-1': 1, 'user-2': 1 },
      addedToItinerary: true,
      createdAt: '2026-11-06T15:30:00Z',
    },
  ],
  'trip-4': [],
  'trip-5': [],
};

export const mockPollsByTrip = {
  'trip-1': [
    {
      id: 'poll-1',
      question: 'Which dinner spot should we book for Night 2?',
      createdBy: 'user-1',
      createdByName: 'Mahmud Rana Tonmoy',
      status: 'open',
      createdAt: '2026-11-04T18:20:00Z',
      options: [
        { id: 'opt-1', text: 'Poushee Courtyard Seafood', voterIds: ['user-1', 'user-3'] },
        { id: 'opt-2', text: 'Mermaid Beach Cafe', voterIds: ['user-2'] },
        { id: 'opt-3', text: 'Jhaubon Local Grill', voterIds: [] },
      ],
    },
    {
      id: 'poll-2',
      question: 'Preferred transport from Dhaka to Cox’s Bazar?',
      createdBy: 'user-1',
      createdByName: 'Mahmud Rana Tonmoy',
      status: 'closed',
      createdAt: '2026-10-23T11:00:00Z',
      options: [
        { id: 'opt-4', text: 'Overnight sleeper coach', voterIds: ['user-1', 'user-2', 'user-4'] },
        { id: 'opt-5', text: 'Cox’s Bazar Express train', voterIds: ['user-3'] },
      ],
    },
  ],
  'trip-2': [
    {
      id: 'poll-201',
      question: 'Should we stay near Zindabazar or Lakkatura?',
      createdBy: 'user-2',
      createdByName: 'Arafat Hossain',
      status: 'open',
      createdAt: '2026-11-01T10:00:00Z',
      options: [
        { id: 'opt-21', text: 'Zindabazar (walkable food spots)', voterIds: ['user-2', 'user-5'] },
        { id: 'opt-22', text: 'Lakkatura (quiet tea estate cottage)', voterIds: [] },
      ],
    },
  ],
  'trip-3': [
    {
      id: 'poll-301',
      question: 'Which trekking route should we prioritize for Day 2?',
      createdBy: 'user-joy',
      createdByName: 'Joy M',
      status: 'open',
      createdAt: '2026-11-07T10:00:00Z',
      options: [
        { id: 'opt-301', text: 'Keokradong Summit trail (rocky & scenic)', voterIds: ['user-joy', 'user-1', 'user-4'] },
        { id: 'opt-302', text: 'Chingri Jhiri waterfall trail (shady & relaxed)', voterIds: ['user-2'] },
      ],
    },
    {
      id: 'poll-302',
      question: 'What type of accommodation at Boga Lake?',
      createdBy: 'user-joy',
      createdByName: 'Joy M',
      status: 'closed',
      createdAt: '2026-11-05T19:00:00Z',
      options: [
        { id: 'opt-303', text: 'Siam Didi bamboo tribal cottage', voterIds: ['user-joy', 'user-1', 'user-2', 'user-4'] },
        { id: 'opt-304', text: 'Trekker tents by the water', voterIds: [] },
      ],
    },
  ],
  'trip-4': [],
  'trip-5': [],
};

export const mockExpensesByTrip = {
  'trip-1': [
    {
      id: 'exp-1',
      title: 'Sleeper coach tickets (4 seats)',
      amount: 2400,
      payerId: 'user-1',
      payerName: 'Mahmud Rana Tonmoy',
      participantIds: ['user-1', 'user-2', 'user-3', 'user-4'],
      date: '2026-11-02',
    },
    {
      id: 'exp-2',
      title: 'Beachfront hostel deposit',
      amount: 2000,
      payerId: 'user-2',
      payerName: 'Arafat Hossain',
      participantIds: ['user-1', 'user-2', 'user-3', 'user-4'],
      date: '2026-11-03',
    },
    {
      id: 'exp-3',
      title: 'Teknaf ferry booking advance',
      amount: 1200,
      payerId: 'user-3',
      payerName: 'Nadia Karim',
      participantIds: ['user-1', 'user-2', 'user-3', 'user-4'],
      date: '2026-11-06',
    },
    {
      id: 'exp-4',
      title: 'Waterproof camera & dry bags',
      amount: 600,
      payerId: 'user-4',
      payerName: 'Tariq Hasan',
      participantIds: ['user-1', 'user-2', 'user-4'],
      date: '2026-11-08',
    },
  ],
  'trip-2': [
    {
      id: 'exp-201',
      title: 'Parabat Express train tickets',
      amount: 1800,
      payerId: 'user-2',
      payerName: 'Arafat Hossain',
      participantIds: ['user-1', 'user-2', 'user-5'],
      date: '2026-11-03',
    },
    {
      id: 'exp-202',
      title: 'Jaflong boat & reserve share',
      amount: 1500,
      payerId: 'user-1',
      payerName: 'Mahmud Rana Tonmoy',
      participantIds: ['user-1', 'user-2', 'user-5'],
      date: '2026-11-04',
    },
  ],
  'trip-3': [
    {
      id: 'exp-301',
      title: 'Chander Gari 4WD round-trip advance',
      amount: 4500,
      payerId: 'user-joy',
      payerName: 'Joy M',
      participantIds: ['user-joy', 'user-1', 'user-2', 'user-4'],
      date: '2026-11-06',
    },
    {
      id: 'exp-302',
      title: 'Boga Lake tribal cottage booking deposit',
      amount: 2200,
      payerId: 'user-1',
      payerName: 'Mahmud Rana Tonmoy',
      participantIds: ['user-joy', 'user-1', 'user-2', 'user-4'],
      date: '2026-11-07',
    },
    {
      id: 'exp-303',
      title: 'Trekking guide & forest safety fee',
      amount: 1500,
      payerId: 'user-joy',
      payerName: 'Joy M',
      participantIds: ['user-joy', 'user-1', 'user-2', 'user-4'],
      date: '2026-11-08',
    },
    {
      id: 'exp-304',
      title: 'Campfire dinner & barbecue supply share',
      amount: 1000,
      payerId: 'user-4',
      payerName: 'Tariq Hasan',
      participantIds: ['user-joy', 'user-1', 'user-2', 'user-4'],
      date: '2026-11-09',
    },
  ],
  'trip-4': [],
  'trip-5': [],
};

export const mockDiscussionByTrip = {
  'trip-1': [
    {
      id: 'post-1',
      authorId: 'user-1',
      authorName: 'Mahmud Rana Tonmoy',
      authorRole: 'Trip Creator',
      content:
        'Booked the four overnight coach seats for Dec 17 night. Please upload your student ID photos to the shared folder before Friday so we can confirm the ferry pass.',
      createdAt: '2026-11-06T14:30:00Z',
      replies: [
        {
          id: 'rep-1',
          authorId: 'user-3',
          authorName: 'Nadia Karim',
          authorRole: 'Trip Member',
          content: 'Just sent mine! Also added the ferry deposit in Expenses.',
          createdAt: '2026-11-06T15:12:00Z',
        },
        {
          id: 'rep-2',
          authorId: 'user-2',
          authorName: 'Arafat Hossain',
          authorRole: 'Trip Member',
          content: 'Confirming I checked the Teknaf pier boarding gate — opens at 06:45 AM.',
          createdAt: '2026-11-07T09:05:00Z',
        },
      ],
    },
    {
      id: 'post-2',
      authorId: 'user-4',
      authorName: 'Tariq Hasan',
      authorRole: 'Trip Member',
      content:
        'Should we rent scooters along Marine Drive or hire one open jeep for all four of us? Jeep is safer if we carry backpacks.',
      createdAt: '2026-11-08T19:40:00Z',
      replies: [
        {
          id: 'rep-3',
          authorId: 'user-1',
          authorName: 'Mahmud Rana Tonmoy',
          authorRole: 'Trip Creator',
          content: 'Good point — let’s go with one open jeep so nobody has to carry bags on a scooter.',
          createdAt: '2026-11-08T20:10:00Z',
        },
      ],
    },
  ],
  'trip-2': [
    {
      id: 'post-201',
      authorId: 'user-2',
      authorName: 'Arafat Hossain',
      authorRole: 'Trip Creator',
      content: 'Train leaves Kamalapur at 06:20 AM sharp. Let’s aim to meet by 05:50 AM.',
      createdAt: '2026-11-04T08:15:00Z',
      replies: [],
    },
  ],
  'trip-3': [
    {
      id: 'post-301',
      authorId: 'user-joy',
      authorName: 'Joy M',
      authorRole: 'Trip Creator',
      content:
        'Hey everyone! Booked our 4WD Chander Gari for Friday morning from Bandarban town to Ruma. Please keep your National ID / Student ID photocopies ready for the Ruma army checkpost clearance.',
      createdAt: '2026-11-08T10:00:00Z',
      replies: [
        {
          id: 'rep-301',
          authorId: 'user-1',
          authorName: 'Mahmud Rana Tonmoy',
          authorRole: 'Trip Member',
          content: 'Photocopies ready! Should we bring tents or stay in the wooden cottages by Boga Lake?',
          createdAt: '2026-11-08T10:45:00Z',
        },
        {
          id: 'rep-302',
          authorId: 'user-joy',
          authorName: 'Joy M',
          authorRole: 'Trip Creator',
          content: 'Cottages have warm blankets and home-cooked meals, so let’s take cottages. I already contacted Siam Didi.',
          createdAt: '2026-11-08T11:15:00Z',
        },
      ],
    },
    {
      id: 'post-302',
      authorId: 'user-4',
      authorName: 'Tariq Hasan',
      authorRole: 'Trip Member',
      content:
        'I am bringing a 30,000 mAh high-capacity power bank and a first-aid kit with crepe bandages and muscle spray since electricity is limited near the lake.',
      createdAt: '2026-11-09T14:20:00Z',
      replies: [
        {
          id: 'rep-303',
          authorId: 'user-2',
          authorName: 'Arafat Hossain',
          authorRole: 'Trip Member',
          content: 'Awesome Tariq! I will carry trekking poles and headlamps for the Day 2 sunrise hike.',
          createdAt: '2026-11-09T15:00:00Z',
        },
      ],
    },
  ],
  'trip-4': [],
  'trip-5': [],
};

export const mockPackingByTrip = {
  'trip-1': [
    { id: 'pack-1', title: 'Portable power bank (20,000 mAh)', assigneeId: 'user-1', assigneeName: 'Mahmud Rana Tonmoy', packed: true },
    { id: 'pack-2', title: 'Basic first-aid & motion sickness kit', assigneeId: 'user-3', assigneeName: 'Nadia Karim', packed: true },
    { id: 'pack-3', title: 'Waterproof dry bag for ferry crossing', assigneeId: 'user-4', assigneeName: 'Tariq Hasan', packed: false },
    { id: 'pack-4', title: 'Sunscreen & polarized sunglasses', assigneeId: 'user-2', assigneeName: 'Arafat Hossain', packed: false },
    { id: 'pack-5', title: 'Printed student ID & booking copies', assigneeId: 'user-1', assigneeName: 'Mahmud Rana Tonmoy', packed: false },
    { id: 'pack-6', title: 'Compact travel card game', assigneeId: '', assigneeName: 'Unassigned', packed: false },
  ],
  'trip-2': [
    { id: 'pack-201', title: 'Light windbreaker jacket', assigneeId: 'user-1', assigneeName: 'Mahmud Rana Tonmoy', packed: true },
    { id: 'pack-202', title: 'Trail sneakers with wet grip', assigneeId: 'user-5', assigneeName: 'Samira Chowdhury', packed: false },
  ],
  'trip-3': [
    { id: 'pack-301', title: 'Trekking poles & knee support brace', assigneeId: 'user-joy', assigneeName: 'Joy M', packed: true },
    { id: 'pack-302', title: '30,000 mAh high-capacity power bank', assigneeId: 'user-4', assigneeName: 'Tariq Hasan', packed: true },
    { id: 'pack-303', title: 'Quick-dry microfiber towels & fleece jackets', assigneeId: 'user-1', assigneeName: 'Mahmud Rana Tonmoy', packed: false },
    { id: 'pack-304', title: 'Outdoor first-aid kit & blister plasters', assigneeId: 'user-2', assigneeName: 'Arafat Hossain', packed: true },
    { id: 'pack-305', title: 'Heavy-duty headlamps with extra AAA batteries', assigneeId: 'user-joy', assigneeName: 'Joy M', packed: false },
  ],
  'trip-4': [],
  'trip-5': [],
};

export const mockUpdatesByTrip = {
  'trip-1': [
    { id: 'upd-1', text: 'Tariq Hasan added expense "Waterproof camera & dry bags" (৳600)', createdAt: '2026-11-08T18:10:00Z' },
    { id: 'upd-2', text: 'Mahmud Rana Tonmoy started poll "Which dinner spot should we book for Night 2?"', createdAt: '2026-11-04T18:20:00Z' },
    { id: 'upd-3', text: 'Nadia Karim marked "Basic first-aid & motion sickness kit" as packed', createdAt: '2026-11-03T16:45:00Z' },
    { id: 'upd-4', text: 'Arafat Hossain suggested idea "Sunrise kayak session near Patuartek"', createdAt: '2026-10-25T10:15:00Z' },
  ],
  'trip-2': [
    { id: 'upd-201', text: 'Samira Chowdhury suggested idea "Sadapathor Bholaganj morning detour"', createdAt: '2026-11-02T09:30:00Z' },
    { id: 'upd-202', text: 'Arafat Hossain posted in Discussion about morning departure time', createdAt: '2026-11-04T08:15:00Z' },
  ],
  'trip-3': [
    { id: 'upd-301', text: 'Joy M added expense "Trekking guide & forest safety fee" (৳1,500)', createdAt: '2026-11-08T18:00:00Z' },
    { id: 'upd-302', text: 'Joy M started poll "Which trekking route should we prioritize for Day 2?"', createdAt: '2026-11-07T10:00:00Z' },
    { id: 'upd-303', text: 'Mahmud Rana Tonmoy added expense "Boga Lake tribal cottage booking deposit" (৳2,200)', createdAt: '2026-11-07T09:15:00Z' },
    { id: 'upd-304', text: 'Joy M suggested idea "Nafakhum & Remakri river boat expedition"', createdAt: '2026-11-06T12:00:00Z' },
    { id: 'upd-305', text: 'Tariq Hasan joined the trip', createdAt: '2026-11-07T11:20:00Z' },
  ],
  'trip-4': [
    { id: 'upd-401', text: 'Joy M created the trip workspace', createdAt: '2026-11-01T11:00:00Z' },
    { id: 'upd-402', text: 'Mahmud Rana Tonmoy joined the trip', createdAt: '2026-11-01T11:15:00Z' },
    { id: 'upd-403', text: 'Nadia Karim added activity "Board river launch at Khulna Ghat"', createdAt: '2026-11-02T10:00:00Z' },
  ],
  'trip-5': [],
};

export const mockWeatherByDestination = {
  "Cox's Bazar & Saint Martin's": {
    available: true,
    location: "Cox's Bazar, Bangladesh",
    temperatureC: 26,
    feelsLikeC: 27,
    condition: 'Clear coastal breeze',
    rainChancePercent: 10,
    humidityPercent: 64,
    windKmh: 14,
    outlook: [
      { day: 'Day 1', highC: 27, lowC: 19, summary: 'Sunny, light wind' },
      { day: 'Day 2', highC: 26, lowC: 18, summary: 'Mostly clear' },
      { day: 'Day 3', highC: 25, lowC: 19, summary: 'Partly cloudy' },
      { day: 'Day 4', highC: 26, lowC: 18, summary: 'Clear morning' },
    ],
  },
  'Sylhet, Jaflong & Ratargul': {
    available: true,
    location: 'Sylhet, Bangladesh',
    temperatureC: 21,
    feelsLikeC: 21,
    condition: 'Cool morning mist',
    rainChancePercent: 20,
    humidityPercent: 72,
    windKmh: 9,
    outlook: [
      { day: 'Day 1', highC: 22, lowC: 13, summary: 'Misty sunrise, sunny' },
      { day: 'Day 2', highC: 21, lowC: 12, summary: 'Crisp & dry' },
      { day: 'Day 3', highC: 22, lowC: 13, summary: 'Light clouds' },
    ],
  },
  'Khulna & Karamjal': {
    available: true,
    location: 'Sundarbans, Bangladesh',
    temperatureC: 25,
    feelsLikeC: 26,
    condition: 'Mangrove river breeze',
    rainChancePercent: 15,
    humidityPercent: 74,
    windKmh: 11,
    outlook: [
      { day: 'Day 1', highC: 26, lowC: 18, summary: 'Sunny launch cruise' },
      { day: 'Day 2', highC: 25, lowC: 17, summary: 'Watchtower trail clear' },
      { day: 'Day 3', highC: 26, lowC: 18, summary: 'Warm river afternoon' },
    ],
  },
  // Intentionally unavailable to demonstrate graceful WeatherCard fallback state
  'Bandarban & Boga Lake': {
    available: false,
    reason: 'Mountain ridge station forecast is temporarily unavailable for February dates.',
  },
};

export const mockNotifications = [
  {
    id: 'notif-1',
    tripId: 'trip-1',
    tripName: "Cox's Bazar Coastline Escape",
    category: 'Expense',
    message: 'Tariq Hasan added "৳600 Waterproof camera & dry bags" to Expenses.',
    link: '/trips/trip-1/expenses',
    read: false,
    createdAt: '2026-11-08T18:10:00Z',
  },
  {
    id: 'notif-2',
    tripId: 'trip-1',
    tripName: "Cox's Bazar Coastline Escape",
    category: 'Poll',
    message: 'New poll open: "Which dinner spot should we book for Night 2?"',
    link: '/trips/trip-1/polls',
    read: false,
    createdAt: '2026-11-04T18:20:00Z',
  },
  {
    id: 'notif-3',
    tripId: 'trip-2',
    tripName: 'Sylhet Tea & Waterfall Weekend',
    category: 'Idea',
    message: 'Samira Chowdhury suggested "Sadapathor Bholaganj morning detour".',
    link: '/trips/trip-2/ideas',
    read: false,
    createdAt: '2026-11-02T09:30:00Z',
  },
  {
    id: 'notif-4',
    tripId: 'trip-1',
    tripName: "Cox's Bazar Coastline Escape",
    category: 'Discussion',
    message: 'Nadia Karim replied to your boarding confirmation post.',
    link: '/trips/trip-1/discussion',
    read: true,
    createdAt: '2026-11-06T15:12:00Z',
  },
];

export function notifyUnreadBadgeSync() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tripforge:notifications-updated'));
  }
}

export function pushTripUpdate(tripId, text, category = 'Update', linkSuffix = 'overview', tripNameOverride) {
  const trip = mockTrips.find((t) => t.id === tripId);
  const tripName = tripNameOverride || trip?.name || 'Trip';
  if (!mockUpdatesByTrip[tripId]) {
    mockUpdatesByTrip[tripId] = [];
  }
  const now = new Date().toISOString();
  mockUpdatesByTrip[tripId].unshift({
    id: `upd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text,
    createdAt: now,
  });

  mockNotifications.unshift({
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    tripId,
    tripName,
    category,
    message: text,
    link: `/trips/${tripId}/${linkSuffix}`,
    read: false,
    createdAt: now,
  });

  notifyUnreadBadgeSync();
}

