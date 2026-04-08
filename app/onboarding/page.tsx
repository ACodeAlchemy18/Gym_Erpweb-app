'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from '@/contexts/auth-context';
import { useOnboarding } from '@/contexts/onboarding-context';
import { getOnboardingSteps, getTotalSteps, type OnboardingField } from '@/data/onboarding-steps';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Dumbbell, ChevronLeft, ChevronRight, Check,
  MapPin, Instagram, Twitter, Facebook, Youtube, Globe,
  Heart, Upload, User,
} from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { saveOnboardingData, completeOnboarding } = useOnboarding();
  const [listInputs, setListInputs] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
 
  const [errors, setErrors] = useState<Record<string, string>>({});
  const searchParams = useSearchParams();
const isEditMode = searchParams.get("edit") === "true";
const { getOnboardingData } = useOnboarding();
const onboarding = getOnboardingData(user.id);

const [formData, setFormData] = useState<Record<string, any>>(
  isEditMode && onboarding?.data ? onboarding.data : {}
);

useEffect(() => {
  if (isEditMode && onboarding?.data) {
    setFormData(onboarding.data);
  }
}, [isEditMode, onboarding]);
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border-border/50 w-full max-w-md">
          <CardContent className="pt-8">
            <p className="text-center text-muted-foreground mb-4">Please login first</p>
            <Link href="/login">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const steps = getOnboardingSteps(user.role);
  const totalSteps = getTotalSteps(user.role);
  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const getIconEmoji = (iconName: string) => {
    const icons: Record<string, string> = {
      Target: '🎯', Scale: '⚖️', Heart: '❤️', Dumbbell: '🏋️',
      User: '👤', CheckCircle: '✓', Lock: '🔒', Building: '🏢',
      Clock: '⏰', DollarSign: '💰', Award: '🏆', MapPin: '📍',
      Share: '🔗',
    };
    return icons[iconName] || '•';
  };
  



  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) setErrors(prev => ({ ...prev, [fieldName]: '' }));
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    currentStepData.fields.forEach(field => {
      const value = formData[field.name];
      if (field.required) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.name] = `${field.label} is required`;
        }
      }
      if (field.type === 'number' && value && isNaN(value)) {
        newErrors[field.name] = 'Must be a number';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateCurrentStep() && currentStep < steps.length - 1) setCurrentStep(s => s + 1); };
  const handlePrevious = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };
  const handleComplete = () => {
  if (validateCurrentStep()) {
    saveOnboardingData(user.id, user.role, formData);

    if (!isEditMode) {
      completeOnboarding(user.id);
    }

    router.push('/profile');
  }
};
  // ── FIELD RENDERER ─────────────────────────────────────────────
  const renderField = (field: OnboardingField) => {
   const value =
  formData[field.name] ??
  (field.type === 'multiselect' || field.type === 'multiimage' ? [] : '');
    const error = errors[field.name];

    switch (field.type) {

      // ── IMAGE UPLOAD ──────────────────────────────────────────
      case 'image':
        return (
          <div key={field.name} className="space-y-3">
            <Label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="flex items-center gap-4">
              {/* Avatar preview */}
              <div className="h-24 w-24 rounded-2xl border-2 border-dashed border-border bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                {value ? (
                  <img src={value} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-muted-foreground opacity-40" />
                )}
              </div>
              <div className="flex-1">
                <label
                  htmlFor={`img-${field.name}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 cursor-pointer transition-colors text-sm font-medium w-fit"
                >
                  <Upload className="h-4 w-4" />
                  {value ? 'Change Photo' : 'Upload Photo'}
                </label>
                <input
                  id={`img-${field.name}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => handleFieldChange(field.name, reader.result);
                    reader.readAsDataURL(file);
                  }}
                />
                {field.help && <p className="text-xs text-muted-foreground mt-2">{field.help}</p>}
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      // ── MULTISELECT (chips) ───────────────────────────────────
      case 'multiselect':
        return (
          <div key={field.name} className="space-y-3">
            <Label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="flex flex-wrap gap-2">
              {field.options?.map(option => {
                const selected = (value || []).includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      let updated = value || [];
                      updated = selected
                        ? updated.filter((v: string) => v !== option.value)
                        : [...updated, option.value];
                      handleFieldChange(field.name, updated);
                    }}
                    className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                      selected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border bg-secondary hover:border-primary/50'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
          </div>
        );

      // ── SELECT ────────────────────────────────────────────────
      case 'select':
        return (
          <div key={field.name} className="space-y-3">
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select value={value} onValueChange={val => handleFieldChange(field.name, val)}>
              <SelectTrigger id={field.name} className="bg-secondary border-border/50">
                <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
          </div>
        );
        //gym_image
        case 'multiimage':
  return (
    <div key={field.name} className="space-y-3">
      <Label className="text-sm font-medium">{field.label}</Label>

      {/* Preview */}
      <div className="flex flex-wrap gap-3">
        {(value || []).map((img: string, idx: number) => (
          <div key={idx} className="relative">
            <img
              src={img}
              className="h-24 w-24 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() =>
                handleFieldChange(
                  field.name,
                  (value || []).filter((_: any, i: number) => i !== idx)
                )
              }
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-1 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Upload */}
      <label className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer bg-secondary">
        Add Photos
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            files.forEach((file) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                handleFieldChange(field.name, [
                  ...(value || []),
                  reader.result,
                ]);
              };
              reader.readAsDataURL(file);
            });
          }}
        />
      </label>
    </div>
  );

      // ── TEXTAREA ──────────────────────────────────────────────
      case 'textarea':
        return (
          <div key={field.name} className="space-y-3">
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              value={value}
              onChange={e => handleFieldChange(field.name, e.target.value)}
              className="min-h-20 bg-secondary border-border/50 resize-none"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
          </div>
        );

      // ── NUMBER ────────────────────────────────────────────────
      case 'number': {
        const isCurrency = field.name.toLowerCase().includes('rate') || field.name.toLowerCase().includes('price');
        return (
          <div key={field.name} className="space-y-3">
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="relative">
              {isCurrency && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>}
              <Input
                id={field.name}
                type="number"
                placeholder={field.placeholder}
                value={value}
                onChange={e => handleFieldChange(field.name, e.target.value)}
                className={`bg-secondary border-border/50 ${isCurrency ? 'pl-8' : ''}`}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
          </div>
        );
      }

      // ── DATE ──────────────────────────────────────────────────
      case 'date':
        return (
          <div key={field.name} className="space-y-3">
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type="date"
              value={value}
              onChange={e => handleFieldChange(field.name, e.target.value)}
              className="bg-secondary border-border/50"
              max={new Date().toISOString().split('T')[0]}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      // ── TIME ──────────────────────────────────────────────────
      case 'time':
        return (
          <div key={field.name} className="space-y-3">
            <Label>{field.label}</Label>
            <Input
              type="time"
              value={value}
              onChange={e => handleFieldChange(field.name, e.target.value)}
              className="bg-secondary border-border/50"
            />
          </div>
        );

      // ── RANGE ─────────────────────────────────────────────────
      case 'range':
        return (
          <div key={field.name} className="space-y-3">
            <Label className="text-sm font-medium">
              {field.label}: <span className="text-primary font-bold">{value || 0}</span>
            </Label>
            <Input
              type="range"
              min={0}
              max={field.name === 'gymArea' ? 50000 : field.name === 'serviceRadius' ? 50 : 25}
              value={value || 0}
              onChange={e => handleFieldChange(field.name, e.target.value)}
              className="accent-primary"
            />
          </div>
        );

      // ── LIST (add items) ──────────────────────────────────────
      case 'list': {
        const items = value || [];
        const input = listInputs[field.name] || '';
        return (
          <div key={field.name} className="space-y-3">
            <Label>{field.label}</Label>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={e => setListInputs(prev => ({ ...prev, [field.name]: e.target.value }))}
                onKeyDown={e => {
                  if (e.key === 'Enter' && input.trim()) {
                    handleFieldChange(field.name, [...items, input.trim()]);
                    setListInputs(prev => ({ ...prev, [field.name]: '' }));
                  }
                }}
                placeholder="Type and press Enter or +"
                className="bg-secondary border-border/50"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (!input.trim()) return;
                  handleFieldChange(field.name, [...items, input.trim()]);
                  setListInputs(prev => ({ ...prev, [field.name]: '' }));
                }}
              >+</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((item: string, idx: number) => (
                <Badge key={idx} className="flex items-center gap-2 bg-primary/20 text-primary">
                  {item}
                  <span className="cursor-pointer hover:text-destructive"
                    onClick={() => handleFieldChange(field.name, items.filter((_: any, i: number) => i !== idx))}>
                    ✕
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        );
      }

      // ── WEEKLY AVAILABILITY ───────────────────────────────────
      case 'weeklyAvailability': {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const availability = value || {};
        return (
          <div key={field.name} className="space-y-4">
            <Label className="text-sm font-medium">{field.label}</Label>
            {days.map(day => {
              const dayData = availability[day] || { enabled: false, start: '06:00', end: '20:00' };
              return (
                <div key={day} className="flex items-center justify-between bg-secondary/40 p-4 rounded-xl">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleFieldChange(field.name, { ...availability, [day]: { ...dayData, enabled: !dayData.enabled } })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition ${dayData.enabled ? 'bg-green-500' : 'bg-muted'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${dayData.enabled ? 'translate-x-6' : ''}`} />
                    </button>
                    <span className="font-medium w-24">{day}</span>
                  </div>
                  {dayData.enabled && (
                    <div className="flex items-center gap-2">
                      <Input type="time" value={dayData.start}
                        onChange={e => handleFieldChange(field.name, { ...availability, [day]: { ...dayData, start: e.target.value } })}
                        className="bg-background w-28" />
                      <span>to</span>
                      <Input type="time" value={dayData.end}
                        onChange={e => handleFieldChange(field.name, { ...availability, [day]: { ...dayData, end: e.target.value } })}
                        className="bg-background w-28" />
                    </div>
                  )}
                </div>
              );
            })}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );
      }

      // ── DEFAULT (text, email, phone, social) ──────────────────
      default: {
        // Social media fields get a prefix icon
        const socialIcons: Record<string, React.ReactNode> = {
          instagram: <Instagram className="h-4 w-4 text-pink-500" />,
          twitter: <Twitter className="h-4 w-4 text-sky-400" />,
          facebook: <Facebook className="h-4 w-4 text-blue-500" />,
          youtube: <Youtube className="h-4 w-4 text-red-500" />,
          website: <Globe className="h-4 w-4 text-muted-foreground" />,
          linkedin: <Globe className="h-4 w-4 text-blue-600" />,
        };
        const socialIcon = socialIcons[field.name];

        return (
          <div key={field.name} className="space-y-3">
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="relative">
              {socialIcon && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2">{socialIcon}</span>
              )}
              <Input
                id={field.name}
                type={field.type === 'email' ? 'email' : 'text'}
                placeholder={field.placeholder}
                value={value}
                onChange={e => handleFieldChange(field.name, e.target.value)}
                className={`bg-secondary border-border/50 ${socialIcon ? 'pl-9' : ''}`}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
          </div>
        );
      }
    }
  };

  // ── STEP ICON COLOUR ─────────────────────────────────────────
  const stepColors: Record<string, string> = {
    profile_setup: 'bg-violet-500/20 text-violet-400',
    location: 'bg-blue-500/20 text-blue-400',
    physical_info: 'bg-orange-500/20 text-orange-400',
    medical_info: 'bg-red-500/20 text-red-400',
    fitness_goals: 'bg-green-500/20 text-green-400',
    social_media: 'bg-pink-500/20 text-pink-400',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <Dumbbell className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GymFinder</span>
            </Link>
            <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {totalSteps}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-3xl font-bold text-foreground">
  {isEditMode ? "Edit Your Profile" : "Complete Your Profile"}
</h1>
</div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className={`grid gap-2 mb-8 ${steps.length <= 4 ? 'grid-cols-4' : steps.length <= 6 ? 'grid-cols-6' : 'grid-cols-4'}`}>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-2 rounded-lg border transition-all text-center ${
                  index === currentStep
                    ? 'border-primary bg-primary/10'
                    : index < currentStep
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-border/50 bg-card'
                }`}
              >
                <span className="text-base block mb-1">{getIconEmoji(step.icon)}</span>
                <p className="text-xs font-medium text-foreground leading-tight">{step.title}</p>
                {index < currentStep && <Check className="h-3 w-3 text-primary mx-auto mt-1" />}
              </div>
            ))}
          </div>

          {/* Form card */}
          <Card className="border-border/50 bg-card mb-8">
            {/* Coloured top strip based on step */}
            <div className={`h-1.5 rounded-t-lg ${
              currentStepData.id === 'profile_setup' ? 'bg-violet-500' :
              currentStepData.id === 'location' ? 'bg-blue-500' :
              currentStepData.id === 'physical_info' ? 'bg-orange-500' :
              currentStepData.id === 'medical_info' ? 'bg-red-500' :
              currentStepData.id === 'fitness_goals' ? 'bg-green-500' :
              currentStepData.id === 'social_media' ? 'bg-pink-500' :
              'bg-primary'
            }`} />
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl text-xl ${stepColors[currentStepData.id] || 'bg-primary/20'}`}>
                  {getIconEmoji(currentStepData.icon)}
                </div>
                <div>
                  <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                  <CardDescription className="mt-0.5">{currentStepData.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentStepData.fields.length === 0 ? (
                  <div className="text-center py-6">
                    <Check className="h-12 w-12 text-primary mx-auto mb-3" />
                    <p className="text-lg font-semibold text-foreground mb-1">Almost there!</p>
                    <p className="text-muted-foreground">Click "Complete Profile" to save your information.</p>
                  </div>
                ) : (
                  currentStepData.fields.map(field => renderField(field))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex gap-3 justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="border-border text-foreground disabled:opacity-40 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button onClick={handleComplete} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                <Check className="h-4 w-4 mr-2" />Complete Profile
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                Next<ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
