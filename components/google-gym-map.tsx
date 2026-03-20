'use client';

import { Gym } from '@/data/gyms';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface GoogleGymMapProps {
  gym: Gym;
}

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleGymMap({ gym }: GoogleGymMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  useEffect(() => {
    // Load Google Maps API dynamically
    if (!window.google) {
      const script = document.createElement('script');
     
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!mapRef.current) return;

      const gymLocation = {
        lat: gym.coordinates.lat,
        lng: gym.coordinates.lng,
      };

      // Create map
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        zoom: 13,
        center: gymLocation,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: true,
        styles: [
          {
            elementType: 'geometry',
            stylers: [{ color: '#1a1a2e' }],
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#242c3f' }],
          },
          {
            elementType: 'labels.text.fill',
            stylers: [{ color: '#746855' }],
          },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }],
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9080' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }],
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [{ color: '#4e7c59' }],
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#a29c9d' }],
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }],
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }],
          },
        ],
      });

      // Add marker for gym location
      markerRef.current = new window.google.maps.Marker({
        position: gymLocation,
        map: mapInstance.current,
        title: gym.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#00d4ff',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      // Add circle for service radius
      circleRef.current = new window.google.maps.Circle({
        map: mapInstance.current,
        center: gymLocation,
        radius: gym.radius * 1000, // Convert km to meters
        fillColor: '#00d4ff',
        fillOpacity: 0.15,
        strokeColor: '#00d4ff',
        strokeOpacity: 0.4,
        strokeWeight: 2,
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="color: #000; padding: 8px; font-family: system-ui;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold;">${gym.name}</h3>
            <p style="margin: 2px 0; font-size: 12px;">${gym.address}</p>
            <p style="margin: 2px 0; font-size: 12px;">Service Radius: ${gym.radius} km</p>
          </div>
        `,
      });

      markerRef.current.addListener('click', () => {
        infoWindow.open(mapInstance.current, markerRef.current);
      });

      // Open info window on load
      infoWindow.open(mapInstance.current, markerRef.current);
    }

    return () => {
      // Cleanup if needed
    };
  }, [gym]);

  return (
    <Card className="overflow-hidden border-border/50">
      <div className="relative">
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '400px',
          }}
          className="rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent p-4 pointer-events-none">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{gym.address}</p>
              <p className="text-sm text-muted-foreground">
                {gym.city}, {gym.state} {gym.zipCode}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Service Area Radius</p>
            <p className="text-lg font-semibold text-foreground">{gym.radius} km</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Coverage Area</span>
          </div>
        </div>
        <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${Math.min((gym.radius / 10) * 100, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          We serve customers within a {gym.radius} kilometer radius of our facility
        </p>
      </div>
    </Card>
  );
}
