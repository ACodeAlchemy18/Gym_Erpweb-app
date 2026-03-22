'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from './auth-context';

export interface OnboardingData {
  userId: string;
  role: UserRole;
  completed: boolean;
  data: Record<string, any>;
}

interface OnboardingContextType {
  onboardingData: OnboardingData | null;
  saveOnboardingData: (userId: string, role: UserRole, data: Record<string, any>) => void;
  getOnboardingData: (userId: string) => OnboardingData | null;
  completeOnboarding: (userId: string) => void;
  isOnboardingCompleted: (userId: string) => boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Fields that hold large base64 image data — strip these before saving to localStorage
// but keep them alive in React state (in-memory only).
const IMAGE_FIELDS = ['avatar', 'profilePhoto', 'image'];

function stripImages(data: Record<string, any>): Record<string, any> {
  const stripped = { ...data };
  IMAGE_FIELDS.forEach(key => {
    if (stripped[key] && typeof stripped[key] === 'string' && stripped[key].startsWith('data:')) {
      delete stripped[key];
    }
  });
  return stripped;
}

function safeSave(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (e: any) {
    if (e?.name === 'QuotaExceededError' || e?.code === 22) {
      // Last resort: clear old onboarding data and retry once
      try {
        localStorage.removeItem(key);
        localStorage.setItem(key, value);
      } catch {
        // Still failing — silently ignore, data lives in React state
        console.warn('localStorage quota exceeded — onboarding data kept in memory only.');
      }
    }
  }
}

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  // allOnboardingData holds the FULL data including images (in memory)
  const [allOnboardingData, setAllOnboardingData] = useState<Record<string, OnboardingData>>({});

  useEffect(() => {
    const savedData = localStorage.getItem('onboarding_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setAllOnboardingData(parsed);
      } catch (error) {
        console.error('Failed to parse onboarding data:', error);
      }
    }
  }, []);

  const saveOnboardingData = (userId: string, role: UserRole, data: Record<string, any>) => {
    const newData: OnboardingData = {
      userId,
      role,
      completed: false,
      data, // full data with images — lives in memory
    };

    const updated = {
      ...allOnboardingData,
      [userId]: newData,
    };

    setAllOnboardingData(updated);
    setOnboardingData(newData);

    // Persist to localStorage but WITHOUT image data (too large)
    const updatedForStorage: Record<string, OnboardingData> = {};
    Object.entries(updated).forEach(([uid, record]) => {
      updatedForStorage[uid] = {
        ...record,
        data: stripImages(record.data),
      };
    });
    safeSave('onboarding_data', JSON.stringify(updatedForStorage));
  };

  const getOnboardingData = (userId: string) => {
    return allOnboardingData[userId] || null;
  };

  const completeOnboarding = (userId: string) => {
    const data = allOnboardingData[userId];
    if (data) {
      const completed: OnboardingData = {
        ...data,
        completed: true,
      };
      const updated = {
        ...allOnboardingData,
        [userId]: completed,
      };
      setAllOnboardingData(updated);
      setOnboardingData(completed);

      const updatedForStorage: Record<string, OnboardingData> = {};
      Object.entries(updated).forEach(([uid, record]) => {
        updatedForStorage[uid] = {
          ...record,
          data: stripImages(record.data),
        };
      });
      safeSave('onboarding_data', JSON.stringify(updatedForStorage));
    }
  };

  const isOnboardingCompleted = (userId: string) => {
    return allOnboardingData[userId]?.completed || false;
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        saveOnboardingData,
        getOnboardingData,
        completeOnboarding,
        isOnboardingCompleted,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
