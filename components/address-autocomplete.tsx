'use client';

import React from "react"

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, coords?: { lat: number; lng: number }) => void;
  label?: string;
  placeholder?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  label = 'Address',
  placeholder = 'Enter your gym address',
}: AddressAutocompleteProps) {
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Mock address suggestions for demo - in production would use Google Places API
  const mockSuggestions = (query: string) => {
    const addressDb = [
      { address: '123 Fitness Street, Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777 },
      { address: '456 Gym Avenue, Delhi, Delhi', lat: 28.7041, lng: 77.1025 },
      { address: '789 Health Road, Bangalore, Karnataka', lat: 12.9716, lng: 77.5946 },
      { address: '321 Exercise Lane, Hyderabad, Telangana', lat: 17.3850, lng: 78.4867 },
      { address: '654 Wellness Park, Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707 },
    ];

    return addressDb.filter(
      (item) =>
        item.address.toLowerCase().includes(query.toLowerCase()) &&
        query.length > 0
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 2) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setSuggestions(mockSuggestions(value));
        setLoading(false);
        setShowSuggestions(true);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectAddress = (address: string, lat: number, lng: number) => {
    setInput(address);
    onChange(address, { lat, lng });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleUseCurrentLocation = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding mock - in production would use actual API
          const mockAddress = `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          setInput(mockAddress);
          onChange(mockAddress, { lat: latitude, lng: longitude });
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="pr-10"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleUseCurrentLocation}
            disabled={loading}
            title="Use current location"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <Card
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 p-0 border-border/50 z-50 max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() =>
                  handleSelectAddress(
                    suggestion.address,
                    suggestion.lat,
                    suggestion.lng
                  )
                }
                className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors border-b border-border/30 last:border-b-0 flex items-start gap-3"
              >
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {suggestion.address}
                  </p>
                </div>
              </button>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
