"use client";

import { Header } from "@/components/header";
import { ProfileDetails } from "@/components/profile-details";
import { useAuth } from "@/contexts/auth-context";
import { useUser } from "@/contexts/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Target,
  Scale,
  Ruler,
  Dumbbell,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, subscriptions } = useUser();

  const memberSince = new Date(profile.joinDate).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <img
              src={profile.avatar || "/placeholder.svg"}
              alt={profile.name}
              className="h-32 w-32 rounded-full object-cover border-4 border-primary/20"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
              <p className="text-muted-foreground mt-1">Member since {memberSince}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <Badge variant="secondary" className="text-sm">
                  {subscriptions.length} Active Subscription{subscriptions.length !== 1 ? "s" : ""}
                </Badge>
                <Badge className="bg-primary text-primary-foreground text-sm">
                  Premium Member
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <Card className="mb-6 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{profile.age} years old</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Onboarding Details */}
          <ProfileDetails />

          {/* Active Subscriptions Summary */}
          {subscriptions.length > 0 && (
            <Card className="mt-6 border-border/50">
              <CardHeader>
                <CardTitle>Active Gym Memberships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{sub.gymName}</p>
                        <p className="text-sm text-muted-foreground">{sub.planLabel} Plan</p>
                      </div>
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
                  ))}
                </div>
                <Link href="/subscriptions">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Subscriptions
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
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
