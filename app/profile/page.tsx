"use client";

import { Header } from "@/components/header";
import { ProfileDetails } from "@/components/profile-details";
import { useAuth } from "@/contexts/auth-context";
import { useUser } from "@/contexts/user-context";
import { useOnboarding } from "@/contexts/onboarding-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft, User, Mail, Phone, Calendar, MapPin,
  Dumbbell, Edit2, Instagram, Twitter, Facebook, Youtube, Globe,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { subscriptions } = useUser();
  const { getOnboardingData } = useOnboarding();

  if (!user) return null;

  // Onboarding data has the rich profile info filled during onboarding
  const onboarding = getOnboardingData(user.id);
  const od = onboarding?.data || {};
  console.log("OD DATA:", od);
console.log("GYM PHOTOS:", od.gymPhotos);


  // ── Build display values: onboarding data first, fallback to auth signup data ──
  const displayName  = od.displayName  || user.name;
  const displayEmail = user.email;                       // always from auth
  const displayPhone = od.phone        || user.mobile;
  const displayCity  = od.city         || user.city;
  const displayArea  = od.area;
  const displayAvatar = od.avatar      || user.avatar
    || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;

  // Age from date of birth (entered in onboarding)
  let displayAge: string | null = null;
  if (od.dateOfBirth) {
    const dob = new Date(od.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear()
      - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
    displayAge = `${age} years`;
  }

  const displayGender = od.gender
    ? ({ male: 'Male', female: 'Female', non_binary: 'Non-binary', prefer_not: 'Prefer not to say' }[od.gender as string] || od.gender)
    : null;

  const memberSince = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  // Role label
  const roleLabel: Record<string, string> = {
    user: 'Fitness Enthusiast',
    trainer: 'Personal Trainer',
    owner: 'Gym Owner',
    admin: 'Platform Admin',
  };

  // Social links from onboarding
  const socials = [
    { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500', prefix: '@' },
    { key: 'twitter',   label: 'Twitter',   icon: Twitter,   color: 'text-sky-400',  prefix: '@' },
    { key: 'facebook',  label: 'Facebook',  icon: Facebook,  color: 'text-blue-500', prefix: '' },
    { key: 'youtube',   label: 'YouTube',   icon: Youtube,   color: 'text-red-500',  prefix: '' },
    { key: 'website',   label: 'Website',   icon: Globe,     color: 'text-muted-foreground', prefix: '' },
  ].filter(s => od[s.key]);
 

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />Back to home
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">

          {/* ── PROFILE HERO ── */}
          <Card className="mb-6 border-border/50 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
            <CardContent className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-12">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="h-24 w-24 rounded-2xl object-cover border-4 border-background shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-background" />
                </div>

                {/* Name + badges */}
                <div className="flex-1 text-center sm:text-left pb-1">
                  <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
                  <p className="text-muted-foreground text-sm">{roleLabel[user.role] || user.role}</p>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                    {user.role === 'user' && (
                      <>
                        <Badge variant="secondary" className="text-xs">
                          {subscriptions.length} Active Membership{subscriptions.length !== 1 ? 's' : ''}
                        </Badge>
                        <Badge className="bg-primary text-primary-foreground text-xs">Member since {memberSince}</Badge>
                      </>
                    )}
                    {od.primaryGoal && (
                      <Badge variant="outline" className="text-xs border-primary/40 text-primary capitalize">
                        🎯 {od.primaryGoal.replace(/-/g, ' ')}
                      </Badge>
                    )}
                  </div>
                </div>

               <Link href="/onboarding?edit=true">
                  <Button variant="outline" size="sm" className="border-border bg-transparent gap-1.5 shrink-0">
                    <Edit2 className="h-3.5 w-3.5" />Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* ── PERSONAL INFORMATION ── */}
          <Card className="mb-6 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-primary" />Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex items-start gap-3 p-3 bg-secondary/40 rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Full Name</p>
                    <p className="font-medium text-foreground">{displayName}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-3 bg-secondary/40 rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Email Address</p>
                    <p className="font-medium text-foreground break-all">{displayEmail}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 p-3 bg-secondary/40 rounded-lg">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Phone Number</p>
                    <p className="font-medium text-foreground">
                      {displayPhone || <span className="text-muted-foreground italic text-sm">Not provided</span>}
                    </p>
                  </div>
                </div>

                {/* Age / DOB */}
                <div className="flex items-start gap-3 p-3 bg-secondary/40 rounded-lg">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Age</p>
                    <p className="font-medium text-foreground">
                      {displayAge
                        ? <>{displayAge}{od.dateOfBirth && <span className="text-muted-foreground text-xs ml-1">({od.dateOfBirth})</span>}</>
                        : <span className="text-muted-foreground italic text-sm">Not provided</span>}
                    </p>
                  </div>
                </div>

                {/* Gender */}
                {displayGender && (
                  <div className="flex items-start gap-3 p-3 bg-secondary/40 rounded-lg">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Gender</p>
                      <p className="font-medium text-foreground">{displayGender}</p>
                    </div>
                  </div>
                )}

                {/* Location */}
                {(displayCity || displayArea) && (
                  <div className="flex items-start gap-3 p-3 bg-secondary/40 rounded-lg">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                      <p className="font-medium text-foreground capitalize">
                        {[displayArea, displayCity].filter(Boolean).join(', ')}
                        {od.pincode && <span className="text-muted-foreground text-xs ml-1">- {od.pincode}</span>}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ── SOCIAL MEDIA (only if any filled) ── */}
          {socials.length > 0 && (
            <Card className="mb-6 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="h-5 w-5 text-primary" />Social Media
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {socials.map(({ key, label, icon: Icon, color, prefix }) => (
                    <div key={key} className="flex items-center gap-3 p-3 bg-secondary/40 rounded-lg">
                      <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                        <p className="font-medium text-foreground text-sm">{prefix}{od[key]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {/* ── GYM PHOTOS ── */}
{user.role === 'owner' && od.gymPhotos?.length > 0 && (
  <Card className="mb-6 border-border/50">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base">
        <Dumbbell className="h-5 w-5 text-primary" />
        Gym Photos
      </CardTitle>
    </CardHeader>

    <CardContent>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {od.gymPhotos.map((img: string, index: number) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden border border-border/50"
          >
            <img
              src={img}
              alt={`Gym ${index}`}
              className="w-full h-32 object-cover hover:scale-105 transition"
            />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)}

          {/* ── ONBOARDING DETAILS (fitness, medical, physical etc.) ── */}
          <ProfileDetails />

          {/* ── ACTIVE SUBSCRIPTIONS ── */}
          {subscriptions.length > 0 && (
            <Card className="mt-6 border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />Active Gym Memberships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subscriptions.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{sub.gymName}</p>
                        <p className="text-sm text-muted-foreground">{sub.planLabel} Plan</p>
                      </div>
                      <Badge className={sub.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                        {sub.status === "active" ? "Active" : "Pending Check-in"}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Link href="/subscriptions">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">View All Subscriptions</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      


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
