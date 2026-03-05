"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { useUser } from "@/contexts/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowLeft,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
  Dumbbell,
  Building2,
  Store,
} from "lucide-react";

export default function WalletPage() {
  const { walletBalance, minimumBalance, transactions, addMoney, businessWallet, gymWallets } = useUser();
  const [addAmount, setAddAmount] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleAddMoney = () => {
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" });
      return;
    }

    const result = addMoney(amount);
    setMessage({ type: result.success ? "success" : "error", text: result.message });
    if (result.success) {
      setAddAmount("");
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const quickAddAmounts = [50, 100, 200, 500];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">My Wallet</h1>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Balance Card */}
            <Card className="border-border/50 md:col-span-2">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/20 rounded-xl">
                      <Wallet className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                      <p className="text-4xl font-bold text-foreground">${walletBalance.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span>Min. balance: ${minimumBalance}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Money Card */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Add Money
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      className="bg-secondary border-border"
                    />
                    <Button
                      onClick={handleAddMoney}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickAddAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setAddAmount(amount.toString())}
                        className="bg-transparent"
                      >
                        +${amount}
                      </Button>
                    ))}
                  </div>
                  {message && (
                    <p
                      className={`text-sm ${
                        message.type === "success" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {message.text}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Business Wallet Info */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Central Business Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">{businessWallet.name}</p>
                  <p className="text-2xl font-bold mt-1">${businessWallet.balance.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Receives payments when you subscribe to a gym
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gym Wallets */}
          {gymWallets.length > 0 && (
            <Card className="mt-6 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  Gym Wallets (After Check-in)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {gymWallets.map((gw) => (
                    <div key={gw.gymId} className="p-4 bg-secondary/50 rounded-lg">
                      <p className="font-medium">{gw.gymName}</p>
                      <p className="text-xl font-bold text-primary mt-1">${gw.balance.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transaction History */}
          <Card className="mt-6 border-border/50">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            txn.type === "credit"
                              ? "bg-green-500/20"
                              : txn.type === "gym_transfer"
                              ? "bg-blue-500/20"
                              : "bg-red-500/20"
                          }`}
                        >
                          {txn.type === "credit" ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-400" />
                          ) : txn.type === "gym_transfer" ? (
                            <Store className="h-4 w-4 text-blue-400" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{txn.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(txn.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            txn.type === "credit" ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {txn.type === "credit" ? "+" : "-"}${txn.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Bal: ${txn.balanceAfter.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No transactions yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <Dumbbell className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GymFinder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 GymFinder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
