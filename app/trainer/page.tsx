'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { ProfileDetails } from '@/components/profile-details';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Users, Calendar, DollarSign, TrendingUp, Clock,
  Dumbbell, MapPin, Copy, CheckCheck, IdCard, Info,
} from 'lucide-react';
import { getTrainerGymsByTrainerId } from '@/data/trainer-gyms';
import { getOwnerGymById } from '@/data/owner-gyms';
import { getRegisteredTrainerById } from '@/data/trainer-registry';

// Dummy gyms that show on trainer dashboard when added via owner page
const DEMO_GYM_DATA: Record<string, { name: string; city: string; image: string }> = {
  demo_gym_1: { name: 'My Gym (Demo)', city: 'Mumbai', image: '/placeholder.svg' },
  '1': { name: 'Iron Temple Fitness', city: 'Los Angeles', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
  '2': { name: 'Flex Zone', city: 'New York', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80' },
};

export default function TrainerDashboard() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'trainer') router.push('/login');
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'trainer') return null;

  // Look up this trainer's public ID from the registry
  const registryTrainer = getRegisteredTrainerById(user.id);
  // Fallback: generate a public ID from their user id if not in registry
  const publicTrainerId = registryTrainer?.trainerId || `TRN-${user.id.replace('trainer_', '').padStart(3, '0')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicTrainerId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const associations = getTrainerGymsByTrainerId(user.id);

  // Helper to get gym data for display (checks owner gyms + demo data)
  const getGymDisplay = (gymId: string) => {
    const ownerGym = getOwnerGymById(gymId);
    if (ownerGym) return { name: ownerGym.name, city: ownerGym.city, image: ownerGym.image || '/placeholder.svg' };
    return DEMO_GYM_DATA[gymId] || { name: `Gym (${gymId})`, city: '', image: '/placeholder.svg' };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">

        {/* ── TRAINER ID CARD ── */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-primary/20 via-primary/10 to-card border-primary/30 p-6 overflow-hidden relative">
            {/* decorative */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-10 translate-x-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-8 -translate-x-8" />

            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Avatar */}
              <img
                src={user.avatar || registryTrainer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="h-20 w-20 rounded-2xl border-2 border-primary/40 object-cover shrink-0"
              />

              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-0.5">Welcome back,</p>
                <h1 className="text-2xl font-bold text-foreground mb-1">{user.name}</h1>
                <Badge className="bg-primary/20 text-primary mb-3">
                  {registryTrainer?.specialization || 'Fitness Trainer'}
                </Badge>

                {/* THE TRAINER ID — most prominent element */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 bg-card border border-primary/40 rounded-xl px-4 py-2.5">
                    <IdCard className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground leading-none mb-0.5">Your Trainer ID</p>
                      <p className="text-xl font-bold text-primary tracking-widest">{publicTrainerId}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary/40 gap-1.5 text-xs"
                    onClick={handleCopy}
                  >
                    {copied ? <CheckCheck className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied!' : 'Copy ID'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Info note */}
            <div className="relative mt-4 flex items-start gap-2 p-3 bg-primary/10 rounded-lg text-sm">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-muted-foreground">
                Share your <span className="font-semibold text-foreground">{publicTrainerId}</span> with gym owners so they can find and add you to their gym.
              </p>
            </div>
          </Card>
        </div>

        {/* ── STATS ── */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          {[
            { label: 'Active Clients', value: '12', icon: Users, color: 'text-primary' },
            { label: 'This Month', value: '₹24,000', icon: DollarSign, color: 'text-green-500' },
            { label: 'Sessions', value: '48', icon: Calendar, color: 'text-blue-500' },
            { label: 'Avg Rating', value: registryTrainer?.rating?.toString() || '4.8', icon: TrendingUp, color: 'text-yellow-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="bg-card border-border/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">{label}</p>
                  <p className="text-3xl font-bold text-foreground">{value}</p>
                </div>
                <Icon className={`h-10 w-10 ${color} opacity-20`} />
              </div>
            </Card>
          ))}
        </div>

        {/* ── UPCOMING SESSIONS ── */}
        <Card className="bg-card border-border/50 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Upcoming Sessions</h2>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">Schedule New</Button>
          </div>
          <div className="space-y-4">
            {[
              { client: 'John Doe', time: '10:00 AM', date: 'Today', type: 'Strength Training' },
              { client: 'Sarah Smith', time: '2:00 PM', date: 'Today', type: 'Cardio' },
              { client: 'Mike Johnson', time: '6:00 PM', date: 'Tomorrow', type: 'HIIT' },
            ].map((session, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{session.client}</p>
                    <p className="text-sm text-muted-foreground">{session.type} • {session.date} at {session.time}</p>
                  </div>
                </div>
                <Button variant="outline" className="border-border text-sm bg-transparent">Manage</Button>
              </div>
            ))}
          </div>
        </Card>

        {/* ── ASSOCIATED GYMS ── */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Associated Gyms</h2>

          {associations.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {associations.map((assoc) => {
                const gym = getGymDisplay(assoc.gymId);
                return (
                  <Card key={assoc.id} className="bg-card border-border/50 overflow-hidden hover:border-primary/50 transition-all">
                    <img src={gym.image} alt={gym.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2">{gym.name}</h3>
                      {gym.city && (
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{gym.city}</span>
                        </div>
                      )}
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        Joined {assoc.joinDate}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-card border-border/50 p-10 text-center">
              <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
              <p className="font-semibold text-foreground mb-2">No gyms yet</p>
              <p className="text-muted-foreground text-sm mb-4">
                Share your Trainer ID <span className="font-bold text-primary">{publicTrainerId}</span> with a gym owner to get added.
              </p>
            </Card>
          )}
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {[
            { icon: Calendar, label: 'Schedule Session' },
            { icon: Users, label: 'My Clients' },
            { icon: DollarSign, label: 'Earnings' },
          ].map(({ icon: Icon, label }) => (
            <Button key={label} variant="outline" className="h-20 border-border flex flex-col items-center justify-center gap-2 bg-transparent">
              <Icon className="h-6 w-6" />
              <span className="text-sm font-medium">{label}</span>
            </Button>
          ))}
        </div>

        {/* ── PROFILE DETAILS ── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Profile Information</h2>
          <ProfileDetails />
        </div>
      </main>
    </div>
  );
}
