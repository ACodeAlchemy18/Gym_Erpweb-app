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

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [allOnboardingData, setAllOnboardingData] = useState<Record<string, OnboardingData>>({});

  useEffect(() => {
    const savedData = localStorage.getItem('onboarding_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setAllOnboardingData(parsed);
      } catch (error) {
        console.error('[v0] Failed to parse onboarding data:', error);
      }
    }
  }, []);

  const saveOnboardingData = (userId: string, role: UserRole, data: Record<string, any>) => {
    const newData = {
      userId,
      role,
      completed: false,
      data,
    };
    const updated = {
      ...allOnboardingData,
      [userId]: newData,
    };
    setAllOnboardingData(updated);
    setOnboardingData(newData);
    localStorage.setItem('onboarding_data', JSON.stringify(updated));
  };

  const getOnboardingData = (userId: string) => {
    return allOnboardingData[userId] || null;
  };

  const completeOnboarding = (userId: string) => {
    const data = allOnboardingData[userId];
    if (data) {
      const completed = {
        ...data,
        completed: true,
      };
      const updated = {
        ...allOnboardingData,
        [userId]: completed,
      };
      setAllOnboardingData(updated);
      setOnboardingData(completed);
      localStorage.setItem('onboarding_data', JSON.stringify(updated));
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
