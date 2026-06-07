'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { ProfileDetails } from '@/components/profile-details';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getOwnerGyms, addOwnerGym, type OwnerGym } from '@/data/owner-gyms';
import {
  Users,
  Dumbbell,
  Wallet,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calendar,
  UserCheck,
  BarChart2,
  Wrench,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronUp,
  Phone,
  Clock,
  Star,
} from 'lucide-react';

// ─── Types & Mock Data ────────────────────────────────────────────────────────

interface Member {
  id: string;
  name: string;
  phone: string;
  plan: string;
  since: string;
  rating: number;
}

interface Trainer {
  id: string;
  name: string;
  joinedAt: string;
  members: number;
  specialization: string;
  status: 'active' | 'inactive';
  memberList: Member[];
}

const trainers: Trainer[] = [
  {
    id: 't1',
    name: 'Rahul Sharma',
    joinedAt: '2024-01-15',
    members: 4,
    specialization: 'Strength Training',
    status: 'active',
    memberList: [
      { id: 'm1', name: 'Aman Gupta',   phone: '+91 98765 43210', plan: 'Monthly',   since: 'Jan 2025', rating: 5 },
      { id: 'm2', name: 'Neha Singh',   phone: '+91 91234 56789', plan: 'Quarterly', since: 'Feb 2025', rating: 4 },
      { id: 'm3', name: 'Rohit Yadav',  phone: '+91 99887 66554', plan: 'Monthly',   since: 'Mar 2025', rating: 5 },
      { id: 'm4', name: 'Kavya Sharma', phone: '+91 88776 55443', plan: 'Weekly',    since: 'Mar 2025', rating: 3 },
    ],
  },
  {
    id: 't2',
    name: 'Priya Mehta',
    joinedAt: '2024-03-10',
    members: 3,
    specialization: 'Yoga & Flexibility',
    status: 'active',
    memberList: [
      { id: 'm5', name: 'Sunita Agarwal', phone: '+91 77665 44332', plan: 'Yearly',  since: 'Nov 2024', rating: 5 },
      { id: 'm6', name: 'Divya Khanna',   phone: '+91 66554 33221', plan: 'Monthly', since: 'Jan 2025', rating: 4 },
      { id: 'm7', name: 'Ritu Joshi',     phone: '+91 55443 22110', plan: 'Monthly', since: 'Feb 2025', rating: 5 },
    ],
  },
  {
    id: 't3',
    name: 'Aditya Verma',
    joinedAt: '2023-11-20',
    members: 4,
    specialization: 'CrossFit & HIIT',
    status: 'active',
    memberList: [
      { id: 'm8',  name: 'Karan Malhotra',  phone: '+91 44332 11009', plan: 'Quarterly', since: 'Dec 2024', rating: 4 },
      { id: 'm9',  name: 'Ishaan Tripathi', phone: '+91 33221 00998', plan: 'Monthly',   since: 'Jan 2025', rating: 5 },
      { id: 'm10', name: 'Anuj Rawat',      phone: '+91 22110 99887', plan: 'Monthly',   since: 'Feb 2025', rating: 3 },
      { id: 'm11', name: 'Pooja Nair',      phone: '+91 11009 88776', plan: 'Weekly',    since: 'Mar 2025', rating: 4 },
    ],
  },
  {
    id: 't4',
    name: 'Sneha Kapoor',
    joinedAt: '2024-06-01',
    members: 2,
    specialization: 'Cardio & Weight Loss',
    status: 'active',
    memberList: [
      { id: 'm12', name: 'Meera Pillai', phone: '+91 90001 23456', plan: 'Monthly',   since: 'Jul 2024', rating: 5 },
      { id: 'm13', name: 'Tanvi Desai',  phone: '+91 80001 23456', plan: 'Quarterly', since: 'Aug 2024', rating: 4 },
    ],
  },
  {
    id: 't5',
    name: 'Vikram Singh',
    joinedAt: '2023-08-05',
    members: 0,
    specialization: 'Powerlifting',
    status: 'inactive',
    memberList: [],
  },
];

const onlineMembers: Member[] = trainers.flatMap(t => t.memberList).slice(0, 5);
const offlineMembers: Member[] = trainers.flatMap(t => t.memberList).slice(5);

const ALL_EQUIPMENT: string[] = [
  'Dumbbells', 'Barbells', 'Treadmill', 'Bench Press', 'Squat Rack',
  'Cable Machine', 'Rowing Machine', 'Leg Press', 'Pull-up Bar',
  'Battle Ropes', 'Kettlebells', 'Smith Machine', 'Elliptical', 'Resistance Bands',
];

const ALL_FACILITIES: string[] = [
  'AC', 'Locker Room', 'Parking', 'Shower', 'WiFi',
  'CCTV', 'First Aid', 'Drinking Water', 'Sauna', 'Supplement Bar',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatJoinedDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `Joined ${date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Trainer Summary Stats ────────────────────────────────────────────────────

function TrainerSummaryStats({ data }: { data: Trainer[] }) {
  const total = data.length;
  const totalMembers = data.reduce((sum, t) => sum + t.members, 0);
  const activeTrainers = data.filter((t) => t.status === 'active').length;
  const avg =
    activeTrainers > 0
      ? Math.round(
          data
            .filter((t) => t.status === 'active')
            .reduce((sum, t) => sum + t.members, 0) / activeTrainers,
        )
      : 0;

  const stats = [
    { label: 'Total Trainers', value: total,        icon: <UserCheck  className="h-4 w-4 text-primary" />, sub: `${activeTrainers} active` },
    { label: 'Total Members',  value: totalMembers, icon: <Users      className="h-4 w-4 text-primary" />, sub: 'under trainers' },
    { label: 'Avg per Trainer',value: avg,          icon: <BarChart2  className="h-4 w-4 text-primary" />, sub: 'members / trainer' },
  ];

  return (
    <div className="grid gap-4 grid-cols-3 mb-6">
      {stats.map((s, i) => (
        <div key={i} className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
          <div className="p-2 bg-primary/20 rounded-lg shrink-0">{s.icon}</div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
            <p className="text-xl font-bold text-foreground leading-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
function MemberDetailsModal({
  member,
  onClose,
}: {
  member: Member | null;
  onClose: () => void;
}) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-xl">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-foreground">Member Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="mb-4">
          <p className="font-semibold">{member.name}</p>
          <p className="text-sm text-muted-foreground">{member.phone}</p>
        </div>

        <div className="space-y-2 text-sm">
          <p><b>Joined:</b> {member.since}</p>
          <p><b>Plan:</b> {member.plan}</p>
          <p><b>Next Payment:</b> Coming Soon</p>
        </div>
      </div>
    </div>
  );
}

// ─── Member Row ───────────────────────────────────────────────────────────────

function MemberRow({ member }: { member: Member }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-background/60 border border-border/30">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-foreground">
            {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{member.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{member.phone}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-4">
        <div className="text-right hidden sm:block">
          <StarRating rating={member.rating} />
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 justify-end">
            <Clock className="h-3 w-3" />
            Since {member.since}
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-medium hover:bg-primary/20">
          {member.plan}
        </Badge>
      </div>
    </div>
  );
}

// ─── Trainer Row (expandable) ─────────────────────────────────────────────────

function TrainerRow({ trainer }: { trainer: Trainer }) {
  const [expanded, setExpanded] = useState(false);
  const hasMembers = trainer.memberList.length > 0;
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
<>
    <div className="rounded-lg overflow-hidden border border-border/30 transition-all">
      {/* Clickable header */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 bg-secondary/50 hover:bg-secondary/80 transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">
              {trainer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{trainer.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatJoinedDate(trainer.joinedAt)}
              {trainer.specialization ? ` · ${trainer.specialization}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-foreground">{trainer.members}</p>
            <p className="text-xs text-muted-foreground">members</p>
          </div>
          <Badge
            className={
              trainer.status === 'active'
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-0'
                : 'bg-muted text-muted-foreground border-0'
            }
          >
            {trainer.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
          {expanded ? (
            <ChevronUp className={`h-4 w-4 ${hasMembers ? 'text-muted-foreground' : 'text-muted-foreground/30'}`} />
          ) : (
            <ChevronDown className={`h-4 w-4 ${hasMembers ? 'text-muted-foreground' : 'text-muted-foreground/30'}`} />
          )}
        </div>
      </button>

      {/* Expanded: member list */}
      {expanded && hasMembers && (
        <div className="px-4 pb-4 pt-3 bg-secondary/20 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">
            Assigned Members ({trainer.memberList.length})
          </p>
          {trainer.memberList.map((member) => (
  <div key={member.id} onClick={() => setSelectedMember(member)} className="cursor-pointer">
    <MemberRow member={member} />
  </div>
))}
        </div>
      )}

      {/* Expanded: no members */}
      {expanded && !hasMembers && (
        <div className="px-4 pb-4 pt-3 bg-secondary/20 text-center">
          <p className="text-sm text-muted-foreground py-3">No members assigned yet.</p>
        </div>
      )}
    </div>
  <MemberDetailsModal
  member={selectedMember}
  onClose={() => setSelectedMember(null)}
/>
  </>
    
  );
}

// ─── Chip Tag (togglable) ─────────────────────────────────────────────────────

function ChipTag({
  label,
  selected,
  variant,
  onToggle,
}: {
  label: string;
  selected: boolean;
  variant: 'equipment' | 'facility';
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer select-none ${
        variant === 'equipment'
          ? selected
            ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
            : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
          : selected
          ? 'bg-foreground text-background border-foreground shadow-sm scale-105'
          : 'bg-secondary text-muted-foreground border-border/50 hover:bg-secondary/80'
      }`}
    >
      {variant === 'equipment' ? (
        <Dumbbell className="h-3 w-3 shrink-0" />
      ) : (
        <ShieldCheck className="h-3 w-3 shrink-0" />
      )}
      {label}
    </button>
  );
}

// ─── Equipment & Facilities Section ──────────────────────────────────────────

function EquipmentFacilitiesSection() {
  const [selectedEquipment, setSelectedEquipment] = useState<Set<string>>(
    new Set(['Dumbbells', 'Treadmill', 'Bench Press', 'Squat Rack', 'Kettlebells']),
  );
  const [selectedFacilities, setSelectedFacilities] = useState<Set<string>>(
    new Set(['AC', 'Locker Room', 'Parking', 'Shower', 'WiFi', 'CCTV', 'Drinking Water']),
  );

  const toggle = (
    set: Set<string>,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    item: string,
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  return (
    <Card className="bg-card border-border/50 p-6 mt-6">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-lg font-bold text-foreground">Gym Equipment & Facilities</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tap any chip to mark it as available or unavailable at your gym
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground bg-secondary/60 px-3 py-1.5 rounded-full shrink-0 ml-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary inline-block" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-secondary border border-border/60 inline-block" />
            Not available
          </span>
        </div>
      </div>

      <div className="space-y-5 mt-6">
        {/* Equipment */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">
              Equipment
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                ({selectedEquipment.size}/{ALL_EQUIPMENT.length} selected)
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_EQUIPMENT.map((item) => (
              <ChipTag
                key={item}
                label={item}
                selected={selectedEquipment.has(item)}
                variant="equipment"
                onToggle={() => toggle(selectedEquipment, setSelectedEquipment, item)}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-border/50" />

        {/* Facilities */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">
              Facilities
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                ({selectedFacilities.size}/{ALL_FACILITIES.length} selected)
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_FACILITIES.map((item) => (
              <ChipTag
                key={item}
                label={item}
                selected={selectedFacilities.has(item)}
                variant="facility"
                onToggle={() => toggle(selectedFacilities, setSelectedFacilities, item)}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OwnerDashboard() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [showMembers, setShowMembers] = useState(false);
  const onlineMembers: Member[] = trainers.flatMap(t => t.memberList).slice(0, 5);
const offlineMembers: Member[] = trainers.flatMap(t => t.memberList).slice(5);
  const [gyms, setGyms] = useState<OwnerGym[]>([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'owner') {
      router.push('/login');
    } else {
      setGyms(getOwnerGyms(user.id));
    }
  }, [isAuthenticated, user, router]);

  const handleAddGym = (gymData: Omit<OwnerGym, 'id' | 'createdAt' | 'ownerId'>) => {
    const newGym = addOwnerGym(user!.id, gymData);
    setGyms((prev) => [...prev, newGym]);
  };

  if (!isAuthenticated || user?.role !== 'owner') return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Gym Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your gym and track performance</p>
        </div>

        {/* ── Top Stats Grid ── */}
        {/* ── Top Stats Grid ── */}
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-4">

  {/* Active Members Card */}
  <Card 
    onClick={() => setShowMembers(!showMembers)}
    className="bg-card border-border/50 p-6 cursor-pointer"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1">
          Active Members
        </p>
        <p className="text-3xl font-bold text-foreground">847</p>
        <p className="text-xs text-primary mt-2">+45 this month</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="p-3 bg-primary/20 rounded-lg">
          <Users className="h-6 w-6 text-primary" />
        </div>
        {showMembers ? <ChevronUp /> : <ChevronDown />}
      </div>
    </div>
  </Card>

  {/* 👇 MOBILE EXPAND */}
  {showMembers && (
    <div className="md:hidden col-span-1">
      <Card className="bg-card border-border/50 p-4">
        <div className="space-y-4">

          <div>
            <p className="text-sm font-semibold text-green-500 mb-2">
              🟢 Online ({onlineMembers.length})
            </p>
            <div className="space-y-2">
              {onlineMembers.map((member) => (
                <MemberRow key={member.id} member={member} />
              ))}
            </div>
          </div>

          <div className="border-t border-border/50" />

          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              ⚪ Offline ({offlineMembers.length})
            </p>
            <div className="space-y-2">
              {offlineMembers.map((member) => (
                <MemberRow key={member.id} member={member} />
              ))}
            </div>
          </div>

        </div>
      </Card>
    </div>
  )}

  {/* Revenue */}
  <Card className="bg-card border-border/50 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1">
          Monthly Revenue
        </p>
        <p className="text-3xl font-bold text-foreground">₹8.5L</p>
        <p className="text-xs text-primary mt-2">+12% increase</p>
      </div>
      <div className="p-3 bg-primary/20 rounded-lg">
        <Wallet className="h-6 w-6 text-primary" />
      </div>
    </div>
  </Card>

  {/* Check-ins */}
  <Card className="bg-card border-border/50 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1">
          Check-ins Today
        </p>
        <p className="text-3xl font-bold text-foreground">234</p>
        <p className="text-xs text-primary mt-2">Peak hours: 6-8 PM</p>
      </div>
      <div className="p-3 bg-primary/20 rounded-lg">
        <Activity className="h-6 w-6 text-primary" />
      </div>
    </div>
  </Card>

  {/* Utilization */}
  <Card className="bg-card border-border/50 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1">
          Utilization Rate
        </p>
        <p className="text-3xl font-bold text-foreground">92%</p>
        <p className="text-xs text-primary mt-2">Excellent</p>
      </div>
      <div className="p-3 bg-primary/20 rounded-lg">
        <TrendingUp className="h-6 w-6 text-primary" />
      </div>
    </div>
  </Card>

  {/* 👇 DESKTOP EXPAND */}
  {showMembers && (
    <div className="hidden md:block col-span-full">
      <Card className="bg-card border-border/50 p-6 mt-2">
        <div className="space-y-6">

          <div>
            <p className="text-sm font-semibold text-green-500 mb-2">
              🟢 Online Members ({onlineMembers.length})
            </p>
            <div className="space-y-2">
              {onlineMembers.map((member) => (
                <MemberRow key={member.id} member={member} />
              ))}
            </div>
          </div>

          <div className="border-t border-border/50" />

          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              ⚪ Offline Members ({offlineMembers.length})
            </p>
            <div className="space-y-2">
              {offlineMembers.map((member) => (
                <MemberRow key={member.id} member={member} />
              ))}
            </div>
          </div>

        </div>
      </Card>
    </div>
  )}

</div>

{/* ── EXPANDED MEMBERS SECTION (OUTSIDE GRID) ── */}
{showMembers && (
  <Card className="bg-card border-border/50 p-6 mb-8 transition-all duration-300">
    
    <div className="space-y-6">

      {/* 🟢 Online Members */}
      <div>
        <p className="text-sm font-semibold text-green-500 mb-2">
          🟢 Online Members ({onlineMembers.length})
        </p>

        <div className="space-y-2">
          {onlineMembers.map((member) => (
            <MemberRow key={member.id} member={member} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/50" />

      {/* ⚪ Offline Members */}
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-2">
          ⚪ Offline Members ({offlineMembers.length})
        </p>

        <div className="space-y-2">
          {offlineMembers.map((member) => (
            <MemberRow key={member.id} member={member} />
          ))}
        </div>
      </div>

    </div>

  </Card>
)}

        {/* ── Main Content Row ── */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* Trainers & Members Overview */}
          <Card className="bg-card border-border/50 p-6 md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Trainers & Members Overview</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click any trainer to see their assigned members
                </p>
              </div>
              <Button variant="ghost" className="text-primary text-sm">View All</Button>
            </div>

            <TrainerSummaryStats data={trainers} />

            <div className="space-y-3">
              {trainers.map((trainer) => (
                <TrainerRow key={trainer.id} trainer={trainer} />
              ))}
            </div>
          </Card>

          {/* Gym Status */}
          <Card className="bg-card border-border/50 p-6">
            <h2 className="text-lg font-bold text-foreground mb-6">Gym Status</h2>
            <div className="space-y-4">
              {[
                { icon: <CheckCircle className="h-5 w-5 text-green-500"  />, bg: 'bg-green-500/20',  label: 'Equipment',   sub: 'All functional' },
                { icon: <CheckCircle className="h-5 w-5 text-green-500"  />, bg: 'bg-green-500/20',  label: 'Staff',       sub: '12 trainers present' },
                { icon: <AlertCircle className="h-5 w-5 text-yellow-500" />, bg: 'bg-yellow-500/20', label: 'Maintenance', sub: '2 pending' },
                { icon: <CheckCircle className="h-5 w-5 text-green-500"  />, bg: 'bg-green-500/20',  label: 'Cleanliness', sub: 'Excellent' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`p-2 ${item.bg} rounded-lg`}>{item.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
              <Dumbbell className="h-4 w-4 mr-2" />
              Manage Gym
            </Button>
          </Card>
        </div>

        {/* ── Schedule ── */}
        

        {/* ── Equipment & Facilities (togglable) ── */}
        <EquipmentFacilitiesSection />

        {/* ── Quick Actions ── */}
       
        {/* ── Owner Profile ── */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Profile Information</h2>
          <ProfileDetails />
        </div>
      </main>
    </div>
  );
}