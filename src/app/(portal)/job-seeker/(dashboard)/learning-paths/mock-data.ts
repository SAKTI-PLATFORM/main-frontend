export const mockLeaderboard = [
  { id: '1', name: 'Nadia', daysStreak: 15, xp: 3120, rank: 1 },
  { id: '2', name: 'Rizal', daysStreak: 14, xp: 2980, rank: 2 },
  { id: '3', name: 'Sari', daysStreak: 13, xp: 2750, rank: 3 },
  { id: '4', name: 'Tono', daysStreak: 10, xp: 2100, rank: 4 },
  { id: '5', name: 'Budi Santoso', daysStreak: 5, xp: 1500, rank: 5 },
  { id: '6', name: 'Citra Dewi', daysStreak: 10, xp: 950, rank: 6 },
  { id: '7', name: 'Dina Pratiwi', daysStreak: 3, xp: 900, rank: 7 },
  { id: '8', name: 'Eko Rinaldi', daysStreak: 2, xp: 600, rank: 8 },
  { id: '9', name: 'Fajar Hidayat', daysStreak: 1, xp: 500, rank: 9 },
  { id: '10', name: 'Dewi Lestari', daysStreak: 8, xp: 450, rank: 10, isCurrentUser: true },
]

export const mockRoadmapOptions = [
  {
    id: '1-full-stack',
    title: '1 Full-Stack Tech Lead',
    description: 'Pelajari keterampilan backend tingkat lanjut (Microservices, GraphQL) dan praktik kepemimpinan untuk menjadi Full-Stack Tech Lead yang handal.',
    priority: '3 prioritas sedang',
    skills: ['React Native', 'GraphQL', 'Microservices'],
    duration: '36.2 jam',
    videos: '30 Video Pembelajaran',
    level: 'Tingkat Menengah',
    progress: 91,
  },
  {
    id: 'ux-ui-design',
    title: 'UX/UI Design Fundamentals',
    description: 'Kuasai prinsip dasar desain antarmuka, riset pengguna, dan pembuatan prototipe interaktif yang memanjakan pengguna.',
    priority: '3 prioritas sedang',
    skills: ['Figma', 'User Research', 'Prototyping'],
    duration: '24.5 jam',
    videos: '18 Video Pembelajaran',
    level: 'Tingkat Dasar',
    progress: 10,
  },
  {
    id: 'data-science',
    title: 'Data Science Analytics Pathway',
    description: 'Tingkatkan kemampuan analisa datamu dari dasar hingga pemodelan prediktif menggunakan Python, SQL, dan Machine Learning.',
    priority: '2 prioritas tinggi',
    skills: ['Python', 'SQL', 'Machine Learning'], 
    duration: '42.0 jam',
    videos: '40 Video Pembelajaran',
    level: 'Tingkat Lanjut',
    progress: 5,
  },
]

export const mockSkillGaps = [
  { name: 'EDA', value: 80, fill: '#FFFFFF' },
  { name: 'Backend F.', value: 40, fill: '#FFFFFF' },
  { name: 'OOP', value: 65, fill: '#FFFFFF' },
  { name: 'Ctx Eng.', value: 30, fill: '#FFFFFF' },
  { name: 'Tools', value: 55, fill: '#FFFFFF' },
  { name: 'TFs', value: 100, fill: '#FFFFFF' },
]

export const mockTimelineSteps = [
  {
    id: 'group-1',
    title: 'Welcome to the Backend Path',
    durationInfo: '4/5',
    timeInfo: '40 min',
    description: 'Your first steps in backend development. Discover your learning route and test your JS skills. Let\'s get going!',
    isExpanded: true,
    subSteps: [
      {
        id: 'sub-1-1',
        title: 'Welcome to the Backend Developer Path',
        type: 'video',
        durationInfo: '4/5',
        timeInfo: '40 min',
      },
      {
        id: 'sub-1-2',
        title: 'How\'s your JavaScript?',
        type: 'play',
        timeInfo: '40 min',
      },
    ]
  },
  {
    id: 'group-2',
    title: 'Command Line Interface',
    durationInfo: '4/5',
    timeInfo: '40 min',
    isExpanded: false,
    subSteps: []
  },
  {
    id: 'group-3',
    title: 'Web Architecture Fundamentals',
    durationInfo: '4/5',
    timeInfo: '40 min',
    isExpanded: false,
    subSteps: []
  },
  {
    id: 'group-4',
    title: 'Async JavaScript & APIs',
    durationInfo: '4/5',
    timeInfo: '40 min',
    isExpanded: false,
    subSteps: []
  },
  {
    id: 'group-5',
    title: 'Node',
    durationInfo: '4/5',
    timeInfo: '40 min',
    description: 'Your first steps in backend development. Discover your learning route and test your JS skills. Let\'s get going!',
    isExpanded: true,
    subSteps: [
      {
        id: 'sub-5-1',
        title: 'Welcome to the Backend Developer Path',
        type: 'video',
        durationInfo: '4/5',
        timeInfo: '40 min',
      }
    ]
  },
  {
    id: 'group-6',
    title: 'Express Framework',
    durationInfo: '3/5',
    timeInfo: '2 hours',
    isExpanded: false,
    subSteps: [
      { id: 'sub-6-1', title: 'Routing in Express', type: 'video', timeInfo: '30 min' },
      { id: 'sub-6-2', title: 'Middleware basics', type: 'video', timeInfo: '45 min' }
    ]
  },
  {
    id: 'group-7',
    title: 'PostgreSQL & Databases',
    durationInfo: '0/8',
    timeInfo: '4 hours',
    isExpanded: false,
    subSteps: []
  },
  {
    id: 'group-8',
    title: 'Authentication & JWT',
    durationInfo: '0/3',
    timeInfo: '1.5 hours',
    isExpanded: false,
    subSteps: [
      { id: 'sub-8-1', title: 'What is JWT?', type: 'video', timeInfo: '20 min' }
    ]
  },
  {
    id: 'group-9',
    title: 'Docker & Containerization',
    durationInfo: '0/5',
    timeInfo: '3 hours',
    isExpanded: false,
    subSteps: []
  },
  {
    id: 'group-10',
    title: 'Deployment & CI/CD',
    durationInfo: '0/4',
    timeInfo: '2 hours',
    isExpanded: false,
    subSteps: []
  }
]
