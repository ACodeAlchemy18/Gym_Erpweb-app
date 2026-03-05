'use client';

export interface OwnerGym {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  city: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  radius: number;
  image: string;
  facilities: string[];
  equipment: string[];
  features: string[];
  operatingHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  staffCount: number;
  trainerCount: number;
  memberCount: number;
  pricing: {
    weekly: number;
    monthly: number;
    quarterly: number;
    halfYearly: number;
    yearly: number;
  };
  amenities: string[];
  phone: string;
  email: string;
  website: string;
  createdAt: string;
}

// Store gyms in localStorage per owner
export function getOwnerGyms(ownerId: string): OwnerGym[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`owner_gyms_${ownerId}`);
  return stored ? JSON.parse(stored) : [];
}

export function addOwnerGym(ownerId: string, gym: Omit<OwnerGym, 'id' | 'createdAt' | 'ownerId'>): OwnerGym {
  const newGym: OwnerGym = {
    ...gym,
    id: `gym_${Date.now()}`,
    ownerId,
    createdAt: new Date().toISOString(),
  };

  const gyms = getOwnerGyms(ownerId);
  gyms.push(newGym);
  localStorage.setItem(`owner_gyms_${ownerId}`, JSON.stringify(gyms));
  return newGym;
}

export function updateOwnerGym(ownerId: string, gymId: string, updates: Partial<OwnerGym>): OwnerGym | null {
  const gyms = getOwnerGyms(ownerId);
  const index = gyms.findIndex(g => g.id === gymId);
  
  if (index === -1) return null;
  
  gyms[index] = { ...gyms[index], ...updates };
  localStorage.setItem(`owner_gyms_${ownerId}`, JSON.stringify(gyms));
  return gyms[index];
}

export function deleteOwnerGym(ownerId: string, gymId: string): boolean {
  const gyms = getOwnerGyms(ownerId);
  const filtered = gyms.filter(g => g.id !== gymId);
  
  if (filtered.length === gyms.length) return false;
  
  localStorage.setItem(`owner_gyms_${ownerId}`, JSON.stringify(filtered));
  return true;
}

const ALL_OWNER_GYMS: { [key: string]: OwnerGym[] } = {
  // Example data
  owner1: [
    {
      id: 'gym1',
      ownerId: 'owner1',
      name: 'Gym 1',
      description: 'Description of Gym 1',
      city: 'City 1',
      address: 'Address 1',
      coordinates: { lat: 1, lng: 1 },
      radius: 100,
      image: 'image1.jpg',
      facilities: ['Facility 1'],
      equipment: ['Equipment 1'],
      features: ['Feature 1'],
      operatingHours: {
        monday: { open: '9:00', close: '17:00' },
        tuesday: { open: '9:00', close: '17:00' },
        wednesday: { open: '9:00', close: '17:00' },
        thursday: { open: '9:00', close: '17:00' },
        friday: { open: '9:00', close: '17:00' },
        saturday: { open: '9:00', close: '17:00' },
        sunday: { open: '9:00', close: '17:00' },
      },
      staffCount: 10,
      trainerCount: 5,
      memberCount: 200,
      pricing: {
        weekly: 50,
        monthly: 200,
        quarterly: 500,
        halfYearly: 1000,
        yearly: 2000,
      },
      amenities: ['Amenity 1'],
      phone: '123-456-7890',
      email: 'gym1@example.com',
      website: 'http://gym1.example.com',
      createdAt: new Date().toISOString(),
    },
  ],
  // Add more owners and gyms as needed
};

export function getOwnerGymById(ownerIdOrGymId: string, gymId?: string): OwnerGym | null {
  // Handle both cases: getOwnerGymById(ownerId, gymId) and getOwnerGymById(gymId)
  if (gymId) {
    // Two parameters: looking up specific owner's gym
    const gyms = getOwnerGyms(ownerIdOrGymId);
    return gyms.find(g => g.id === gymId) || null;
  } else {
    // Single parameter: search all owners for this gym (used by trainer dashboard)
    if (typeof window === 'undefined') return null;
    
    // Check localStorage for all owner keys
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith('owner_gyms_')) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const gyms: OwnerGym[] = JSON.parse(stored);
          const found = gyms.find(g => g.id === ownerIdOrGymId);
          if (found) return found;
        }
      }
    }
    return null;
  }
}

export function getAllOwnerGyms(): OwnerGym[] {
  const gyms = localStorage.getItem("owner_gyms");
  return gyms ? JSON.parse(gyms) : [];
}
