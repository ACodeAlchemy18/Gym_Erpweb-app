"use client";

import { useState } from "react";
import { gyms } from "@/data/gyms";
import { GymCard } from "@/components/gym-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";

export function GymList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [radiusFilter, setRadiusFilter] = useState<number[]>([10]);

  const filteredGyms = gyms
    .filter((gym) => {
      const matchesSearch =
        gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "budget" && gym.pricing.monthly <= 100) ||
        (priceFilter === "mid" && gym.pricing.monthly > 100 && gym.pricing.monthly <= 130) ||
        (priceFilter === "premium" && gym.pricing.monthly > 130);

      const matchesRadius = gym.radius <= radiusFilter[0];

      return matchesSearch && matchesPrice && matchesRadius;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.pricing.monthly - b.pricing.monthly;
        case "price-high":
          return b.pricing.monthly - a.pricing.monthly;
        case "rating":
          return b.rating - a.rating;
        case "radius-low":
          return a.radius - b.radius;
        case "radius-high":
          return b.radius - a.radius;
        case "featured":
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by gym name, city, or state..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Radius Slider */}
        <div className="flex-1 p-4 bg-card rounded-lg border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-primary" />
              Service Radius
            </Label>
            <span className="text-sm font-bold text-primary">{radiusFilter[0]} km</span>
          </div>
          <Slider
            value={radiusFilter}
            onValueChange={setRadiusFilter}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1 km</span>
            <span>10 km</span>
          </div>
        </div>

        {/* Other Filters */}
        <div className="flex gap-3">
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-[140px] bg-card border-border">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="budget">Budget ($100 or less)</SelectItem>
              <SelectItem value="mid">Mid ($100-$130)</SelectItem>
              <SelectItem value="premium">Premium ($130+)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] bg-card border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="radius-low">Radius: Small to Large</SelectItem>
              <SelectItem value="radius-high">Radius: Large to Small</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing <span className="text-foreground font-medium">{filteredGyms.length}</span> gyms
          {radiusFilter[0] < 10 && (
            <span className="text-primary"> within {radiusFilter[0]} km radius</span>
          )}
        </p>
        {(searchQuery || priceFilter !== "all" || radiusFilter[0] < 10) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setPriceFilter("all");
              setRadiusFilter([10]);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Gym Grid */}
      {filteredGyms.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGyms.map((gym) => (
            <GymCard key={gym.id} gym={gym} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No gyms found matching your criteria</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery("");
              setPriceFilter("all");
              setRadiusFilter([10]);
            }}
            className="text-primary mt-2"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
