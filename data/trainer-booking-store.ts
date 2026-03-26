// ─────────────────────────────────────────────────────────────────────────────
// TRAINER BOOKING STORE
// Module-level singleton so bookings are shared across all pages in the session
// ─────────────────────────────────────────────────────────────────────────────

export type BookingPlan = 'hourly' | 'weekly' | 'monthly';
export type BookingStatus = 'confirmed' | 'cancelled';

export interface TrainerBooking {
  id: string;
  userId: string;
  trainerId: string;
  trainerName: string;
  trainerAvatar: string;
  trainerSpecialization: string;
  gymId: string;
  gymName: string;
  gymSlug: string;
  plan: BookingPlan;
  sessions: number;
  amount: number;
  bookedAt: string;
  status: BookingStatus;
}

export const PLAN_META: Record<BookingPlan, { label: string; sessions: number; multiplier: number }> = {
  hourly:  { label: 'Hourly Session',    sessions: 1,  multiplier: 1  },
  weekly:  { label: 'Weekly Package',    sessions: 5,  multiplier: 5  },
  monthly: { label: 'Monthly Package',   sessions: 20, multiplier: 20 },
};

// THE SHARED STORE
const store: TrainerBooking[] = [];

export function getAllBookings(): TrainerBooking[] {
  return [...store];
}

export function getUserBookings(userId: string): TrainerBooking[] {
  return store.filter(b => b.userId === userId && b.status === 'confirmed')
    .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime());
}

export function getBookingsByGym(userId: string, gymId: string): TrainerBooking[] {
  return getUserBookings(userId).filter(b => b.gymId === gymId);
}

export function hasActiveBooking(userId: string, trainerId: string, plan: BookingPlan): boolean {
  return store.some(b => b.userId === userId && b.trainerId === trainerId && b.plan === plan && b.status === 'confirmed');
}

export function addBooking(params: {
  userId: string;
  trainerId: string;
  trainerName: string;
  trainerAvatar: string;
  trainerSpecialization: string;
  gymId: string;
  gymName: string;
  gymSlug: string;
  plan: BookingPlan;
  hourlyRate: number;
}): { success: boolean; message: string; booking?: TrainerBooking } {
  if (hasActiveBooking(params.userId, params.trainerId, params.plan)) {
    return { success: false, message: `You already have an active ${params.plan} booking with this trainer.` };
  }
  const meta = PLAN_META[params.plan];
  const booking: TrainerBooking = {
    id: `tbk_${Date.now()}`,
    userId: params.userId,
    trainerId: params.trainerId,
    trainerName: params.trainerName,
    trainerAvatar: params.trainerAvatar,
    trainerSpecialization: params.trainerSpecialization,
    gymId: params.gymId,
    gymName: params.gymName,
    gymSlug: params.gymSlug,
    plan: params.plan,
    sessions: meta.sessions,
    amount: params.hourlyRate * meta.multiplier,
    bookedAt: new Date().toISOString(),
    status: 'confirmed',
  };
  store.push(booking);
  return { success: true, message: `${meta.label} booked with ${params.trainerName}!`, booking };
}

export function cancelBooking(bookingId: string): boolean {
  const b = store.find(x => x.id === bookingId);
  if (!b) return false;
  b.status = 'cancelled';
  return true;
}
