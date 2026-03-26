"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { useUser } from "@/contexts/user-context";
import { useAuth } from "@/contexts/auth-context";
import { getGymBySlug } from "@/data/gyms";
import { getUserBookings, cancelBooking, PLAN_META, type TrainerBooking } from "@/data/trainer-booking-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import {
  ArrowLeft, Calendar, MapPin, QrCode, Dumbbell, CheckCircle2, AlertCircle,
  Users, ChevronRight, Clock, CreditCard, Star, User, Trash2,
} from "lucide-react";

export default function SubscriptionsPage() {
  const { subscriptions, checkIn } = useUser();
  const { user } = useAuth();
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const [checkInMessage, setCheckInMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [trainerBookings, setTrainerBookings] = useState<TrainerBooking[]>([]);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) setTrainerBookings(getUserBookings(user.id));
  }, [user]);

  const refreshBookings = () => { if (user) setTrainerBookings(getUserBookings(user.id)); };

  const handleCancelBooking = () => {
    if (!cancelBookingId) return;
    cancelBooking(cancelBookingId);
    refreshBookings();
    setCancelBookingId(null);
  };

  const handleScanQR = (id: string) => { setSelectedSubscription(id); setQrDialogOpen(true); setCheckInMessage(null); };
  const handleCheckIn = () => {
    if (!selectedSubscription) return;
    const sub = subscriptions.find(s => s.id === selectedSubscription);
    if (!sub) return;
    const result = checkIn(selectedSubscription, sub.gymId);
    setCheckInMessage({ type: result.success ? "success" : "error", text: result.message });
    if (result.success) setTimeout(() => { setQrDialogOpen(false); setCheckInMessage(null); }, 2000);
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const daysLeft = (end: string) => Math.max(0, Math.ceil((new Date(end).getTime() - Date.now()) / 86400000));
  const activeCount = subscriptions.filter(s => s.status === "active" || s.status === "pending_checkin").length;

  // Group trainer bookings by gym
  const bookingsByGym = trainerBookings.reduce<Record<string, TrainerBooking[]>>((acc, b) => {
    if (!acc[b.gymId]) acc[b.gymId] = [];
    acc[b.gymId].push(b);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/"><Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>

        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground mt-1">Your gym memberships and trainer sessions</p>
          </div>
          <Link href="/"><Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"><Dumbbell className="h-4 w-4" />Browse Gyms</Button></Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="border-border/50 p-4 text-center">
            <p className="text-2xl font-bold text-primary">{activeCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Active Memberships</p>
          </Card>
          <Card className="border-border/50 p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">{trainerBookings.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Trainer Bookings</p>
          </Card>
          <Card className="border-border/50 p-4 text-center">
            <p className="text-2xl font-bold text-green-500">₹{subscriptions.reduce((s, sub) => s + sub.amount, 0) + trainerBookings.reduce((s, b) => s + b.amount, 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Invested</p>
          </Card>
        </div>

        {/* GYM MEMBERSHIPS */}
        {subscriptions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Gym Memberships</h2>
            <div className="space-y-4">
              {subscriptions.map(sub => {
                const gym = getGymBySlug(sub.gymSlug);
                const days = daysLeft(sub.endDate);
                const isActive = sub.status === "active" || sub.status === "pending_checkin";
                const gymBookings = bookingsByGym[sub.gymId] || [];

                return (
                  <Card key={sub.id} className="border-border/50 overflow-hidden">
                    <div className={`h-1 ${isActive ? "bg-green-500" : "bg-muted"}`} />
                    <CardContent className="p-5">
                      {/* Gym header */}
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                        {gym && <img src={gym.photos[0] || "/placeholder.svg"} alt={gym.name} className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0" />}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-bold text-foreground">{sub.gymName}</h3>
                              {gym && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{gym.city}, {gym.state}</p>}
                            </div>
                            <Badge className={isActive ? "bg-green-500/20 text-green-400 text-xs" : "bg-yellow-500/20 text-yellow-500 text-xs"}>
                              {isActive ? "✅ Active" : "⏳ Check-in Needed"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                            <div className="p-2 bg-secondary/50 rounded-lg text-center">
                              <p className="text-xs text-muted-foreground">Plan</p><p className="text-xs font-bold">{sub.planLabel}</p>
                            </div>
                            <div className="p-2 bg-secondary/50 rounded-lg text-center">
                              <p className="text-xs text-muted-foreground">Paid</p><p className="text-xs font-bold">₹{sub.amount}</p>
                            </div>
                            <div className="p-2 bg-secondary/50 rounded-lg text-center">
                              <p className="text-xs text-muted-foreground">Expires</p><p className="text-xs font-bold">{fmt(sub.endDate)}</p>
                            </div>
                            <div className={`p-2 rounded-lg text-center ${days <= 7 ? "bg-red-500/10" : "bg-primary/10"}`}>
                              <p className="text-xs text-muted-foreground">Days Left</p>
                              <p className={`text-base font-bold ${days <= 7 ? "text-red-400" : "text-primary"}`}>{days}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Link href={`/gym/${sub.gymSlug}`}><Button variant="outline" size="sm" className="border-border bg-transparent text-xs">View Gym</Button></Link>
                            {isActive && <Link href={`/gym/${sub.gymSlug}#trainers`}><Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs gap-1"><Users className="h-3 w-3" />Browse Trainers</Button></Link>}
                            {sub.status === "pending_checkin" && <Button size="sm" variant="outline" className="border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/10 text-xs gap-1" onClick={() => handleScanQR(sub.id)}><QrCode className="h-3 w-3" />Scan to Check-in</Button>}
                          </div>
                        </div>
                      </div>

                      {/* Trainer Bookings for this gym */}
                      {gymBookings.length > 0 && (
                        <div className="border-t border-border/50 pt-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Booked Trainers</p>
                          <div className="space-y-2">
                            {gymBookings.map(booking => (
                              <div key={booking.id} className="flex items-center gap-3 p-3 bg-secondary/40 rounded-lg">
                                <img src={booking.trainerAvatar} alt={booking.trainerName} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-foreground">{booking.trainerName}</p>
                                  <p className="text-xs text-muted-foreground">{booking.trainerSpecialization} · {PLAN_META[booking.plan].label}</p>
                                  <p className="text-xs text-muted-foreground">{booking.sessions} sessions · ₹{booking.amount}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <Badge className="bg-green-500/20 text-green-400 text-xs">✅ Confirmed</Badge>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => setCancelBookingId(booking.id)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* ALL TRAINER BOOKINGS (those without a matching subscription) */}
        {trainerBookings.filter(b => !subscriptions.find(s => s.gymId === b.gymId)).length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Other Trainer Bookings</h2>
            <div className="space-y-3">
              {trainerBookings.filter(b => !subscriptions.find(s => s.gymId === b.gymId)).map(booking => (
                <Card key={booking.id} className="border-border/50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <img src={booking.trainerAvatar} alt={booking.trainerName} className="h-12 w-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{booking.trainerName}</p>
                      <p className="text-xs text-muted-foreground">{booking.trainerSpecialization} · {booking.gymName}</p>
                      <p className="text-xs text-muted-foreground">{PLAN_META[booking.plan].label} · {booking.sessions} sessions · ₹{booking.amount}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500/20 text-green-400 text-xs">✅ Confirmed</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setCancelBookingId(booking.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {subscriptions.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="py-16 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-xl font-semibold mb-2">No Active Memberships</h3>
              <p className="text-muted-foreground mb-6">Browse our gyms and subscribe to get started!</p>
              <Link href="/"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Explore Gyms</Button></Link>
            </CardContent>
          </Card>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Link href="/workout"><Card className="border-border/50 p-4 hover:border-primary/50 transition-colors cursor-pointer"><div className="flex items-center gap-3"><Dumbbell className="h-5 w-5 text-primary" /><div><p className="font-medium text-sm">Workout Plans</p><p className="text-xs text-muted-foreground">View your programs</p></div></div></Card></Link>
          <Link href="/diet"><Card className="border-border/50 p-4 hover:border-primary/50 transition-colors cursor-pointer"><div className="flex items-center gap-3"><span className="text-xl">🥗</span><div><p className="font-medium text-sm">Diet Plans</p><p className="text-xs text-muted-foreground">Your nutrition guide</p></div></div></Card></Link>
        </div>
      </main>

      {/* QR Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader><DialogTitle>Check-in QR</DialogTitle><DialogDescription>Show at gym entrance</DialogDescription></DialogHeader>
          <div className="flex flex-col items-center py-4">
            <div className="bg-white p-4 rounded-xl">
              <svg width="160" height="160" viewBox="0 0 200 200"><rect width="200" height="200" fill="white"/><rect x="10" y="10" width="50" height="50" fill="black"/><rect x="17" y="17" width="36" height="36" fill="white"/><rect x="24" y="24" width="22" height="22" fill="black"/><rect x="140" y="10" width="50" height="50" fill="black"/><rect x="147" y="17" width="36" height="36" fill="white"/><rect x="154" y="24" width="22" height="22" fill="black"/><rect x="10" y="140" width="50" height="50" fill="black"/><rect x="17" y="147" width="36" height="36" fill="white"/><rect x="24" y="154" width="22" height="22" fill="black"/><rect x="70" y="10" width="10" height="10" fill="black"/><rect x="90" y="10" width="10" height="10" fill="black"/><rect x="70" y="70" width="10" height="10" fill="black"/><rect x="130" y="90" width="10" height="10" fill="black"/></svg>
            </div>
            {checkInMessage && (
              <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 w-full ${checkInMessage.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {checkInMessage.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                <span className="text-sm">{checkInMessage.text}</span>
              </div>
            )}
            <Button onClick={handleCheckIn} className="mt-4 bg-primary text-primary-foreground" disabled={checkInMessage?.type === "success"}>Simulate Check-in</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel booking confirm */}
      <AlertDialog open={!!cancelBookingId} onOpenChange={() => setCancelBookingId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader><AlertDialogTitle>Cancel Trainer Booking?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-transparent">Keep</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelBooking} className="bg-destructive text-destructive-foreground">Cancel Booking</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
