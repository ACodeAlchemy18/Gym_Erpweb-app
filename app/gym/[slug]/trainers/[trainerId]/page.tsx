'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { useUser } from '@/contexts/user-context';
import { useAuth } from '@/contexts/auth-context';
import { getGymBySlug } from '@/data/gyms';
import { getTrainersByGymId } from '@/data/trainer-gyms';
import { getRegisteredTrainerById } from '@/data/trainer-registry';
import { addBooking, PLAN_META, type BookingPlan } from '@/data/trainer-booking-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ArrowLeft, Star, Award, Clock, DollarSign, Mail, Phone,
  MapPin, CheckCircle2, AlertCircle, Calendar, Zap, IdCard, Lock,
} from 'lucide-react';

export default function TrainerProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const trainerId = params.trainerId as string;
  const { subscriptions } = useUser();
  const { user, isAuthenticated } = useAuth();

  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<BookingPlan | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const gym = getGymBySlug(slug);
  if (!gym) return (
    <div className="min-h-screen bg-background"><Header />
      <div className="flex items-center justify-center h-96"><p className="text-muted-foreground">Gym not found.</p></div>
    </div>
  );

  const richTrainer = getRegisteredTrainerById(trainerId);
  const basicTrainer = getTrainersByGymId(gym.id).find(t => t.id === trainerId);
  const trainer = richTrainer || basicTrainer;

  if (!trainer) return (
    <div className="min-h-screen bg-background"><Header />
      <div className="flex items-center justify-center h-96"><p className="text-muted-foreground">Trainer not found.</p></div>
    </div>
  );

  const hasActiveSubscription = isAuthenticated && subscriptions.some(
    s => s.gymId === gym.id && (s.status === 'active' || s.status === 'pending_checkin')
  );

  const hourlyRate = richTrainer?.hourlyRate ?? (basicTrainer as any)?.hourlyRate ?? 50;
  const avatar = richTrainer?.avatar ?? (basicTrainer as any)?.image ?? '/placeholder-user.jpg';
  const rating = richTrainer?.rating ?? (basicTrainer as any)?.rating ?? 4.8;
  const yearsExp = richTrainer?.yearsExperience ?? (basicTrainer as any)?.yearsExperience ?? 5;

  const openBookingDialog = () => {
    setSelectedPlan(null);
    setConfirming(false);
    setBookingResult(null);
    setBookingDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedPlan || !user) return;
    const result = addBooking({
      userId: user.id,
      trainerId: trainer.id,
      trainerName: trainer.name,
      trainerAvatar: avatar,
      trainerSpecialization: trainer.specialization,
      gymId: gym.id,
      gymName: gym.name,
      gymSlug: gym.slug,
      plan: selectedPlan,
      hourlyRate,
    });
    setBookingResult({ type: result.success ? 'success' : 'error', text: result.message });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href={`/gym/${slug}`}>
          <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />Back to {gym.name}
          </Button>
        </Link>

        {/* Profile Hero */}
        <Card className="border-border/50 mb-8 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-primary/60 to-primary/20" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img src={avatar} alt={trainer.name} className="w-36 h-36 rounded-2xl object-cover border-2 border-border shrink-0" />
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{trainer.name}</h1>
                    <Badge className="mt-1 bg-primary/20 text-primary text-sm">{trainer.specialization}</Badge>
                    {richTrainer?.trainerId && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <IdCard className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-mono font-bold text-primary">{richTrainer.trainerId}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-1.5 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-foreground">{rating}</span>
                    <span className="text-muted-foreground text-sm">rating</span>
                  </div>
                </div>
                {richTrainer?.bio && <p className="text-muted-foreground leading-relaxed mb-4">{richTrainer.bio}</p>}
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Award className="h-4 w-4 text-primary" />{yearsExp} years experience</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground"><DollarSign className="h-4 w-4 text-green-500" />₹{hourlyRate}/hour</span>
                  {richTrainer?.city && <span className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />{richTrainer.city}</span>}
                  {richTrainer?.availability && <span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-4 w-4 text-primary" />{richTrainer.availability}</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Details */}
          <div className="md:col-span-2 space-y-6">
            {richTrainer?.certifications && (
              <Card className="border-border/50">
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Award className="h-5 w-5 text-primary" />Certifications</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {richTrainer.certifications.split(',').map(c => <Badge key={c.trim()} variant="secondary">{c.trim()}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            )}
            {richTrainer && (
              <Card className="border-border/50">
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Zap className="h-5 w-5 text-primary" />Contact</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground"><Mail className="h-4 w-4" />{richTrainer.email}</div>
                  {richTrainer.phone && <div className="flex items-center gap-3 text-muted-foreground"><Phone className="h-4 w-4" />{richTrainer.phone}</div>}
                </CardContent>
              </Card>
            )}
            <Card className="border-border/50">
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MapPin className="h-5 w-5 text-primary" />Working At</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <div className="p-2 bg-primary/20 rounded-lg"><MapPin className="h-5 w-5 text-primary" /></div>
                  <div><p className="font-medium text-foreground">{gym.name}</p><p className="text-sm text-muted-foreground">{gym.city}, {gym.state}</p></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Book panel */}
          <div>
            <Card className="border-border/50 sticky top-6">
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Calendar className="h-5 w-5 text-primary" />Book This Trainer</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {!isAuthenticated ? (
                  <div className="text-center py-4">
                    <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground mb-4">Login to book this trainer</p>
                    <Link href="/login"><Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Login to Book</Button></Link>
                  </div>
                ) : !hasActiveSubscription ? (
                  <div className="text-center py-4">
                    <Lock className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">Membership Required</p>
                    <p className="text-xs text-muted-foreground mb-4">Get a membership at {gym.name} first to book trainers.</p>
                    <a href={`/gym/${slug}#pricing`}>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-2">Get Membership</Button>
                    </a>
                    <Link href="/subscriptions">
                      <Button variant="ghost" className="w-full text-xs text-muted-foreground">View My Plans</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-500/10 rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      <p className="text-sm text-green-600 dark:text-green-400">Active membership — ready to book!</p>
                    </div>
                    {(Object.entries(PLAN_META) as [BookingPlan, typeof PLAN_META[BookingPlan]][]).map(([plan, meta]) => (
                      <div key={plan} className="p-3 rounded-lg border border-border bg-secondary/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground text-sm">{meta.label}</p>
                            <p className="text-xs text-muted-foreground">{meta.sessions} session{meta.sessions > 1 ? 's' : ''}</p>
                          </div>
                          <p className="font-bold text-primary text-sm">₹{hourlyRate * meta.multiplier}</p>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2" onClick={openBookingDialog}>
                      Book This Trainer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={open => { if (!open) { setBookingDialogOpen(false); setBookingResult(null); } }}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Book {trainer.name}</DialogTitle>
            <DialogDescription>Choose a plan and confirm your booking</DialogDescription>
          </DialogHeader>

          {!bookingResult ? (
            !confirming ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <img src={avatar} alt={trainer.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div>
                    <p className="font-semibold text-foreground">{trainer.name}</p>
                    <p className="text-sm text-muted-foreground">{trainer.specialization} · ₹{hourlyRate}/hr</p>
                  </div>
                </div>
                <p className="text-sm font-medium">Select a plan:</p>
                <div className="space-y-2">
                  {(Object.entries(PLAN_META) as [BookingPlan, typeof PLAN_META[BookingPlan]][]).map(([plan, meta]) => (
                    <button key={plan} onClick={() => setSelectedPlan(plan)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${selectedPlan === plan ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground text-sm">{meta.label}</p>
                          <p className="text-xs text-muted-foreground">{meta.sessions} session{meta.sessions > 1 ? 's' : ''}</p>
                        </div>
                        <p className="font-bold text-primary">₹{hourlyRate * meta.multiplier}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-border bg-transparent" onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
                  <Button className="flex-1 bg-primary text-primary-foreground" disabled={!selectedPlan} onClick={() => setConfirming(true)}>Continue</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedPlan && (() => {
                  const meta = PLAN_META[selectedPlan];
                  return (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
                      {[['Trainer', trainer.name], ['Plan', meta.label], ['Sessions', String(meta.sessions)], ['Gym', gym.name]].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>
                      ))}
                      <div className="flex justify-between font-bold border-t border-border/50 pt-2">
                        <span>Total</span><span className="text-primary">₹{hourlyRate * meta.multiplier}</span>
                      </div>
                    </div>
                  );
                })()}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-border bg-transparent" onClick={() => setConfirming(false)}>Back</Button>
                  <Button className="flex-1 bg-primary text-primary-foreground" onClick={handleConfirm}>Confirm Booking</Button>
                </div>
              </div>
            )
          ) : (
            <div className="py-6 text-center">
              {bookingResult.type === 'success'
                ? <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-4" />
                : <AlertCircle className="h-14 w-14 text-destructive mx-auto mb-4" />}
              <p className={`font-semibold text-lg mb-2 ${bookingResult.type === 'success' ? 'text-green-500' : 'text-destructive'}`}>
                {bookingResult.type === 'success' ? 'Booking Confirmed! 🎉' : 'Booking Failed'}
              </p>
              <p className="text-muted-foreground text-sm mb-4">{bookingResult.text}</p>
              {bookingResult.type === 'success' ? (
                <Link href="/subscriptions"><Button className="bg-primary text-primary-foreground">View My Dashboard</Button></Link>
              ) : (
                <Button className="bg-primary text-primary-foreground" onClick={() => { setBookingResult(null); setConfirming(false); }}>Try Again</Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
