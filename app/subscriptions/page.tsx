"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { useUser } from "@/contexts/user-context";
import { getGymBySlug } from "@/data/gyms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  QrCode,
  Dumbbell,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SubscriptionsPage() {
  const { subscriptions, checkIn } = useUser();
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const [checkInMessage, setCheckInMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleScanQR = (subscriptionId: string) => {
    setSelectedSubscription(subscriptionId);
    setQrDialogOpen(true);
    setCheckInMessage(null);
  };

  const handleCheckIn = () => {
    if (!selectedSubscription) return;
    
    const sub = subscriptions.find(s => s.id === selectedSubscription);
    if (!sub) return;

    const result = checkIn(selectedSubscription, sub.gymId);
    setCheckInMessage({ type: result.success ? "success" : "error", text: result.message });
    
    if (result.success) {
      setTimeout(() => {
        setQrDialogOpen(false);
        setCheckInMessage(null);
      }, 2000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Gym Subscriptions</h1>
            <Link href="/">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Browse Gyms
              </Button>
            </Link>
          </div>

          {subscriptions.length > 0 ? (
            <div className="space-y-4">
              {subscriptions.map((sub) => {
                const gym = getGymBySlug(sub.gymSlug);
                const daysRemaining = getDaysRemaining(sub.endDate);
                
                return (
                  <Card key={sub.id} className="border-border/50 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Gym Image */}
                      {gym && (
                        <div className="md:w-48 h-32 md:h-auto">
                          <img
                            src={gym.photos[0] || "/placeholder.svg"}
                            alt={gym.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <CardContent className="flex-1 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold">{sub.gymName}</h3>
                              <Badge
                                className={
                                  sub.status === "active"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }
                              >
                                {sub.status === "active" ? "Active" : "Pending Check-in"}
                              </Badge>
                            </div>
                            
                            {gym && (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                                <MapPin className="h-4 w-4" />
                                <span>{gym.city}, {gym.state}</span>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Plan</p>
                                <p className="font-medium">{sub.planLabel}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Amount Paid</p>
                                <p className="font-medium">${sub.amount}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Start Date</p>
                                <p className="font-medium">{formatDate(sub.startDate)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">End Date</p>
                                <p className="font-medium">{formatDate(sub.endDate)}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-3">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Days Remaining</p>
                              <p className="text-2xl font-bold text-primary">{daysRemaining}</p>
                            </div>
                            
                            {sub.status === "pending_checkin" && (
                              <Button
                                onClick={() => handleScanQR(sub.id)}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                              >
                                <QrCode className="h-4 w-4 mr-2" />
                                Scan QR to Check-in
                              </Button>
                            )}
                            
                            {sub.status === "active" && (
                              <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="text-sm font-medium">Checked In</span>
                              </div>
                            )}
                            
                            <Link href={`/gym/${sub.gymSlug}`}>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                View Gym
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-border/50">
              <CardContent className="py-16 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Subscriptions</h3>
                <p className="text-muted-foreground mb-6">
                  You don't have any gym subscriptions yet. Browse our gyms and find your perfect fit!
                </p>
                <Link href="/">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Explore Gyms
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code at the gym to complete your check-in
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-6">
            {/* Dummy QR Code */}
            <div className="bg-white p-4 rounded-lg">
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                className="text-black"
              >
                {/* QR Code Pattern - Simplified dummy version */}
                <rect x="0" y="0" width="200" height="200" fill="white" />
                {/* Position detection patterns */}
                <rect x="10" y="10" width="50" height="50" fill="black" />
                <rect x="17" y="17" width="36" height="36" fill="white" />
                <rect x="24" y="24" width="22" height="22" fill="black" />
                
                <rect x="140" y="10" width="50" height="50" fill="black" />
                <rect x="147" y="17" width="36" height="36" fill="white" />
                <rect x="154" y="24" width="22" height="22" fill="black" />
                
                <rect x="10" y="140" width="50" height="50" fill="black" />
                <rect x="17" y="147" width="36" height="36" fill="white" />
                <rect x="24" y="154" width="22" height="22" fill="black" />
                
                {/* Random data modules */}
                <rect x="70" y="10" width="10" height="10" fill="black" />
                <rect x="90" y="10" width="10" height="10" fill="black" />
                <rect x="110" y="10" width="10" height="10" fill="black" />
                <rect x="70" y="30" width="10" height="10" fill="black" />
                <rect x="90" y="30" width="10" height="10" fill="black" />
                <rect x="70" y="50" width="10" height="10" fill="black" />
                <rect x="110" y="50" width="10" height="10" fill="black" />
                
                <rect x="70" y="70" width="10" height="10" fill="black" />
                <rect x="90" y="70" width="10" height="10" fill="black" />
                <rect x="110" y="70" width="10" height="10" fill="black" />
                <rect x="130" y="70" width="10" height="10" fill="black" />
                <rect x="150" y="70" width="10" height="10" fill="black" />
                <rect x="170" y="70" width="10" height="10" fill="black" />
                
                <rect x="10" y="70" width="10" height="10" fill="black" />
                <rect x="30" y="70" width="10" height="10" fill="black" />
                <rect x="50" y="70" width="10" height="10" fill="black" />
                
                <rect x="70" y="90" width="10" height="10" fill="black" />
                <rect x="110" y="90" width="10" height="10" fill="black" />
                <rect x="130" y="90" width="10" height="10" fill="black" />
                <rect x="170" y="90" width="10" height="10" fill="black" />
                
                <rect x="70" y="110" width="10" height="10" fill="black" />
                <rect x="90" y="110" width="10" height="10" fill="black" />
                <rect x="110" y="110" width="10" height="10" fill="black" />
                <rect x="150" y="110" width="10" height="10" fill="black" />
                
                <rect x="70" y="130" width="10" height="10" fill="black" />
                <rect x="130" y="130" width="10" height="10" fill="black" />
                <rect x="150" y="130" width="10" height="10" fill="black" />
                <rect x="170" y="130" width="10" height="10" fill="black" />
                
                <rect x="70" y="150" width="10" height="10" fill="black" />
                <rect x="90" y="150" width="10" height="10" fill="black" />
                <rect x="130" y="150" width="10" height="10" fill="black" />
                <rect x="170" y="150" width="10" height="10" fill="black" />
                
                <rect x="70" y="170" width="10" height="10" fill="black" />
                <rect x="110" y="170" width="10" height="10" fill="black" />
                <rect x="130" y="170" width="10" height="10" fill="black" />
                <rect x="150" y="170" width="10" height="10" fill="black" />
              </svg>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4 text-center">
              In a real scenario, this QR would be scanned at the gym entrance
            </p>
            
            {checkInMessage && (
              <div
                className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                  checkInMessage.type === "success"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {checkInMessage.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span className="text-sm">{checkInMessage.text}</span>
              </div>
            )}
            
            <Button
              onClick={handleCheckIn}
              className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={checkInMessage?.type === "success"}
            >
              Simulate Check-in
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
