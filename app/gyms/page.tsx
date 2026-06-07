"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { GymList } from "@/components/gym-list";
import { getFeaturedGyms } from "@/data/gyms";
import { GymCard } from "@/components/gym-card";
import { getAllOwnerGyms } from "@/data/owner-gyms";
import { useUser } from "@/contexts/user-context";
import { Dumbbell, Search, MapPin, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CITY_FILTERS = ["All", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Chennai"];

export default function GymsExplorePage() {
  const userData = useUser();
  const [allGyms, setAllGyms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");

  let subscriptions: any[] = [];
  try { subscriptions = userData.subscriptions; } catch {}
  const subscribedIds = new Set(subscriptions.map((s: any) => s.gymId));

  useEffect(() => {
    const staticGyms = getFeaturedGyms();
    const ownerGyms = getAllOwnerGyms().map(g => ({
      id: g.id, slug: g.id, name: g.name, city: g.city, state: '',
      tagline: 'Owner managed gym', description: '', address: g.address || '',
      zipCode: '', coordinates: g.coordinates || { lat: 0, lng: 0 },
      radius: g.radius || 5, phone: g.phone || '', email: g.email || '',
      website: g.website || '', rating: 4.5, totalReviews: 0,
      operatingHours: { weekdays: '6AM-10PM', saturday: '7AM-9PM', sunday: '8AM-8PM' },
      pricing: g.pricing || { weekly: 200, monthly: 700, quarterly: 1800, halfYearly: 3200, yearly: 5500 },
      amenities: g.amenities || [], features: g.features || [],
      trainers: g.trainerCount || 0, equipment: 0, sqft: Number(g.gymArea) || 0,
      established: 2023, photos: [g.image || '/placeholder.svg'], featured: false,
    }));
    setAllGyms([...staticGyms, ...ownerGyms]);
  }, []);

  const filtered = allGyms.filter(gym => {
    const matchSearch = !search || gym.name.toLowerCase().includes(search.toLowerCase()) || gym.city?.toLowerCase().includes(search.toLowerCase());
    const matchCity = cityFilter === "All" || gym.city?.toLowerCase() === cityFilter.toLowerCase();
    return matchSearch && matchCity;
  });

  const alreadyJoined = filtered.filter(g => subscribedIds.has(g.id));
  const notJoined = filtered.filter(g => !subscribedIds.has(g.id));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Explore Gyms</h1>
          <p className="text-muted-foreground mt-1">Discover and compare gyms near you</p>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search gyms by name or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-secondary border-border"
            />
          </div>
        </div>

        {/* City filter chips */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CITY_FILTERS.map(city => (
            <button key={city} onClick={() => setCityFilter(city)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                cityFilter === city
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}>
              {city}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <div className="px-4 py-2 bg-secondary/50 rounded-lg text-sm">
            <span className="font-bold text-primary">{filtered.length}</span> <span className="text-muted-foreground">gyms found</span>
          </div>
          {subscriptions.length > 0 && (
            <div className="px-4 py-2 bg-green-500/10 rounded-lg text-sm">
              <span className="font-bold text-green-500">{alreadyJoined.length}</span> <span className="text-muted-foreground">already joined</span>
            </div>
          )}
        </div>

        {/* Already joined */}
        {alreadyJoined.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-lg font-bold text-foreground">Your Gyms</h2>
              <Badge className="bg-green-500/20 text-green-500 text-xs">{alreadyJoined.length} joined</Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {alreadyJoined.map(gym => <GymCard key={gym.id} gym={gym} />)}
            </div>
          </section>
        )}

        {/* Available to join */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-5">
            {subscriptions.length > 0 ? 'Other Gyms' : 'All Gyms'}
            {notJoined.length > 0 && (
              <span className="text-muted-foreground font-normal text-sm ml-2">({notJoined.length} available)</span>
            )}
          </h2>
          {notJoined.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No gyms found for "{search}"</p>
              <p className="text-sm mt-1">Try a different search or city</p>
              <Button variant="ghost" className="mt-3 text-primary" onClick={() => { setSearch(''); setCityFilter('All'); }}>Clear filters</Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {notJoined.map(gym => <GymCard key={gym.id} gym={gym} />)}
            </div>
          )}
        </section>

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
