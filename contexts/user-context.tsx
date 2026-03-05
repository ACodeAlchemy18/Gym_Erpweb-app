"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Gym } from "@/data/gyms";
import {
  userProfile,
  UserProfile,
  Subscription,
  Transaction,
  BusinessWallet,
  GymWallet,
  MINIMUM_WALLET_BALANCE,
  getWalletBalance,
  addMoneyToWallet,
  getTransactions,
  getActiveSubscriptions,
  addSubscription,
  checkInAtGym,
  getBusinessWallet,
  getGymWallets,
} from "@/data/user-store";

interface UserContextType {
  profile: UserProfile;
  walletBalance: number;
  minimumBalance: number;
  transactions: Transaction[];
  subscriptions: Subscription[];
  businessWallet: BusinessWallet;
  gymWallets: GymWallet[];
  addMoney: (amount: number) => { success: boolean; message: string };
  subscribe: (
    gym: Gym,
    planType: "weekly" | "monthly" | "quarterly" | "halfYearly" | "yearly",
    planLabel: string,
    amount: number
  ) => { success: boolean; message: string; subscription?: Subscription };
  checkIn: (subscriptionId: string, gymId: string) => { success: boolean; message: string };
  refreshData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [walletBalance, setWalletBalance] = useState(getWalletBalance());
  const [transactions, setTransactions] = useState<Transaction[]>(getTransactions());
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(getActiveSubscriptions());
  const [businessWallet, setBusinessWallet] = useState<BusinessWallet>(getBusinessWallet());
  const [gymWallets, setGymWallets] = useState<GymWallet[]>(getGymWallets());

  const refreshData = useCallback(() => {
    setWalletBalance(getWalletBalance());
    setTransactions(getTransactions());
    setSubscriptions(getActiveSubscriptions());
    setBusinessWallet(getBusinessWallet());
    setGymWallets(getGymWallets());
  }, []);

  const addMoney = useCallback((amount: number) => {
    const result = addMoneyToWallet(amount);
    if (result.success) {
      refreshData();
    }
    return result;
  }, [refreshData]);

  const subscribe = useCallback((
    gym: Gym,
    planType: "weekly" | "monthly" | "quarterly" | "halfYearly" | "yearly",
    planLabel: string,
    amount: number
  ) => {
    const result = addSubscription(gym, planType, planLabel, amount);
    if (result.success) {
      refreshData();
    }
    return result;
  }, [refreshData]);

  const checkIn = useCallback((subscriptionId: string, gymId: string) => {
    const result = checkInAtGym(subscriptionId, gymId);
    if (result.success) {
      refreshData();
    }
    return result;
  }, [refreshData]);

  return (
    <UserContext.Provider
      value={{
        profile: userProfile,
        walletBalance,
        minimumBalance: MINIMUM_WALLET_BALANCE,
        transactions,
        subscriptions,
        businessWallet,
        gymWallets,
        addMoney,
        subscribe,
        checkIn,
        refreshData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
