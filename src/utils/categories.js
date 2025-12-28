export const jobCategories = [
  // ====== INDUSTRIAL & MANUFACTURING ======
  {
    id: 'industrial-manufacturing',
    name: 'Industrial & Manufacturing',
    icon: '🏭',
    description: 'Factory, plant, and industrial facility workers',
    subcategories: [
      'Factory Workers',
      'Assembly Line Workers',
      'Quality Inspectors',
      'Machine Operators',
      'Forklift Drivers',
      'Warehouse Packers',
      'Production Supervisors',
      'CNC Operators',
      'Textile Workers',
      'Packaging Staff'
    ],
    color: 'bg-gray-100 text-gray-800 border-gray-300'
  },
  {
    id: 'construction',
    name: 'Construction',
    icon: '🏗️',
    description: 'Building, infrastructure, and construction work',
    subcategories: [
      'Construction Laborers',
      'Masons',
      'Carpenters',
      'Electricians',
      'Plumbers',
      'Painters',
      'Welders',
      'Heavy Equipment Operators',
      'Surveyors',
      'Foremen',
      'Scaffolders',
      'Tile Workers'
    ],
    color: 'bg-orange-100 text-orange-800 border-orange-300'
  },
  
  // ====== AGRICULTURE & FARMING ======
  {
    id: 'agriculture-farming',
    name: 'Agriculture & Farming',
    icon: '🚜',
    description: 'Farm, crop, and livestock related work',
    subcategories: [
      'Farm Laborers',
      'Harvest Workers',
      'Tractor Drivers',
      'Irrigation Workers',
      'Pesticide Sprayers',
      'Livestock Handlers',
      'Dairy Workers',
      'Poultry Workers',
      'Gardeners',
      'Nursery Workers',
      'Seasonal Crop Workers',
      'Farm Supervisors'
    ],
    color: 'bg-green-100 text-green-800 border-green-300'
  },
  {
    id: 'fishing-aquaculture',
    name: 'Fishing & Aquaculture',
    icon: '🎣',
    description: 'Fishing, seafood processing, and marine work',
    subcategories: [
      'Fishermen',
      'Boat Crew',
      'Seafood Processors',
      'Fish Farm Workers',
      'Net Menders',
      'Ice Plant Workers'
    ],
    color: 'bg-teal-100 text-teal-800 border-teal-300'
  },
  
  // ====== TRANSPORTATION & LOGISTICS ======
  {
    id: 'transportation-drivers',
    name: 'Transportation & Drivers',
    icon: '🚛',
    description: 'All types of driving and transportation jobs',
    subcategories: [
      'Truck Drivers (Heavy/Light)',
      'Bus Drivers',
      'Taxi/Auto Drivers',
      'Delivery Drivers',
      'School Van Drivers',
      'Ambulance Drivers',
      'Forklift Drivers',
      'Crane Operators',
      'Logistics Helpers',
      'Dispatch Clerks',
      'Transport Supervisors'
    ],
    color: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    id: 'logistics-warehouse',
    name: 'Logistics & Warehouse',
    icon: '📦',
    description: 'Warehouse, storage, and supply chain jobs',
    subcategories: [
      'Warehouse Workers',
      'Loaders/Unloaders',
      'Forklift Operators',
      'Inventory Clerks',
      'Packers',
      'Shipping Clerks',
      'Stock Keepers',
      'Order Pickers',
      'Quality Checkers'
    ],
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  },
  
  // ====== DOMESTIC & PERSONAL SERVICES ======
  {
    id: 'domestic-help',
    name: 'Domestic Help',
    icon: '🏠',
    description: 'Household and personal assistance services',
    subcategories: [
      'House Maids',
      'Cooks',
      'Nannies/Babysitters',
      'Elderly Caregivers',
      'Drivers (Personal)',
      'Security Guards',
      'Gardeners',
      'Pet Caretakers',
      'Housekeepers',
      'Laundry Workers'
    ],
    color: 'bg-pink-100 text-pink-800 border-pink-300'
  },
  
  // ====== HOSPITALITY & FOOD SERVICES ======
  {
    id: 'hospitality-food',
    name: 'Hospitality & Food',
    icon: '🍽️',
    description: 'Hotels, restaurants, and food services',
    subcategories: [
      'Waiters/Waitresses',
      'Chefs/Cooks',
      'Kitchen Helpers',
      'Bartenders',
      'Hotel Staff',
      'Catering Staff',
      'Fast Food Workers',
      'Bakery Workers',
      'Food Delivery',
      'Restaurant Cleaners'
    ],
    color: 'bg-red-100 text-red-800 border-red-300'
  },
  
  // ====== RETAIL & SALES ======
  {
    id: 'retail-sales',
    name: 'Retail & Sales',
    icon: '🛒',
    description: 'Store, shop, and sales positions',
    subcategories: [
      'Sales Associates',
      'Cashiers',
      'Store Managers',
      'Shop Assistants',
      'Promoters',
      'Merchandisers',
      'Stock Clerks',
      'Customer Service',
      'Billing Clerks'
    ],
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  },
  
  // ====== OFFICE & ADMINISTRATION ======
  {
    id: 'office-admin',
    name: 'Office & Administration',
    icon: '💼',
    description: 'Administrative and clerical positions',
    subcategories: [
      'Data Entry Operators',
      'Receptionists',
      'Office Assistants',
      'Accountants',
      'Clerks',
      'Telecallers',
      'Secretaries',
      'Typists',
      'File Clerks'
    ],
    color: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  
  // ====== TECHNICAL & IT ======
  {
    id: 'technical-it',
    name: 'Technical & IT',
    icon: '💻',
    description: 'Technology, computers, and digital services',
    subcategories: [
      'Computer Operators',
      'IT Support',
      'Mobile Repair',
      'Electricians (Household)',
      'AC Repair',
      'Plumbers (Household)',
      'Carpenters (Furniture)',
      'Technicians',
      'CCTV Installers'
    ],
    color: 'bg-cyan-100 text-cyan-800 border-cyan-300'
  },
  
  // ====== HEALTHCARE ======
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    description: 'Medical and health services',
    subcategories: [
      'Nurses',
      'Nursing Assistants',
      'Caregivers',
      'Medical Attendants',
      'Lab Assistants',
      'Ambulance Drivers',
      'Hospital Cleaners',
      'Ward Boys',
      'Compounders'
    ],
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  
  // ====== CLEANING & SANITATION ======
  {
    id: 'cleaning-sanitation',
    name: 'Cleaning & Sanitation',
    icon: '🧹',
    description: 'Cleaning, janitorial, and sanitation work',
    subcategories: [
      'Office Cleaners',
      'House Cleaners',
      'Sweepers',
      'Drain Cleaners',
      'Toilet Cleaners',
      'Garbage Collectors',
      'Street Cleaners',
      'Window Cleaners',
      'Industrial Cleaners'
    ],
    color: 'bg-lime-100 text-lime-800 border-lime-300'
  },
  
  // ====== SECURITY ======
  {
    id: 'security',
    name: 'Security Services',
    icon: '🛡️',
    description: 'Security and protection services',
    subcategories: [
      'Security Guards',
      'Gatekeepers',
      'Watchmen',
      'Bouncers',
      'CCTV Operators',
      'Patrol Officers',
      'Event Security',
      'Personal Bodyguards'
    ],
    color: 'bg-neutral-100 text-neutral-800 border-neutral-300'
  },
  
  // ====== BEAUTY & WELLNESS ======
  {
    id: 'beauty-wellness',
    name: 'Beauty & Wellness',
    icon: '💇',
    description: 'Beauty, grooming, and wellness services',
    subcategories: [
      'Hair Stylists',
      'Beauticians',
      'Spa Therapists',
      'Barbers',
      'Massage Therapists',
      'Makeup Artists',
      'Nail Technicians',
      'Fitness Trainers'
    ],
    color: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300'
  },
  
  // ====== EDUCATION & TRAINING ======
  {
    id: 'education-training',
    name: 'Education & Training',
    icon: '📚',
    description: 'Teaching, coaching, and training',
    subcategories: [
      'Tutors',
      'Coaches',
      'Instructors',
      'Workshop Facilitators',
      'Driving Instructors',
      'Computer Trainers',
      'Language Teachers',
      'Music Teachers'
    ],
    color: 'bg-violet-100 text-violet-800 border-violet-300'
  },
  
  // ====== EVENT & ENTERTAINMENT ======
  {
    id: 'event-entertainment',
    name: 'Event & Entertainment',
    icon: '🎪',
    description: 'Event management and entertainment',
    subcategories: [
      'Event Managers',
      'Catering Staff',
      'Decorators',
      'Photographers',
      'Videographers',
      'DJs',
      'Musicians',
      'Ushers',
      'Stage Crew'
    ],
    color: 'bg-rose-100 text-rose-800 border-rose-300'
  },

  // ====== TOURISM & TRAVEL ======
  {
    id: 'tourism-travel',
    name: 'Tourism & Travel',
    icon: '✈️',
    description: 'Tour guide, travel assistant, and related jobs',
    subcategories: [
      'Tour Guides',
      'Travel Assistants',
      'Ticket Agents',
      'Reservation Clerks',
      'Souvenir Shop Staff',
      'Hotel Porters'
    ],
    color: 'bg-sky-100 text-sky-800 border-sky-300'
  },

  // ====== SKILLED TRADES ======
  {
    id: 'skilled-trades',
    name: 'Skilled Trades',
    icon: '🛠️',
    description: 'Specialized skilled trade work',
    subcategories: [
      'Electricians (Certified)',
      'Plumbers (Licensed)',
      'HVAC Technicians',
      'Welders (Certified)',
      'Masonry Experts',
      'Roofing Specialists'
    ],
    color: 'bg-stone-100 text-stone-800 border-stone-300'
  },
  
  // ====== MISCELLANEOUS ======
  {
    id: 'miscellaneous',
    name: 'Miscellaneous Services',
    icon: '🔧',
    description: 'Other specialized services',
    subcategories: [
      'Electricians (Industrial)',
      'Mechanics',
      'Plumbers (Industrial)',
      'Welders (Industrial)',
      'Carpenters (Industrial)',
      'Painters (Industrial)',
      'Scaffolders',
      'Riggers',
      'Crane Operators',
      'Heavy Equipment Mechanics'
    ],
    color: 'bg-amber-100 text-amber-800 border-amber-300'
  }
];

// ====== SEASONAL CATEGORIES ======
export const seasonalCategories = [
  {
    id: 'festival-season',
    name: 'Festival Season Work',
    icon: '🎉',
    description: 'Temporary jobs during festivals',
    examples: [
      'Diwali Sales Staff',
      'Christmas Decorators',
      'Eid Catering',
      'Durga Puja Pandals',
      'Ganesh Chaturthi Helpers',
      'New Year Event Staff'
    ]
  },
  {
    id: 'harvest-season',
    name: 'Harvest Season Work',
    icon: '🌾',
    description: 'Agricultural work during harvest',
    examples: [
      'Wheat Harvest Workers',
      'Rice Harvest Workers',
      'Fruit Pickers',
      'Vegetable Harvesters',
      'Tea Leaf Pickers',
      'Coffee Bean Pickers'
    ]
  },
  {
    id: 'monsoon-season',
    name: 'Monsoon Season Work',
    icon: '🌧️',
    description: 'Jobs specific to rainy season',
    examples: [
      'Drain Cleaners',
      'Road Repair Workers',
      'Flood Relief Workers',
      'Roof Repair Workers',
      'Waterproofing Workers'
    ]
  },
  {
    id: 'summer-season',
    name: 'Summer Season Work',
    icon: '☀️',
    description: 'Jobs during summer months',
    examples: [
      'AC Installation & Repair',
      'Swimming Pool Cleaners',
      'Summer Camp Staff',
      'Ice Cream Vendors',
      'Water Delivery'
    ]
  }
];

// ====== DRIVER SPECIFIC CATEGORIES ======
export const driverCategories = [
  {
    id: 'heavy-vehicle',
    name: 'Heavy Vehicle Drivers',
    icon: '🚛',
    vehicles: ['Truck', 'Bus', 'Container', 'Dumper', 'Tractor', 'Crane'],
    license: 'Heavy Vehicle License Required'
  },
  {
    id: 'light-vehicle',
    name: 'Light Vehicle Drivers',
    icon: '🚗',
    vehicles: ['Car', 'Van', 'Auto', 'Taxi', 'Jeep', 'Pickup'],
    license: 'Light Vehicle License Required'
  },
  {
    id: 'commercial',
    name: 'Commercial Drivers',
    icon: '🚚',
    vehicles: ['Delivery Van', 'Goods Carrier', 'Ambulance', 'School Van', 'Tourist Bus'],
    license: 'Commercial License Required'
  },
  {
    id: 'specialized',
    name: 'Specialized Vehicle Drivers',
    icon: '🏎️',
    vehicles: ['Forklift', 'Crane', 'Excavator', 'Bulldozer', 'Concrete Mixer'],
    license: 'Special Training Required'
  }
];

// ====== WORK TYPE CLASSIFICATIONS ======
export const workTypes = [
  { 
    id: 'daily-wage', 
    name: 'Daily Wage', 
    icon: '📅',
    description: 'Paid daily, no long-term commitment'
  },
  { 
    id: 'contract', 
    name: 'Contract Basis', 
    icon: '📝',
    description: 'Fixed duration contract work'
  },
  { 
    id: 'part-time', 
    name: 'Part Time', 
    icon: '⏰',
    description: 'Few hours per day'
  },
  { 
    id: 'full-time', 
    name: 'Full Time', 
    icon: '🕘',
    description: 'Regular employment'
  },
  { 
    id: 'seasonal', 
    name: 'Seasonal', 
    icon: '🌦️',
    description: 'Work during specific seasons'
  },
  { 
    id: 'temporary', 
    name: 'Temporary', 
    icon: '⏳',
    description: 'Short-term temporary work'
  },
  { 
    id: 'freelance', 
    name: 'Freelance', 
    icon: '💼',
    description: 'Project-based independent work'
  },
  { 
    id: 'work-from-home', 
    name: 'Work From Home', 
    icon: '🏠',
    description: 'Remote work opportunities'
  }
];

// ====== ADDITIONAL CONFIGURATIONS ======
export const experienceLevels = [
  { id: 'fresher', name: 'Fresher (0-1 year)', badge: '🆕' },
  { id: 'beginner', name: 'Beginner (1-3 years)', badge: '👶' },
  { id: 'intermediate', name: 'Intermediate (3-5 years)', badge: '👨‍💼' },
  { id: 'experienced', name: 'Experienced (5-8 years)', badge: '👨‍🔧' },
  { id: 'expert', name: 'Expert (8+ years)', badge: '👴' }
];

export const educationLevels = [
  { id: 'illiterate', name: 'Illiterate' },
  { id: 'literate', name: 'Literate (Can Read/Write)' },
  { id: 'primary', name: 'Primary School (1-5)' },
  { id: 'middle', name: 'Middle School (6-8)' },
  { id: 'matric', name: 'Matric/10th Pass' },
  { id: 'intermediate', name: 'Intermediate/12th Pass' },
  { id: 'diploma', name: 'Diploma/ITI' },
  { id: 'graduate', name: 'Graduate' },
  { id: 'post-graduate', name: 'Post Graduate' }
];

export const genderPreferences = [
  { id: 'any', name: 'Any Gender' },
  { id: 'male', name: 'Male Only' },
  { id: 'female', name: 'Female Only' },
  { id: 'transgender', name: 'Transgender' },
  { id: 'no-preference', name: 'No Preference' }
];

export const accommodationOptions = [
  { id: 'not-needed', name: 'Accommodation Not Needed' },
  { id: 'needed', name: 'Accommodation Needed' },
  { id: 'provided', name: 'Accommodation Provided' },
  { id: 'shared', name: 'Shared Accommodation' }
];

// ====== NEW: LOCATION TYPES ======
export const locationTypes = [
  { id: 'urban', name: 'Urban/City', icon: '🏙️' },
  { id: 'rural', name: 'Rural/Village', icon: '🌳' },
  { id: 'industrial', name: 'Industrial Area', icon: '🏭' },
  { id: 'remote', name: 'Remote Location', icon: '🗺️' },
  { id: 'site', name: 'Site Based', icon: '🚧' }
];

// ====== NEW: LANGUAGE REQUIREMENTS ======
export const languageRequirements = [
  { id: 'hindi', name: 'Hindi', levels: ['Basic', 'Conversational', 'Fluent'] },
  { id: 'english', name: 'English', levels: ['Basic', 'Conversational', 'Fluent'] },
  { id: 'local', name: 'Local Language', levels: ['Basic', 'Conversational', 'Fluent'] },
  { id: 'multilingual', name: 'Multilingual Preferred' }
];

// ====== NEW: PHYSICAL REQUIREMENTS ======
export const physicalRequirements = [
  { id: 'heavy-lifting', name: 'Heavy Lifting', icon: '🏋️' },
  { id: 'standing-long', name: 'Long Standing Hours', icon: '🧍' },
  { id: 'outdoor-work', name: 'Outdoor Work', icon: '☀️' },
  { id: 'height-work', name: 'Height Work', icon: '🧗' },
  { id: 'flexible-hours', name: 'Flexible Hours', icon: '⏰' }
];

// ====== NEW: SALARY RANGES ======
export const salaryRanges = [
  { id: 'daily-500', name: '₹500-800 per day' },
  { id: 'daily-800', name: '₹800-1200 per day' },
  { id: 'daily-1200', name: '₹1200-2000 per day' },
  { id: 'monthly-15k', name: '₹15,000-25,000 monthly' },
  { id: 'monthly-25k', name: '₹25,000-40,000 monthly' },
  { id: 'negotiable', name: 'Negotiable' },
  { id: 'piece-rate', name: 'Piece Rate/Payment' }
];

// ====== NEW: BENEFITS ======
export const benefits = [
  { id: 'esi-pf', name: 'ESI/PF', icon: '🏥' },
  { id: 'overtime', name: 'Overtime Pay', icon: '💵' },
  { id: 'bonus', name: 'Performance Bonus', icon: '💰' },
  { id: 'transport', name: 'Transport Allowance', icon: '🚌' },
  { id: 'food', name: 'Food Provided', icon: '🍛' },
  { id: 'uniform', name: 'Uniform Provided', icon: '👕' },
  { id: 'insurance', name: 'Insurance', icon: '🛡️' }
];

// ====== HELPER FUNCTIONS ======
export const getCategoryById = (id) => {
  return jobCategories.find(category => category.id === id) || jobCategories[0];
};

export const getSeasonalCategory = (id) => {
  return seasonalCategories.find(cat => cat.id === id);
};

export const getDriverCategory = (id) => {
  return driverCategories.find(cat => cat.id === id);
};

export const getSubcategories = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category?.subcategories || [];
};

export const isSeasonalWork = (categoryId) => {
  const seasonalIds = seasonalCategories.map(cat => cat.id);
  return seasonalIds.includes(categoryId);
};

// ====== NEW: VALIDATION HELPERS ======
export const validateJobCategory = (categoryId) => {
  const validIds = jobCategories.map(cat => cat.id);
  return validIds.includes(categoryId);
};

export const getAllSubcategories = () => {
  return jobCategories.flatMap(category => 
    category.subcategories.map(sub => ({
      id: `${category.id}-${sub.toLowerCase().replace(/\s+/g, '-')}`,
      name: sub,
      category: category.name,
      categoryId: category.id
    }))
  );
};

export const getCategoryBySubcategory = (subcategoryName) => {
  return jobCategories.find(category => 
    category.subcategories.includes(subcategoryName)
  );
};

// ====== NEW: SEARCH INDEX ======
export const createSearchIndex = () => {
  const index = [];
  
  jobCategories.forEach(category => {
    index.push({
      type: 'category',
      id: category.id,
      name: category.name,
      description: category.description,
      searchTerms: [
        category.name,
        ...category.name.split(' '),
        ...category.description.split(' '),
        ...category.subcategories
      ]
    });
    
    category.subcategories.forEach(sub => {
      index.push({
        type: 'subcategory',
        id: `${category.id}-${sub.toLowerCase().replace(/\s+/g, '-')}`,
        name: sub,
        category: category.name,
        categoryId: category.id,
        searchTerms: [
          sub,
          ...sub.split(' '),
          category.name
        ]
      });
    });
  });
  
  return index;
};

// ====== NEW: STATISTICS ======
export const getCategoryStats = (jobsData) => {
  const stats = {};
  
  jobCategories.forEach(category => {
    const categoryJobs = jobsData.filter(job => job.category === category.id);
    stats[category.id] = {
      total: categoryJobs.length,
      subcategories: {}
    };
    
    category.subcategories.forEach(sub => {
      const subJobs = categoryJobs.filter(job => job.subcategory === sub);
      stats[category.id].subcategories[sub] = subJobs.length;
    });
  });
  
  return stats;
};

// ====== NEW: FILTERING FUNCTIONS ======
export const filterJobsByCategory = (jobs, categoryId) => {
  return jobs.filter(job => job.category === categoryId);
};

export const getJobsByExperience = (jobs, experienceLevel) => {
  return jobs.filter(job => job.experience === experienceLevel);
};

// ====== NEW: UTILITY FUNCTIONS ======
export const getIconForCategory = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category?.icon || '💼';
};

export const getColorForCategory = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category?.color || 'bg-gray-100 text-gray-800 border-gray-300';
};

export const getAllCategoriesWithCounts = (jobs = []) => {
  return jobCategories.map(category => {
    const jobCount = jobs.filter(job => job.category === category.id).length;
    return {
      ...category,
      jobCount
    };
  });
};

// Export all
export default {
  jobCategories,
  seasonalCategories,
  driverCategories,
  workTypes,
  experienceLevels,
  educationLevels,
  genderPreferences,
  accommodationOptions,
  locationTypes,
  languageRequirements,
  physicalRequirements,
  salaryRanges,
  benefits,
  getCategoryById,
  getSeasonalCategory,
  getDriverCategory,
  getSubcategories,
  isSeasonalWork,
  validateJobCategory,
  getAllSubcategories,
  getCategoryBySubcategory,
  createSearchIndex,
  getCategoryStats,
  filterJobsByCategory,
  getJobsByExperience,
  getIconForCategory,
  getColorForCategory,
  getAllCategoriesWithCounts
};