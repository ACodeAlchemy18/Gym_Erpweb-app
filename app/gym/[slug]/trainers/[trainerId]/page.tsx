'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
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
  ArrowLeft, Award, Star, Users, Trash2, Mail, Phone,
  Eye, UserCheck, UserPlus, Clock, DollarSign,
  Building2, Search, X, IdCard, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { getOwnerGyms } from '@/data/owner-gyms';
import {
  associateTrainerWithGym,
  removeTrainerFromGym,
  getActiveTrainerIdsForGym,
} from '@/data/trainer-gyms';
import {
  getAllRegisteredTrainers,
  getAvailableTrainersForGym,
  getTrainerByPublicId,
  searchTrainers,
  type RegisteredTrainer,
} from '@/data/trainer-registry';

const DUMMY_GYM = { id: 'demo_gym_1', name: 'My Gym (Demo)', city: 'Mumbai' };

export default function OwnersTrainersPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [gyms, setGyms] = useState<any[]>([]);
  const [selectedGym, setSelectedGym] = useState<string>('');
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [trainerToRemove, setTrainerToRemove] = useState<string | null>(null);
  const [viewTrainer, setViewTrainer] = useState<RegisteredTrainer | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [assignedIds, setAssignedIds] = useState<string[]>([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [idSearchQuery, setIdSearchQuery] = useState('');
  const [idSearchResult, setIdSearchResult] = useState<RegisteredTrainer | null | 'not_found'>(null);
  const [addSuccessMsg, setAddSuccessMsg] = useState('');

  const refreshAssigned = useCallback((gymId: string) => {
    setAssignedIds(getActiveTrainerIdsForGym(gymId));
  }, []);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'owner') { router.push('/login'); return; }
    const ownerGyms = getOwnerGyms(user.id);
    const allGyms = ownerGyms.length > 0 ? ownerGyms : [DUMMY_GYM];
    setGyms(allGyms);
    setSelectedGym(allGyms[0].id);
    refreshAssigned(allGyms[0].id);
  }, [isAuthenticated, user, router, refreshAssigned]);

  useEffect(() => {
    if (selectedGym) refreshAssigned(selectedGym);
  }, [selectedGym, refreshAssigned]);

  const currentGym = gyms.find(g => g.id === selectedGym);
  const allTrainers = getAllRegisteredTrainers();
  const addedTrainers = allTrainers.filter(t => assignedIds.includes(t.id));

  // Filter available trainers by search query
  const filteredAvailable = searchQuery.trim()
    ? searchTrainers(searchQuery).filter(t => !assignedIds.includes(t.id))
    : getAvailableTrainersForGym(assignedIds);

  const handleAddTrainer = (trainerId: string, trainerName?: string) => {
    if (!selectedGym) return;
    associateTrainerWithGym(trainerId, selectedGym);
    refreshAssigned(selectedGym);
    if (trainerName) {
      setAddSuccessMsg(`${trainerName} added to ${currentGym?.name}!`);
      setTimeout(() => setAddSuccessMsg(''), 3000);
    }
  };

  const handleRemoveConfirm = () => {
    if (!trainerToRemove || !selectedGym) return;
    removeTrainerFromGym(trainerToRemove, selectedGym);
    refreshAssigned(selectedGym);
    setTrainerToRemove(null);
    setRemoveDialogOpen(false);
  };

  // Search trainer by their public Trainer ID (e.g. TRN-001)
  const handleIdSearch = () => {
    if (!idSearchQuery.trim()) return;
    const found = getTrainerByPublicId(idSearchQuery.trim());
    setIdSearchResult(found ?? 'not_found');
  };

  const handleAddFromIdSearch = () => {
    if (!idSearchResult || idSearchResult === 'not_found') return;
    handleAddTrainer(idSearchResult.id, idSearchResult.name);
    setIdSearchQuery('');
    setIdSearchResult(null);
  };

  if (!isAuthenticated || user?.role !== 'owner') return null;

  const TrainerCard = ({ trainer, isAdded }: { trainer: RegisteredTrainer; isAdded: boolean }) => (
    <Card className="bg-card border-border/50 p-5 flex flex-col gap-4 hover:border-primary/40 transition-all">
      <div className="flex items-start gap-4">
        <img src={trainer.avatar || '/placeholder-user.jpg'} alt={trainer.name} className="h-16 w-16 rounded-xl object-cover border border-border" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-base">{trainer.name}</h3>
          <Badge className="mt-1 bg-primary/20 text-primary text-xs">{trainer.specialization}</Badge>
          {/* Trainer ID badge */}
          <div className="flex items-center gap-1 mt-1.5">
            <IdCard className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">{trainer.trainerId}</span>
          </div>
        </div>
        {isAdded && (
          <Badge variant="outline" className="text-green-500 border-green-500/50 text-xs shrink-0 flex items-center gap-1">
            <UserCheck className="h-3 w-3" />Added
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground"><Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" /><span>{trainer.rating} rating</span></div>
        <div className="flex items-center gap-1.5 text-muted-foreground"><Award className="h-3.5 w-3.5 text-primary" /><span>{trainer.yearsExperience} yrs exp</span></div>
        <div className="flex items-center gap-1.5 text-muted-foreground"><DollarSign className="h-3.5 w-3.5 text-green-500" /><span>₹{trainer.hourlyRate}/hr</span></div>
        <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-3.5 w-3.5 text-primary" /><span className="truncate">{trainer.city}</span></div>
        <div className="flex items-center gap-1.5 text-muted-foreground col-span-2"><Mail className="h-3.5 w-3.5" /><span className="truncate text-xs">{trainer.email}</span></div>
      </div>

      <div className="flex gap-2 pt-1 border-t border-border/50">
        <Button variant="outline" size="sm" className="flex-1 border-border bg-transparent gap-1.5 text-xs" onClick={() => { setViewTrainer(trainer); setProfileDialogOpen(true); }}>
          <Eye className="h-3.5 w-3.5" />View Profile
        </Button>
        {isAdded ? (
          <Button variant="outline" size="sm" className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10 gap-1.5 text-xs"
            onClick={() => { setTrainerToRemove(trainer.id); setRemoveDialogOpen(true); }}>
            <Trash2 className="h-3.5 w-3.5" />Remove
          </Button>
        ) : (
          <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-xs"
            onClick={() => handleAddTrainer(trainer.id, trainer.name)}>
            <UserPlus className="h-3.5 w-3.5" />Add to Gym
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">

        {/* Page header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/owner"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Trainers</h1>
            <p className="text-muted-foreground">Add or remove trainers from your gym</p>
          </div>
        </div>

        {/* Success toast */}
        {addSuccessMsg && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 dark:text-green-400 text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0" />{addSuccessMsg}
          </div>
        )}

        {/* Gym info */}
        {currentGym && (
          <Card className="bg-card border-border/50 p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg"><Building2 className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="font-semibold text-foreground">{currentGym.name}</p>
                  <p className="text-sm text-muted-foreground">{currentGym.city}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{addedTrainers.length}</p>
                  <p className="text-xs text-muted-foreground">In Your Gym</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{getAvailableTrainersForGym(assignedIds).length}</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ═══════════════════════════════════════════════
            SECTION: ADD BY TRAINER ID
        ═══════════════════════════════════════════════ */}
        <Card className="bg-card border-primary/30 border p-5 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <IdCard className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Add Trainer by ID</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Ask your trainer for their Trainer ID (shown on their dashboard) and enter it below to find and add them instantly.
          </p>

          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g. TRN-001"
                value={idSearchQuery}
                onChange={e => { setIdSearchQuery(e.target.value); setIdSearchResult(null); }}
                onKeyDown={e => e.key === 'Enter' && handleIdSearch()}
                className="pl-9 bg-secondary border-border font-mono uppercase tracking-wider"
              />
            </div>
            <Button onClick={handleIdSearch} disabled={!idSearchQuery.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
              <Search className="h-4 w-4" />Search
            </Button>
            {idSearchQuery && (
              <Button variant="ghost" size="icon" onClick={() => { setIdSearchQuery(''); setIdSearchResult(null); }}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Search result */}
          {idSearchResult === 'not_found' && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              No trainer found with ID <strong className="font-mono ml-1">{idSearchQuery}</strong>. Please check the ID and try again.
            </div>
          )}

          {idSearchResult && idSearchResult !== 'not_found' && (
            <div className="p-4 bg-secondary/50 border border-border rounded-lg">
              <div className="flex items-center gap-4">
                <img src={idSearchResult.avatar} alt={idSearchResult.name} className="h-14 w-14 rounded-xl object-cover border border-border" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground">{idSearchResult.name}</p>
                    <Badge className="bg-primary/20 text-primary text-xs">{idSearchResult.trainerId}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{idSearchResult.specialization} · {idSearchResult.city}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>⭐ {idSearchResult.rating}</span>
                    <span>🏆 {idSearchResult.yearsExperience} yrs exp</span>
                    <span>₹{idSearchResult.hourlyRate}/hr</span>
                  </div>
                </div>
                {assignedIds.includes(idSearchResult.id) ? (
                  <Badge variant="outline" className="text-green-500 border-green-500/50 shrink-0">
                    <UserCheck className="h-3.5 w-3.5 mr-1" />Already Added
                  </Badge>
                ) : (
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 gap-1.5" onClick={handleAddFromIdSearch}>
                    <UserPlus className="h-4 w-4" />Add to Gym
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* ═══════════════════════════════════════════════
            SECTION 1: YOUR GYM'S TRAINERS
        ═══════════════════════════════════════════════ */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <UserCheck className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-bold text-foreground">Your Gym's Trainers</h2>
            <Badge className="bg-green-500/20 text-green-500">{addedTrainers.length}</Badge>
          </div>

          {addedTrainers.length === 0 ? (
            <Card className="bg-card border-border/50 border-dashed p-10 text-center">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground mb-1">No trainers added yet</p>
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
            <span className="bg-background px-4 text-sm text-muted-foreground">Browse & Add Available Trainers</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 2: AVAILABLE TRAINERS + search bar
        ═══════════════════════════════════════════════ */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <UserPlus className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Available Trainers</h2>
              <Badge className="bg-primary/20 text-primary">{filteredAvailable.length}</Badge>
            </div>
            {/* Search bar */}
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, specialty..."
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

          {filteredAvailable.length === 0 ? (
            <Card className="bg-card border-border/50 border-dashed p-10 text-center">
              {searchQuery ? (
                <>
                  <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="font-semibold text-foreground mb-1">No results for "{searchQuery}"</p>
                  <p className="text-sm text-muted-foreground">Try a different name, ID, or specialization</p>
                </>
              ) : (
                <>
                  <UserCheck className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <p className="font-semibold text-foreground mb-1">All trainers are in your gym!</p>
                  <p className="text-sm text-muted-foreground">Every registered trainer has been added to {currentGym?.name}.</p>
                </>
              )}
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAvailable.map(t => <TrainerCard key={t.id} trainer={t} isAdded={false} />)}
            </div>
          )}
        </div>
      </main>

      {/* TRAINER PROFILE DIALOG */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
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
                  {/* Trainer ID shown in profile */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <IdCard className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-mono font-semibold text-primary">{viewTrainer.trainerId}</span>
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

              <div className="space-y-2 text-sm border-t border-border pt-4">
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />{viewTrainer.email}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />{viewTrainer.phone}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Award className="h-4 w-4" /><span className="text-xs">{viewTrainer.certifications}</span></div>
              </div>

              {!assignedIds.includes(viewTrainer.id) ? (
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { handleAddTrainer(viewTrainer.id, viewTrainer.name); setProfileDialogOpen(false); }}>
                  <UserPlus className="h-4 w-4 mr-2" />Add to {currentGym?.name}
                </Button>
              ) : (
                <Button variant="outline" className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                  onClick={() => { setTrainerToRemove(viewTrainer.id); setProfileDialogOpen(false); setRemoveDialogOpen(true); }}>
                  <Trash2 className="h-4 w-4 mr-2" />Remove from {currentGym?.name}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* REMOVE CONFIRM */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Trainer?</AlertDialogTitle>
            <AlertDialogDescription>This trainer will be removed from {currentGym?.name}. You can re-add them anytime.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-transparent">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
