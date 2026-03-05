'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { OwnerGym } from '@/data/owner-gyms';
import { AddressAutocomplete } from '@/components/address-autocomplete';
import { POPULAR_CITIES, GYM_AMENITIES, GYM_EQUIPMENT } from '@/data/locations';

interface GymFormProps {
  onSubmit: (gymData: Omit<OwnerGym, 'id' | 'createdAt' | 'ownerId'>) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GymForm({ onSubmit, isOpen, onOpenChange }: GymFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    address: '',
    coordinates: { lat: 0, lng: 0 },
    radius: 5,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&h=300',
    facilities: [] as string[],
    equipment: [] as string[],
    features: [] as string[],
    operatingHours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '22:00' },
      saturday: { open: '07:00', close: '21:00' },
      sunday: { open: '07:00', close: '21:00' },
    },
    staffCount: 5,
    trainerCount: 3,
    memberCount: 0,
    pricing: {
      weekly: 30,
      monthly: 80,
      quarterly: 200,
      halfYearly: 350,
      yearly: 600,
    },
    amenities: [] as string[],
    phone: '',
    email: '',
    website: '',
  });

  const [currentFacility, setCurrentFacility] = useState('');
  const [currentAmenity, setCurrentAmenity] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    if (keys.length === 1) {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0] as any], [keys[1]]: value }
      }));
    }
  };

  const handleAddressChange = (address: string, coords?: { lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      address,
      coordinates: coords || prev.coordinates
    }));
  };

  const handleCityChange = (city: string) => {
    setFormData(prev => ({ ...prev, city }));
  };

  const addFacility = () => {
    if (currentFacility.trim()) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, currentFacility]
      }));
      setCurrentFacility('');
    }
  };

  const addAmenity = () => {
    if (currentAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, currentAmenity]
      }));
      setCurrentAmenity('');
    }
  };

  const removeFacility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index)
    }));
  };

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      description: '',
      city: '',
      address: '',
      coordinates: { lat: 0, lng: 0 },
      radius: 5,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&h=300',
      facilities: [],
      equipment: [],
      features: [],
      operatingHours: {
        monday: { open: '06:00', close: '22:00' },
        tuesday: { open: '06:00', close: '22:00' },
        wednesday: { open: '06:00', close: '22:00' },
        thursday: { open: '06:00', close: '22:00' },
        friday: { open: '06:00', close: '22:00' },
        saturday: { open: '07:00', close: '21:00' },
        sunday: { open: '07:00', close: '21:00' },
      },
      staffCount: 5,
      trainerCount: 3,
      memberCount: 0,
      pricing: {
        weekly: 30,
        monthly: 80,
        quarterly: 200,
        halfYearly: 350,
        yearly: 600,
      },
      amenities: [],
      phone: '',
      email: '',
      website: '',
    });
    onOpenChange?.(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="h-4 w-4" />
          Add New Gym
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Gym</DialogTitle>
          <DialogDescription>
            Add a new gym to your portfolio
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Basic Information</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium mb-2 block">Gym Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Premium Fitness Hub"
                  className="bg-secondary border-border"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">City</Label>
                <Select value={formData.city} onValueChange={handleCityChange}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {POPULAR_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <AddressAutocomplete
                value={formData.address}
                onChange={handleAddressChange}
                placeholder="Search for an address or use current location"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your gym..."
                className="bg-secondary border-border"
                required
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Information</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium mb-2 block">Phone</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91-9876543210"
                  className="bg-secondary border-border"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="info@gym.com"
                  className="bg-secondary border-border"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Website</Label>
              <Input
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://gymwebsite.com"
                className="bg-secondary border-border"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Pricing</h3>
            
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium mb-2 block">Weekly ($)</Label>
                <Input
                  name="pricing.weekly"
                  type="number"
                  value={formData.pricing.weekly}
                  onChange={handleChange}
                  className="bg-secondary border-border"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Monthly ($)</Label>
                <Input
                  name="pricing.monthly"
                  type="number"
                  value={formData.pricing.monthly}
                  onChange={handleChange}
                  className="bg-secondary border-border"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Quarterly ($)</Label>
                <Input
                  name="pricing.quarterly"
                  type="number"
                  value={formData.pricing.quarterly}
                  onChange={handleChange}
                  className="bg-secondary border-border"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Yearly ($)</Label>
                <Input
                  name="pricing.yearly"
                  type="number"
                  value={formData.pricing.yearly}
                  onChange={handleChange}
                  className="bg-secondary border-border"
                  required
                />
              </div>
            </div>
          </div>

          {/* Facilities & Amenities */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Facilities & Amenities</h3>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Add Facility</Label>
              <div className="flex gap-2">
                <Input
                  value={currentFacility}
                  onChange={(e) => setCurrentFacility(e.target.value)}
                  placeholder="e.g., Weights, Cardio Equipment"
                  className="bg-secondary border-border flex-1"
                />
                <Button type="button" onClick={addFacility} variant="outline" className="border-border bg-transparent">
                  Add
                </Button>
              </div>
              {formData.facilities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.facilities.map((facility, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-secondary">
                      {facility}
                      <button
                        type="button"
                        onClick={() => removeFacility(idx)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Add Amenity</Label>
              <div className="flex gap-2">
                <Input
                  value={currentAmenity}
                  onChange={(e) => setCurrentAmenity(e.target.value)}
                  placeholder="e.g., Locker Room, Shower"
                  className="bg-secondary border-border flex-1"
                />
                <Button type="button" onClick={addAmenity} variant="outline" className="border-border bg-transparent">
                  Add
                </Button>
              </div>
              {formData.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.amenities.map((amenity, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-secondary">
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(idx)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-6 border-t border-border">
            <Button type="button" variant="outline" className="border-border bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Create Gym
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
