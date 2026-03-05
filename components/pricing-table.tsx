"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gym } from "@/data/gyms";
import { useUser } from "@/contexts/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, AlertCircle, CheckCircle2, Wallet } from "lucide-react";

interface PricingTableProps {
  pricing: Gym["pricing"];
  gym: Gym;
}

const pricingPlans = [
  { key: "weekly" as const, label: "Weekly", description: "Perfect for trying us out" },
  { key: "monthly" as const, label: "Monthly", description: "For regular fitness enthusiasts" },
  { key: "quarterly" as const, label: "Quarterly", description: "3 months of commitment", popular: true },
  { key: "halfYearly" as const, label: "Half Yearly", description: "6 months of dedication" },
  { key: "yearly" as const, label: "Yearly", description: "Best value for serious athletes" },
];

export function PricingTable({ pricing, gym }: PricingTableProps) {
  const router = useRouter();
  const { walletBalance, minimumBalance, subscribe, subscriptions } = useUser();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof pricingPlans[0] | null>(null);
  const [resultMessage, setResultMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const hasActiveSubscription = subscriptions.some(sub => sub.gymId === gym.id);

  const handleChoosePlan = (plan: typeof pricingPlans[0]) => {
    setSelectedPlan(plan);
    setResultMessage(null);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubscription = () => {
    if (!selectedPlan) return;

    const amount = pricing[selectedPlan.key];
    const result = subscribe(gym, selectedPlan.key, selectedPlan.label, amount);
    
    setResultMessage({ type: result.success ? "success" : "error", text: result.message });
    
    if (result.success) {
      setTimeout(() => {
        setConfirmDialogOpen(false);
        router.push("/subscriptions");
      }, 2000);
    }
  };

  const canAfford = (amount: number) => {
    return walletBalance - amount >= minimumBalance;
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {pricingPlans.map((plan) => {
          const isPopular = plan.popular;
          const amount = pricing[plan.key];
          const affordable = canAfford(amount);
          
          return (
            <Card
              key={plan.key}
              className={`relative overflow-hidden transition-all duration-300 hover:border-primary/50 ${
                isPopular ? "border-primary ring-1 ring-primary" : "border-border/50"
              }`}
            >
              {isPopular && (
                <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                  Recommended
                </Badge>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{plan.label}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${amount}</span>
                  <span className="text-muted-foreground">/{plan.key === "weekly" ? "week" : plan.label.toLowerCase().replace(" ", "-")}</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Full gym access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Locker & shower</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Group classes</span>
                  </li>
                  {plan.key !== "weekly" && (
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Guest passes</span>
                    </li>
                  )}
                </ul>
                <Button
                  onClick={() => handleChoosePlan(plan)}
                  disabled={hasActiveSubscription}
                  className={`w-full ${
                    isPopular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {hasActiveSubscription ? "Already Subscribed" : "Choose Plan"}
                </Button>
                {!affordable && !hasActiveSubscription && (
                  <p className="text-xs text-yellow-500 mt-2 text-center">
                    Low wallet balance
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Subscription</DialogTitle>
            <DialogDescription>
              You are about to subscribe to {gym.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="py-4">
              <div className="p-4 bg-secondary/50 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">{selectedPlan.label}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold text-xl">${pricing[selectedPlan.key]}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Wallet className="h-4 w-4" />
                    Wallet Balance
                  </span>
                  <span className="font-medium">${walletBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-muted-foreground">After Payment</span>
                  <span className={`font-medium ${
                    canAfford(pricing[selectedPlan.key]) ? "text-green-400" : "text-red-400"
                  }`}>
                    ${(walletBalance - pricing[selectedPlan.key]).toFixed(2)}
                  </span>
                </div>
              </div>
              
              {!canAfford(pricing[selectedPlan.key]) && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 text-red-400 rounded-lg mb-4">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">
                    Insufficient balance. Min balance of ${minimumBalance} must be maintained.
                  </span>
                </div>
              )}
              
              {resultMessage && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
                    resultMessage.type === "success"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {resultMessage.type === "success" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <span className="text-sm">{resultMessage.text}</span>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground text-center">
                Payment will be transferred to Aditya Sir (Central Business). 
                After check-in at the gym, 90% will be transferred to the gym.
              </p>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubscription}
              disabled={!selectedPlan || !canAfford(pricing[selectedPlan.key]) || resultMessage?.type === "success"}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Confirm & Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
