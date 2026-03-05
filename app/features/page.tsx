'use client';

import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Zap, Eye, Save, Share2, Filter, Clock, MapIcon } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: MapIcon,
      title: 'Interactive Map View',
      description: 'View all gyms on an interactive map with service radius visualization and search functionality.',
      highlights: ['Real-time gym locations', 'Service radius display', 'Quick gym preview'],
    },
    {
      icon: MapPin,
      title: 'Address Autocomplete',
      description: 'Gym owners can search and select addresses from Google Maps suggestions or use current location.',
      highlights: ['Google Maps integration', 'Current location detection', 'Address suggestions'],
    },
    {
      icon: Filter,
      title: 'Smart Filters',
      description: 'Filter gyms by price, radius, location, and more using select dropdowns for ease of use.',
      highlights: ['City/State selection', 'Price range filters', 'Radius slider filter'],
    },
    {
      icon: Users,
      title: '4-Role System',
      description: 'Complete role-based access with User, Trainer, Owner, and Admin roles with unique dashboards.',
      highlights: ['Role-specific dashboards', 'Tailored onboarding', 'Custom features'],
    },
    {
      icon: Save,
      title: 'Gym Management',
      description: 'Owners can create, manage, and view detailed analytics for their gyms.',
      highlights: ['Add new gyms', 'View analytics', 'Manage memberships'],
    },
    {
      icon: Eye,
      title: 'Detailed Gym Pages',
      description: 'Users can view comprehensive gym information including Google Map, pricing, and amenities.',
      highlights: ['Google Maps integration', 'Full pricing details', 'Amenities list'],
    },
    {
      icon: Clock,
      title: 'Wallet System',
      description: 'Secure wallet with add money, transaction history, and payment tracking.',
      highlights: ['Add funds', 'Transaction history', 'Minimum balance tracking'],
    },
    {
      icon: Zap,
      title: 'Smart Onboarding',
      description: 'Role-specific onboarding flows with select dropdowns reducing manual input.',
      highlights: ['Role-specific fields', 'Select dropdowns', 'Progressive disclosure'],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Features & Capabilities
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive gym discovery and management platform with intuitive interfaces for all user roles
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-card border-border/50 hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">Feature</Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Demo Credentials Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Quick Start Demo</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { role: 'User', email: 'user@example.com', password: 'user123', path: '/' },
              { role: 'Trainer', email: 'trainer@example.com', password: 'trainer123', path: '/trainer' },
              { role: 'Gym Owner', email: 'owner@example.com', password: 'owner123', path: '/owner' },
              { role: 'Admin', email: 'admin@example.com', password: 'admin123', path: '/admin' },
            ].map((demo, index) => (
              <Card key={index} className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">{demo.role}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-mono bg-secondary rounded p-2 break-all">{demo.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Password</p>
                    <p className="text-sm font-mono bg-secondary rounded p-2">{demo.password}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
