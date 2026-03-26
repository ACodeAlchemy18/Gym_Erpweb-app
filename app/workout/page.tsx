"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Dumbbell, Clock, Flame, ChevronDown, ChevronUp, Plus, Trash2, Star, User, Edit3 } from "lucide-react";
import Link from "next/link";

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long' });

// ── DEFAULT PLANS ────────────────────────────────────────────────
const DEFAULT_PLANS = [
  {
    id: 'd1', title: "Beginner Full Body", level: "Beginner", duration: "4 weeks", days: 3, goal: "Build Foundation", color: "bg-green-500",
    description: "Perfect for beginners. Focuses on learning proper form with compound movements.",
    schedule: {
      Monday:    { name: "Upper Body Basics",  exercises: [{ name: "Push-ups", sets: "3", reps: "8-10", rest: "60s" }, { name: "Dumbbell Rows", sets: "3", reps: "10", rest: "60s" }, { name: "Shoulder Press", sets: "3", reps: "10", rest: "60s" }] },
      Wednesday: { name: "Lower Body Basics",  exercises: [{ name: "Bodyweight Squats", sets: "3", reps: "12", rest: "60s" }, { name: "Lunges", sets: "3", reps: "10 each", rest: "60s" }, { name: "Glute Bridges", sets: "3", reps: "15", rest: "45s" }] },
      Friday:    { name: "Core & Cardio",      exercises: [{ name: "Plank", sets: "3", reps: "30s", rest: "45s" }, { name: "Crunches", sets: "3", reps: "15", rest: "45s" }, { name: "Jumping Jacks", sets: "3", reps: "30", rest: "30s" }] },
    },
  },
  {
    id: 'd2', title: "Weight Loss HIIT", level: "Intermediate", duration: "6 weeks", days: 5, goal: "Fat Burn", color: "bg-orange-500",
    description: "High-intensity program combining cardio and strength to maximize calorie burn.",
    schedule: {
      Monday:    { name: "HIIT Cardio",         exercises: [{ name: "Burpees", sets: "4", reps: "10", rest: "30s" }, { name: "Mountain Climbers", sets: "4", reps: "20", rest: "30s" }, { name: "Jump Squats", sets: "4", reps: "12", rest: "30s" }] },
      Tuesday:   { name: "Strength Circuit",    exercises: [{ name: "Goblet Squat", sets: "4", reps: "12", rest: "45s" }, { name: "KB Swings", sets: "4", reps: "15", rest: "45s" }, { name: "Box Jumps", sets: "3", reps: "8", rest: "60s" }] },
      Thursday:  { name: "Core Blast",          exercises: [{ name: "Russian Twists", sets: "3", reps: "20", rest: "30s" }, { name: "Leg Raises", sets: "3", reps: "15", rest: "30s" }, { name: "Flutter Kicks", sets: "3", reps: "30s", rest: "30s" }] },
      Friday:    { name: "Full Body Cardio",    exercises: [{ name: "Jumping Jacks", sets: "3", reps: "40", rest: "30s" }, { name: "High Knees", sets: "3", reps: "30s", rest: "30s" }, { name: "Speed Skaters", sets: "3", reps: "20", rest: "30s" }] },
      Saturday:  { name: "Active Recovery",     exercises: [{ name: "Walking", sets: "1", reps: "30 min", rest: "-" }, { name: "Stretching", sets: "1", reps: "15 min", rest: "-" }] },
    },
  },
  {
    id: 'd3', title: "Muscle Building", level: "Advanced", duration: "8 weeks", days: 5, goal: "Hypertrophy", color: "bg-primary",
    description: "Progressive overload program designed to maximise muscle growth and strength.",
    schedule: {
      Monday:    { name: "Chest & Triceps",  exercises: [{ name: "Bench Press", sets: "4", reps: "8-10", rest: "90s" }, { name: "Incline DB Press", sets: "3", reps: "10-12", rest: "75s" }, { name: "Tricep Dips", sets: "3", reps: "12", rest: "60s" }] },
      Tuesday:   { name: "Back & Biceps",    exercises: [{ name: "Deadlift", sets: "4", reps: "5-6", rest: "120s" }, { name: "Pull-ups", sets: "3", reps: "8-10", rest: "90s" }, { name: "Bicep Curls", sets: "3", reps: "12", rest: "60s" }] },
      Thursday:  { name: "Legs & Glutes",    exercises: [{ name: "Squat", sets: "4", reps: "8-10", rest: "90s" }, { name: "Leg Press", sets: "3", reps: "12", rest: "75s" }, { name: "Romanian Deadlift", sets: "3", reps: "10", rest: "75s" }] },
      Friday:    { name: "Shoulders",        exercises: [{ name: "OHP", sets: "4", reps: "8-10", rest: "90s" }, { name: "Lateral Raises", sets: "3", reps: "15", rest: "60s" }, { name: "Face Pulls", sets: "3", reps: "15", rest: "60s" }] },
      Saturday:  { name: "Arms & Abs",       exercises: [{ name: "EZ Bar Curl", sets: "3", reps: "12", rest: "60s" }, { name: "Skull Crushers", sets: "3", reps: "12", rest: "60s" }, { name: "Cable Crunch", sets: "3", reps: "15", rest: "45s" }] },
    },
  },
];

// ── TRAINER CUSTOM PLANS ─────────────────────────────────────────
const TRAINER_PLANS = [
  {
    id: 't1', trainerName: "Rahul Sharma", trainerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
    title: "Personalised Strength Build", createdFor: "You", level: "Intermediate", duration: "6 weeks", goal: "Strength",
    notes: "Focus on progressive overload. Increase weight by 2.5kg every week on main lifts. Rest adequately between sets.",
    schedule: {
      Monday:   { name: "Heavy Lower",   exercises: [{ name: "Back Squat", sets: "5", reps: "5", rest: "3min" }, { name: "Leg Curl", sets: "3", reps: "10", rest: "90s" }] },
      Wednesday:{ name: "Heavy Upper",   exercises: [{ name: "Bench Press", sets: "5", reps: "5", rest: "3min" }, { name: "Pendlay Row", sets: "5", reps: "5", rest: "3min" }] },
      Friday:   { name: "Volume Day",    exercises: [{ name: "DB Press", sets: "4", reps: "10-12", rest: "60s" }, { name: "Cable Row", sets: "4", reps: "12", rest: "60s" }, { name: "Lateral Raise", sets: "3", reps: "15", rest: "45s" }] },
    },
  },
];

interface CustomExercise { name: string; sets: string; reps: string; rest: string; }
interface CustomDay { name: string; exercises: CustomExercise[]; }

const levelColors: Record<string, string> = {
  Beginner: "bg-green-500/20 text-green-500", Intermediate: "bg-orange-500/20 text-orange-500", Advanced: "bg-red-500/20 text-red-500",
};

export default function WorkoutPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'default' | 'trainer' | 'custom'>('default');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set([TODAY]));
  // Custom plan state
  const [customPlans, setCustomPlans] = useState<{ id: string; title: string; goal: string; days: Record<string, CustomDay> }[]>([]);
  const [buildingPlan, setBuildingPlan] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanGoal, setNewPlanGoal] = useState('');
  const [newPlanDays, setNewPlanDays] = useState<Record<string, CustomDay>>({});
  const [addingDay, setAddingDay] = useState('');
  const [newDayName, setNewDayName] = useState('');

  const toggleDay = (day: string) => setExpandedDays(prev => { const n = new Set(prev); n.has(day) ? n.delete(day) : n.add(day); return n; });

  const addExerciseToDayBuilder = (day: string) => {
    setNewPlanDays(prev => ({
      ...prev,
      [day]: { name: prev[day]?.name || day, exercises: [...(prev[day]?.exercises || []), { name: '', sets: '3', reps: '10', rest: '60s' }] },
    }));
  };

  const saveCustomPlan = () => {
    if (!newPlanTitle || Object.keys(newPlanDays).length === 0) return;
    setCustomPlans(prev => [...prev, { id: `c_${Date.now()}`, title: newPlanTitle, goal: newPlanGoal || 'Custom', days: newPlanDays }]);
    setBuildingPlan(false); setNewPlanTitle(''); setNewPlanGoal(''); setNewPlanDays({});
  };

  const PlanCard = ({ plan, type }: { plan: any; type: 'default' | 'trainer' | 'custom' }) => {
    const todaySchedule = plan.schedule?.[TODAY];
    return (
      <Card className="border-border/50 overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
        onClick={() => setSelectedPlan({ ...plan, _type: type })}>
        <div className={`h-2 ${type === 'trainer' ? 'bg-blue-500' : type === 'custom' ? 'bg-purple-500' : plan.color || 'bg-primary'}`} />
        <CardContent className="p-5">
          {type === 'trainer' && plan.trainerName && (
            <div className="flex items-center gap-2 mb-3">
              <img src={plan.trainerAvatar} alt={plan.trainerName} className="h-6 w-6 rounded-full object-cover" />
              <span className="text-xs text-muted-foreground">By {plan.trainerName}</span>
              <Badge className="bg-blue-500/20 text-blue-500 text-xs ml-auto">Trainer Plan</Badge>
            </div>
          )}
          {type === 'custom' && <Badge className="bg-purple-500/20 text-purple-500 text-xs mb-3">My Plan</Badge>}
          {type === 'default' && plan.level && <Badge className={`${levelColors[plan.level]} text-xs mb-3`}>{plan.level}</Badge>}
          <h3 className="font-bold text-foreground text-base mb-1 group-hover:text-primary transition-colors">{plan.title}</h3>
          {plan.description && <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{plan.description}</p>}
          {plan.notes && <p className="text-xs text-blue-400 italic mb-3">"{plan.notes.slice(0, 80)}..."</p>}
          <div className="flex gap-2 text-xs text-muted-foreground flex-wrap mb-3">
            {plan.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{plan.duration}</span>}
            {plan.goal && <span className="flex items-center gap-1"><Flame className="h-3 w-3 text-orange-500" />{plan.goal}</span>}
            {plan.days && <span className="flex items-center gap-1"><Dumbbell className="h-3 w-3 text-primary" />{plan.days} days/week</span>}
          </div>
          {todaySchedule && (
            <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-xs font-semibold text-primary mb-1">📅 Today ({TODAY}): {todaySchedule.name}</p>
              <p className="text-xs text-muted-foreground">{todaySchedule.exercises.length} exercises</p>
            </div>
          )}
          <Button className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90 text-sm">View Full Plan</Button>
        </CardContent>
      </Card>
    );
  };

  const ScheduleView = ({ plan }: { plan: any }) => {
    const days = Object.entries(plan.schedule || {});
    return (
      <div>
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Button variant="outline" className="border-border bg-transparent gap-2" onClick={() => setSelectedPlan(null)}>
            <ArrowLeft className="h-4 w-4" />Back
          </Button>
          <div>
            <h2 className="font-bold text-xl text-foreground">{plan.title}</h2>
            {plan.goal && <p className="text-xs text-muted-foreground">{plan.goal}{plan.duration ? ` · ${plan.duration}` : ''}</p>}
          </div>
        </div>
        {plan.notes && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-5 text-sm text-blue-400">
            💬 <strong>Trainer note:</strong> {plan.notes}
          </div>
        )}
        <div className="space-y-3">
          {days.map(([day, session]: [string, any]) => {
            const isToday = day === TODAY;
            return (
              <Card key={day} className={`border-border/50 ${isToday ? 'border-primary/50 ring-1 ring-primary/20' : ''}`}>
                <button className="w-full p-4 flex items-center justify-between text-left" onClick={() => toggleDay(day)}>
                  <div className="flex items-center gap-3">
                    {isToday && <Badge className="bg-primary text-primary-foreground text-xs">TODAY</Badge>}
                    <div>
                      <p className="font-semibold text-foreground">{day}</p>
                      <p className="text-sm text-muted-foreground">{session.name} · {session.exercises?.length} exercises</p>
                    </div>
                  </div>
                  {expandedDays.has(day) ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </button>
                {expandedDays.has(day) && (
                  <div className="px-4 pb-4">
                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="grid grid-cols-4 text-xs text-muted-foreground font-medium mb-2 px-1">
                        <span>Exercise</span><span className="text-center">Sets</span><span className="text-center">Reps</span><span className="text-center">Rest</span>
                      </div>
                      {session.exercises?.map((ex: any, i: number) => (
                        <div key={i} className={`grid grid-cols-4 py-2.5 px-1 rounded-lg ${isToday ? 'bg-primary/5' : 'bg-secondary/30'}`}>
                          <span className="text-sm font-medium text-foreground">{ex.name}</span>
                          <span className="text-sm text-center text-foreground">{ex.sets}</span>
                          <span className="text-sm text-center text-foreground">{ex.reps}</span>
                          <span className="text-sm text-center text-muted-foreground">{ex.rest}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Workout Plans</h1>
            <p className="text-muted-foreground">Structured programs for every goal</p>
          </div>
        </div>

        {/* Today's workout banner */}
        <div className="p-4 bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-xl mb-6">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">📅 Today is {TODAY}</p>
          {DEFAULT_PLANS[0].schedule[TODAY as keyof typeof DEFAULT_PLANS[0]['schedule']] ? (
            <div>
              <p className="font-bold text-foreground">Today's Default Workout: {(DEFAULT_PLANS[0].schedule as any)[TODAY]?.name}</p>
              <p className="text-sm text-muted-foreground">{(DEFAULT_PLANS[0].schedule as any)[TODAY]?.exercises?.length} exercises</p>
            </div>
          ) : (
            <p className="font-bold text-foreground">Rest day — recovery is part of the plan 💪</p>
          )}
        </div>

        {!selectedPlan ? (
          <div>
            {/* Tabs */}
            <div className="flex gap-1 bg-secondary/50 p-1 rounded-xl mb-6">
              {([['default', '🏋️ Default Plans'], ['trainer', '👨‍🏫 Trainer Plans'], ['custom', '✏️ My Plans']] as const).map(([t, label]) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  {label}
                </button>
              ))}
            </div>

            {tab === 'default' && (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {DEFAULT_PLANS.map(p => <PlanCard key={p.id} plan={p} type="default" />)}
              </div>
            )}

            {tab === 'trainer' && (
              TRAINER_PLANS.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2">
                  {TRAINER_PLANS.map(p => <PlanCard key={p.id} plan={p} type="trainer" />)}
                </div>
              ) : (
                <Card className="border-dashed border-border/50 p-12 text-center">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="font-semibold text-foreground mb-1">No trainer plans yet</p>
                  <p className="text-sm text-muted-foreground">Book a trainer session and they'll create a custom plan for you</p>
                  <Link href="/subscriptions" className="block mt-4"><Button className="bg-primary text-primary-foreground">View My Trainers</Button></Link>
                </Card>
              )
            )}

            {tab === 'custom' && (
              <div>
                {!buildingPlan ? (
                  <>
                    {customPlans.length === 0 ? (
                      <Card className="border-dashed border-border/50 p-12 text-center mb-4">
                        <Edit3 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                        <p className="font-semibold text-foreground mb-1">No custom plans yet</p>
                        <p className="text-sm text-muted-foreground mb-4">Create your own workout plan tailored to your schedule</p>
                      </Card>
                    ) : (
                      <div className="grid gap-5 md:grid-cols-2 mb-4">
                        {customPlans.map(p => <PlanCard key={p.id} plan={p} type="custom" />)}
                      </div>
                    )}
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2" onClick={() => setBuildingPlan(true)}>
                      <Plus className="h-4 w-4" />Create New Plan
                    </Button>
                  </>
                ) : (
                  <Card className="border-border/50 p-5">
                    <h3 className="font-bold text-foreground mb-4">Build Your Plan</h3>
                    <div className="space-y-4 mb-6">
                      <div><Label>Plan Name</Label><Input value={newPlanTitle} onChange={e => setNewPlanTitle(e.target.value)} placeholder="e.g. My Morning Routine" className="bg-secondary border-border mt-1" /></div>
                      <div><Label>Goal</Label><Input value={newPlanGoal} onChange={e => setNewPlanGoal(e.target.value)} placeholder="e.g. Strength, Flexibility" className="bg-secondary border-border mt-1" /></div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-foreground mb-3">Add workout days:</p>
                      <div className="flex gap-2 flex-wrap mb-3">
                        {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
                          <button key={d} onClick={() => { if (!newPlanDays[d]) addExerciseToDayBuilder(d); setAddingDay(d); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${newPlanDays[d] ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>{d.slice(0,3)}</button>
                        ))}
                      </div>
                      {Object.entries(newPlanDays).map(([day, data]) => (
                        <div key={day} className="mb-4 p-3 bg-secondary/50 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-sm text-foreground">{day}</p>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setNewPlanDays(prev => { const n = {...prev}; delete n[day]; return n; })}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                          {data.exercises.map((ex, i) => (
                            <div key={i} className="grid grid-cols-4 gap-1.5 mb-1.5">
                              <Input value={ex.name} onChange={e => setNewPlanDays(prev => { const n = {...prev}; n[day].exercises[i].name = e.target.value; return n; })} placeholder="Exercise" className="bg-background border-border col-span-1 text-xs h-8" />
                              <Input value={ex.sets} onChange={e => setNewPlanDays(prev => { const n = {...prev}; n[day].exercises[i].sets = e.target.value; return n; })} placeholder="Sets" className="bg-background border-border text-xs h-8" />
                              <Input value={ex.reps} onChange={e => setNewPlanDays(prev => { const n = {...prev}; n[day].exercises[i].reps = e.target.value; return n; })} placeholder="Reps" className="bg-background border-border text-xs h-8" />
                              <Input value={ex.rest} onChange={e => setNewPlanDays(prev => { const n = {...prev}; n[day].exercises[i].rest = e.target.value; return n; })} placeholder="Rest" className="bg-background border-border text-xs h-8" />
                            </div>
                          ))}
                          <Button variant="ghost" size="sm" className="text-xs gap-1 mt-1" onClick={() => addExerciseToDayBuilder(day)}><Plus className="h-3 w-3" />Add Exercise</Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="border-border bg-transparent" onClick={() => setBuildingPlan(false)}>Cancel</Button>
                      <Button className="bg-primary text-primary-foreground" onClick={saveCustomPlan}>Save Plan</Button>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        ) : (
          <ScheduleView plan={selectedPlan} />
        )}
      </main>
    </div>
  );
}
