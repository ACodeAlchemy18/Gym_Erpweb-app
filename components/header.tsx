"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Dumbbell, Menu, User, Wallet, Calendar, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useUser } from "@/contexts/user-context";
import { useRouter } from "next/navigation";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const userData = useUser();
  let profile, walletBalance, subscriptions;

  try {
    profile = userData.profile;
    walletBalance = userData.walletBalance;
    subscriptions = userData.subscriptions;
  } catch {
    profile = null;
    walletBalance = 0;
    subscriptions = [];
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

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

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              All Gyms
            </Link>
            <Link href="/map" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Map View
            </Link>
            <Link href="/#featured" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Featured
            </Link>
            {isAuthenticated && user?.role === 'user' && (
              <Link href="/subscriptions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                My Gyms
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Admin Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === 'owner' && (
              <Link href="/owner" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Owner Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === 'trainer' && (
              <Link href="/trainer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Trainer Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && user?.role === 'user' && (
              <>
                {/* Wallet Balance Display */}
                <Link href="/wallet" className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg border border-border/50">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">${walletBalance?.toFixed(2) || '0.00'}</span>
                </Link>

                {/* Hamburger Menu */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Menu className="h-6 w-6" />
                      {subscriptions && subscriptions.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                          {subscriptions.length}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[320px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle className="text-left">Menu</SheetTitle>
                    </SheetHeader>
                    
                    {/* User Info */}
                    <div className="mt-6 flex items-center gap-3 p-4 bg-card rounded-lg border border-border/50">
                      <img
                        src={profile?.avatar || "/placeholder.svg"}
                        alt={profile?.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{profile?.name}</p>
                        <p className="text-sm text-muted-foreground">{profile?.email}</p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Menu Items */}
                    <nav className="space-y-2">
                      <Link href="/profile">
                        <Button variant="ghost" className="w-full justify-between h-14 px-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary rounded-lg">
                              <User className="h-5 w-5 text-foreground" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Profile</p>
                              <p className="text-xs text-muted-foreground">View your details</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </Button>
                      </Link>

                      <Link href="/subscriptions">
                        <Button variant="ghost" className="w-full justify-between h-14 px-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary rounded-lg">
                              <Calendar className="h-5 w-5 text-foreground" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Ongoing Subscriptions</p>
                              <p className="text-xs text-muted-foreground">
                                {subscriptions?.length || 0} active {subscriptions?.length === 1 ? "plan" : "plans"}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </Button>
                      </Link>

                      <Link href="/subscriptions/bookings">
                        <Button variant="ghost" className="w-full justify-between h-14 px-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary rounded-lg">
                              <Dumbbell className="h-5 w-5 text-foreground" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Trainer Bookings</p>
                              <p className="text-xs text-muted-foreground">Your booked sessions</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </Button>
                      </Link>

                      <Link href="/wallet">
                        <Button variant="ghost" className="w-full justify-between h-14 px-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                              <Wallet className="h-5 w-5 text-primary" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Wallet</p>
                              <p className="text-xs text-muted-foreground">Balance: ${walletBalance?.toFixed(2) || '0.00'}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </Button>
                      </Link>
                    </nav>

                    <Separator className="my-6" />

                    {/* Logout */}
                    <Button 
                      onClick={handleLogout}
                      variant="outline" 
                      className="w-full justify-start gap-3 border-border text-muted-foreground bg-transparent"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </SheetContent>
                </Sheet>
              </>
            )}

            {isAuthenticated && (user?.role === 'admin' || user?.role === 'owner' || user?.role === 'trainer') && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">Menu</SheetTitle>
                  </SheetHeader>
                  
                  {/* User Info */}
                  <div className="mt-6 flex items-center gap-3 p-4 bg-card rounded-lg border border-border/50">
                    <img
                      src={user?.avatar || "/placeholder.svg"}
                      alt={user?.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Menu Items for Trainer */}
                  {user?.role === 'trainer' && (
                    <nav className="space-y-2 mb-6">
                      <Link href="/trainer/settings">
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                          Profile Settings
                        </Button>
                      </Link>
                      <Link href="/trainer/clients">
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                          My Clients
                        </Button>
                      </Link>
                    </nav>
                  )}

                  {/* Menu Items for Owner */}
                  {user?.role === 'owner' && (
                    <nav className="space-y-2 mb-6">
                      <Link href="/owner/trainers">
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                          Manage Trainers
                        </Button>
                      </Link>
                    </nav>
                  )}

                  <Separator className="my-6" />

                  {/* Logout */}
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="w-full justify-start gap-3 border-border text-muted-foreground bg-transparent"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                </SheetContent>
              </Sheet>
            )}

            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="text-sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
