"use client";

import { useEffect, useState } from "react";

import { Header } from "@/components/header";
import { GymList } from "@/components/gym-list";
import { getFeaturedGyms } from "@/data/gyms";
import { GymCard } from "@/components/gym-card";
import { Dumbbell, MapPin, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllOwnerGyms } from "@/data/owner-gyms";


export default function HomePage() {
const [featuredGyms, setFeaturedGyms] = useState<any[]>([]);

useEffect(() => {
  const staticGyms = getFeaturedGyms();
  const ownerGyms = getAllOwnerGyms();

  const formattedOwnerGyms = ownerGyms.map((gym) => ({
    id: gym.id,
    slug: gym.id,
    name: gym.name,
    city: gym.city,
    image: gym.image,
    rating: 4.5,
    reviews: 0,
    featured: false,
  }));

  setFeaturedGyms([...staticGyms, ...formattedOwnerGyms]);
}, []);



  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
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
              Browse through our curated selection of top-rated gyms. Compare pricing, 
              amenities, and locations to find your ideal fitness destination.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm mb-8">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">50+ Gyms Listed</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Multiple Cities</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Verified Reviews</span>
              </div>
            </div>

            {/* Login/Signup CTA */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-border px-8 h-12 bg-transparent">
                  Login Here
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" className="border-border px-8 h-12 bg-transparent">
                  View Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gyms Section */}
      <section id="featured" className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Gyms</h2>
              <p className="text-muted-foreground mt-1">Hand-picked premium fitness centers</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredGyms.map((gym) => (
              <GymCard key={gym.id} gym={gym} />
            ))}
          </div>
        </div>
      </section>

      {/* All Gyms Section */}
      <section id="all-gyms" className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">All Gyms</h2>
            <p className="text-muted-foreground mt-1">Explore our complete directory</p>
          </div>
          <GymList />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-border/50 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">50+</p>
              <p className="text-muted-foreground mt-1">Partner Gyms</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">15K+</p>
              <p className="text-muted-foreground mt-1">Active Members</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">100+</p>
              <p className="text-muted-foreground mt-1">Expert Trainers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">4.8</p>
              <p className="text-muted-foreground mt-1">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <Dumbbell className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GymFinder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 GymFinder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
