'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  User,
  CheckCircle2,
  Dumbbell,
} from 'lucide-react';

// ─── Dummy bookings for prototype ───────────────────────────
const DUMMY_BOOKINGS = [
  {
    id: 'b1',
    trainerName: 'Rahul Sharma',
    trainerId: 'trainer_1',
    gymName: 'Iron Temple Fitness',
    gymSlug: 'iron-temple-fitness',
    plan: 'monthly',
    amount: 1000,
    status: 'confirmed',
    bookedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'b2',
    trainerName: 'Priya Patel',
    trainerId: 'trainer_2',
    gymName: 'Iron Temple Fitness',
    gymSlug: 'iron-temple-fitness',
    plan: 'weekly',
    amount: 225,
    status: 'confirmed',
    bookedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const PLAN_LABELS: Record<string, string> = {
  hourly: 'Hourly Session',
  weekly: 'Weekly Package (5 sessions)',
  monthly: 'Monthly Package (20 sessions)',
};

export default function TrainerBookingsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [bookings] = useState(DUMMY_BOOKINGS);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const totalSpent = bookings.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/subscriptions">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Trainer Bookings</h1>
            <p className="text-muted-foreground">View and manage your trainer sessions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="border-border/50 p-4 text-center">
            <p className="text-2xl font-bold text-primary">{bookings.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Bookings</p>
          </Card>
          <Card className="border-border/50 p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{bookings.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Active</p>
          </Card>
          <Card className="border-border/50 p-4 text-center">
            <p className="text-2xl font-bold text-foreground">₹{totalSpent}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Spent</p>
          </Card>
        </div>

        {/* Bookings list */}
        {bookings.length === 0 ? (
          <Card className="border-border/50 p-16 text-center">
            <Dumbbell className="h-14 w-14 text-muted-foreground mx-auto mb-4 opacity-40" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground mb-6">Browse gyms and book a trainer to get started</p>
            <Link href="/"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Browse Gyms</Button></Link>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Active Bookings</h2>
            {bookings.map((booking) => (
              <Card key={booking.id} className="border-border/50 overflow-hidden">
                <div className="h-1 bg-primary" />
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-foreground">{booking.trainerName}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{PLAN_LABELS[booking.plan]}</p>
                        </div>
                        <Badge className="text-xs text-green-500 bg-green-500/10 border border-green-500/30 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />Confirmed
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="truncate">{booking.gymName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-green-500" />
                          <span className="font-medium text-foreground">₹{booking.amount}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(booking.bookedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="capitalize">{booking.plan} package</span>
                        </div>
                      </div>
                    </div>

                    <Link href={`/gym/${booking.gymSlug}/trainers/${booking.trainerId}`}>
                      <Button variant="outline" size="sm" className="border-border bg-transparent text-xs whitespace-nowrap">
                        View Trainer
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
