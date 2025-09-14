export const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Information Technology',
  'Mathematics',
  'Physics',
  'Chemistry',
  'English',
  'Commerce',
  'Management'
];

export const DEGREE_NAMES = [
  'Bachelor of Technology (B.Tech)',
  'Bachelor of Engineering (B.E)',
  'Bachelor of Science (B.Sc)',
  'Bachelor of Commerce (B.Com)',
  'Bachelor of Arts (B.A)',
  'Bachelor of Business Administration (BBA)',
  'Master of Technology (M.Tech)',
  'Master of Science (M.Sc)',
  'Master of Commerce (M.Com)',
  'Master of Arts (M.A)',
  'Master of Business Administration (MBA)',
  'Diploma',
  'Certificate Course'
];

export const STREAMS = [
  'Computer Science and Engineering',
  'Electronics and Communication Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Information Technology',
  'Aerospace Engineering',
  'Chemical Engineering',
  'Biotechnology',
  'Data Science',
  'Artificial Intelligence',
  'Cybersecurity',
  'Software Engineering',
  'Network Engineering',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English Literature',
  'History',
  'Economics',
  'Commerce',
  'Business Administration',
  'Management Studies'
];

export const OD_TYPES = [
  { value: 'medical', label: 'Medical' },
  { value: 'personal', label: 'Personal' },
  { value: 'official', label: 'Official' },
  { value: 'academic', label: 'Academic' }
];

export const OD_CATEGORIES = [
  { value: 'intercollege', label: 'Intercollege' },
  { value: 'intracollege', label: 'Intracollege' },
  { value: 'other', label: 'Other' }
];

export const DEPARTMENT_EVENTS = {
  'Computer Science': [
    'Tech Fest 2025',
    'Coding Competition',
    'Hackathon',
    'Technical Symposium',
    'Project Exhibition',
    'Guest Lecture Series',
    'Workshop on AI/ML',
    'Database Design Contest'
  ],
  'Electronics': [
    'Electronics Expo',
    'Circuit Design Competition',
    'Robotics Workshop',
    'Embedded Systems Seminar',
    'IoT Innovation Challenge',
    'Signal Processing Conference',
    'VLSI Design Contest',
    'Electronics Project Showcase'
  ],
  'Mechanical': [
    'Mechanical Engineering Expo',
    'CAD Design Competition',
    'Automobile Workshop',
    'Thermodynamics Seminar',
    'Machine Design Contest',
    'Manufacturing Technology Expo',
    'Fluid Mechanics Workshop',
    'Mechanical Project Display'
  ],
  'Civil': [
    'Civil Engineering Expo',
    'Structural Design Competition',
    'Concrete Technology Workshop',
    'Surveying Contest',
    'Environmental Engineering Seminar',
    'Construction Technology Expo',
    'Geotechnical Workshop',
    'Civil Project Exhibition'
  ],
  'Electrical': [
    'Electrical Engineering Expo',
    'Power Systems Workshop',
    'Control Systems Competition',
    'Renewable Energy Seminar',
    'Electrical Safety Workshop',
    'Power Electronics Contest',
    'Smart Grid Conference',
    'Electrical Project Showcase'
  ],
  'Information Technology': [
    'IT Expo 2025',
    'Web Development Competition',
    'Cybersecurity Workshop',
    'Cloud Computing Seminar',
    'Mobile App Development Contest',
    'Data Analytics Workshop',
    'Network Security Conference',
    'IT Project Exhibition'
  ],
  'Mathematics': [
    'Mathematics Olympiad',
    'Statistics Workshop',
    'Mathematical Modeling Contest',
    'Applied Mathematics Seminar',
    'Numerical Analysis Workshop',
    'Mathematical Research Conference',
    'Statistics Project Display',
    'Mathematics Quiz Competition'
  ],
  'Physics': [
    'Physics Expo',
    'Quantum Physics Workshop',
    'Optics Laboratory Contest',
    'Thermodynamics Seminar',
    'Electromagnetism Workshop',
    'Modern Physics Conference',
    'Physics Project Exhibition',
    'Science Fair'
  ],
  'Chemistry': [
    'Chemistry Expo',
    'Organic Chemistry Workshop',
    'Analytical Chemistry Contest',
    'Physical Chemistry Seminar',
    'Inorganic Chemistry Workshop',
    'Chemical Engineering Conference',
    'Chemistry Project Display',
    'Lab Safety Workshop'
  ],
  'English': [
    'Literary Festival',
    'Creative Writing Competition',
    'Public Speaking Workshop',
    'Literature Seminar',
    'Drama Competition',
    'Poetry Recitation Contest',
    'Language Skills Workshop',
    'Cultural Event'
  ],
  'Commerce': [
    'Commerce Expo',
    'Business Plan Competition',
    'Accounting Workshop',
    'Economics Seminar',
    'Marketing Contest',
    'Finance Workshop',
    'Entrepreneurship Conference',
    'Commerce Project Display'
  ],
  'Management': [
    'Management Expo',
    'Case Study Competition',
    'Leadership Workshop',
    'HR Management Seminar',
    'Strategic Planning Contest',
    'Operations Management Workshop',
    'Business Ethics Conference',
    'Management Project Showcase'
  ]
};

export const SHIFTS = [
  { value: 'morning', label: 'Morning' },
  { value: 'evening', label: 'Evening' }
];

export const MOTIVATIONAL_QUOTES = [
  "Success is the sum of small efforts repeated day in and day out.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Education is the most powerful weapon which you can use to change the world.",
  "Your limitation—it's only your imagination.",
  "The only impossible journey is the one you never begin."
];

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  EVENTS: '/events',
  OD_REQUESTS: '/od-requests',
  STUDENT_ATTENDANCE: '/student/attendance',
  TOP_STUDENTS: '/staff/top-students'
};