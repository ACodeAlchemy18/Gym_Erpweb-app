'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/header';
import { ProfileDetails } from '@/components/profile-details';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Dumbbell, 
  Wallet, 
  Activity, 
  BarChart3, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the platform and monitor activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-card border-border/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Total Users</p>
                <p className="text-3xl font-bold text-foreground">15,240</p>
                <p className="text-xs text-primary mt-2">+12% from last month</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Active Gyms</p>
                <p className="text-3xl font-bold text-foreground">50</p>
                <p className="text-xs text-primary mt-2">+3 new this month</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-lg">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground">₹45.2L</p>
                <p className="text-xs text-primary mt-2">+8% from last month</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-lg">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Active Sessions</p>
                <p className="text-3xl font-bold text-foreground">3,421</p>
                <p className="text-xs text-primary mt-2">Currently online</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-lg">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Recent Transactions */}
          <Card className="bg-card border-border/50 p-6 md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
              <Button variant="ghost" className="text-primary text-sm">View All</Button>
            </div>

            <div className="space-y-4">
              {[
                { id: 1, user: 'John Fitness', amount: '₹999', gym: 'Elite Gym Mumbai', status: 'Completed' },
                { id: 2, user: 'Sarah Active', amount: '₹4,999', gym: 'Power House Delhi', status: 'Completed' },
                { id: 3, user: 'Mike Strong', amount: '₹2,499', gym: 'Fitness Zone Bangalore', status: 'Pending' },
                { id: 4, user: 'Emma Fit', amount: '₹1,499', gym: 'Gold Gym Pune', status: 'Completed' },
                { id: 5, user: 'Alex Train', amount: '₹3,999', gym: 'Iron Paradise Chennai', status: 'Completed' },
              ].map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{transaction.user}</p>
                    <p className="text-xs text-muted-foreground">{transaction.gym}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{transaction.amount}</p>
                    <p className={`text-xs font-medium ${transaction.status === 'Completed' ? 'text-primary' : 'text-yellow-500'}`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Platform Overview */}
          <Card className="bg-card border-border/50 p-6">
            <h2 className="text-lg font-bold text-foreground mb-6">Platform Overview</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">User Satisfaction</span>
                <span className="text-foreground font-medium">4.8/5</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary rounded-full h-2" style={{ width: '96%' }}></div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <span className="text-muted-foreground text-sm">Gym Utilization</span>
                <span className="text-foreground font-medium">87%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary rounded-full h-2" style={{ width: '87%' }}></div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <span className="text-muted-foreground text-sm">System Uptime</span>
                <span className="text-foreground font-medium">99.9%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary rounded-full h-2" style={{ width: '99.9%' }}></div>
              </div>
            </div>

            <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Detailed Analytics
            </Button>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3 mt-8">
          <Button variant="outline" className="h-20 border-border flex flex-col items-center justify-center gap-2 bg-transparent">
            <Users className="h-6 w-6" />
            <span className="text-sm font-medium">Manage Users</span>
          </Button>
          <Button variant="outline" className="h-20 border-border flex flex-col items-center justify-center gap-2 bg-transparent">
            <Dumbbell className="h-6 w-6" />
            <span className="text-sm font-medium">Manage Gyms</span>
          </Button>
          <Button variant="outline" className="h-20 border-border flex flex-col items-center justify-center gap-2 bg-transparent">
            <AlertCircle className="h-6 w-6" />
            <span className="text-sm font-medium">View Reports</span>
          </Button>
        </div>

        {/* Admin Profile Details */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Profile Information</h2>
          <ProfileDetails />
        </div>
      </main>
    </div>
  );
}
