"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { GymList } from "@/components/gym-list";
import { getFeaturedGyms, getGymBySlug } from "@/data/gyms";
import { GymCard } from "@/components/gym-card";
import { useAuth } from "@/contexts/auth-context";
import { useUser } from "@/contexts/user-context";
import { getUserBookings, PLAN_META, type TrainerBooking } from "@/data/trainer-booking-store";
import {
  Dumbbell, MapPin, Clock, Award, Users, ChevronRight,
  Calendar, CheckCircle2, ChevronDown, ChevronUp,
  BarChart3, Star, Flame, Zap, TrendingUp, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getAllOwnerGyms } from "@/data/owner-gyms";

// ─── Today's day ───────────────────────────────────────────────────
const TODAY_DAY = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as string;
const TODAY_DATE = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

// ─── Full workout plans ────────────────────────────────────────────
const WORKOUT_PLANS = [
  {
    id: 'd1', title: "Beginner Full Body", level: "Beginner", color: "bg-green-500",
    schedule: {
      Monday:    { name: "Upper Body Basics", muscles: "Chest · Back · Shoulders", exercises: [
        { name: "Push-ups", sets: 3, reps: "8-10", rest: "60s", tip: "Keep core tight, elbows at 45°" },
        { name: "Dumbbell Rows", sets: 3, reps: "10 each side", rest: "60s", tip: "Pull to hip, not armpit" },
        { name: "Shoulder Press", sets: 3, reps: "10", rest: "60s", tip: "Don't arch your lower back" },
        { name: "Band Pull-aparts", sets: 2, reps: "15", rest: "45s", tip: "Full range, slow eccentric" },
      ]},
      Tuesday:   { name: "Rest / Light Walk", muscles: "Recovery", exercises: [
        { name: "Brisk Walk", sets: 1, reps: "20-30 min", rest: "-", tip: "Keep heart rate moderate" },
        { name: "Full Body Stretch", sets: 1, reps: "10 min", rest: "-", tip: "Hold each stretch 30 seconds" },
      ]},
      Wednesday: { name: "Lower Body Basics", muscles: "Quads · Hamstrings · Glutes", exercises: [
        { name: "Bodyweight Squats", sets: 3, reps: "12", rest: "60s", tip: "Knees over toes, chest up" },
        { name: "Reverse Lunges", sets: 3, reps: "10 each leg", rest: "60s", tip: "Keep front shin vertical" },
        { name: "Glute Bridges", sets: 3, reps: "15", rest: "45s", tip: "Squeeze at top for 1 second" },
        { name: "Calf Raises", sets: 3, reps: "15", rest: "30s", tip: "Full range of motion" },
      ]},
      Thursday:  { name: "Rest / Mobility", muscles: "Recovery", exercises: [
        { name: "Hip Circles", sets: 2, reps: "10 each direction", rest: "-", tip: "Keep core engaged" },
        { name: "Cat-Cow Stretch", sets: 2, reps: "10", rest: "-", tip: "Move through full spine" },
        { name: "Pigeon Pose", sets: 2, reps: "45s each side", rest: "-", tip: "Breathe into the stretch" },
      ]},
      Friday:    { name: "Core & Cardio", muscles: "Abs · Core · Full Body", exercises: [
        { name: "Plank", sets: 3, reps: "30s", rest: "45s", tip: "Neutral spine, don't sag hips" },
        { name: "Dead Bug", sets: 3, reps: "10 each side", rest: "45s", tip: "Lower back pressed to floor" },
        { name: "Crunches", sets: 3, reps: "15", rest: "45s", tip: "Don't pull your neck" },
        { name: "Jumping Jacks", sets: 3, reps: "30", rest: "30s", tip: "Land softly, arms fully extend" },
      ]},
      Saturday:  { name: "Active Recovery", muscles: "Full Body Mobility", exercises: [
        { name: "Yoga Flow", sets: 1, reps: "20 min", rest: "-", tip: "Focus on breathing" },
        { name: "Foam Rolling", sets: 1, reps: "10 min", rest: "-", tip: "Spend extra time on tight spots" },
      ]},
      Sunday:    { name: "Complete Rest", muscles: "Recovery", exercises: [
        { name: "Sleep & Recovery", sets: 1, reps: "8 hours", rest: "-", tip: "Sleep is when muscles grow" },
      ]},
    },
  },
  {
    id: 'd2', title: "Weight Loss HIIT", level: "Intermediate", color: "bg-orange-500",
    schedule: {
      Monday:    { name: "HIIT Cardio", muscles: "Full Body · Cardio", exercises: [
        { name: "Burpees", sets: 4, reps: "10", rest: "30s", tip: "Explode off the floor, land softly" },
        { name: "Mountain Climbers", sets: 4, reps: "20", rest: "30s", tip: "Keep hips level, fast pace" },
        { name: "Jump Squats", sets: 4, reps: "12", rest: "30s", tip: "Land with soft knees" },
        { name: "High Knees", sets: 3, reps: "30s", rest: "20s", tip: "Pump arms to increase intensity" },
      ]},
      Tuesday:   { name: "Strength Circuit", muscles: "Legs · Glutes · Core", exercises: [
        { name: "Goblet Squat", sets: 4, reps: "12", rest: "45s", tip: "Hold weight at chest, elbows inside knees" },
        { name: "KB Swings", sets: 4, reps: "15", rest: "45s", tip: "Hip hinge, not squat" },
        { name: "Step-ups", sets: 3, reps: "10 each leg", rest: "45s", tip: "Drive through the heel" },
        { name: "Box Jumps", sets: 3, reps: "8", rest: "60s", tip: "Full extension at takeoff" },
      ]},
      Wednesday: { name: "Active Recovery", muscles: "Recovery", exercises: [
        { name: "Swimming / Walking", sets: 1, reps: "30 min", rest: "-", tip: "Keep heart rate under 130 bpm" },
        { name: "Stretching Routine", sets: 1, reps: "15 min", rest: "-", tip: "Focus on hip flexors and hamstrings" },
      ]},
      Thursday:  { name: "Core Blast", muscles: "Abs · Obliques · Lower Back", exercises: [
        { name: "Russian Twists", sets: 3, reps: "20", rest: "30s", tip: "Lift feet for more challenge" },
        { name: "Leg Raises", sets: 3, reps: "15", rest: "30s", tip: "Lower back stays on floor" },
        { name: "Flutter Kicks", sets: 3, reps: "30s", rest: "30s", tip: "Small fast kicks, breathe steadily" },
        { name: "Side Plank", sets: 3, reps: "20s each side", rest: "30s", tip: "Stack feet or stagger" },
      ]},
      Friday:    { name: "Full Body Cardio", muscles: "Full Body · Endurance", exercises: [
        { name: "Jumping Jacks", sets: 3, reps: "40", rest: "30s", tip: "Maintain rhythm throughout" },
        { name: "Speed Skaters", sets: 3, reps: "20", rest: "30s", tip: "Reach for the floor on each side" },
        { name: "Squat to Press", sets: 3, reps: "12", rest: "45s", tip: "Full squat depth, arms fully extended" },
        { name: "Tuck Jumps", sets: 3, reps: "8", rest: "45s", tip: "Land softly, immediate next rep" },
      ]},
      Saturday:  { name: "Long Cardio", muscles: "Cardiovascular", exercises: [
        { name: "Steady Run / Jog", sets: 1, reps: "30-45 min", rest: "-", tip: "Conversational pace, zone 2" },
        { name: "Cool Down Walk", sets: 1, reps: "10 min", rest: "-", tip: "Gradually reduce heart rate" },
      ]},
      Sunday:    { name: "Rest Day", muscles: "Recovery", exercises: [
        { name: "Complete Rest", sets: 1, reps: "Full day", rest: "-", tip: "Trust the process" },
      ]},
    },
  },
  {
    id: 'd3', title: "Muscle Building", level: "Advanced", color: "bg-primary",
    schedule: {
      Monday:    { name: "Chest & Triceps", muscles: "Pecs · Triceps · Front Delts", exercises: [
        { name: "Flat Bench Press", sets: 4, reps: "8-10", rest: "90s", tip: "Retract scapula, slight arch" },
        { name: "Incline DB Press", sets: 3, reps: "10-12", rest: "75s", tip: "30-45° incline, controlled eccentric" },
        { name: "Cable Flyes", sets: 3, reps: "12-15", rest: "60s", tip: "Keep slight bend in elbows" },
        { name: "Tricep Dips", sets: 3, reps: "12", rest: "60s", tip: "Lean slightly forward for chest" },
        { name: "Overhead Tricep Extension", sets: 3, reps: "12", rest: "60s", tip: "Keep elbows pointing forward" },
      ]},
      Tuesday:   { name: "Back & Biceps", muscles: "Lats · Rhomboids · Biceps", exercises: [
        { name: "Deadlift", sets: 4, reps: "5-6", rest: "120s", tip: "Bar over mid-foot, hinge from hips" },
        { name: "Pull-ups", sets: 3, reps: "8-10", rest: "90s", tip: "Full dead hang at bottom" },
        { name: "Barbell Row", sets: 3, reps: "8-10", rest: "75s", tip: "Pull to lower sternum" },
        { name: "Seated Cable Row", sets: 3, reps: "12", rest: "60s", tip: "Squeeze shoulder blades together" },
        { name: "Hammer Curls", sets: 3, reps: "12", rest: "60s", tip: "Neutral grip, no swinging" },
      ]},
      Wednesday: { name: "Rest / Mobility", muscles: "Recovery", exercises: [
        { name: "Foam Rolling", sets: 1, reps: "15 min", rest: "-", tip: "Focus on thoracic spine and lats" },
        { name: "Band Shoulder Circles", sets: 3, reps: "10", rest: "-", tip: "Improve shoulder health" },
        { name: "Hip Flexor Stretch", sets: 3, reps: "45s each", rest: "-", tip: "Posterior pelvic tilt" },
      ]},
      Thursday:  { name: "Legs & Glutes", muscles: "Quads · Hamstrings · Glutes · Calves", exercises: [
        { name: "Back Squat", sets: 4, reps: "8-10", rest: "120s", tip: "Break parallel, knees track toes" },
        { name: "Romanian Deadlift", sets: 3, reps: "10", rest: "90s", tip: "Hinge at hip, slight knee bend" },
        { name: "Leg Press", sets: 3, reps: "12", rest: "75s", tip: "Feet shoulder-width, drive through heels" },
        { name: "Walking Lunges", sets: 3, reps: "10 each leg", rest: "60s", tip: "90° front knee angle" },
        { name: "Standing Calf Raises", sets: 4, reps: "15-20", rest: "45s", tip: "Full range, pause at top" },
      ]},
      Friday:    { name: "Shoulders & Traps", muscles: "Delts · Traps · Rotator Cuff", exercises: [
        { name: "Overhead Press", sets: 4, reps: "8-10", rest: "90s", tip: "Full lockout, vertical bar path" },
        { name: "Lateral Raises", sets: 4, reps: "15", rest: "60s", tip: "Lead with elbows, slight lean" },
        { name: "Rear Delt Flyes", sets: 3, reps: "15", rest: "60s", tip: "Horizontal pull, squeeze at peak" },
        { name: "Face Pulls", sets: 3, reps: "15", rest: "60s", tip: "External rotation at peak" },
        { name: "Barbell Shrugs", sets: 3, reps: "12", rest: "60s", tip: "Full elevation, hold 1 second" },
      ]},
      Saturday:  { name: "Arms & Abs", muscles: "Biceps · Triceps · Core", exercises: [
        { name: "EZ Bar Curl", sets: 3, reps: "10-12", rest: "60s", tip: "Full extension at bottom" },
        { name: "Skull Crushers", sets: 3, reps: "10-12", rest: "60s", tip: "Bar to forehead level" },
        { name: "Concentration Curls", sets: 3, reps: "12", rest: "45s", tip: "Elbow on inner thigh" },
        { name: "Cable Crunch", sets: 4, reps: "15", rest: "45s", tip: "Round back, pull elbow to knee" },
        { name: "Hanging Leg Raises", sets: 3, reps: "12", rest: "60s", tip: "Posterior pelvic tilt at top" },
      ]},
      Sunday:    { name: "Complete Rest", muscles: "Recovery", exercises: [
        { name: "Sleep & Nutrition", sets: 1, reps: "Full day", rest: "-", tip: "Hit protein target: 1.6-2.2g per kg body weight" },
      ]},
    },
  },
];

// ─── Dummy data ────────────────────────────────────────────────────
const WEEKLY_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DONE_DAYS = [0, 1, 2]; // Mon Tue Wed completed

const STAT_CARDS = [
  { label: "Workouts Done", value: "12", sub: "this month", icon: "🏋️", color: "text-primary" },
  { label: "Calories Burned", value: "4,200", sub: "this week", icon: "🔥", color: "text-orange-500" },
  { label: "Active Streak", value: "3 days", sub: "keep going!", icon: "⚡", color: "text-yellow-500" },
  { label: "Sessions Left", value: "8", sub: "this plan", icon: "📅", color: "text-green-500" },
];

const PROGRESS_BARS = [
  { label: "Workouts Completed", value: 12, total: 20, color: "bg-primary", icon: "🏋️" },
  { label: "This Week's Sessions", value: 3, total: 5, color: "bg-green-500", icon: "📅" },
  { label: "Calories Burned", value: 4200, total: 8000, color: "bg-orange-500", icon: "🔥", suffix: " kcal" },
  { label: "Active Days", value: 18, total: 30, color: "bg-blue-500", icon: "⚡" },
];

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const userData = useUser();
  const [allGyms, setAllGyms] = useState<any[]>([]);
  const [trainerBookings, setTrainerBookings] = useState<TrainerBooking[]>([]);
  const [expandedWorkout, setExpandedWorkout] = useState(false);
  const [activePlanIdx] = useState(0);

  let subscriptions: any[] = [];
  try { subscriptions = userData.subscriptions; } catch {}

  const isUser = isAuthenticated && user?.role === 'user';
  const hasSubscriptions = isUser && subscriptions.length > 0;

  useEffect(() => {
    const staticGyms = getFeaturedGyms();
    const ownerGyms = getAllOwnerGyms().map(g => ({
      id: g.id, slug: g.id, name: g.name, city: g.city,
      image: g.image, rating: 4.5, reviews: 0, featured: false,
    }));
    setAllGyms([...staticGyms, ...ownerGyms]);
  }, []);

  useEffect(() => {
    if (user) setTrainerBookings(getUserBookings(user.id));
  }, [user]);

  const subscribedGyms = subscriptions.map(sub => {
    const gym = getGymBySlug(sub.gymSlug) || allGyms.find(g => g.id === sub.gymId);
    return { sub, gym };
  }).filter(x => x.gym);

  const bookingsByGym = trainerBookings.reduce<Record<string, TrainerBooking[]>>((acc, b) => {
    if (!acc[b.gymId]) acc[b.gymId] = [];
    acc[b.gymId].push(b);
    return acc;
  }, {});

  const activePlan = WORKOUT_PLANS[activePlanIdx];
  const todayWorkout = (activePlan.schedule as any)[TODAY_DAY];
  const isRestDay = todayWorkout?.muscles === 'Recovery';
  const firstGymName = subscribedGyms[0]?.sub?.gymName || 'your gym';
  const allBookings = Object.values(bookingsByGym).flat();

  // ── SUBSCRIBED USER DASHBOARD ─────────────────────────────────────
  if (hasSubscriptions) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-5xl">

          {/* ── WELCOME HEADER ── */}
          <div className="mb-7">
            <p className="text-muted-foreground text-sm">{TODAY_DATE}</p>
            <h1 className="text-3xl font-bold text-foreground mt-0.5">
              Welcome back to <span className="text-primary">{firstGymName}</span> 💪
            </h1>
          </div>

          {/* ── STAT CARDS ROW ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {STAT_CARDS.map(s => (
              <Card key={s.label} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{s.icon}</span>
                    <TrendingUp className="h-4 w-4 text-muted-foreground opacity-50" />
                  </div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs font-medium text-foreground mt-0.5">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ── TWO COLUMN LAYOUT ── */}
          <div className="grid lg:grid-cols-3 gap-5">

            {/* LEFT COLUMN (2/3) */}
            <div className="lg:col-span-2 space-y-5">

              {/* ── TODAY'S WORKOUT CARD ── */}
              <Card className="border-border/50 overflow-hidden">
                <div className={`h-1.5 ${activePlan.color}`} />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${activePlan.color} text-white text-xs`}>{activePlan.level}</Badge>
                        <Badge variant="outline" className="text-xs border-border">📋 {activePlan.title}</Badge>
                      </div>
                      <CardTitle className="text-base">
                        {isRestDay ? "🛋️ Rest & Recovery Day" : `Today — ${todayWorkout?.name}`}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{todayWorkout?.muscles}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">Today</p>
                      <p className="text-sm font-bold text-foreground">{TODAY_DAY}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {(expandedWorkout ? todayWorkout?.exercises : todayWorkout?.exercises?.slice(0, 4))?.map((ex: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-secondary/40 rounded-xl">
                        <div className={`h-6 w-6 rounded-full ${activePlan.color} text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5`}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-foreground text-sm">{ex.name}</p>
                            <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                              {ex.sets > 1 && <Badge variant="outline" className="text-xs px-1.5 py-0 border-border h-5">{ex.sets}×</Badge>}
                              <Badge variant="outline" className="text-xs px-1.5 py-0 border-border h-5">{ex.reps}</Badge>
                              {ex.rest !== '-' && <Badge variant="outline" className="text-xs px-1.5 py-0 border-border h-5 text-muted-foreground">{ex.rest}</Badge>}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground italic mt-0.5">💡 {ex.tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {todayWorkout?.exercises?.length > 4 && (
                    <button onClick={() => setExpandedWorkout(!expandedWorkout)}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {expandedWorkout
                        ? <><ChevronUp className="h-3.5 w-3.5" />Show less</>
                        : <><ChevronDown className="h-3.5 w-3.5" />+{todayWorkout.exercises.length - 4} more exercises</>}
                    </button>
                  )}

                  <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
                    <Link href="/workout" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-border bg-transparent text-xs gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />Full Weekly Plan
                      </Button>
                    </Link>
                    {!isRestDay && (
                      <Button size="sm" className={`flex-1 ${activePlan.color} text-white text-xs gap-1.5`}>
                        <CheckCircle2 className="h-3.5 w-3.5" />Mark Done
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* ── MY GYMS CARDS ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />My Gyms
                  </h2>
                  <Link href="/subscriptions">
                    <Button variant="ghost" size="sm" className="text-primary text-xs gap-1 h-7">
                      Manage <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {subscribedGyms.map(({ sub, gym }) => {
                    const gymSlug = gym.slug || sub.gymSlug;
                    const isActive = sub.status === 'active' || sub.status === 'pending_checkin';
                    const daysLeft = Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / 86400000));
                    return (
                      <Card key={sub.id} className="border-border/50 overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            {gym.photos?.[0] && (
                              <img src={gym.photos[0]} alt={gym.name}
                                className="h-14 w-14 rounded-xl object-cover border border-border shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-foreground text-sm">{sub.gymName}</h3>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge className={`text-xs ${isActive ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"}`}>
                                  {isActive ? "✅ Active" : "⏳ Check-in"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{sub.planLabel}</span>
                                <span className={`text-xs font-semibold ${daysLeft <= 7 ? 'text-red-400' : 'text-muted-foreground'}`}>
                                  {daysLeft}d left
                                </span>
                              </div>
                            </div>
                            <Link href={`/gym/${gymSlug}`}>
                              <Button variant="outline" size="sm" className="border-border bg-transparent text-xs shrink-0">View</Button>
                            </Link>
                          </div>
                          {isActive && (
                            <div className="mt-3 pt-3 border-t border-border/50 flex gap-2">
                              <Link href={`/gym/${gymSlug}#trainers`} className="flex-1">
                                <Button size="sm" className="w-full bg-primary text-primary-foreground text-xs gap-1.5">
                                  <Users className="h-3 w-3" />Browse Trainers
                                </Button>
                              </Link>
                              <Link href="/workout" className="flex-1">
                                <Button size="sm" variant="outline" className="w-full border-border bg-transparent text-xs gap-1.5">
                                  <Dumbbell className="h-3 w-3" />Workout Plan
                                </Button>
                              </Link>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* ── BOOKED TRAINERS CARDS ── */}
              {allBookings.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-foreground flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />My Trainers
                    </h2>
                    <Badge className="bg-green-500/20 text-green-500 text-xs">{allBookings.length} booked</Badge>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {allBookings.map(booking => (
                      <Card key={booking.id} className="border-border/50 overflow-hidden hover:border-primary/40 transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <img src={booking.trainerAvatar} alt={booking.trainerName}
                              className="h-12 w-12 rounded-xl object-cover border border-border shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground text-sm">{booking.trainerName}</p>
                              <p className="text-xs text-muted-foreground">{booking.trainerSpecialization}</p>
                              <Badge className="mt-1 bg-green-500/20 text-green-500 text-xs">✅ Confirmed</Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="p-2 bg-secondary/50 rounded-lg text-center">
                              <p className="text-xs text-muted-foreground">Plan</p>
                              <p className="text-xs font-bold text-foreground capitalize">{booking.plan}</p>
                            </div>
                            <div className="p-2 bg-secondary/50 rounded-lg text-center">
                              <p className="text-xs text-muted-foreground">Sessions</p>
                              <p className="text-xs font-bold text-foreground">{booking.sessions}</p>
                            </div>
                            <div className="p-2 bg-secondary/50 rounded-lg text-center">
                              <p className="text-xs text-muted-foreground">Paid</p>
                              <p className="text-xs font-bold text-primary">₹{booking.amount}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                            <Building2 className="h-3 w-3" />{booking.gymName}
                          </p>
                          <Link href={`/gym/${booking.gymSlug}/trainers/${booking.trainerId}`}>
                            <Button variant="outline" size="sm" className="w-full border-border bg-transparent text-xs">
                              View Trainer Profile
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty trainer state */}
              {allBookings.length === 0 && (
                <Card className="border-dashed border-border/50">
                  <CardContent className="p-6 text-center">
                    <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="font-medium text-foreground text-sm mb-1">No trainers booked yet</p>
                    <p className="text-xs text-muted-foreground mb-3">Visit your gym page to browse and book a trainer</p>
                    {subscribedGyms[0] && (
                      <Link href={`/gym/${subscribedGyms[0].gym.slug || subscribedGyms[0].sub.gymSlug}#trainers`}>
                        <Button size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5">
                          <Users className="h-3 w-3" />Browse Trainers
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* RIGHT COLUMN (1/3) */}
            <div className="space-y-5">

              {/* ── WEEKLY CHECK-IN CARD ── */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />This Week
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {WEEKLY_DAYS.map((day, i) => {
                      const isToday = i === (new Date().getDay() + 6) % 7;
                      const isDone = DONE_DAYS.includes(i);
                      return (
                        <div key={day} className="text-center">
                          <div className={`h-8 rounded-lg flex items-center justify-center mb-1 text-xs font-medium transition-all ${
                            isDone ? 'bg-green-500 text-white'
                            : isToday ? 'bg-primary/20 border border-primary text-primary'
                            : 'bg-secondary/50 text-muted-foreground'
                          }`}>
                            {isDone ? '✓' : day.charAt(0)}
                          </div>
                          <span className="text-xs text-muted-foreground">{day.slice(0,1)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{DONE_DAYS.length} of 5 sessions done</span>
                    <span className="font-semibold text-green-500">{Math.round((DONE_DAYS.length/5)*100)}%</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${(DONE_DAYS.length/5)*100}%` }} />
                  </div>
                </CardContent>
              </Card>

              {/* ── PROGRESS TRACKER CARD ── */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />Progress Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {PROGRESS_BARS.map(p => (
                    <div key={p.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <span>{p.icon}</span>{p.label}
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {p.value}{p.suffix || ''}
                          <span className="font-normal text-muted-foreground">/{p.total}{p.suffix || ''}</span>
                        </span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full ${p.color} rounded-full`}
                          style={{ width: `${Math.min(100, (p.value / p.total) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* ── ACTIVE PLAN CARD ── */}
              <Card className="border-border/50 overflow-hidden">
                <div className={`h-1 ${activePlan.color}`} />
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-primary" />Active Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="font-semibold text-foreground text-sm mb-1">{activePlan.title}</p>
                  <Badge className={`${activePlan.color} text-white text-xs mb-3`}>{activePlan.level}</Badge>
                  <div className="space-y-2 text-xs">
                    {Object.entries(activePlan.schedule).slice(0, 5).map(([day, session]: any) => (
                      <div key={day} className={`flex items-center justify-between p-2 rounded-lg ${
                        day === TODAY_DAY ? 'bg-primary/10 border border-primary/30' : 'bg-secondary/30'
                      }`}>
                        <span className={`font-medium ${day === TODAY_DAY ? 'text-primary' : 'text-muted-foreground'}`}>
                          {day === TODAY_DAY ? '→ ' : ''}{day.slice(0, 3)}
                        </span>
                        <span className="text-muted-foreground truncate ml-2 max-w-[120px]">{session.name}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/workout" className="block mt-3">
                    <Button variant="outline" size="sm" className="w-full border-border bg-transparent text-xs">
                      View Full Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* ── QUICK LINKS CARD ── */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />Quick Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { href: '/workout', icon: '🏋️', label: 'Workouts' },
                      { href: '/diet', icon: '🥗', label: 'Diet' },
                      { href: '/subscriptions', icon: '📋', label: 'My Gyms' },
                      { href: '/gyms', icon: '🔍', label: 'Explore' },
                      { href: '/profile', icon: '👤', label: 'Profile' },
                      { href: '/wallet', icon: '💳', label: 'Wallet' },
                    ].map(({ href, icon, label }) => (
                      <Link key={href} href={href}>
                        <div className="flex items-center gap-2 p-2.5 bg-secondary/40 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                          <span className="text-base">{icon}</span>
                          <span className="text-xs font-medium text-foreground">{label}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <footer className="py-10 border-t border-border/50 mt-10">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg"><Dumbbell className="h-5 w-5 text-primary-foreground" /></div>
              <span className="text-xl font-bold text-foreground">GymFinder</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 GymFinder. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  // ── NOT SUBSCRIBED / GUEST ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-6">
              <span className="text-primary text-sm font-medium">Find Your Perfect Gym</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Discover Premium Fitness Centers Near You
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Browse top-rated gyms, compare pricing and amenities, and find your ideal fitness destination.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm mb-8">
              {[["50+ Gyms", Dumbbell], ["Multiple Cities", MapPin], ["24/7 Support", Clock], ["Verified Reviews", Award]].map(([label, Icon]: any) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
            {!isAuthenticated && (
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/signup"><Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12">Get Started Free</Button></Link>
                <Link href="/login"><Button variant="outline" className="border-border px-8 h-12 bg-transparent">Login Here</Button></Link>
              </div>
            )}
          </div>
        </div>
      </section>
      <section id="featured" className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Featured Gyms</h2>
          <p className="text-muted-foreground mb-8">Hand-picked premium fitness centers</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {allGyms.map(gym => <GymCard key={gym.id} gym={gym} />)}
          </div>
        </div>
      </section>
      <section id="all-gyms" className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">All Gyms</h2>
          <p className="text-muted-foreground mb-8">Explore our complete directory</p>
          <GymList />
        </div>
      </section>
      <section className="py-16 border-t border-border/50 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[["50+","Partner Gyms"],["15K+","Active Members"],["100+","Expert Trainers"],["4.8","Average Rating"]].map(([val,label]) => (
              <div key={label} className="text-center">
                <p className="text-4xl font-bold text-primary">{val}</p>
                <p className="text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg"><Dumbbell className="h-5 w-5 text-primary-foreground" /></div>
            <span className="text-xl font-bold text-foreground">GymFinder</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 GymFinder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
