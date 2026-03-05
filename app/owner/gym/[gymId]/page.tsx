'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GoogleGymMap } from '@/components/google-gym-map';
import { getOwnerGymById, type OwnerGym } from '@/data/owner-gyms';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Dumbbell,
  Clock,
  Zap,
  ArrowLeft,
  Edit2,
  Trash2,
} from 'lucide-react';

export default function OwnerGymDetailPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const gymId = params.gymId as string;

  const [gym, setGym] = useState<OwnerGym | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'owner') {
      router.push('/login');
      return;
    }

    const ownerGym = getOwnerGymById(user.id, gymId);
    if (!ownerGym) {
      router.push('/owner');
      return;
    }

    setGym(ownerGym);
    setLoading(false);
  }, [isAuthenticated, user, router, gymId]);

  if (loading || !gym) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Loading gym details...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/owner">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="flex-1">
            <img
              src={gym.image || "/placeholder.svg"}
              alt={gym.name}
              className="w-full h-96 object-cover rounded-lg border border-border/50"
            />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <Badge variant="secondary" className="mb-4 bg-secondary">{gym.city}</Badge>
              <h1 className="text-4xl font-bold text-foreground mb-2">{gym.name}</h1>
              <p className="text-lg text-muted-foreground mb-6">{gym.description}</p>

              {/* Quick Stats */}
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Active Members</p>
                  <p className="text-2xl font-bold text-foreground">{gym.memberCount}</p>
                </div>
                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Trainers</p>
                  <p className="text-2xl font-bold text-foreground">{gym.trainerCount}</p>
                </div>
                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Staff</p>
                  <p className="text-2xl font-bold text-foreground">{gym.staffCount}</p>
                </div>
                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Service Radius</p>
                  <p className="text-2xl font-bold text-foreground">{gym.radius} km</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Gym
              </Button>
              <Button variant="outline" className="flex-1 border-border gap-2 bg-transparent">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Contact & Details */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {/* Contact Information */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium text-foreground">{gym.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{gym.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{gym.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <p className="font-medium text-foreground">{gym.website}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(gym.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center p-2 bg-secondary/50 rounded-lg">
                  <span className="font-medium text-foreground capitalize">{day}</span>
                  <span className="text-sm text-muted-foreground">{hours.open} - {hours.close}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Pricing */}
        <Card className="border-border/50 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              Membership Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="p-4 bg-secondary/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Weekly</p>
                <p className="text-2xl font-bold text-primary">${gym.pricing.weekly}</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Monthly</p>
                <p className="text-2xl font-bold text-primary">${gym.pricing.monthly}</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Quarterly</p>
                <p className="text-2xl font-bold text-primary">${gym.pricing.quarterly}</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Half Yearly</p>
                <p className="text-2xl font-bold text-primary">${gym.pricing.halfYearly}</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Yearly</p>
                <p className="text-2xl font-bold text-primary">${gym.pricing.yearly}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Facilities & Amenities */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {gym.facilities.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {gym.facilities.map((facility, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-primary/20 text-primary">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {gym.amenities.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {gym.amenities.map((amenity, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-primary/20 text-primary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Location Map */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Location & Service Area</h2>
          <GoogleGymMap
            gym={{
              ...gym,
              slug: gym.id,
              featured: false,
              rating: 4.5,
              reviews: 120,
            }}
          />
        </div>
      </main>
    </div>
  );
}
