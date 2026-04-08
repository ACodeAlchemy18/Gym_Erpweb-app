"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell, Menu, User, Wallet, Calendar, ChevronRight,
  LogOut, Users, Utensils, Apple, Compass, BookOpen,
  Bell, UserPlus, Dumbbell as TrainerIcon, X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useUser } from "@/contexts/user-context";
import { useOnboarding } from "@/contexts/onboarding-context";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

// ─── Notification Types ────────────────────────────────────────────────────────

type NotificationType = "new_member" | "new_trainer";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  time: string;         // human-readable relative time
  read: boolean;
}

// ─── Notification Icon Map ─────────────────────────────────────────────────────

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
  if (type === "new_member") {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/15">
        <UserPlus className="h-4 w-4 text-blue-500" />
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/15">
      <Dumbbell className="h-4 w-4 text-orange-500" />
    </div>
  );
};

// ─── Dummy seed data (replace with API/WebSocket later) ───────────────────────

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "new_member",
    message: "New member Aman Gupta joined your gym",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "new_trainer",
    message: "Trainer Priya Sharma has been onboarded",
    time: "15 min ago",
    read: false,
  },
  {
    id: "3",
    type: "new_member",
    message: "New member Rohan Mehta joined your gym",
    time: "1 hr ago",
    read: true,
  },
  {
    id: "4",
    type: "new_trainer",
    message: "Trainer Karan Singh is now active",
    time: "3 hrs ago",
    read: true,
  },
];

// ─── NotificationDropdown Component ───────────────────────────────────────────

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onMarkAllRead,
  onDismiss,
  onClose,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="
        absolute right-0 top-full mt-2 w-[340px] sm:w-[380px]
        rounded-2xl border border-border/60 bg-background shadow-xl
        z-[9999] overflow-hidden
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm text-foreground">Notifications</span>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-xs text-primary hover:underline underline-offset-2 transition-colors"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-border/40">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <Bell className="h-8 w-8 opacity-30" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                flex items-start gap-3 px-4 py-3 transition-colors
                hover:bg-muted/40 group relative
                ${!notification.read ? "bg-primary/5" : ""}
              `}
            >
              {/* Unread dot */}
              {!notification.read && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
              )}

              <NotificationIcon type={notification.type} />

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm leading-snug ${
                    !notification.read
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{notification.time}</p>
              </div>

              {/* Dismiss button */}
              <button
                onClick={() => onDismiss(notification.id)}
                className="
                  opacity-0 group-hover:opacity-100 transition-opacity
                  p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground
                "
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-border/50 px-4 py-2.5">
          <Link
            href="/owner/notifications"
            className="text-xs text-primary hover:underline underline-offset-2 transition-colors"
            onClick={onClose}
          >
            View all notifications →
          </Link>
        </div>
      )}
    </div>
  );
};

// ─── Main Header ───────────────────────────────────────────────────────────────

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const userData = useUser();
  const { getOnboardingData } = useOnboarding();
  const pathname = usePathname();

  let walletBalance = 0, subscriptions: any[] = [];
  try { walletBalance = userData.walletBalance; subscriptions = userData.subscriptions; } catch {}

  const onboardingData = isAuthenticated && user ? getOnboardingData(user.id) : null;
  const avatarSrc = onboardingData?.data?.avatar || user?.avatar || "/placeholder-user.jpg";
  const displayName = onboardingData?.data?.displayName || user?.name || "User";

  const handleLogout = () => { logout(); router.push('/'); };

  // ── Notification state ──────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Load dummy notifications (swap this block for an API/WebSocket call later)
  useEffect(() => {
    if (user?.role === "owner") {
      setNotifications(DUMMY_NOTIFICATIONS);
    }
  }, [user?.role]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ── Menu Item helper ────────────────────────────────────────────────────────
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

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">GymFinder</span>
          </Link>

          {/* Desktop nav */}
          {isAuthenticated && user?.role === 'user' && subscriptions.length > 0 ? (
            <>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/subscriptions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Gyms</Link>
              <Link href="/workout" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Workouts</Link>
              <Link href="/diet" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Diet Plans</Link>
            </>
          ) : (
            <>
              {!(user?.role === 'owner' && pathname.startsWith('/owner')) && (
                <>
                  <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Gyms</Link>
                  <Link href="/map" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Map View</Link>
                  <Link href="/#featured" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Featured</Link>
                </>
              )}
              {isAuthenticated && user?.role === 'user' && (
                <Link href="/subscriptions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Gyms</Link>
              )}
            </>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Admin Dashboard</Link>
          )}
          {isAuthenticated && user?.role === 'owner' && (
            <Link href="/owner" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Owner Dashboard</Link>
          )}
          {isAuthenticated && user?.role === 'trainer' && (
            <Link href="/trainer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Trainer Dashboard</Link>
          )}

          {/* Right side controls */}
          <div className="flex items-center gap-2">

            {/* ── Owner Bell Icon ──────────────────────────────────────────── */}
            {isAuthenticated && user?.role === 'owner' && (
              <div className="relative" ref={notifRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setNotifOpen((prev) => !prev)}
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span
                      className="
                        absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center
                        justify-center rounded-full bg-red-500 px-1
                        text-[10px] font-bold text-white leading-none
                      "
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>

                {notifOpen && (
                  <NotificationDropdown
                    notifications={notifications}
                    onMarkAllRead={handleMarkAllRead}
                    onDismiss={handleDismiss}
                    onClose={() => setNotifOpen(false)}
                  />
                )}
              </div>
            )}

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
                    <SheetHeader><SheetTitle className="text-left">Menu</SheetTitle></SheetHeader>

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
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">Account</p>
                    <nav className="space-y-1">
                      <MenuItem href="/profile" icon={User} iconBg="bg-secondary" label="My Profile" sub="View & edit your details" />
                      <MenuItem href="/subscriptions" icon={Calendar} iconBg="bg-secondary" label="My Subscriptions" sub={`${subscriptions.length} active plan${subscriptions.length !== 1 ? 's' : ''}`} />
                      <MenuItem href="/subscriptions/bookings" icon={Users} iconBg="bg-secondary" label="Trainer Bookings" sub="Your booked sessions" />
                      <MenuItem href="/wallet" icon={Wallet} iconBg="bg-primary/20" label="Wallet" sub={`Balance: ₹${walletBalance?.toFixed(2) || '0.00'}`} />
                    </nav>

                    <Separator className="my-4" />
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">Fitness</p>
                    <nav className="space-y-1">
                      <MenuItem href="/workout" icon={Dumbbell} iconBg="bg-orange-500/20" label="Workout Plans" sub="Structured training programs" />
                      <MenuItem href="/diet" icon={Utensils} iconBg="bg-green-500/20" label="Diet Plans" sub="Nutrition & meal guides" />
                    </nav>

                    <Separator className="my-4" />
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
                  <Link href="/profile" className="block">
                    <div className="mt-6 flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 cursor-pointer hover:bg-muted/50 transition">
                      <img src={user?.avatar || "/placeholder.svg"} alt={user?.name} className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                      </div>
                    </div>
                  </Link>
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