"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { useUser } from "@/contexts/user-context";
import { getGymBySlug } from "@/data/gyms";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  ArrowLeft, Calendar, MapPin, QrCode, Dumbbell,
  CheckCircle2, AlertCircle, Users, ChevronRight,
  Clock, CreditCard, Star,
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
      setTimeout(() => { setQrDialogOpen(false); setCheckInMessage(null); }, 2000);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const daysLeft = (end: string) =>
    Math.max(0, Math.ceil((new Date(end).getTime() - Date.now()) / 86400000));

  const activeCount = subscriptions.filter(s => s.status === "active" || s.status === "pending_checkin").length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />Back to home
          </Button>
        </Link>

        {/* Page header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your gym memberships and trainer bookings</p>
          </div>
          <Link href="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Dumbbell className="h-4 w-4" />Browse More Gyms
            </Button>
          </Link>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="border-border/50 p-4 text-center">
            <p className="text-2xl font-bold text-primary">{activeCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Active Memberships</p>
          </Card>
          <Card className="border-border/50 p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{subscriptions.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Subscriptions</p>
          </Card>
          <Card className="border-border/50 p-4 text-center">
            <p className="text-2xl font-bold text-green-500">
              ₹{subscriptions.reduce((s, sub) => s + sub.amount, 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total Invested</p>
          </Card>
        </div>

        {/* Subscriptions list */}
        {subscriptions.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-16 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-xl font-semibold mb-2">No Active Memberships</h3>
              <p className="text-muted-foreground mb-6">
                You don't have any gym subscriptions yet. Browse our gyms to get started!
              </p>
              <Link href="/">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Explore Gyms
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-foreground">Your Gym Memberships</h2>

            {subscriptions.map((sub) => {
              const gym = getGymBySlug(sub.gymSlug);
              const days = daysLeft(sub.endDate);
              const isActive = sub.status === "active" || sub.status === "pending_checkin";

              return (
                <Card key={sub.id} className="border-border/50 overflow-hidden">
                  {/* Top accent */}
                  <div className={`h-1 ${isActive ? "bg-green-500" : "bg-muted"}`} />

                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Gym image */}
                      {gym && (
                        <div className="md:w-44 h-36 md:h-auto shrink-0 overflow-hidden">
                          <img
                            src={gym.photos[0] || "/placeholder.svg"}
                            alt={gym.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 p-5">
                        {/* Gym name + status */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-foreground">{sub.gymName}</h3>
                            {gym && (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{gym.city}, {gym.state}</span>
                                {gym.rating && (
                                  <span className="flex items-center gap-0.5 ml-2">
                                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                    {gym.rating}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <Badge className={isActive
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-muted text-muted-foreground"
                          }>
                            {sub.status === "active" ? "✅ Active" : "⏳ Pending Check-in"}
                          </Badge>
                        </div>

                        {/* Plan details */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
                          <div className="p-2 bg-secondary/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />Plan
                            </p>
                            <p className="font-medium text-foreground">{sub.planLabel}</p>
                          </div>
                          <div className="p-2 bg-secondary/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-0.5">Amount Paid</p>
                            <p className="font-medium text-foreground">₹{sub.amount}</p>
                          </div>
                          <div className="p-2 bg-secondary/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                              <Clock className="h-3 w-3" />Expires
                            </p>
                            <p className="font-medium text-foreground">{formatDate(sub.endDate)}</p>
                          </div>
                          <div className={`p-2 rounded-lg ${days <= 7 ? "bg-red-500/10 border border-red-500/20" : "bg-primary/10"}`}>
                            <p className="text-xs text-muted-foreground mb-0.5">Days Left</p>
                            <p className={`font-bold text-lg ${days <= 7 ? "text-red-400" : "text-primary"}`}>
                              {days}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2">
                          {/* View Gym */}
                          <Link href={`/gym/${sub.gymSlug}`}>
                            <Button variant="outline" size="sm" className="border-border bg-transparent gap-1.5 text-xs">
                              View Gym
                            </Button>
                          </Link>

                          {/* Browse Trainers — PRIMARY CTA, only active members */}
                          {isActive && (
                            <Link href={`/gym/${sub.gymSlug}#trainers`}>
                              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-xs">
                                <Users className="h-3.5 w-3.5" />
                                Browse Trainers
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          )}

                          {/* Check-in QR */}
                          {sub.status === "pending_checkin" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/10 gap-1.5 text-xs"
                              onClick={() => handleScanQR(sub.id)}
                            >
                              <QrCode className="h-3.5 w-3.5" />Scan to Check-in
                            </Button>
                          )}
                        </div>

                        {/* Trainer unlock notice for pending checkin */}
                        {sub.status === "pending_checkin" && (
                          <p className="text-xs text-muted-foreground mt-2">
                            💡 Check in at the gym first to unlock trainer booking
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Trainer bookings shortcut */}
            <Link href="/subscriptions/bookings">
              <Card className="border-border/50 border-dashed p-4 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">My Trainer Bookings</p>
                      <p className="text-xs text-muted-foreground">View and manage your booked trainer sessions</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Card>
            </Link>
          </div>
        )}
      </main>

      {/* QR Check-in Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>Scan QR Code to Check-in</DialogTitle>
            <DialogDescription>Show this at the gym entrance to complete your check-in</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <svg width="180" height="180" viewBox="0 0 200 200">
                <rect x="0" y="0" width="200" height="200" fill="white" />
                <rect x="10" y="10" width="50" height="50" fill="black" />
                <rect x="17" y="17" width="36" height="36" fill="white" />
                <rect x="24" y="24" width="22" height="22" fill="black" />
                <rect x="140" y="10" width="50" height="50" fill="black" />
                <rect x="147" y="17" width="36" height="36" fill="white" />
                <rect x="154" y="24" width="22" height="22" fill="black" />
                <rect x="10" y="140" width="50" height="50" fill="black" />
                <rect x="17" y="147" width="36" height="36" fill="white" />
                <rect x="24" y="154" width="22" height="22" fill="black" />
                <rect x="70" y="10" width="10" height="10" fill="black" />
                <rect x="90" y="10" width="10" height="10" fill="black" />
                <rect x="110" y="10" width="10" height="10" fill="black" />
                <rect x="70" y="30" width="10" height="10" fill="black" />
                <rect x="90" y="70" width="10" height="10" fill="black" />
                <rect x="110" y="70" width="10" height="10" fill="black" />
                <rect x="130" y="90" width="10" height="10" fill="black" />
                <rect x="150" y="110" width="10" height="10" fill="black" />
                <rect x="70" y="130" width="10" height="10" fill="black" />
                <rect x="110" y="150" width="10" height="10" fill="black" />
                <rect x="130" y="170" width="10" height="10" fill="black" />
              </svg>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Prototype: click "Simulate Check-in" below
            </p>
            {checkInMessage && (
              <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 w-full ${
                checkInMessage.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}>
                {checkInMessage.type === "success"
                  ? <CheckCircle2 className="h-5 w-5 shrink-0" />
                  : <AlertCircle className="h-5 w-5 shrink-0" />}
                <span className="text-sm">{checkInMessage.text}</span>
              </div>
            )}
            <Button
              onClick={handleCheckIn}
              className="mt-5 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={checkInMessage?.type === "success"}
            >
              Simulate Check-in
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="py-12 border-t border-border/50 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <Dumbbell className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GymFinder</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 GymFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
