"use client";

import { Gym } from "@/data/gyms";

export interface Subscription {
  id: string;
  gymId: string;
  gymName: string;
  gymSlug: string;
  planType: "weekly" | "monthly" | "quarterly" | "halfYearly" | "yearly";
  planLabel: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "pending_checkin";
  checkedIn: boolean;
}

export interface Transaction {
  id: string;
  type: "credit" | "debit" | "gym_transfer";
  amount: number;
  description: string;
  date: string;
  balanceAfter: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  fitnessGoal: string;
  age: number;
  weight: string;
  height: string;
}

export interface BusinessWallet {
  name: string;
  balance: number;
}

export interface GymWallet {
  gymId: string;
  gymName: string;
  balance: number;
}

// Dummy user profile
export const userProfile: UserProfile = {
  id: "user-001",
  name: "Rahul Sharma",
  email: "rahul.sharma@email.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80",
  joinDate: "2024-06-15",
  fitnessGoal: "Build Muscle & Strength",
  age: 28,
  weight: "75 kg",
  height: "5'10\"",
};

// Minimum wallet balance required
export const MINIMUM_WALLET_BALANCE = 100;

// Initial wallet balance
const INITIAL_WALLET_BALANCE = 500;

// Business wallet (Aditya Sir)
export const businessWallet: BusinessWallet = {
  name: "Aditya Sir (Central Business)",
  balance: 0,
};

// Gym wallets
export const gymWallets: GymWallet[] = [];

// Store state in memory (simulating localStorage for prototype)
let walletBalance = INITIAL_WALLET_BALANCE;
let subscriptions: Subscription[] = [];
let transactions: Transaction[] = [
  {
    id: "txn-001",
    type: "credit",
    amount: 500,
    description: "Initial wallet top-up",
    date: new Date().toISOString(),
    balanceAfter: 500,
  },
];

// Wallet functions
export function getWalletBalance(): number {
  return walletBalance;
}

export function addMoneyToWallet(amount: number): { success: boolean; message: string } {
  if (amount <= 0) {
    return { success: false, message: "Amount must be greater than 0" };
  }
  
  walletBalance += amount;
  
  const transaction: Transaction = {
    id: `txn-${Date.now()}`,
    type: "credit",
    amount,
    description: "Wallet top-up",
    date: new Date().toISOString(),
    balanceAfter: walletBalance,
  };
  transactions.push(transaction);
  
  return { success: true, message: `$${amount} added to wallet successfully` };
}

export function deductFromWallet(amount: number, description: string): { success: boolean; message: string } {
  if (walletBalance - amount < MINIMUM_WALLET_BALANCE) {
    return { 
      success: false, 
      message: `Insufficient balance. Minimum balance of $${MINIMUM_WALLET_BALANCE} must be maintained.` 
    };
  }
  
  walletBalance -= amount;
  businessWallet.balance += amount;
  
  const transaction: Transaction = {
    id: `txn-${Date.now()}`,
    type: "debit",
    amount,
    description,
    date: new Date().toISOString(),
    balanceAfter: walletBalance,
  };
  transactions.push(transaction);
  
  return { success: true, message: "Payment successful" };
}

export function getTransactions(): Transaction[] {
  return [...transactions].reverse();
}

// Subscription functions
export function getSubscriptions(): Subscription[] {
  return subscriptions;
}

export function getActiveSubscriptions(): Subscription[] {
  const now = new Date();
  return subscriptions.filter(sub => {
    const endDate = new Date(sub.endDate);
    return endDate >= now && (sub.status === "active" || sub.status === "pending_checkin");
  });
}

export function addSubscription(
  gym: Gym,
  planType: "weekly" | "monthly" | "quarterly" | "halfYearly" | "yearly",
  planLabel: string,
  amount: number
): { success: boolean; message: string; subscription?: Subscription } {
  // Check if already subscribed to this gym
  const existingActive = subscriptions.find(
    sub => sub.gymId === gym.id && sub.status !== "expired" && new Date(sub.endDate) >= new Date()
  );
  
  if (existingActive) {
    return { success: false, message: "You already have an active subscription to this gym" };
  }
  
  // Deduct from wallet
  const deductResult = deductFromWallet(amount, `${planLabel} subscription - ${gym.name}`);
  if (!deductResult.success) {
    return { success: false, message: deductResult.message };
  }
  
  // Calculate end date based on plan
  const startDate = new Date();
  const endDate = new Date();
  
  switch (planType) {
    case "weekly":
      endDate.setDate(endDate.getDate() + 7);
      break;
    case "monthly":
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case "quarterly":
      endDate.setMonth(endDate.getMonth() + 3);
      break;
    case "halfYearly":
      endDate.setMonth(endDate.getMonth() + 6);
      break;
    case "yearly":
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
  }
  
  const subscription: Subscription = {
    id: `sub-${Date.now()}`,
    gymId: gym.id,
    gymName: gym.name,
    gymSlug: gym.slug,
    planType,
    planLabel,
    amount,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    status: "pending_checkin",
    checkedIn: false,
  };
  
  subscriptions.push(subscription);
  
  return { success: true, message: "Subscription successful!", subscription };
}

export function checkInAtGym(subscriptionId: string, gymId: string): { success: boolean; message: string } {
  const subscription = subscriptions.find(sub => sub.id === subscriptionId);
  
  if (!subscription) {
    return { success: false, message: "Subscription not found" };
  }
  
  if (subscription.gymId !== gymId) {
    return { success: false, message: "This QR code is not for your subscribed gym" };
  }
  
  if (subscription.checkedIn) {
    return { success: false, message: "Already checked in for this subscription" };
  }
  
  // Update subscription status
  subscription.status = "active";
  subscription.checkedIn = true;
  
  // Transfer money to gym wallet
  let gymWallet = gymWallets.find(gw => gw.gymId === gymId);
  if (!gymWallet) {
    gymWallet = { gymId, gymName: subscription.gymName, balance: 0 };
    gymWallets.push(gymWallet);
  }
  
  // Transfer from business to gym (simulating the flow)
  const transferAmount = subscription.amount * 0.9; // 90% goes to gym, 10% commission
  gymWallet.balance += transferAmount;
  businessWallet.balance -= transferAmount;
  
  // Add transaction record
  const transaction: Transaction = {
    id: `txn-${Date.now()}`,
    type: "gym_transfer",
    amount: transferAmount,
    description: `Check-in transfer to ${subscription.gymName}`,
    date: new Date().toISOString(),
    balanceAfter: walletBalance,
  };
  transactions.push(transaction);
  
  return { success: true, message: `Checked in successfully! $${transferAmount.toFixed(2)} transferred to ${subscription.gymName}` };
}

export function getBusinessWallet(): BusinessWallet {
  return { ...businessWallet };
}

export function getGymWallets(): GymWallet[] {
  return [...gymWallets];
}
