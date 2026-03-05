import { gyms } from "./gyms";

/* -------------------------------------------------------------------------- */
/*                                ASSOCIATION                                 */
/* -------------------------------------------------------------------------- */

export interface TrainerGym {
  id: string;
  trainerId: string;
  gymId: string;
  joinDate: string;
  status: "active" | "inactive";
}

/* -------------------------------------------------------------------------- */
/*                                TRAINER TYPE                                */
/* -------------------------------------------------------------------------- */

export interface Trainer {
  id: string;
  name: string;
  email: string;
  image: string;
  specialization: string;
  yearsExperience: number;
  hourlyRate: number;
  rating: number;
  certifications: string;

  // ⭐ UI helper fields (added dynamically)
  gymSlug?: string;
  experience?: string;
}

/* -------------------------------------------------------------------------- */
/*                               DUMMY MAPPING                                */
/* -------------------------------------------------------------------------- */

const TRAINER_GYM_ASSOCIATIONS: TrainerGym[] = [
  {
    id: "tg_1",
    trainerId: "trainer_1",
    gymId: "1",
    joinDate: "2024-01-15",
    status: "active",
  },
  {
    id: "tg_2",
    trainerId: "trainer_2",
    gymId: "1",
    joinDate: "2024-02-10",
    status: "active",
  },
  {
    id: "tg_3",
    trainerId: "trainer_3",
    gymId: "2",
    joinDate: "2024-03-05",
    status: "active",
  },
];

/* -------------------------------------------------------------------------- */
/*                              TRAINERS DATABASE                             */
/* -------------------------------------------------------------------------- */

const TRAINERS_DATA: Record<string, Trainer> = {
  trainer_1: {
    id: "trainer_1",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
    specialization: "Strength Training",
    yearsExperience: 5,
    hourlyRate: 50,
    rating: 4.8,
    certifications: "ACE, NASM, ISSA",
  },
  trainer_2: {
    id: "trainer_2",
    name: "Priya Patel",
    email: "priya@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    specialization: "Yoga & Flexibility",
    yearsExperience: 8,
    hourlyRate: 45,
    rating: 4.9,
    certifications: "RYT-200, Yoga Alliance",
  },
  trainer_3: {
    id: "trainer_3",
    name: "Amit Verma",
    email: "amit@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=amit",
    specialization: "CrossFit",
    yearsExperience: 6,
    hourlyRate: 55,
    rating: 4.7,
    certifications: "CrossFit Level 2, NASM",
  },
};

/* -------------------------------------------------------------------------- */
/*                               GET FUNCTIONS                                */
/* -------------------------------------------------------------------------- */

export function getTrainerGymsByTrainerId(trainerId: string): TrainerGym[] {
  return TRAINER_GYM_ASSOCIATIONS.filter(
    (assoc) => assoc.trainerId === trainerId && assoc.status === "active"
  );
}

/**
 * ⭐ MAIN FUNCTION FOR GYM PAGE
 */
export function getTrainersByGymId(gymId: string): Trainer[] {
  if (!gyms || gyms.length === 0) return [];

  const gym = gyms.find((g) => g.id === gymId);
  if (!gym) return [];


  const trainerIds = TRAINER_GYM_ASSOCIATIONS.filter(
    (assoc) => assoc.gymId === gymId && assoc.status === "active"
  ).map((assoc) => assoc.trainerId);

  return trainerIds.map((id) => {
    const trainer = TRAINERS_DATA[id];

    if (!trainer) return null;

    return {
      ...trainer,
      gymSlug: gym?.slug || "",
      experience: `${trainer.yearsExperience} years`,
    };
  }).filter(Boolean) as Trainer[];
}

/**
 * ⭐ FOR PROFILE PAGE
 */
export function getTrainerById(
  trainerId: string,
  gymId: string
): Trainer | null {
  const trainer = TRAINERS_DATA[trainerId];
  const gym = gyms.find((g) => g.id === gymId);

  if (!trainer) return null;

  return {
    ...trainer,
    gymSlug: gym?.slug || "",
    experience: `${trainer.yearsExperience} years`,
  };
}

/* -------------------------------------------------------------------------- */
/*                             ADMIN / OWNER SIDE                             */
/* -------------------------------------------------------------------------- */

export function associateTrainerWithGym(
  trainerId: string,
  gymId: string
): TrainerGym {
  const newAssociation: TrainerGym = {
    id: `tg_${Date.now()}`,
    trainerId,
    gymId,
    joinDate: new Date().toISOString().split("T")[0],
    status: "active",
  };

  TRAINER_GYM_ASSOCIATIONS.push(newAssociation);
  return newAssociation;
}

export function updateTrainerGymAssociation(
  associationId: string,
  status: "active" | "inactive"
): void {
  const index = TRAINER_GYM_ASSOCIATIONS.findIndex(
    (a) => a.id === associationId
  );

  if (index !== -1) {
    TRAINER_GYM_ASSOCIATIONS[index].status = status;
  }
}

/** Remove a trainer from a gym by setting their association to inactive */
export function removeTrainerFromGym(trainerId: string, gymId: string): boolean {
  const assoc = TRAINER_GYM_ASSOCIATIONS.find(
    (a) => a.trainerId === trainerId && a.gymId === gymId && a.status === "active"
  );
  if (!assoc) return false;
  assoc.status = "inactive";
  return true;
}

/** Get all trainerIds currently active in a gym */
export function getActiveTrainerIdsForGym(gymId: string): string[] {
  return TRAINER_GYM_ASSOCIATIONS.filter(
    (a) => a.gymId === gymId && a.status === "active"
  ).map((a) => a.trainerId);
}

/** Check if a trainer is already in a specific gym */
export function isTrainerInGym(trainerId: string, gymId: string): boolean {
  return TRAINER_GYM_ASSOCIATIONS.some(
    (a) => a.trainerId === trainerId && a.gymId === gymId && a.status === "active"
  );
}
