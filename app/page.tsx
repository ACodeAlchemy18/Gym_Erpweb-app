"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { GymList } from "@/components/gym-list";
import { getFeaturedGyms, getGymBySlug } from "@/data/gyms";
import { GymCard } from "@/components/gym-card";
import { useAuth } from "@/contexts/auth-context";
import { useUser } from "@/contexts/user-context";
import { Dumbbell, MapPin, Clock, Award, Users, ChevronRight, Star, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getAllOwnerGyms } from "@/data/owner-gyms";
import { getTrainersByGymId } from "@/data/trainer-gyms";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const userData = useUser();
  const [allGyms, setAllGyms] = useState<any[]>([]);

  let subscriptions: any[] = [];
  try { subscriptions = userData.subscriptions; } catch {}

  const isUser = isAuthenticated && user?.role === 'user';
  const hasSubscriptions = isUser && subscriptions.length > 0;

  useEffect(() => {
    const staticGyms = getFeaturedGyms();
    const ownerGyms = getAllOwnerGyms().map(g => ({
      id: g.id, slug: g.id, name: g.name, city: g.city,
      image: g.image, rating: 4.5, reviews: 0, featured: false,
    }));
    setAllGyms([...staticGyms, ...ownerGyms]);
  }, []);

  // Build subscribed gym details for dashboard view
  const subscribedGyms = subscriptions.map(sub => {
    const gym = getGymBySlug(sub.gymSlug) || allGyms.find(g => g.id === sub.gymId);
    const trainers = getTrainersByGymId(sub.gymId);
    return { sub, gym, trainers };
  }).filter(x => x.gym);

  // Gyms NOT subscribed to (for explore section)
  const subscribedIds = new Set(subscriptions.map(s => s.gymId));
  const exploreGyms = allGyms.filter(g => !subscribedIds.has(g.id)).slice(0, 6);

  // ── LOGGED IN USER WITH SUBSCRIPTIONS ──────────────────────────
  if (hasSubscriptions) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Welcome back! 👋</h1>
            <p className="text-muted-foreground mt-1">Here's your fitness dashboard</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <Card className="border-border/50 p-4 text-center">
              <p className="text-2xl font-bold text-primary">{subscriptions.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Active Memberships</p>
            </Card>
            <Card className="border-border/50 p-4 text-center">
              <p className="text-2xl font-bold text-foreground">
                {subscribedGyms.reduce((s, g) => s + g.trainers.length, 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Available Trainers</p>
            </Card>
            <Card className="border-border/50 p-4 text-center">
              <p className="text-2xl font-bold text-green-500">
                ₹{subscriptions.reduce((s, sub) => s + sub.amount, 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Invested</p>
            </Card>
          </div>

          {/* Subscribed Gyms + Trainers */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-foreground">Your Gyms & Trainers</h2>
              <Link href="/subscriptions">
                <Button variant="ghost" size="sm" className="text-primary gap-1 text-xs">
                  View All <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-6">
              {subscribedGyms.map(({ sub, gym, trainers }) => {
                const isActive = sub.status === 'active' || sub.status === 'pending_checkin';
                const gymSlug = gym.slug || sub.gymSlug;
                const daysLeft = Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / 86400000));

                return (
                  <Card key={sub.id} className="border-border/50 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-primary to-primary/30" />
                    <CardContent className="p-5">
                      {/* Gym header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          {gym.photos?.[0] && (
                            <img src={gym.photos[0]} alt={gym.name}
                              className="h-14 w-14 rounded-xl object-cover border border-border shrink-0" />
                          )}
                          <div>
                            <h3 className="font-bold text-foreground">{sub.gymName}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge className={isActive ? "bg-green-500/20 text-green-400 text-xs" : "bg-yellow-500/20 text-yellow-500 text-xs"}>
                                {isActive ? "✅ Active" : "⏳ Check-in Needed"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{daysLeft} days left</span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/gym/${gymSlug}`}>
                          <Button variant="outline" size="sm" className="border-border bg-transparent text-xs">
                            View Gym
                          </Button>
                        </Link>
                      </div>

                      {/* Trainers */}
                      {trainers.length > 0 ? (
                        <>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                            Trainers at this gym
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {trainers.slice(0, 3).map(trainer => (
                              <Link key={trainer.id} href={`/gym/${gymSlug}/trainers/${trainer.id}`}>
                                <div className="flex items-center gap-2 p-2.5 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                                  <img
                                    src={trainer.avatar || trainer.image || '/placeholder-user.jpg'}
                                    alt={trainer.name}
                                    className="h-9 w-9 rounded-lg object-cover shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-foreground truncate">{trainer.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{trainer.specialization}</p>
                                  </div>
                                </div>
                              </Link>
                            ))}
                            {trainers.length > 3 && (
                              <Link href={`/gym/${gymSlug}#trainers`}>
                                <div className="flex items-center justify-center gap-1 p-2.5 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer h-full">
                                  <span className="text-xs text-muted-foreground">+{trainers.length - 3} more</span>
                                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                </div>
                              </Link>
                            )}
                          </div>
                          {isActive && (
                            <Link href={`/gym/${gymSlug}#trainers`} className="block mt-3">
                              <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-xs">
                                <Users className="h-3.5 w-3.5" />Browse All Trainers & Book
                              </Button>
                            </Link>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">No trainers assigned to this gym yet.</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Explore more gyms */}
          {exploreGyms.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Explore More Gyms</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Discover other gyms you haven't joined yet</p>
                </div>
                <Link href="/?showAll=1">
                  <Button variant="ghost" size="sm" className="text-primary gap-1 text-xs">
                    See All <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {exploreGyms.map(gym => <GymCard key={gym.id} gym={gym} />)}
              </div>
            </section>
          )}
        </main>

        <footer className="py-12 border-t border-border/50 mt-16">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg"><Dumbbell className="h-5 w-5 text-primary-foreground" /></div>
              <span className="text-xl font-bold text-foreground">GymFinder</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 GymFinder. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  // ── NOT LOGGED IN / NEW USER / NO SUBSCRIPTIONS ─────────────────
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-6">
              <span className="text-primary text-sm font-medium">Find Your Perfect Gym</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Discover Premium Fitness Centers Near You
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Browse top-rated gyms, compare pricing and amenities, and find your ideal fitness destination.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm mb-8">
              {[["50+ Gyms", Dumbbell], ["Multiple Cities", MapPin], ["24/7 Support", Clock], ["Verified Reviews", Award]].map(([label, Icon]: any) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
            {!isAuthenticated && (
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/signup"><Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12">Get Started Free</Button></Link>
                <Link href="/login"><Button variant="outline" className="border-border px-8 h-12 bg-transparent">Login Here</Button></Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Gyms */}
      <section id="featured" className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Gyms</h2>
              <p className="text-muted-foreground mt-1">Hand-picked premium fitness centers</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {allGyms.map(gym => <GymCard key={gym.id} gym={gym} />)}
          </div>
        </div>
      </section>

      {/* All Gyms */}
      <section id="all-gyms" className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">All Gyms</h2>
            <p className="text-muted-foreground mt-1">Explore our complete directory</p>
          </div>
          <GymList />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-t border-border/50 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[["50+", "Partner Gyms"], ["15K+", "Active Members"], ["100+", "Expert Trainers"], ["4.8", "Average Rating"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-4xl font-bold text-primary">{val}</p>
                <p className="text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg"><Dumbbell className="h-5 w-5 text-primary-foreground" /></div>
            <span className="text-xl font-bold text-foreground">GymFinder</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 GymFinder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
