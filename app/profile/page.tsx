"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/header";
import { ProfileDetails } from "@/components/profile-details";
import { useAuth } from "@/contexts/auth-context";
import { useUser } from "@/contexts/user-context";
import { useOnboarding } from "@/contexts/onboarding-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  ArrowLeft, User, Mail, Phone, Calendar, MapPin,
  Dumbbell, Edit2, Instagram, Twitter, Facebook, Youtube,
  Globe, Check, X, Camera, Upload,
} from "lucide-react";

// ─── tiny helper: editable field row ────────────────────────────────────────
function EditRow({
  label, value, editValue, isEditing, icon: Icon,
  onEdit, onSave, onCancel, children,
}: {
  label: string; value: React.ReactNode; editValue?: string; isEditing: boolean;
  icon: any; onEdit: () => void; onSave: () => void; onCancel: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-secondary/40 rounded-lg group relative">
      <Icon className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        {isEditing ? (
          <div className="space-y-2">
            {children}
            <div className="flex gap-2 mt-1">
              <Button size="sm" className="h-7 bg-primary text-primary-foreground px-3 text-xs gap-1" onClick={onSave}>
                <Check className="h-3 w-3" />Save
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-3 text-xs gap-1 text-muted-foreground" onClick={onCancel}>
                <X className="h-3 w-3" />Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="font-medium text-foreground text-sm">{value || <span className="text-muted-foreground italic text-xs">Not provided</span>}</div>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              onClick={onEdit}>
              <Edit2 className="h-3 w-3 text-muted-foreground" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── city options ────────────────────────────────────────────────────────────
const CITIES = ['mumbai','delhi','bangalore','hyderabad','pune','chennai','kolkata','ahmedabad','jaipur','lucknow','other'];
const GENDERS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'non_binary', label: 'Non-binary' }, { value: 'prefer_not', label: 'Prefer not to say' }];

export default function ProfilePage() {
  const { user } = useAuth();
  const { subscriptions } = useUser();
  const { getOnboardingData, saveOnboardingData } = useOnboarding();

  if (!user) return null;

  const onboarding = getOnboardingData(user.id);
  const od = onboarding?.data || {};

  // ── which field is currently being edited ───────────────────────────────
  const [editing, setEditing] = useState<string | null>(null);
  // ── draft values for each field ──────────────────────────────────────────
  const [draft, setDraft] = useState<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (field: string) => {
    setEditing(field);
    setDraft({ [field]: od[field] ?? '' });
  };
  const cancelEdit = () => { setEditing(null); setDraft({}); };

  const saveField = (field: string, value?: any) => {
    const val = value !== undefined ? value : draft[field];
    const updated = { ...od, [field]: val };
    saveOnboardingData(user.id, user.role as any, updated);
    setEditing(null);
    setDraft({});
  };

  // Multi-field save (e.g. location block)
  const saveFields = (fields: Record<string, any>) => {
    const updated = { ...od, ...fields };
    saveOnboardingData(user.id, user.role as any, updated);
    setEditing(null);
    setDraft({});
  };

  // ── derived display values ───────────────────────────────────────────────
  const displayName   = od.displayName  || user.name;
  const displayPhone  = od.phone        || user.mobile;
  const displayCity   = od.city         || user.city;
  const displayAvatar = od.avatar || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;

  let displayAge: string | null = null;
  if (od.dateOfBirth) {
    const dob = new Date(od.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear()
      - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
    displayAge = `${age} years`;
  }

  const displayGender = od.gender
    ? (GENDERS.find(g => g.value === od.gender)?.label || od.gender)
    : null;

  const memberSince = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const roleLabel: Record<string, string> = {
    user: 'Fitness Enthusiast', trainer: 'Personal Trainer',
    owner: 'Gym Owner', admin: 'Platform Admin',
  };

  const socials = [
    { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500', prefix: '@' },
    { key: 'twitter',   label: 'Twitter',   icon: Twitter,   color: 'text-sky-400',  prefix: '@' },
    { key: 'facebook',  label: 'Facebook',  icon: Facebook,  color: 'text-blue-500', prefix: '' },
    { key: 'youtube',   label: 'YouTube',   icon: Youtube,   color: 'text-red-500',  prefix: '' },
    { key: 'website',   label: 'Website',   icon: Globe,     color: 'text-muted-foreground', prefix: '' },
  ];

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => saveField('avatar', reader.result);
    reader.readAsDataURL(file);
  };

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
                {/* Avatar — click to change */}
                <div className="relative shrink-0 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={displayAvatar} alt={displayName}
                    className="h-24 w-24 rounded-2xl object-cover border-4 border-background shadow-lg" />
                  <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-background" />
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>

                <div className="flex-1 text-center sm:text-left pb-1">
                  {editing === 'displayName' ? (
                    <div className="flex items-center gap-2">
                      <Input value={draft.displayName ?? ''} onChange={e => setDraft({ displayName: e.target.value })}
                        className="bg-secondary border-border text-lg font-bold h-9 max-w-xs" autoFocus />
                      <Button size="icon" className="h-8 w-8 bg-primary text-primary-foreground" onClick={() => saveField('displayName')}><Check className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEdit}><X className="h-4 w-4" /></Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center sm:justify-start group">
                      <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => startEdit('displayName')}>
                        <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  )}
                  <p className="text-muted-foreground text-sm mt-0.5">{roleLabel[user.role] || user.role}</p>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                    {user.role === 'user' && (
                      <>
                        <Badge variant="secondary" className="text-xs">{subscriptions.length} Active Membership{subscriptions.length !== 1 ? 's' : ''}</Badge>
                        <Badge className="bg-primary text-primary-foreground text-xs">Member since {memberSince}</Badge>
                      </>
                    )}
                    {od.primaryGoal && (
                      <Badge variant="outline" className="text-xs border-primary/40 text-primary capitalize">
                        🎯 {od.primaryGoal.replace(/-/g, ' ')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 justify-center sm:justify-start">
                    <Camera className="h-3 w-3" />Click photo to change · Hover any field to edit
                  </p>
                </div>
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
              <div className="grid sm:grid-cols-2 gap-3">

                {/* Full Name */}
                <EditRow label="Full Name" value={displayName} isEditing={editing === 'displayName'}
                  icon={User} onEdit={() => startEdit('displayName')} onCancel={cancelEdit}
                  onSave={() => saveField('displayName')}>
                  <Input value={draft.displayName ?? ''} onChange={e => setDraft(d => ({...d, displayName: e.target.value}))}
                    className="bg-background border-border text-sm h-8" autoFocus />
                </EditRow>

                {/* Email — read-only */}
                <div className="flex items-start gap-3 p-3 bg-secondary/40 rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Email Address</p>
                    <p className="font-medium text-foreground text-sm break-all">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Cannot be changed</p>
                  </div>
                </div>

                {/* Phone */}
                <EditRow label="Phone Number" value={displayPhone} isEditing={editing === 'phone'}
                  icon={Phone} onEdit={() => startEdit('phone')} onCancel={cancelEdit}
                  onSave={() => saveField('phone')}>
                  <Input value={draft.phone ?? ''} onChange={e => setDraft(d => ({...d, phone: e.target.value}))}
                    placeholder="+91 98765 43210" className="bg-background border-border text-sm h-8" autoFocus />
                </EditRow>

                {/* Date of Birth */}
                <EditRow label="Date of Birth" value={od.dateOfBirth ? `${displayAge} (${od.dateOfBirth})` : null}
                  isEditing={editing === 'dateOfBirth'} icon={Calendar}
                  onEdit={() => startEdit('dateOfBirth')} onCancel={cancelEdit}
                  onSave={() => saveField('dateOfBirth')}>
                  <Input type="date" value={draft.dateOfBirth ?? ''} onChange={e => setDraft(d => ({...d, dateOfBirth: e.target.value}))}
                    max={new Date().toISOString().split('T')[0]} className="bg-background border-border text-sm h-8" autoFocus />
                </EditRow>

                {/* Gender */}
                <EditRow label="Gender" value={displayGender} isEditing={editing === 'gender'}
                  icon={User} onEdit={() => startEdit('gender')} onCancel={cancelEdit}
                  onSave={() => saveField('gender')}>
                  <Select value={draft.gender ?? ''} onValueChange={v => setDraft(d => ({...d, gender: v}))}>
                    <SelectTrigger className="bg-background border-border text-sm h-8">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </EditRow>

                {/* Location */}
                <EditRow
                  label="Location"
                  value={[od.area, od.city].filter(Boolean).join(', ') + (od.pincode ? ` - ${od.pincode}` : '') || null}
                  isEditing={editing === 'location'}
                  icon={MapPin}
                  onEdit={() => { setEditing('location'); setDraft({ city: od.city ?? '', area: od.area ?? '', pincode: od.pincode ?? '' }); }}
                  onCancel={cancelEdit}
                  onSave={() => saveFields({ city: draft.city, area: draft.area, pincode: draft.pincode })}>
                  <div className="space-y-1.5">
                    <Select value={draft.city ?? ''} onValueChange={v => setDraft(d => ({...d, city: v}))}>
                      <SelectTrigger className="bg-background border-border text-sm h-8"><SelectValue placeholder="City" /></SelectTrigger>
                      <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase()+c.slice(1)}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input value={draft.area ?? ''} onChange={e => setDraft(d => ({...d, area: e.target.value}))}
                      placeholder="Area / Locality" className="bg-background border-border text-sm h-8" />
                    <Input value={draft.pincode ?? ''} onChange={e => setDraft(d => ({...d, pincode: e.target.value}))}
                      placeholder="PIN Code" className="bg-background border-border text-sm h-8" />
                  </div>
                </EditRow>

              </div>
            </CardContent>
          </Card>

          {/* ── PHYSICAL INFORMATION ── */}
          <Card className="mb-6 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="text-lg">⚖️</span>Physical Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                <EditRow label="Height (cm)" value={od.height ? `${od.height} cm` : null} isEditing={editing === 'height'}
                  icon={User} onEdit={() => startEdit('height')} onCancel={cancelEdit} onSave={() => saveField('height')}>
                  <Input type="number" value={draft.height ?? ''} onChange={e => setDraft(d => ({...d, height: e.target.value}))}
                    placeholder="170" className="bg-background border-border text-sm h-8" autoFocus />
                </EditRow>

                <EditRow label="Current Weight (kg)" value={od.weight ? `${od.weight} kg` : null} isEditing={editing === 'weight'}
                  icon={User} onEdit={() => startEdit('weight')} onCancel={cancelEdit} onSave={() => saveField('weight')}>
                  <Input type="number" value={draft.weight ?? ''} onChange={e => setDraft(d => ({...d, weight: e.target.value}))}
                    placeholder="70" className="bg-background border-border text-sm h-8" autoFocus />
                </EditRow>

                <EditRow label="Target Weight (kg)" value={od.targetWeight ? `${od.targetWeight} kg` : null} isEditing={editing === 'targetWeight'}
                  icon={User} onEdit={() => startEdit('targetWeight')} onCancel={cancelEdit} onSave={() => saveField('targetWeight')}>
                  <Input type="number" value={draft.targetWeight ?? ''} onChange={e => setDraft(d => ({...d, targetWeight: e.target.value}))}
                    placeholder="65" className="bg-background border-border text-sm h-8" autoFocus />
                </EditRow>

                <EditRow label="Activity Level" value={od.activityLevel ? od.activityLevel.replace(/_/g, ' ') : null}
                  isEditing={editing === 'activityLevel'} icon={User}
                  onEdit={() => startEdit('activityLevel')} onCancel={cancelEdit} onSave={() => saveField('activityLevel')}>
                  <Select value={draft.activityLevel ?? ''} onValueChange={v => setDraft(d => ({...d, activityLevel: v}))}>
                    <SelectTrigger className="bg-background border-border text-sm h-8"><SelectValue placeholder="Activity level" /></SelectTrigger>
                    <SelectContent>
                      {[['sedentary','Sedentary'],['lightly_active','Lightly Active'],['moderately_active','Moderately Active'],['very_active','Very Active']].map(([v,l]) =>
                        <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </EditRow>
              </div>
            </CardContent>
          </Card>

          {/* ── MEDICAL INFORMATION ── */}
          <Card className="mb-6 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="text-lg">❤️</span>Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                <EditRow label="Blood Group" value={od.bloodGroup && od.bloodGroup !== 'unknown' ? od.bloodGroup : null}
                  isEditing={editing === 'bloodGroup'} icon={User}
                  onEdit={() => startEdit('bloodGroup')} onCancel={cancelEdit} onSave={() => saveField('bloodGroup')}>
                  <Select value={draft.bloodGroup ?? ''} onValueChange={v => setDraft(d => ({...d, bloodGroup: v}))}>
                    <SelectTrigger className="bg-background border-border text-sm h-8"><SelectValue placeholder="Blood group" /></SelectTrigger>
                    <SelectContent>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-','unknown'].map(b => <SelectItem key={b} value={b}>{b === 'unknown' ? "Don't know" : b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </EditRow>

                <EditRow label="Doctor Clearance" value={od.doctorClearance ? { yes: '✅ Cleared', no: '❌ Not cleared', na: 'N/A' }[od.doctorClearance as string] || od.doctorClearance : null}
                  isEditing={editing === 'doctorClearance'} icon={User}
                  onEdit={() => startEdit('doctorClearance')} onCancel={cancelEdit} onSave={() => saveField('doctorClearance')}>
                  <Select value={draft.doctorClearance ?? ''} onValueChange={v => setDraft(d => ({...d, doctorClearance: v}))}>
                    <SelectTrigger className="bg-background border-border text-sm h-8"><SelectValue placeholder="Clearance status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">✅ Cleared to exercise</SelectItem>
                      <SelectItem value="no">❌ Not cleared</SelectItem>
                      <SelectItem value="na">N/A — healthy</SelectItem>
                    </SelectContent>
                  </Select>
                </EditRow>

                <div className="sm:col-span-2">
                  <EditRow label="Injuries / Pain Areas" value={od.injuries || null} isEditing={editing === 'injuries'}
                    icon={User} onEdit={() => startEdit('injuries')} onCancel={cancelEdit} onSave={() => saveField('injuries')}>
                    <Textarea value={draft.injuries ?? ''} onChange={e => setDraft(d => ({...d, injuries: e.target.value}))}
                      placeholder="Describe any injuries or pain areas..." className="bg-background border-border text-sm min-h-16 resize-none" autoFocus />
                  </EditRow>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── FITNESS GOALS ── */}
          <Card className="mb-6 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="text-lg">🎯</span>Fitness Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                <EditRow label="Primary Goal"
                  value={od.primaryGoal ? od.primaryGoal.replace(/-/g, ' ') : null}
                  isEditing={editing === 'primaryGoal'} icon={User}
                  onEdit={() => startEdit('primaryGoal')} onCancel={cancelEdit} onSave={() => saveField('primaryGoal')}>
                  <Select value={draft.primaryGoal ?? ''} onValueChange={v => setDraft(d => ({...d, primaryGoal: v}))}>
                    <SelectTrigger className="bg-background border-border text-sm h-8"><SelectValue placeholder="Goal" /></SelectTrigger>
                    <SelectContent>
                      {[['weight-loss','Weight Loss'],['muscle-gain','Muscle Gain'],['maintenance','Maintain Shape'],['endurance','Build Endurance'],['flexibility','Flexibility'],['rehabilitation','Rehabilitation'],['sports','Sports Performance'],['stress','Stress Relief']].map(([v,l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </EditRow>

                <EditRow label="Experience Level"
                  value={od.experienceLevel ? od.experienceLevel.replace(/_/g, ' ') : null}
                  isEditing={editing === 'experienceLevel'} icon={User}
                  onEdit={() => startEdit('experienceLevel')} onCancel={cancelEdit} onSave={() => saveField('experienceLevel')}>
                  <Select value={draft.experienceLevel ?? ''} onValueChange={v => setDraft(d => ({...d, experienceLevel: v}))}>
                    <SelectTrigger className="bg-background border-border text-sm h-8"><SelectValue placeholder="Experience" /></SelectTrigger>
                    <SelectContent>
                      {[['beginner','Beginner'],['some','Some Experience'],['intermediate','Intermediate'],['advanced','Advanced']].map(([v,l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </EditRow>

                <EditRow label="Days Per Week"
                  value={od.availableDaysPerWeek ? `${od.availableDaysPerWeek} days` : null}
                  isEditing={editing === 'availableDaysPerWeek'} icon={Calendar}
                  onEdit={() => startEdit('availableDaysPerWeek')} onCancel={cancelEdit} onSave={() => saveField('availableDaysPerWeek')}>
                  <Select value={String(draft.availableDaysPerWeek ?? '')} onValueChange={v => setDraft(d => ({...d, availableDaysPerWeek: v}))}>
                    <SelectTrigger className="bg-background border-border text-sm h-8"><SelectValue placeholder="Days" /></SelectTrigger>
                    <SelectContent>
                      {['1','2','3','4','5','6','7'].map(n => <SelectItem key={n} value={n}>{n} day{n !== '1' ? 's' : ''}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </EditRow>
              </div>
            </CardContent>
          </Card>

          {/* ── SOCIAL MEDIA ── */}
          <Card className="mb-6 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-5 w-5 text-primary" />Social Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {socials.map(({ key, label, icon: Icon, color, prefix }) => (
                  <EditRow key={key} label={label}
                    value={od[key] ? <span className="flex items-center gap-1.5"><Icon className={`h-3.5 w-3.5 ${color}`} />{prefix}{od[key]}</span> : null}
                    isEditing={editing === key} icon={Icon}
                    onEdit={() => startEdit(key)} onCancel={cancelEdit} onSave={() => saveField(key)}>
                    <Input value={draft[key] ?? ''} onChange={e => setDraft(d => ({...d, [key]: e.target.value}))}
                      placeholder={`Your ${label} ${prefix ? 'handle' : 'URL'}`}
                      className="bg-background border-border text-sm h-8" autoFocus />
                  </EditRow>
                ))}

                {/* Notes for trainer */}
                <div className="sm:col-span-2">
                  <EditRow label="Notes for Trainer" value={od.fitnessGoalNote || null}
                    isEditing={editing === 'fitnessGoalNote'} icon={User}
                    onEdit={() => startEdit('fitnessGoalNote')} onCancel={cancelEdit} onSave={() => saveField('fitnessGoalNote')}>
                    <Textarea value={draft.fitnessGoalNote ?? ''} onChange={e => setDraft(d => ({...d, fitnessGoalNote: e.target.value}))}
                      placeholder="Any specific requests or notes for your trainer..." className="bg-background border-border text-sm min-h-16 resize-none" autoFocus />
                  </EditRow>
                </div>
              </div>
            </CardContent>
          </Card>

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
