'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import {
  ArrowLeft, Award, Star, Trash2, Mail, Phone,
  Eye, UserCheck, UserPlus, Clock, DollarSign,
  Building2, Search, X, IdCard, CheckCircle2, AlertCircle, Users,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// ALL TRAINER DATA INLINE — no external imports needed
// This makes the page work even if other data files are missing
// ─────────────────────────────────────────────────────────────────
interface Trainer {
  id: string;
  trainerId: string;   // public ID shown on trainer dashboard e.g. TRN-001
  name: string;
  email: string;
  avatar: string;
  specialization: string;
  yearsExperience: number;
  hourlyRate: number;
  rating: number;
  certifications: string;
  bio: string;
  city: string;
  phone: string;
  availability: string;
}

const ALL_TRAINERS: Trainer[] = [
  {
    id: 'trainer_1',
    trainerId: 'TRN-001',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
    specialization: 'Strength Training',
    yearsExperience: 5,
    hourlyRate: 50,
    rating: 4.8,
    certifications: 'ACE, NASM, ISSA',
    bio: 'Passionate strength coach helping clients build muscle and boost confidence.',
    city: 'Mumbai',
    phone: '+91-9876500001',
    availability: 'Mon-Sat, 6AM-9PM',
  },
  {
    id: 'trainer_2',
    trainerId: 'TRN-002',
    name: 'Priya Patel',
    email: 'priya@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    specialization: 'Yoga & Flexibility',
    yearsExperience: 8,
    hourlyRate: 45,
    rating: 4.9,
    certifications: 'RYT-200, Yoga Alliance',
    bio: 'Bringing calm and flexibility to every practice. Specialised in Hatha and Vinyasa yoga.',
    city: 'Bangalore',
    phone: '+91-9876500002',
    availability: 'Mon-Sun, 7AM-7PM',
  },
  {
    id: 'trainer_3',
    trainerId: 'TRN-003',
    name: 'Amit Verma',
    email: 'amit@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
    specialization: 'CrossFit',
    yearsExperience: 6,
    hourlyRate: 55,
    rating: 4.7,
    certifications: 'CrossFit Level 2, NASM',
    bio: 'High-intensity training specialist. Helping athletes push their limits every day.',
    city: 'Delhi',
    phone: '+91-9876500003',
    availability: 'Mon-Fri, 5AM-10PM',
  },
  {
    id: 'trainer_4',
    trainerId: 'TRN-004',
    name: 'Neha Singh',
    email: 'neha@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neha',
    specialization: 'Cardio & Weight Loss',
    yearsExperience: 4,
    hourlyRate: 40,
    rating: 4.6,
    certifications: 'ACE-CPT, Zumba Certified',
    bio: 'Fun, energetic cardio sessions that make fitness feel like a party.',
    city: 'Pune',
    phone: '+91-9876500004',
    availability: 'Tue-Sun, 6AM-8PM',
  },
  {
    id: 'trainer_5',
    trainerId: 'TRN-005',
    name: 'Vikram Nair',
    email: 'vikram@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram',
    specialization: 'Sports Performance',
    yearsExperience: 10,
    hourlyRate: 70,
    rating: 4.9,
    certifications: 'CSCS, NSCA, Sports Nutrition Diploma',
    bio: 'Former national-level athlete now dedicated to coaching the next generation of champions.',
    city: 'Chennai',
    phone: '+91-9876500005',
    availability: 'Mon-Sat, 7AM-8PM',
  },
];

// Search by trainerId (exact, case-insensitive, ignoring dashes)
function findByTrainerId(input: string): Trainer | null {
  const normalized = input.replace(/[-\s]/g, '').toUpperCase();
  return ALL_TRAINERS.find(t =>
    t.trainerId.replace(/[-\s]/g, '').toUpperCase() === normalized
  ) || null;
}

// Search by name / trainerId / specialization / city (partial)
function searchTrainers(q: string): Trainer[] {
  const lower = q.toLowerCase().trim();
  if (!lower) return ALL_TRAINERS;
  return ALL_TRAINERS.filter(t =>
    t.name.toLowerCase().includes(lower) ||
    t.trainerId.toLowerCase().includes(lower) ||
    t.specialization.toLowerCase().includes(lower) ||
    t.city.toLowerCase().includes(lower)
  );
}

// ─────────────────────────────────────────────────────────────────
export default function OwnersTrainersPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Gym name — read from localStorage if available, else show generic label
  const [gymName, setGymName] = useState('Your Gym');

  // The IDs of trainers added to this gym (stored in component state only for prototype)
  const [addedIds, setAddedIds] = useState<string[]>([]);

  // ID search
  const [idInput, setIdInput] = useState('');
  const [idResult, setIdResult] = useState<Trainer | null | 'not_found'>(null);

  // Browse search
  const [searchQuery, setSearchQuery] = useState('');

  // Profile dialog
  const [viewTrainer, setViewTrainer] = useState<Trainer | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Remove confirm
  const [removeId, setRemoveId] = useState<string | null>(null);

  // Success toast
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'owner') {
      router.push('/login');
      return;
    }
    // Try to read gym name from localStorage
    try {
      const stored = localStorage.getItem(`owner_gyms_${user.id}`);
      if (stored) {
        const gyms = JSON.parse(stored);
        if (gyms.length > 0) setGymName(gyms[0].name);
      }
    } catch (_) {}
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'owner') return null;

  const addedTrainers = ALL_TRAINERS.filter(t => addedIds.includes(t.id));
  const availableTrainers = searchQuery.trim()
    ? searchTrainers(searchQuery).filter(t => !addedIds.includes(t.id))
    : ALL_TRAINERS.filter(t => !addedIds.includes(t.id));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const addTrainer = (trainer: Trainer) => {
    if (addedIds.includes(trainer.id)) return;
    setAddedIds(prev => [...prev, trainer.id]);
    showToast(`${trainer.name} (${trainer.trainerId}) added to ${gymName}!`);
  };

  const removeTrainer = () => {
    if (!removeId) return;
    setAddedIds(prev => prev.filter(id => id !== removeId));
    setRemoveId(null);
  };

  const handleIdSearch = () => {
    if (!idInput.trim()) return;
    setIdResult(findByTrainerId(idInput.trim()) ?? 'not_found');
  };

  // ── TRAINER CARD ──────────────────────────────────────────────
  const TrainerCard = ({ trainer, isAdded }: { trainer: Trainer; isAdded: boolean }) => (
    <Card className="bg-card border-border/50 p-5 flex flex-col gap-4 hover:border-primary/40 transition-all">
      {/* Top row */}
      <div className="flex items-start gap-3">
        <img
          src={trainer.avatar}
          alt={trainer.name}
          className="h-14 w-14 rounded-xl object-cover border border-border shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{trainer.name}</h3>
          <Badge className="mt-0.5 bg-primary/20 text-primary text-xs">{trainer.specialization}</Badge>
          <div className="flex items-center gap-1 mt-1">
            <IdCard className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground tracking-wide">{trainer.trainerId}</span>
          </div>
        </div>
        {isAdded && (
          <Badge variant="outline" className="text-green-500 border-green-500/40 text-xs flex items-center gap-1 shrink-0">
            <UserCheck className="h-3 w-3" />Added
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />{trainer.rating} rating</span>
        <span className="flex items-center gap-1"><Award className="h-3 w-3 text-primary" />{trainer.yearsExperience} yrs exp</span>
        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3 text-green-500" />₹{trainer.hourlyRate}/hr</span>
        <span className="flex items-center gap-1 truncate"><Clock className="h-3 w-3 text-primary shrink-0" />{trainer.city}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-border/50">
        <Button variant="outline" size="sm" className="flex-1 border-border bg-transparent text-xs gap-1"
          onClick={() => { setViewTrainer(trainer); setProfileOpen(true); }}>
          <Eye className="h-3.5 w-3.5" />View Profile
        </Button>
        {isAdded ? (
          <Button variant="outline" size="sm" className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10 text-xs gap-1"
            onClick={() => setRemoveId(trainer.id)}>
            <Trash2 className="h-3.5 w-3.5" />Remove
          </Button>
        ) : (
          <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs gap-1"
            onClick={() => addTrainer(trainer)}>
            <UserPlus className="h-3.5 w-3.5" />Add
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Page header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/owner"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Trainers</h1>
            <p className="text-muted-foreground">Add or remove trainers from your gym</p>
          </div>
        </div>

        {/* Gym info bar */}
        <Card className="bg-card border-border/50 p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg"><Building2 className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="font-semibold text-foreground">{gymName}</p>
                <p className="text-xs text-muted-foreground">Managing trainer roster</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{addedTrainers.length}</p>
                <p className="text-xs text-muted-foreground">In Your Gym</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{ALL_TRAINERS.length - addedTrainers.length}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Toast */}
        {toast && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 dark:text-green-400 text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0" />{toast}
          </div>
        )}

        {/* ══════════════════════════════════════════
            ADD BY TRAINER ID
        ══════════════════════════════════════════ */}
        <Card className="border border-primary/30 bg-card p-5 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <IdCard className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Add Trainer by ID</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Ask the trainer for their Trainer ID from their dashboard (e.g. <span className="font-mono font-semibold text-foreground">TRN-001</span>) and enter it below.
          </p>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter Trainer ID  e.g. TRN-001"
                value={idInput}
                onChange={e => { setIdInput(e.target.value.toUpperCase()); setIdResult(null); }}
                onKeyDown={e => e.key === 'Enter' && handleIdSearch()}
                className="pl-9 bg-secondary border-border font-mono tracking-wider"
              />
            </div>
            <Button
              onClick={handleIdSearch}
              disabled={!idInput.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shrink-0"
            >
              <Search className="h-4 w-4" />Search
            </Button>
            {idInput && (
              <Button variant="ghost" size="icon" onClick={() => { setIdInput(''); setIdResult(null); }}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Result */}
          {idResult === 'not_found' && (
            <div className="mt-3 flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              No trainer found with ID <span className="font-mono font-bold ml-1">{idInput}</span>.
              Try TRN-001 through TRN-005 for this demo.
            </div>
          )}

          {idResult && idResult !== 'not_found' && (
            <div className="mt-3 p-4 bg-secondary/60 border border-border rounded-lg flex items-center gap-4 flex-wrap">
              <img src={idResult.avatar} alt={idResult.name} className="h-14 w-14 rounded-xl object-cover border border-border shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-foreground">{idResult.name}</p>
                  <Badge className="bg-primary/20 text-primary text-xs font-mono">{idResult.trainerId}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{idResult.specialization} · {idResult.city}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ⭐ {idResult.rating} · {idResult.yearsExperience} yrs · ₹{idResult.hourlyRate}/hr
                </p>
              </div>
              {addedIds.includes(idResult.id) ? (
                <Badge variant="outline" className="text-green-500 border-green-500/40 shrink-0 flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5" />Already in your gym
                </Badge>
              ) : (
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shrink-0"
                  onClick={() => { addTrainer(idResult); setIdInput(''); setIdResult(null); }}
                >
                  <UserPlus className="h-4 w-4" />Add to {gymName}
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* ══════════════════════════════════════════
            YOUR GYM'S TRAINERS
        ══════════════════════════════════════════ */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <UserCheck className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-bold text-foreground">Your Gym's Trainers</h2>
            <Badge className="bg-green-500/20 text-green-600">{addedTrainers.length}</Badge>
          </div>

          {addedTrainers.length === 0 ? (
            <Card className="border-dashed border-border/50 p-10 text-center bg-card">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground mb-1 font-medium">No trainers added yet</p>
              <p className="text-sm text-muted-foreground">Use the Trainer ID search above or browse available trainers below</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {addedTrainers.map(t => <TrainerCard key={t.id} trainer={t} isAdded={true} />)}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-sm text-muted-foreground">Browse & Add from Available Trainers</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            AVAILABLE TRAINERS
        ══════════════════════════════════════════ */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <UserPlus className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Available Trainers</h2>
              <Badge className="bg-primary/20 text-primary">{ALL_TRAINERS.length - addedTrainers.length}</Badge>
            </div>
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, ID, specialty, city..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary border-border"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {availableTrainers.length === 0 ? (
            <Card className="border-dashed border-border/50 p-10 text-center bg-card">
              {searchQuery ? (
                <>
                  <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="font-medium text-foreground mb-1">No results for "{searchQuery}"</p>
                  <p className="text-sm text-muted-foreground">Try a different name, ID, or specialization</p>
                </>
              ) : (
                <>
                  <UserCheck className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <p className="font-medium text-foreground mb-1">All trainers are in your gym!</p>
                </>
              )}
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableTrainers.map(t => <TrainerCard key={t.id} trainer={t} isAdded={false} />)}
            </div>
          )}
        </div>
      </main>

      {/* PROFILE DIALOG */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Trainer Profile</DialogTitle>
            <DialogDescription>Full details for this trainer</DialogDescription>
          </DialogHeader>
          {viewTrainer && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <img src={viewTrainer.avatar} alt={viewTrainer.name} className="h-20 w-20 rounded-xl object-cover border border-border" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">{viewTrainer.name}</h2>
                  <Badge className="bg-primary/20 text-primary mt-1">{viewTrainer.specialization}</Badge>
                  <div className="flex items-center gap-1.5 mt-2">
                    <IdCard className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-mono font-bold text-primary tracking-wider">{viewTrainer.trainerId}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{viewTrainer.bio}</p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Experience', value: `${viewTrainer.yearsExperience} years` },
                  { label: 'Rating', value: `⭐ ${viewTrainer.rating}` },
                  { label: 'Hourly Rate', value: `₹${viewTrainer.hourlyRate}/hr` },
                  { label: 'Availability', value: viewTrainer.availability },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    <p className="font-semibold text-foreground text-sm">{value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t border-border pt-3">
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />{viewTrainer.email}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />{viewTrainer.phone}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Award className="h-4 w-4" /><span className="text-xs">{viewTrainer.certifications}</span></div>
              </div>

              {!addedIds.includes(viewTrainer.id) ? (
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => { addTrainer(viewTrainer); setProfileOpen(false); }}>
                  <UserPlus className="h-4 w-4 mr-2" />Add to {gymName}
                </Button>
              ) : (
                <Button variant="outline" className="w-full border-destructive/40 text-destructive hover:bg-destructive/10"
                  onClick={() => { setRemoveId(viewTrainer.id); setProfileOpen(false); }}>
                  <Trash2 className="h-4 w-4 mr-2" />Remove from {gymName}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* REMOVE CONFIRM */}
      <AlertDialog open={!!removeId} onOpenChange={() => setRemoveId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Trainer?</AlertDialogTitle>
            <AlertDialogDescription>
              This trainer will be removed from {gymName}. You can re-add them anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-transparent">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeTrainer} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
