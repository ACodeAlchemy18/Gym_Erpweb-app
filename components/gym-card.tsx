"use client";

import { Gym } from "@/data/gyms";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, Users, Dumbbell } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";

interface GymCardProps {
  gym: Gym;
}

export function GymCard({ gym }: GymCardProps) {
  const { isAuthenticated } = useAuth();
  
  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={gym.photos[0] || "/placeholder.svg"}
          alt={gym.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        {gym.featured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-sm">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="font-medium">{gym.rating}</span>
          <span className="text-muted-foreground">({gym.totalReviews} reviews)</span>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {gym.name}
            </h3>
            <p className="text-sm text-muted-foreground italic">{gym.tagline}</p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{gym.city}, {gym.state}</span>
            <span className="text-border">|</span>
            <span>{gym.radius} km radius</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span>{gym.operatingHours.weekdays}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              <span>{gym.trainers} Trainers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Dumbbell className="h-4 w-4 text-primary" />
              <span>{gym.equipment}+ Equipment</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {gym.amenities.slice(0, 4).map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {gym.amenities.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{gym.amenities.length - 4} more
              </Badge>
            )}
          </div>

          <div className="pt-3 border-t border-border">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Starting from</p>
                <p className="text-2xl font-bold text-foreground">
                  ${gym.pricing.weekly}
                  <span className="text-sm font-normal text-muted-foreground">/week</span>
                </p>
              </div>
              {isAuthenticated ? (
                <Link href={`/gym/${gym.slug}`}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    View Details
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Login to Join
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
