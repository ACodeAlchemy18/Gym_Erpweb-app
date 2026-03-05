// ============================================================
// TRAINER BOOKINGS
// Stores bookings made by users for specific trainers.
// ============================================================

export type BookingPlan = 'hourly' | 'weekly' | 'monthly';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface TrainerBooking {
  id: string;
  userId: string;
  userName: string;
  trainerId: string;
  trainerName: string;
  gymId: string;
  gymName: string;
  gymSlug: string;
  plan: BookingPlan;
  amount: number;
  bookedAt: string; // ISO date string
  scheduledDate: string; // ISO date string
  status: BookingStatus;
  notes?: string;
}

const PLAN_RATES: Record<BookingPlan, { label: string; multiplier: number }> = {
  hourly: { label: 'Hourly Session', multiplier: 1 },
  weekly: { label: 'Weekly Package (5 sessions)', multiplier: 5 },
  monthly: { label: 'Monthly Package (20 sessions)', multiplier: 20 },
};

// In-memory store
let BOOKINGS: TrainerBooking[] = [];

/** Book a trainer */
export function bookTrainer(params: {
  userId: string;
  userName: string;
  trainerId: string;
  trainerName: string;
  gymId: string;
  gymName: string;
  gymSlug: string;
  plan: BookingPlan;
  hourlyRate: number;
  scheduledDate?: string;
}): { success: boolean; message: string; booking?: TrainerBooking } {
  // Check for duplicate pending/confirmed booking for same trainer + user + plan
  const existing = BOOKINGS.find(
    b =>
      b.userId === params.userId &&
      b.trainerId === params.trainerId &&
      b.plan === params.plan &&
      b.status !== 'cancelled'
  );

  if (existing) {
    return {
      success: false,
      message: `You already have an active ${params.plan} booking with this trainer.`,
    };
  }

  const multiplier = PLAN_RATES[params.plan].multiplier;
  const amount = params.hourlyRate * multiplier;

  const booking: TrainerBooking = {
    id: `booking_${Date.now()}`,
    userId: params.userId,
    userName: params.userName,
    trainerId: params.trainerId,
    trainerName: params.trainerName,
    gymId: params.gymId,
    gymName: params.gymName,
    gymSlug: params.gymSlug,
    plan: params.plan,
    amount,
    bookedAt: new Date().toISOString(),
    scheduledDate: params.scheduledDate || new Date().toISOString(),
    status: 'confirmed',
  };

  BOOKINGS.push(booking);

  return {
    success: true,
    message: `${PLAN_RATES[params.plan].label} booked successfully with ${params.trainerName}!`,
    booking,
  };
}

/** Get all bookings for a user */
export function getUserBookings(userId: string): TrainerBooking[] {
  return BOOKINGS.filter(b => b.userId === userId).sort(
    (a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
  );
}

/** Get all bookings for a trainer */
export function getTrainerBookings(trainerId: string): TrainerBooking[] {
  return BOOKINGS.filter(b => b.trainerId === trainerId).sort(
    (a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
  );
}

/** Cancel a booking */
export function cancelBooking(bookingId: string, userId: string): { success: boolean; message: string } {
  const booking = BOOKINGS.find(b => b.id === bookingId && b.userId === userId);
  if (!booking) return { success: false, message: 'Booking not found.' };
  if (booking.status === 'cancelled') return { success: false, message: 'Booking already cancelled.' };
  booking.status = 'cancelled';
  return { success: true, message: 'Booking cancelled successfully.' };
}

/** Get human-readable plan label */
export function getPlanLabel(plan: BookingPlan): string {
  return PLAN_RATES[plan].label;
}

/** Get plan amount given hourly rate */
export function getPlanAmount(plan: BookingPlan, hourlyRate: number): number {
  return hourlyRate * PLAN_RATES[plan].multiplier;
}
