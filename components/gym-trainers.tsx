"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/user-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Star, Award, DollarSign, Lock, Eye, CheckCircle2, AlertCircle, Users } from "lucide-react";
import { addBooking, PLAN_META, type BookingPlan } from "@/data/trainer-booking-store";

interface Trainer {
  id: string; name: string; experience?: string; yearsExperience?: number;
  specialization: string; image?: string; avatar?: string;
  gymSlug: string; gymId: string; rating?: number; hourlyRate?: number; certifications?: string;
}

const DUMMY_GYM_PEOPLE: Record<string, number> = {
  '1': 34, '2': 21, '3': 47, '4': 12, '5': 28,
};
function getPeopleCount(gymId: string): number {
  return DUMMY_GYM_PEOPLE[gymId] ?? Math.floor(Math.random() * 40 + 10);
}

export default function GymTrainers({ trainers, gymId, gymSlug }: {
  trainers: Trainer[]; gymId: string; gymSlug: string;
}) {
  const { isAuthenticated } = useAuth();
  const { subscriptions } = useUser();
  const { user } = useAuth();

  const hasSubscription = isAuthenticated && subscriptions.some(
    s => s.gymId === gymId && (s.status === "active" || s.status === "pending_checkin")
  );

  const [bookingTrainer, setBookingTrainer] = useState<Trainer | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<BookingPlan | null>(null);
  const [bookingResult, setBookingResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirming, setConfirming] = useState(false);

  const gymName = subscriptions.find(s => s.gymId === gymId)?.gymName || gymId;
  const peopleCount = getPeopleCount(gymId);

  const openBooking = (trainer: Trainer) => {
    setBookingTrainer(trainer);
    setSelectedPlan(null);
    setBookingResult(null);
    setConfirming(false);
  };

  const handleConfirm = () => {
    if (!selectedPlan || !bookingTrainer || !user) return;
    const rate = bookingTrainer.hourlyRate ?? 50;
    const result = addBooking({
      userId: user.id,
      trainerId: bookingTrainer.id,
      trainerName: bookingTrainer.name,
      trainerAvatar: bookingTrainer.avatar || bookingTrainer.image || '/placeholder-user.jpg',
      trainerSpecialization: bookingTrainer.specialization,
      gymId, gymName, gymSlug,
      plan: selectedPlan,
      hourlyRate: rate,
    });
    setBookingResult({ type: result.success ? 'success' : 'error', text: result.message });
    if (result.success) setTimeout(() => { setBookingTrainer(null); setBookingResult(null); }, 2500);
  };

  if (!trainers || trainers.length === 0) {
    return <div className="text-center py-10 text-muted-foreground"><p>No trainers available for this gym yet.</p></div>;
  }

  return (
    <div id="trainers" className="space-y-4">
      {/* Live people count */}
      <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <Users className="h-4 w-4 text-green-500" />
        <p className="text-sm text-foreground font-medium">
          <span className="text-green-500 font-bold">{peopleCount}</span> people currently at the gym
        </p>
      </div>

      {/* Subscription prompt */}
      {!hasSubscription && (
        <div className="flex items-center justify-between gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-yellow-500 shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm">Subscribe to unlock trainer booking</p>
              <p className="text-xs text-muted-foreground">Get a membership to view profiles & book sessions</p>
            </div>
          </div>
          <a href={`/gym/${gymSlug}#pricing`}>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">View Plans</Button>
          </a>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trainers.map((trainer) => {
          const photo = trainer.avatar || trainer.image || "/placeholder-user.jpg";
          const exp = trainer.experience || (trainer.yearsExperience ? `${trainer.yearsExperience} years` : null);
          const profileUrl = `/gym/${gymSlug}/trainers/${trainer.id}`;
          const rate = trainer.hourlyRate ?? 50;

          return (
            <Card key={trainer.id} className={`border-border/50 overflow-hidden transition-all ${hasSubscription ? "hover:border-primary/50 group" : "opacity-90"}`}>
              <div className="relative h-44 overflow-hidden bg-secondary">
                <img src={photo} alt={trainer.name}
                  className={`w-full h-full object-cover transition-transform duration-300 ${hasSubscription ? "group-hover:scale-105" : "brightness-75"}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                {!hasSubscription && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-background/70 backdrop-blur-sm rounded-full p-3">
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                )}
                {trainer.rating && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold">{trainer.rating}</span>
                  </div>
                )}
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{trainer.name}</h3>
                  <Badge className="mt-1 bg-primary/20 text-primary text-xs">{trainer.specialization}</Badge>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {exp && <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5 text-primary" />{exp} exp</span>}
                  {hasSubscription
                    ? <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5 text-green-500" />₹{rate}/hr</span>
                    : <span className="flex items-center gap-1 blur-sm select-none"><DollarSign className="h-3.5 w-3.5" />₹XX/hr</span>
                  }
                </div>
                {trainer.certifications && (
                  <p className="text-xs text-muted-foreground truncate">
                    🏅 {hasSubscription ? trainer.certifications : "Subscribe to view"}
                  </p>
                )}

                <div className="pt-1 border-t border-border/50">
                  {hasSubscription ? (
                    <div className="flex gap-2">
                      {/* View Profile — goes to full page */}
                      <Link href={profileUrl} className="flex-1">
                        <Button variant="outline" className="w-full border-border bg-transparent text-xs gap-1">
                          <Eye className="h-3.5 w-3.5" />View Profile
                        </Button>
                      </Link>
                      {/* Book — opens inline dialog */}
                      <Button
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                        onClick={() => openBooking(trainer)}
                      >
                        Book
                      </Button>
                    </div>
                  ) : (
                    <a href={`/gym/${gymSlug}#pricing`} className="block">
                      <Button variant="outline" className="w-full border-border bg-transparent text-xs gap-1 text-muted-foreground">
                        <Lock className="h-3.5 w-3.5" />Subscribe to View & Book
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── BOOKING DIALOG ── */}
      <Dialog open={!!bookingTrainer} onOpenChange={open => { if (!open) { setBookingTrainer(null); setBookingResult(null); } }}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Book Trainer</DialogTitle>
            <DialogDescription>Choose a session plan to book with {bookingTrainer?.name}</DialogDescription>
          </DialogHeader>

          {!bookingResult ? (
            !confirming ? (
              /* Plan selection */
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <img src={bookingTrainer?.avatar || bookingTrainer?.image || '/placeholder-user.jpg'}
                    alt={bookingTrainer?.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div>
                    <p className="font-semibold text-foreground">{bookingTrainer?.name}</p>
                    <p className="text-sm text-muted-foreground">{bookingTrainer?.specialization} · ₹{bookingTrainer?.hourlyRate ?? 50}/hr</p>
                  </div>
                </div>

                <p className="text-sm font-medium text-foreground">Select a plan:</p>
                <div className="space-y-2">
                  {(Object.entries(PLAN_META) as [BookingPlan, typeof PLAN_META[BookingPlan]][]).map(([plan, meta]) => {
                    const rate = bookingTrainer?.hourlyRate ?? 50;
                    return (
                      <button key={plan} onClick={() => setSelectedPlan(plan)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedPlan === plan
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground text-sm">{meta.label}</p>
                            <p className="text-xs text-muted-foreground">{meta.sessions} session{meta.sessions > 1 ? 's' : ''}</p>
                          </div>
                          <p className="font-bold text-primary">₹{rate * meta.multiplier}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 border-border bg-transparent" onClick={() => setBookingTrainer(null)}>Cancel</Button>
                  <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={!selectedPlan} onClick={() => setConfirming(true)}>
                    Continue
                  </Button>
                </div>
              </div>
            ) : (
              /* Confirm screen */
              <div className="space-y-4">
                {selectedPlan && (() => {
                  const meta = PLAN_META[selectedPlan];
                  const rate = bookingTrainer?.hourlyRate ?? 50;
                  return (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Trainer</span><span className="font-medium">{bookingTrainer?.name}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Plan</span><span className="font-medium">{meta.label}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Sessions</span><span className="font-medium">{meta.sessions}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Gym</span><span className="font-medium">{gymName}</span></div>
                      <div className="flex justify-between font-bold border-t border-border/50 pt-2">
                        <span>Total</span><span className="text-primary">₹{rate * meta.multiplier}</span>
                      </div>
                    </div>
                  );
                })()}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-border bg-transparent" onClick={() => setConfirming(false)}>Back</Button>
                  <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleConfirm}>Confirm Booking</Button>
                </div>
              </div>
            )
          ) : (
            /* Result */
            <div className="py-6 text-center">
              {bookingResult.type === 'success'
                ? <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-4" />
                : <AlertCircle className="h-14 w-14 text-destructive mx-auto mb-4" />}
              <p className={`font-semibold text-lg mb-2 ${bookingResult.type === 'success' ? 'text-green-500' : 'text-destructive'}`}>
                {bookingResult.type === 'success' ? 'Booking Confirmed! 🎉' : 'Booking Failed'}
              </p>
              <p className="text-muted-foreground text-sm mb-4">{bookingResult.text}</p>
              {bookingResult.type === 'success' && (
                <Link href="/subscriptions">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">View My Dashboard</Button>
                </Link>
              )}
              {bookingResult.type === 'error' && (
                <Button className="bg-primary text-primary-foreground" onClick={() => setBookingResult(null)}>Try Again</Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
