// ============================================================
// TRAINER REGISTRY
// Global store of all registered trainers.
// Each trainer has a unique human-readable trainerId (like TRN-001)
// that owners can use to search and add them.
// ============================================================

export interface RegisteredTrainer {
  id: string;          // internal system id e.g. 'trainer_1'
  trainerId: string;   // human-readable public ID e.g. 'TRN-001' shown on trainer dashboard
  name: string;
  email: string;
  avatar: string;
  specialization: string;
  yearsExperience: number;
  hourlyRate: number;
  rating: number;
  certifications: string;
  bio: string;
  city: string;
  phone: string;
  availability: string;
}

let TRAINER_REGISTRY: RegisteredTrainer[] = [
  {
    id: 'trainer_1',
    trainerId: 'TRN-001',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
    specialization: 'Strength Training',
    yearsExperience: 5,
    hourlyRate: 50,
    rating: 4.8,
    certifications: 'ACE, NASM, ISSA',
    bio: 'Passionate strength coach helping clients build muscle and boost confidence.',
    city: 'Mumbai',
    phone: '+91-9876500001',
    availability: 'Mon-Sat, 6AM-9PM',
  },
  {
    id: 'trainer_2',
    trainerId: 'TRN-002',
    name: 'Priya Patel',
    email: 'priya@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    specialization: 'Yoga & Flexibility',
    yearsExperience: 8,
    hourlyRate: 45,
    rating: 4.9,
    certifications: 'RYT-200, Yoga Alliance',
    bio: 'Bringing calm and flexibility to every practice. Specialised in Hatha and Vinyasa yoga.',
    city: 'Bangalore',
    phone: '+91-9876500002',
    availability: 'Mon-Sun, 7AM-7PM',
  },
  {
    id: 'trainer_3',
    trainerId: 'TRN-003',
    name: 'Amit Verma',
    email: 'amit@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
    specialization: 'CrossFit',
    yearsExperience: 6,
    hourlyRate: 55,
    rating: 4.7,
    certifications: 'CrossFit Level 2, NASM',
    bio: 'High-intensity training specialist. Helping athletes push their limits every day.',
    city: 'Delhi',
    phone: '+91-9876500003',
    availability: 'Mon-Fri, 5AM-10PM',
  },
  {
    id: 'trainer_4',
    trainerId: 'TRN-004',
    name: 'Neha Singh',
    email: 'neha@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neha',
    specialization: 'Cardio & Weight Loss',
    yearsExperience: 4,
    hourlyRate: 40,
    rating: 4.6,
    certifications: 'ACE-CPT, Zumba Certified',
    bio: 'Fun, energetic cardio sessions that make fitness feel like a party.',
    city: 'Pune',
    phone: '+91-9876500004',
    availability: 'Tue-Sun, 6AM-8PM',
  },
  {
    id: 'trainer_5',
    trainerId: 'TRN-005',
    name: 'Vikram Nair',
    email: 'vikram@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram',
    specialization: 'Sports Performance',
    yearsExperience: 10,
    hourlyRate: 70,
    rating: 4.9,
    certifications: 'CSCS, NSCA, Sports Nutrition Diploma',
    bio: 'Former national-level athlete now dedicated to coaching the next generation of champions.',
    city: 'Chennai',
    phone: '+91-9876500005',
    availability: 'Mon-Sat, 7AM-8PM',
  },
];

/** Get all trainers */
export function getAllRegisteredTrainers(): RegisteredTrainer[] {
  return [...TRAINER_REGISTRY];
}

/** Get by internal id */
export function getRegisteredTrainerById(id: string): RegisteredTrainer | null {
  return TRAINER_REGISTRY.find(t => t.id === id) || null;
}

/** 
 * Get by human-readable trainerId (e.g. 'TRN-001').
 * Case-insensitive search so owners can type 'trn-001' or 'TRN001'.
 */
export function getTrainerByPublicId(publicId: string): RegisteredTrainer | null {
  const normalized = publicId.replace(/[-\s]/g, '').toUpperCase();
  return TRAINER_REGISTRY.find(t => {
    const tNorm = t.trainerId.replace(/[-\s]/g, '').toUpperCase();
    return tNorm === normalized;
  }) || null;
}

/** Get trainers not yet assigned to a gym */
export function getAvailableTrainersForGym(assignedIds: string[]): RegisteredTrainer[] {
  return TRAINER_REGISTRY.filter(t => !assignedIds.includes(t.id));
}

/** Register a new trainer (called post-onboarding) */
export function registerTrainer(trainer: RegisteredTrainer): void {
  const exists = TRAINER_REGISTRY.some(t => t.id === trainer.id);
  if (!exists) TRAINER_REGISTRY.push(trainer);
}

/** Search by name or trainerId (partial match, case-insensitive) */
export function searchTrainers(query: string): RegisteredTrainer[] {
  const q = query.toLowerCase().trim();
  if (!q) return [...TRAINER_REGISTRY];
  return TRAINER_REGISTRY.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.trainerId.toLowerCase().includes(q) ||
    t.specialization.toLowerCase().includes(q) ||
    t.city.toLowerCase().includes(q)
  );
}
