'use client';

import { Header } from '@/components/header';
import { gyms } from '@/data/gyms';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { MapPin, Search, Star } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function GymsMapPage() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGyms, setFilteredGyms] = useState(gyms);

  // Mock Google Map implementation
  const [mapLoaded, setMapLoaded] = useState(true);

  useEffect(() => {
    const filtered = gyms.filter(
      (gym) =>
        gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.state.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGyms(filtered);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Gyms Near You</h1>
          <p className="text-muted-foreground">Find and explore fitness centers on an interactive map</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border/50 h-[600px] overflow-hidden">
              <CardContent className="p-0 h-full relative bg-muted/30 flex items-center justify-center">
                {mapLoaded ? (
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 relative">
                    {/* Mock Map Grid */}
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-px opacity-10">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="bg-border" />
                      ))}
                    </div>

                    {/* Gym Markers */}
                    <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none">
                      {filteredGyms.map((gym, index) => {
                        // Normalize coordinates to SVG viewport (0-100% range)
                        const x = ((gym.coordinates.lng + 180) / 360) * 100;
                        const y = ((90 - gym.coordinates.lat) / 180) * 100;
                        return (
                          <g key={gym.id}>
                            {/* Service Radius Circle */}
                            <circle
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r={`${(gym.radius / 20) * 5}%`}
                              fill="url(#radiusGradient)"
                              opacity="0.15"
                            />
                            {/* Gym Marker */}
                            <circle
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="1.5%"
                              fill="var(--color-primary)"
                              stroke="white"
                              strokeWidth="0.3%"
                            />
                            {/* Tooltip */}
                            <title>{gym.name}</title>
                          </g>
                        );
                      })}
                      <defs>
                        <radialGradient id="radiusGradient">
                          <stop offset="0%" stopColor="var(--color-primary)" />
                          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                    </svg>

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur border border-border/50 rounded-lg p-4 text-sm">
                      <div className="font-semibold text-foreground mb-3">Map Legend</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          <span className="text-muted-foreground">Gym Location</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full border-2 border-primary opacity-20" />
                          <span className="text-muted-foreground">Service Area</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Map is loading...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Gyms List */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border/50 sticky top-20">
              <CardContent className="p-4">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search gyms..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {filteredGyms.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-muted-foreground">No gyms found</p>
                    </div>
                  ) : (
                    filteredGyms.map((gym) => (
                      <Card
                        key={gym.id}
                        className="bg-secondary border-border/50 p-3 hover:border-primary/50 transition-all cursor-pointer"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-sm text-foreground line-clamp-2">
                              {gym.name}
                            </h3>
                            <Badge variant="secondary" className="text-xs flex-shrink-0">
                              {gym.radius} km
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {gym.city}, {gym.state}
                          </p>
                          <div className="flex items-center gap-1 text-xs">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(gym.rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-muted-foreground">({gym.reviews})</span>
                          </div>
                          <p className="text-xs text-foreground font-medium">
                            ${gym.pricing.monthly}/month
                          </p>
                          {isAuthenticated ? (
                            <Link href={`/gym/${gym.slug}`}>
                              <Button
                                size="sm"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                              >
                                View Details
                              </Button>
                            </Link>
                          ) : (
                            <Link href="/login">
                              <Button
                                size="sm"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                              >
                                Login to Join
                              </Button>
                            </Link>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
