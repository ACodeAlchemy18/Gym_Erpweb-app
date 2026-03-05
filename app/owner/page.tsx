'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { ProfileDetails } from '@/components/profile-details';
import { GymForm } from '@/components/gym-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getOwnerGyms, addOwnerGym, type OwnerGym } from '@/data/owner-gyms';
import Link from 'next/link';
import { 
  Users, 
  Dumbbell, 
  Wallet, 
  Activity, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';

export default function OwnerDashboard() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [gyms, setGyms] = useState<OwnerGym[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'owner') {
      router.push('/login');
    } else {
      const ownerGyms = getOwnerGyms(user.id);
      setGyms(ownerGyms);
    }
  }, [isAuthenticated, user, router]);

  const handleAddGym = (gymData: Omit<OwnerGym, 'id' | 'createdAt' | 'ownerId'>) => {
    const newGym = addOwnerGym(user!.id, gymData);
    setGyms(prev => [...prev, newGym]);
  };

  if (!isAuthenticated || user?.role !== 'owner') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Gym Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your gym and track performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-card border-border/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Active Members</p>
                <p className="text-3xl font-bold text-foreground">847</p>
                <p className="text-xs text-primary mt-2">+45 this month</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Monthly Revenue</p>
                <p className="text-3xl font-bold text-foreground">₹8.5L</p>
                <p className="text-xs text-primary mt-2">+12% increase</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-lg">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Check-ins Today</p>
                <p className="text-3xl font-bold text-foreground">234</p>
                <p className="text-xs text-primary mt-2">Peak hours: 6-8 PM</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-lg">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Utilization Rate</p>
                <p className="text-3xl font-bold text-foreground">92%</p>
                <p className="text-xs text-primary mt-2">Excellent</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Membership Plans */}
          <Card className="bg-card border-border/50 p-6 md:col-span-2">
            <h2 className="text-lg font-bold text-foreground mb-6">Membership Plans Performance</h2>

            <div className="space-y-4">
              {[
                { plan: 'Weekly Pass', members: 234, revenue: '₹2.34L', trending: '+8%' },
                { plan: 'Monthly Pass', members: 456, revenue: '₹4.56L', trending: '+12%' },
                { plan: 'Quarterly Pass', members: 89, revenue: '₹1.05L', trending: '+5%' },
                { plan: 'Half Yearly', members: 45, revenue: '₹0.54L', trending: '+3%' },
                { plan: 'Yearly Pass', members: 23, revenue: '₹0.23L', trending: '+2%' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.plan}</p>
                    <p className="text-sm text-muted-foreground">{item.members} active members</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{item.revenue}</p>
                    <p className="text-sm text-primary">{item.trending}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-card border-border/50 p-6">
            <h2 className="text-lg font-bold text-foreground mb-6">Gym Status</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Equipment</p>
                  <p className="text-xs text-muted-foreground">All functional</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Staff</p>
                  <p className="text-xs text-muted-foreground">12 trainers present</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Maintenance</p>
                  <p className="text-xs text-muted-foreground">2 pending</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Cleanliness</p>
                  <p className="text-xs text-muted-foreground">Excellent</p>
                </div>
              </div>
            </div>

            <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
              <Dumbbell className="h-4 w-4 mr-2" />
              Manage Gym
            </Button>
          </Card>
        </div>

        {/* Schedule */}
        <Card className="bg-card border-border/50 p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">This Week's Schedule</h2>
            <Button variant="ghost" className="text-primary text-sm">View All</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
              <div key={idx} className="p-4 bg-secondary/50 rounded-lg text-center">
                <p className="text-sm font-medium text-muted-foreground mb-2">{day}</p>
                <p className="text-2xl font-bold text-foreground">{189 + idx * 15}</p>
                <p className="text-xs text-muted-foreground mt-1">check-ins</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Gym Management Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Gyms</h2>
            <GymForm onSubmit={handleAddGym} isOpen={isFormOpen} onOpenChange={setIsFormOpen} />
          </div>

          {gyms.length === 0 ? (
            <Card className="bg-card border-border/50 p-12 text-center">
              <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Gyms Yet</h3>
              <p className="text-muted-foreground mb-6">Create your first gym to get started</p>
              <Button onClick={() => setIsFormOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Your First Gym
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gyms.map((gym) => (
                <Card key={gym.id} className="bg-card border-border/50 overflow-hidden hover:border-primary/50 transition-all">
                  <img
                    src={gym.image || "/placeholder.svg"}
                    alt={gym.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">{gym.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{gym.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="bg-secondary">{gym.city}</Badge>
                      <span className="text-xs text-muted-foreground">{gym.memberCount} members</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/owner/gym/${gym.id}`} className="flex-1">
                        <Button variant="outline" className="w-full border-border bg-transparent">
                          View Details
                        </Button>
                      </Link>
                      <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3 mt-8 mb-12">
          <Button variant="outline" className="h-20 border-border flex flex-col items-center justify-center gap-2 bg-transparent">
            <Users className="h-6 w-6" />
            <span className="text-sm font-medium">Members</span>
          </Button>
          <Button variant="outline" className="h-20 border-border flex flex-col items-center justify-center gap-2 bg-transparent">
            <Calendar className="h-6 w-6" />
            <span className="text-sm font-medium">Schedule</span>
          </Button>
          <Button variant="outline" className="h-20 border-border flex flex-col items-center justify-center gap-2 bg-transparent">
            <Wallet className="h-6 w-6" />
            <span className="text-sm font-medium">Financials</span>
          </Button>
        </div>

        {/* Owner Profile Details */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Profile Information</h2>
          <ProfileDetails />
        </div>
      </main>
    </div>
  );
}
