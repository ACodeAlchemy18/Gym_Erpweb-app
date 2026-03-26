"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell, Menu, User, Wallet, Calendar, ChevronRight,
  LogOut, Users, Utensils, Apple, Compass, BookOpen,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useUser } from "@/contexts/user-context";
import { useOnboarding } from "@/contexts/onboarding-context";
import { useRouter } from "next/navigation";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const userData = useUser();
  const { getOnboardingData } = useOnboarding();

  let walletBalance = 0, subscriptions: any[] = [];
  try { walletBalance = userData.walletBalance; subscriptions = userData.subscriptions; } catch {}

  // Get avatar from onboarding data if available
  const onboardingData = isAuthenticated && user ? getOnboardingData(user.id) : null;
  const avatarSrc = onboardingData?.data?.avatar || user?.avatar || "/placeholder-user.jpg";
  const displayName = onboardingData?.data?.displayName || user?.name || "User";

  const handleLogout = () => { logout(); router.push('/'); };

  const MenuItem = ({ href, icon: Icon, iconBg, label, sub }: {
    href: string; icon: any; iconBg: string; label: string; sub?: string;
  }) => (
    <Link href={href}>
      <Button variant="ghost" className="w-full justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${iconBg} rounded-lg`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="font-medium">{label}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </Button>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">GymFinder</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {isAuthenticated && user?.role === 'user' && subscriptions.length > 0 ? (
              // Subscribed user — show dashboard links
              <>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                <Link href="/subscriptions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Gyms</Link>
                <Link href="/workout" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Workouts</Link>
                <Link href="/diet" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Diet Plans</Link>
              </>
            ) : (
              // New / guest user — show browse links
              <>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Gyms</Link>
                <Link href="/map" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Map View</Link>
                <Link href="/#featured" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Featured</Link>
                {isAuthenticated && user?.role === 'user' && (
                  <Link href="/subscriptions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Gyms</Link>
                )}
              </>
            )}
            {isAuthenticated && user?.role === 'admin' && <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Admin Dashboard</Link>}
            {isAuthenticated && user?.role === 'owner' && <Link href="/owner" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Owner Dashboard</Link>}
            {isAuthenticated && user?.role === 'trainer' && <Link href="/trainer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Trainer Dashboard</Link>}
          </nav>

          <div className="flex items-center gap-3">

            {/* USER hamburger */}
            {isAuthenticated && user?.role === 'user' && (
              <>
                <Link href="/wallet" className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg border border-border/50">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">₹{walletBalance?.toFixed(2) || '0.00'}</span>
                </Link>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Menu className="h-6 w-6" />
                      {subscriptions.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                          {subscriptions.length}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[320px] sm:w-[400px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="text-left">Menu</SheetTitle>
                    </SheetHeader>

                    {/* User info card */}
                    <div className="mt-6 flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50">
                      <img src={avatarSrc} alt={displayName} className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-semibold text-foreground">{displayName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        {subscriptions.length > 0 && (
                          <Badge className="mt-1 bg-primary/20 text-primary text-xs">
                            {subscriptions.length} active plan{subscriptions.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Account */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">Account</p>
                    <nav className="space-y-1">
                      <MenuItem href="/profile" icon={User} iconBg="bg-secondary" label="My Profile" sub="View & edit your details" />
                      <MenuItem href="/subscriptions" icon={Calendar} iconBg="bg-secondary" label="My Subscriptions" sub={`${subscriptions.length} active plan${subscriptions.length !== 1 ? 's' : ''}`} />
                      <MenuItem href="/subscriptions/bookings" icon={Users} iconBg="bg-secondary" label="Trainer Bookings" sub="Your booked sessions" />
                      <MenuItem href="/wallet" icon={Wallet} iconBg="bg-primary/20" label="Wallet" sub={`Balance: ₹${walletBalance?.toFixed(2) || '0.00'}`} />
                    </nav>

                    <Separator className="my-4" />

                    {/* Fitness */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">Fitness</p>
                    <nav className="space-y-1">
                      <MenuItem href="/workout" icon={Dumbbell} iconBg="bg-orange-500/20" label="Workout Plans" sub="Structured training programs" />
                      <MenuItem href="/diet" icon={Utensils} iconBg="bg-green-500/20" label="Diet Plans" sub="Nutrition & meal guides" />
                    </nav>

                    <Separator className="my-4" />

                    {/* Explore */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">Explore</p>
                    <nav className="space-y-1">
                      <MenuItem href="/" icon={Compass} iconBg="bg-blue-500/20" label="Explore Gyms" sub="Find new gyms near you" />
                      <MenuItem href="/map" icon={Compass} iconBg="bg-blue-500/20" label="Map View" sub="Browse gyms on map" />
                    </nav>

                    <Separator className="my-4" />

                    <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-3 border-border text-muted-foreground bg-transparent">
                      <LogOut className="h-5 w-5" />Logout
                    </Button>
                  </SheetContent>
                </Sheet>
              </>
            )}

            {/* ADMIN / OWNER / TRAINER hamburger */}
            {isAuthenticated && (user?.role === 'admin' || user?.role === 'owner' || user?.role === 'trainer') && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[400px]">
                  <SheetHeader><SheetTitle className="text-left">Menu</SheetTitle></SheetHeader>
                  <div className="mt-6 flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50">
                    <img src={user?.avatar || "/placeholder.svg"} alt={user?.name} className="h-12 w-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  {user?.role === 'trainer' && (
                    <nav className="space-y-1 mb-4">
                      <MenuItem href="/trainer" icon={User} iconBg="bg-secondary" label="My Dashboard" sub="View stats and sessions" />
                      <MenuItem href="/trainer/settings" icon={User} iconBg="bg-secondary" label="Profile Settings" sub="" />
                      <MenuItem href="/trainer/clients" icon={Users} iconBg="bg-secondary" label="My Clients" sub="" />
                    </nav>
                  )}
                  {user?.role === 'owner' && (
                    <nav className="space-y-1 mb-4">
                      <MenuItem href="/owner" icon={User} iconBg="bg-secondary" label="Owner Dashboard" sub="" />
                      <MenuItem href="/owner/trainers" icon={Users} iconBg="bg-secondary" label="Manage Trainers" sub="" />
                    </nav>
                  )}
                  <Separator className="my-4" />
                  <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-3 border-border text-muted-foreground bg-transparent">
                    <LogOut className="h-5 w-5" />Logout
                  </Button>
                </SheetContent>
              </Sheet>
            )}

            {/* Not logged in */}
            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <Link href="/login"><Button variant="ghost" className="text-sm">Login</Button></Link>
                <Link href="/signup"><Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">Sign Up</Button></Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
