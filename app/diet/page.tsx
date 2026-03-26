"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Utensils, Droplets, Clock, Plus, Trash2, User, Edit3 } from "lucide-react";
import Link from "next/link";

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long' });

const MEAL_COLORS: Record<string, string> = {
  Breakfast: "bg-yellow-500/20 text-yellow-600", "Mid-Morning": "bg-green-500/20 text-green-600",
  Lunch: "bg-blue-500/20 text-blue-600", "Pre-Workout": "bg-orange-500/20 text-orange-600",
  "Evening Snack": "bg-purple-500/20 text-purple-600", Dinner: "bg-indigo-500/20 text-indigo-600",
};

const DEFAULT_DIETS = [
  {
    id: 'dd1', title: "Weight Loss Diet", goal: "Fat Loss", calories: "1600-1800 kcal",
    tag: "Popular", tagColor: "bg-orange-500/20 text-orange-500", color: "bg-orange-500",
    macros: { Protein: "40%", Carbs: "35%", Fat: "25%" },
    description: "Calorie-deficit plan with high protein to preserve muscle while losing fat.",
    meals: [
      { type: "Breakfast", time: "7:30 AM", name: "Oats with Banana & Almonds", calories: 320, items: ["1 cup rolled oats", "1 banana", "10 almonds", "1 tsp honey", "200ml low-fat milk"] },
      { type: "Mid-Morning", time: "10:30 AM", name: "Greek Yogurt with Berries", calories: 180, items: ["150g Greek yogurt", "½ cup mixed berries", "1 tsp chia seeds"] },
      { type: "Lunch", time: "1:00 PM", name: "Grilled Chicken Rice Bowl", calories: 480, items: ["150g grilled chicken", "1 cup brown rice", "Steamed broccoli", "1 tsp olive oil"] },
      { type: "Evening Snack", time: "5:00 PM", name: "Boiled Eggs + Cucumber", calories: 160, items: ["2 boiled eggs", "1 cucumber", "Salt & pepper"] },
      { type: "Dinner", time: "8:00 PM", name: "Dal + Roti + Salad", calories: 420, items: ["1 bowl moong dal", "2 whole wheat rotis", "Mixed salad", "1 tsp ghee"] },
    ],
  },
  {
    id: 'dd2', title: "Muscle Building Diet", goal: "Hypertrophy", calories: "2800-3200 kcal",
    tag: "Best for Gym", tagColor: "bg-primary/20 text-primary", color: "bg-primary",
    macros: { Protein: "35%", Carbs: "45%", Fat: "20%" },
    description: "High calorie, high protein plan to fuel intense workouts and muscle growth.",
    meals: [
      { type: "Breakfast", time: "7:00 AM", name: "Egg & Oats Power Bowl", calories: 620, items: ["4 whole eggs", "1.5 cups oats", "1 banana", "1 glass whole milk", "1 tbsp peanut butter"] },
      { type: "Mid-Morning", time: "10:00 AM", name: "Mass Gainer Shake", calories: 400, items: ["2 scoops mass gainer", "300ml milk", "1 banana"] },
      { type: "Lunch", time: "1:00 PM", name: "Chicken + Rice", calories: 750, items: ["200g chicken breast", "1.5 cups white rice", "Mixed veggies", "1 tbsp olive oil"] },
      { type: "Pre-Workout", time: "5:00 PM", name: "Banana + Protein Bar", calories: 350, items: ["2 bananas", "1 protein bar"] },
      { type: "Dinner", time: "9:00 PM", name: "Rajma Chawal + Paneer", calories: 700, items: ["1 bowl rajma", "1.5 cups rice", "100g paneer", "2 tsp ghee"] },
    ],
  },
  {
    id: 'dd3', title: "Vegetarian Fitness Diet", goal: "Balanced Health", calories: "1800-2200 kcal",
    tag: "Veg Friendly", tagColor: "bg-green-500/20 text-green-500", color: "bg-green-500",
    macros: { Protein: "30%", Carbs: "45%", Fat: "25%" },
    description: "Complete plant-based plan with all essential nutrients for an active lifestyle.",
    meals: [
      { type: "Breakfast", time: "7:30 AM", name: "Moong Dal Chilla + Curd", calories: 380, items: ["3 moong dal chillas", "100g curd", "Green chutney"] },
      { type: "Mid-Morning", time: "10:30 AM", name: "Mixed Nuts + Fruit", calories: 220, items: ["1 orange", "20g mixed nuts", "1 tsp flaxseeds"] },
      { type: "Lunch", time: "1:00 PM", name: "Chole + Brown Rice", calories: 520, items: ["1 bowl chole", "1 cup brown rice", "Salad", "1 tsp ghee"] },
      { type: "Evening Snack", time: "5:30 PM", name: "Sprouts Chaat", calories: 180, items: ["1 cup mixed sprouts", "Lemon, chaat masala", "Onion, tomato"] },
      { type: "Dinner", time: "8:00 PM", name: "Palak Paneer + Roti", calories: 480, items: ["½ cup spinach gravy", "100g paneer", "2 rotis"] },
    ],
  },
];

const TRAINER_DIETS = [
  {
    id: 'td1', trainerName: "Priya Patel", trainerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    title: "Recovery & Lean Gain Plan", goal: "Lean Muscle", calories: "2200 kcal",
    notes: "Increase protein at every meal. Avoid processed sugar. Drink water before every meal.",
    meals: [
      { type: "Breakfast", time: "7:00 AM", name: "Protein Smoothie + Eggs", calories: 450, items: ["1 scoop whey protein", "2 whole eggs + 2 whites", "1 cup spinach", "½ cup oats", "Almond milk"] },
      { type: "Lunch", time: "1:00 PM", name: "Quinoa Chicken Bowl", calories: 580, items: ["150g grilled chicken", "¾ cup quinoa", "Avocado", "Cherry tomatoes", "Lemon dressing"] },
      { type: "Dinner", time: "8:00 PM", name: "Fish + Sweet Potato", calories: 520, items: ["200g grilled fish", "1 medium sweet potato", "Steamed broccoli", "Olive oil"] },
    ],
  },
];

interface CustomMeal { type: string; name: string; calories: string; items: string; }

const DietCard = ({ diet, type, onSelect }: { diet: any; type: string; onSelect: () => void }) => (
  <Card className="border-border/50 overflow-hidden hover:border-primary/50 transition-all cursor-pointer group" onClick={onSelect}>
    <div className={`h-2 ${diet.color || 'bg-primary'}`} />
    <CardContent className="p-5">
      {type === 'trainer' && (
        <div className="flex items-center gap-2 mb-3">
          <img src={diet.trainerAvatar} alt={diet.trainerName} className="h-6 w-6 rounded-full" />
          <span className="text-xs text-muted-foreground">By {diet.trainerName}</span>
          <Badge className="bg-blue-500/20 text-blue-500 text-xs ml-auto">Trainer Plan</Badge>
        </div>
      )}
      {type === 'custom' && <Badge className="bg-purple-500/20 text-purple-500 text-xs mb-3">My Plan</Badge>}
      {diet.tag && type === 'default' && <Badge className={`${diet.tagColor} text-xs mb-3`}>{diet.tag}</Badge>}
      <h3 className="font-bold text-foreground text-base mb-1 group-hover:text-primary transition-colors">{diet.title}</h3>
      {diet.description && <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{diet.description}</p>}
      {diet.notes && <p className="text-xs text-blue-400 italic mb-3">"{diet.notes.slice(0, 80)}..."</p>}
      <div className="flex gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
        {diet.calories && <span className="flex items-center gap-1"><Utensils className="h-3 w-3" />{diet.calories}</span>}
        {diet.goal && <span className="flex items-center gap-1">🎯 {diet.goal}</span>}
      </div>
      {diet.macros && (
        <div className="flex gap-1.5 flex-wrap mb-3">
          {Object.entries(diet.macros).map(([k, v]: any) => (
            <span key={k} className={`px-2 py-0.5 rounded-full text-xs ${k === 'Protein' ? 'bg-red-500/10 text-red-500' : k === 'Carbs' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-blue-500/10 text-blue-500'}`}>{k} {v}</span>
          ))}
        </div>
      )}
      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm gap-2"><Utensils className="h-3.5 w-3.5" />View Plan</Button>
    </CardContent>
  </Card>
);

export default function DietPage() {
  const [tab, setTab] = useState<'default' | 'trainer' | 'custom'>('default');
  const [selectedDiet, setSelectedDiet] = useState<any>(null);
  const [customDiets, setCustomDiets] = useState<any[]>([]);
  const [building, setBuilding] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [customMeals, setCustomMeals] = useState<CustomMeal[]>([{ type: 'Breakfast', name: '', calories: '', items: '' }]);

  const saveCustomDiet = () => {
    if (!customTitle) return;
    setCustomDiets(prev => [...prev, {
      id: `cd_${Date.now()}`, title: customTitle, goal: customGoal || 'Custom',
      calories: `${customMeals.reduce((s, m) => s + (Number(m.calories) || 0), 0)} kcal`,
      color: 'bg-purple-500',
      meals: customMeals.map(m => ({ type: m.type, name: m.name, calories: Number(m.calories) || 0, items: m.items.split(',').map(x => x.trim()).filter(Boolean) })),
    }]);
    setBuilding(false); setCustomTitle(''); setCustomGoal(''); setCustomMeals([{ type: 'Breakfast', name: '', calories: '', items: '' }]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Diet Plans</h1>
            <p className="text-muted-foreground">Nutrition plans to fuel your fitness goals</p>
          </div>
        </div>

        {/* Water reminder */}
        <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
          <Droplets className="h-5 w-5 text-blue-500 shrink-0" />
          <p className="text-sm">💧 <strong>Daily goal:</strong> Drink 8–10 glasses of water (2.5–3 litres) throughout the day</p>
        </div>

        {!selectedDiet ? (
          <>
            {/* Tabs */}
            <div className="flex gap-1 bg-secondary/50 p-1 rounded-xl mb-6">
              {([['default', '🥗 Default Plans'], ['trainer', '👨‍🏫 Trainer Plans'], ['custom', '✏️ My Plans']] as const).map(([t, label]) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>{label}</button>
              ))}
            </div>

            {tab === 'default' && (
              <div className="grid gap-5 md:grid-cols-3">
                {DEFAULT_DIETS.map(d => <DietCard key={d.id} diet={d} type="default" onSelect={() => setSelectedDiet(d)} />)}
              </div>
            )}

            {tab === 'trainer' && (
              TRAINER_DIETS.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2">
                  {TRAINER_DIETS.map(d => <DietCard key={d.id} diet={d} type="trainer" onSelect={() => setSelectedDiet(d)} />)}
                </div>
              ) : (
                <Card className="border-dashed border-border/50 p-12 text-center">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="font-semibold text-foreground mb-1">No trainer diet plans yet</p>
                  <p className="text-sm text-muted-foreground">Book a trainer and request a personalised diet plan</p>
                </Card>
              )
            )}

            {tab === 'custom' && (
              <>
                {!building ? (
                  <>
                    {customDiets.length === 0 ? (
                      <Card className="border-dashed border-border/50 p-12 text-center mb-4">
                        <Edit3 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                        <p className="font-semibold text-foreground mb-1">No custom diet plans yet</p>
                        <p className="text-sm text-muted-foreground mb-4">Build your own meal plan</p>
                      </Card>
                    ) : (
                      <div className="grid gap-5 md:grid-cols-2 mb-4">
                        {customDiets.map(d => <DietCard key={d.id} diet={d} type="custom" onSelect={() => setSelectedDiet(d)} />)}
                      </div>
                    )}
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2" onClick={() => setBuilding(true)}>
                      <Plus className="h-4 w-4" />Create Diet Plan
                    </Button>
                  </>
                ) : (
                  <Card className="border-border/50 p-5">
                    <h3 className="font-bold text-foreground mb-4">Build Your Diet Plan</h3>
                    <div className="space-y-3 mb-5">
                      <div><Label>Plan Name</Label><Input value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="e.g. My Cutting Diet" className="bg-secondary border-border mt-1" /></div>
                      <div><Label>Goal</Label><Input value={customGoal} onChange={e => setCustomGoal(e.target.value)} placeholder="e.g. Fat Loss" className="bg-secondary border-border mt-1" /></div>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-3">Add your meals:</p>
                    {customMeals.map((meal, i) => (
                      <div key={i} className="p-3 bg-secondary/50 rounded-xl mb-3 space-y-2">
                        <div className="flex gap-2">
                          <Input value={meal.type} onChange={e => setCustomMeals(prev => { const n = [...prev]; n[i].type = e.target.value; return n; })} placeholder="Meal type" className="bg-background border-border flex-1 text-xs h-8" />
                          <Input value={meal.name} onChange={e => setCustomMeals(prev => { const n = [...prev]; n[i].name = e.target.value; return n; })} placeholder="Dish name" className="bg-background border-border flex-1 text-xs h-8" />
                          <Input value={meal.calories} onChange={e => setCustomMeals(prev => { const n = [...prev]; n[i].calories = e.target.value; return n; })} placeholder="kcal" className="bg-background border-border w-20 text-xs h-8" type="number" />
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0" onClick={() => setCustomMeals(prev => prev.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                        <Input value={meal.items} onChange={e => setCustomMeals(prev => { const n = [...prev]; n[i].items = e.target.value; return n; })} placeholder="Ingredients (comma separated)" className="bg-background border-border text-xs h-8" />
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="gap-1 mb-4" onClick={() => setCustomMeals(prev => [...prev, { type: '', name: '', calories: '', items: '' }])}><Plus className="h-3.5 w-3.5" />Add Meal</Button>
                    <div className="flex gap-3">
                      <Button variant="outline" className="border-border bg-transparent" onClick={() => setBuilding(false)}>Cancel</Button>
                      <Button className="bg-primary text-primary-foreground" onClick={saveCustomDiet}>Save Plan</Button>
                    </div>
                  </Card>
                )}
              </>
            )}
          </>
        ) : (
          /* Diet detail view */
          <div>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <Button variant="outline" className="border-border bg-transparent gap-2" onClick={() => setSelectedDiet(null)}>
                <ArrowLeft className="h-4 w-4" />Back
              </Button>
              <div>
                <h2 className="font-bold text-xl text-foreground">{selectedDiet.title}</h2>
                <p className="text-xs text-muted-foreground">{selectedDiet.calories} · {selectedDiet.goal}</p>
              </div>
            </div>
            {selectedDiet.notes && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-5 text-sm text-blue-400">
                💬 <strong>Trainer note:</strong> {selectedDiet.notes}
              </div>
            )}
            <div className="space-y-3">
              {selectedDiet.meals?.map((meal: any, i: number) => (
                <Card key={i} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${MEAL_COLORS[meal.type] || 'bg-secondary text-foreground'} text-xs`}>{meal.type}</Badge>
                        {meal.time && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{meal.time}</span>}
                      </div>
                      <span className="text-xs font-bold text-primary">{meal.calories} kcal</span>
                    </div>
                    <p className="font-semibold text-foreground mb-2 text-sm">{meal.name}</p>
                    <ul className="space-y-1">
                      {meal.items?.map((item: string, j: number) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-foreground">Daily Total</span>
                <span className="font-bold text-primary text-lg">{selectedDiet.meals?.reduce((s: number, m: any) => s + (m.calories || 0), 0)} kcal</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
