'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dumbbell, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { saveOnboardingData, completeOnboarding } = useOnboarding();
  const [listInputs, setListInputs] = useState<Record<string, string>>({});

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

const role = user?.role;

const steps = role ? getOnboardingSteps(role) : [];
const totalSteps = role ? getTotalSteps(role) : 1;

const currentStepData = steps[currentStep];
const progress = ((currentStep + 1) / totalSteps) * 100;

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border-border/50 w-full max-w-md">
          <CardContent className="pt-8">
            <p className="text-center text-muted-foreground mb-4">Please login first</p>
            <Link href="/login">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Target: '🎯',
      Scale: '⚖️',
      Heart: '❤️',
      Dumbbell: '🏋️',
      User: '👤',
      CheckCircle: '✓',
      Lock: '🔒',
      Building: '🏢',
      Clock: '⏰',
      DollarSign: '💰',
    };
    return icons[iconName] || '•';
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: '',
      }));
    }
  };

 const validateCurrentStep = (): boolean => {
  const newErrors: Record<string, string> = {};

  currentStepData.fields.forEach((field) => {
    const value = formData[field.name];

    // Required validation
    if (field.required) {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }
    }

    // Number validation
    if (field.type === 'number' && value) {
      if (isNaN(value)) {
        newErrors[field.name] = 'Must be a number';
      }
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (validateCurrentStep()) {
      saveOnboardingData(user.id, user.role, formData);
      completeOnboarding(user.id);
      router.push('/profile');
    }
  };

  const renderField = (field: OnboardingField) => {
   const value = formData[field.name] || (field.type === 'multiselect' ? [] : '');

    const error = errors[field.name];

    switch (field.type) {

      case 'multiselect':
  return (
    <div key={field.name} className="space-y-3">
      <Label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <div className="flex flex-wrap gap-2">
        {field.options?.map((option) => {
          const selected = (value || []).includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                let updated = value || [];
                if (selected) {
                  updated = updated.filter((v: string) => v !== option.value);
                } else {
                  updated = [...updated, option.value];
                }
                handleFieldChange(field.name, updated);
              }}
              className={`px-3 py-1 rounded-full border text-sm transition
                ${selected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-secondary"
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


  case 'image':
  return (
    <div key={field.name} className="space-y-3">
      <Label className="text-sm font-medium">{field.label}</Label>

      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onloadend = () => {
            handleFieldChange(field.name, reader.result);
          };
          reader.readAsDataURL(file);
        }}
      />

      {value && (
        <img
          src={value}
          className="h-24 w-24 rounded-full object-cover border"
        />
      )}
    </div>
  );

  case 'range':
  return (
    <div key={field.name} className="space-y-3">
      <Label className="text-sm font-medium">
        {field.label} : {value || 0} years
      </Label>

      <Input
  type="range"
  min={0}
  max={25}
  value={value || 0}
  onChange={(e) => handleFieldChange(field.name, e.target.value)}
  className="accent-green-500"
/>

    </div>
  );

  case 'time':
  return (
    <div key={field.name} className="space-y-3">
      <Label>{field.label}</Label>
      <Input
        type="time"
        value={value}
        onChange={(e) => handleFieldChange(field.name, e.target.value)}
      />
    </div>
  );


case 'list': {
  const items = value || [];
  const input = listInputs[field.name] || '';

  return (
    <div key={field.name} className="space-y-3">
      <Label>{field.label}</Label>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) =>
            setListInputs((prev) => ({
              ...prev,
              [field.name]: e.target.value,
            }))
          }
          placeholder="Add item"
        />

        <Button
          type="button"
          onClick={() => {
            if (!input) return;

            handleFieldChange(field.name, [...items, input]);

            setListInputs((prev) => ({
              ...prev,
              [field.name]: '',
            }));
          }}
        >
          +
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item: string, index: number) => (
          <Badge key={index} className="flex items-center gap-2">
            {item}
            <span
              className="cursor-pointer"
              onClick={() =>
                handleFieldChange(
                  field.name,
                  items.filter((_: any, i: number) => i !== index)
                )
              }
            >
              ✕
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
}


case 'weeklyAvailability': {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const availability = value || {};

  return (
    <div key={field.name} className="space-y-5">
      <Label className="text-sm font-medium">{field.label}</Label>

      {days.map((day) => {
        const dayData = availability[day] || {
          enabled: false,
          start: '06:00',
          end: '20:00',
        };

        return (
          <div
            key={day}
            className="flex items-center justify-between bg-secondary/40 p-4 rounded-xl"
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              {/* Toggle */}
              <button
                type="button"
                onClick={() =>
                  handleFieldChange(field.name, {
                    ...availability,
                    [day]: { ...dayData, enabled: !dayData.enabled },
                  })
                }
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  dayData.enabled ? 'bg-green-500' : 'bg-muted'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    dayData.enabled ? 'translate-x-6' : ''
                  }`}
                />
              </button>

              <span className="font-medium w-24">{day}</span>
            </div>

            {/* RIGHT */}
            {dayData.enabled && (
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={dayData.start}
                  onChange={(e) =>
                    handleFieldChange(field.name, {
                      ...availability,
                      [day]: { ...dayData, start: e.target.value },
                    })
                  }
                  className="bg-background"
                />
                <span>to</span>
                <Input
                  type="time"
                  value={dayData.end}
                  onChange={(e) =>
                    handleFieldChange(field.name, {
                      ...availability,
                      [day]: { ...dayData, end: e.target.value },
                    })
                  }
                  className="bg-background"
                />
              </div>
            )}
          </div>
        );
      })}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}



      case 'select':
        return (
          <div key={field.name} className="space-y-3">
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleFieldChange(field.name, val)}>
              <SelectTrigger id={field.name} className="bg-secondary border-border/50">
                <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
          </div>
        );
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
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="min-h-20 bg-secondary border-border/50 resize-none"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
          </div>
        );
 case 'number': {
  const isCurrency =
    field.name.toLowerCase().includes("rate") ||
    field.name.toLowerCase().includes("price");

  return (
    <div key={field.name} className="space-y-3">
      <Label htmlFor={field.name} className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <div className="relative">
        {isCurrency && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            ₹
          </span>
        )}

        <Input
          id={field.name}
          type="number"
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          className={`bg-secondary border-border/50 ${isCurrency ? "pl-8" : ""}`}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
    </div>
  );
}

      default:
        return (
          <div key={field.name} className="space-y-3">
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="bg-secondary border-border/50"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
          </div>
        );
    }
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-3xl font-bold text-foreground">Complete Your Profile</h1>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps Indicators */}
          <div className="grid grid-cols-4 gap-2 mb-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-3 rounded-lg border transition-all ${
                  index === currentStep
                    ? 'border-primary bg-primary/10'
                    : index < currentStep
                      ? 'border-primary bg-primary/20'
                      : 'border-border/50 bg-card'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-lg">{getIconComponent(step.icon)}</span>
                  <p className="text-xs font-medium text-center text-foreground">
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Form Card */}
          <Card className="border-border/50 bg-card mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
              <CardDescription className="text-base mt-2">
                {currentStepData.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
               {currentStepData.fields.length === 0 ? (
  <p className="text-muted-foreground">
    Click complete to publish your trainer profile.
  </p>
) : (
  currentStepData.fields.map((field) => renderField(field))
)}

              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="border-border text-foreground disabled:opacity-50 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleComplete}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              >
                <Check className="h-4 w-4 mr-2" />
                Complete Profile
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
