'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useOnboarding } from '@/contexts/onboarding-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Target, Scale, Heart, Dumbbell, User, Building,
  Clock, DollarSign, CheckCircle, AlertCircle, Activity,
  Droplets, Shield,
} from 'lucide-react';


export function ProfileDetails() {
  const { user } = useAuth();
  const { getOnboardingData } = useOnboarding();

  if (!user) return null;

  const onboardingData = getOnboardingData(user.id);

  // ─────────────────────────────────────────────────────────────
  // USER
  // ─────────────────────────────────────────────────────────────
  if (user.role === 'user' && onboardingData) {
    const d = onboardingData.data;

    // Label maps
    const goalLabels: Record<string, string> = {
      'weight-loss': 'Weight Loss', 'muscle-gain': 'Muscle Gain',
      'maintenance': 'Maintain Shape', 'endurance': 'Build Endurance',
      'flexibility': 'Flexibility & Mobility', 'rehabilitation': 'Injury Rehab',
      'sports': 'Sports Performance', 'stress': 'Stress Relief',
    };
    const activityLabels: Record<string, string> = {
      sedentary: 'Sedentary', lightly_active: 'Lightly Active',
      moderately_active: 'Moderately Active', very_active: 'Very Active',
    };
    const experienceLabels: Record<string, string> = {
      beginner: 'Beginner', some: 'Some Experience',
      intermediate: 'Intermediate', advanced: 'Advanced',
    };
    const bodyTypeLabels: Record<string, string> = {
      ectomorph: 'Ectomorph (Lean)', mesomorph: 'Mesomorph (Athletic)',
      endomorph: 'Endomorph (Heavier)', unsure: 'Not Sure',
    };
    const conditionLabels: Record<string, string> = {
      diabetes: 'Diabetes', hypertension: 'High Blood Pressure',
      heart_disease: 'Heart Disease', asthma: 'Asthma',
      thyroid: 'Thyroid Disorder', arthritis: 'Arthritis',
      pcod: 'PCOD/PCOS', none: 'None',
    };

    // BMI
    const bmi = d.height && d.weight
      ? (Number(d.weight) / ((Number(d.height) / 100) ** 2)).toFixed(1)
      : null;
    const bmiLabel = bmi
      ? Number(bmi) < 18.5 ? 'Underweight'
        : Number(bmi) < 25 ? 'Normal'
        : Number(bmi) < 30 ? 'Overweight'
        : 'Obese'
      : null;

    return (
      <div className="space-y-5">

        {/* PHYSICAL INFORMATION */}
        {(d.height || d.weight || d.activityLevel || d.bodyType) && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Scale className="h-5 w-5 text-orange-500" />Physical Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {d.height && (
                  <div className="p-3 bg-secondary/50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">Height</p>
                    <p className="font-bold text-foreground text-lg">{d.height} <span className="text-sm font-normal">cm</span></p>
                  </div>
                )}
                {d.weight && (
                  <div className="p-3 bg-secondary/50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">Weight</p>
                    <p className="font-bold text-foreground text-lg">{d.weight} <span className="text-sm font-normal">kg</span></p>
                  </div>
                )}
                {d.targetWeight && (
                  <div className="p-3 bg-secondary/50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">Target Weight</p>
                    <p className="font-bold text-foreground text-lg">{d.targetWeight} <span className="text-sm font-normal">kg</span></p>
                  </div>
                )}
                {bmi && (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">BMI</p>
                    <p className="font-bold text-primary text-lg">{bmi}</p>
                    <p className="text-xs text-muted-foreground">{bmiLabel}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {d.bodyType && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Body Type</p>
                    <p className="font-medium text-foreground text-sm">{bodyTypeLabels[d.bodyType] || d.bodyType}</p>
                  </div>
                )}
                {d.activityLevel && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Activity Level</p>
                    <p className="font-medium text-foreground text-sm">{activityLabels[d.activityLevel] || d.activityLevel}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* MEDICAL INFORMATION */}
        {(d.bloodGroup || d.chronicConditions?.length || d.injuries || d.doctorClearance) && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="h-5 w-5 text-red-500" />Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {d.bloodGroup && d.bloodGroup !== 'unknown' && (
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-red-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">Blood Group</p>
                      <p className="font-bold text-foreground">{d.bloodGroup}</p>
                    </div>
                  </div>
                )}
                {d.doctorClearance && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Doctor Clearance</p>
                      <p className="font-medium text-foreground text-sm">
                        {d.doctorClearance === 'yes' ? '✅ Cleared' : d.doctorClearance === 'no' ? '❌ Not cleared' : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {d.chronicConditions?.length > 0 && !d.chronicConditions.includes('none') && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Chronic Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {d.chronicConditions.map((c: string) => (
                      <Badge key={c} variant="outline" className="border-red-500/30 text-red-400 text-xs">
                        {conditionLabels[c] || c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {d.chronicConditions?.includes('none') && (
                <p className="text-sm text-green-500">✅ No chronic conditions reported</p>
              )}

              {d.injuries && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Injuries / Pain Areas</p>
                  <p className="text-sm text-foreground bg-secondary/50 p-2 rounded-lg">{d.injuries}</p>
                </div>
              )}

              {d.surgeries && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Past Surgeries</p>
                  <p className="text-sm text-foreground bg-secondary/50 p-2 rounded-lg">{d.surgeries}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* FITNESS GOALS */}
        {(d.primaryGoal || d.experienceLevel || d.preferredActivities?.length) && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-green-500" />Fitness Goals & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {d.primaryGoal && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Primary Goal</p>
                    <p className="font-medium text-foreground text-sm">{goalLabels[d.primaryGoal] || d.primaryGoal}</p>
                  </div>
                )}
                {d.experienceLevel && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Experience</p>
                    <p className="font-medium text-foreground text-sm">{experienceLabels[d.experienceLevel] || d.experienceLevel}</p>
                  </div>
                )}
                {d.availableDaysPerWeek && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Days per Week</p>
                    <p className="font-medium text-foreground text-sm">{d.availableDaysPerWeek} days</p>
                  </div>
                )}
              </div>

              {d.preferredActivities?.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Preferred Workouts</p>
                  <div className="flex flex-wrap gap-2">
                    {d.preferredActivities.map((a: string) => (
                      <Badge key={a} className="bg-primary/20 text-primary text-xs capitalize">
                        {a.replace(/-/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* NOTES FOR TRAINER */}
        {d.fitnessGoalNote && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5 text-primary" />Notes for Trainer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground bg-secondary/50 p-3 rounded-lg leading-relaxed">{d.fitnessGoalNote}</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ADMIN — unchanged
  // ─────────────────────────────────────────────────────────────
  if (user.role === 'admin' && onboardingData) {
    return (
      <div className="space-y-6">
        {onboardingData.data.department && (
          <Card className="border-border/50">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5 text-primary" />Admin Profile</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground mb-1">Department</p><p className="font-medium text-foreground capitalize">{onboardingData.data.department}</p></div>
                <div><p className="text-sm text-muted-foreground mb-1">Experience</p><p className="font-medium text-foreground">{onboardingData.data.experience} years</p></div>
              </div>
            </CardContent>
          </Card>
        )}
        {onboardingData.data.responsibilities && (
          <Card className="border-border/50">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><CheckCircle className="h-5 w-5 text-primary" />Responsibilities</CardTitle></CardHeader>
            <CardContent><p className="text-foreground whitespace-pre-wrap">{onboardingData.data.responsibilities}</p></CardContent>
          </Card>
        )}
        {onboardingData.data.accessLevel && (
          <Card className="border-border/50">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><AlertCircle className="h-5 w-5 text-primary" />Access & Permissions</CardTitle></CardHeader>
            <CardContent><Badge className="bg-primary/20 text-primary capitalize">{onboardingData.data.accessLevel} Access</Badge></CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // TRAINER — unchanged
  // ─────────────────────────────────────────────────────────────
  if (user.role === 'trainer' && onboardingData) {
    const data = onboardingData.data;
    const daysOrder = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    return (
      <div className="space-y-6">
        {data.bio && (
          <Card className="border-border/50"><CardHeader><CardTitle>About</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">{data.bio}</p></CardContent>
          </Card>
        )}
        {data.specializations?.length > 0 && (
          <Card className="border-border/50"><CardHeader><CardTitle>Specializations</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {data.specializations.map((item: string) => <Badge key={item} className="bg-primary/20 text-primary">{item.replace('_', ' ')}</Badge>)}
            </CardContent>
          </Card>
        )}
        {data.certifications?.length > 0 && (
          <Card className="border-border/50"><CardHeader><CardTitle>Certifications</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {data.certifications.map((item: string) => <Badge key={item} variant="secondary">{item}</Badge>)}
            </CardContent>
          </Card>
        )}
        {data.yearsExperience && (
          <Card className="border-border/50"><CardHeader><CardTitle>Experience</CardTitle></CardHeader>
            <CardContent><p className="font-semibold">{data.yearsExperience} years</p></CardContent>
          </Card>
        )}
        {(data.hourlyRate || data.packageRate || data.groupClassRate) && (
          <Card className="border-border/50"><CardHeader><CardTitle>Rates</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {data.hourlyRate && <p>Session: ₹{data.hourlyRate}</p>}
              {data.packageRate && <p>Package (10): ₹{data.packageRate}</p>}
              {data.groupClassRate && <p>Group: ₹{data.groupClassRate}</p>}
            </CardContent>
          </Card>
        )}
        {data.availability && (
          <Card className="border-border/50"><CardHeader><CardTitle>Weekly Schedule</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {daysOrder.map(day => {
                const d = data.availability[day];
                if (!d?.enabled) return null;
                return <div key={day} className="flex justify-between"><span>{day}</span><span className="text-muted-foreground">{d.start} - {d.end}</span></div>;
              })}
            </CardContent>
          </Card>
        )}
        {(data.instagram || data.twitter || data.linkedin || data.website) && (
          <Card className="border-border/50"><CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {data.instagram && <p>Instagram: {data.instagram}</p>}
              {data.twitter && <p>Twitter: {data.twitter}</p>}
              {data.linkedin && <p>LinkedIn: {data.linkedin}</p>}
              {data.website && <p>Website: {data.website}</p>}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // OWNER — unchanged
  // ─────────────────────────────────────────────────────────────
  if (user.role === 'owner' && onboardingData) {
    return (
      <div className="space-y-6">
        {onboardingData.data.gymName && (
          <Card className="border-border/50">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Building className="h-5 w-5 text-primary" />Gym Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-sm text-muted-foreground mb-1">Gym Name</p><p className="font-medium text-foreground text-lg">{onboardingData.data.gymName}</p></div>
              <div><p className="text-sm text-muted-foreground mb-1">Address</p><p className="text-foreground">{onboardingData.data.gymAddress}</p></div>
              <div><p className="text-sm text-muted-foreground mb-1">Area</p><p className="font-medium text-foreground">{onboardingData.data.gymArea} sq.ft</p></div>
            </CardContent>
          </Card>
        )}
        {(onboardingData.data.equipment || onboardingData.data.facilities) && (
          <Card className="border-border/50">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Dumbbell className="h-5 w-5 text-primary" />Facilities & Equipment</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {onboardingData.data.equipment && <div><p className="text-sm text-muted-foreground mb-2">Equipment</p><p className="text-foreground whitespace-pre-wrap">{onboardingData.data.equipment}</p></div>}
              {onboardingData.data.facilities && <div><p className="text-sm text-muted-foreground mb-2">Facilities</p><p className="text-foreground">{onboardingData.data.facilities}</p></div>}
            </CardContent>
          </Card>
        )}
        {onboardingData.data.weeklyPrice && (
          <Card className="border-border/50">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><DollarSign className="h-5 w-5 text-primary" />Membership Pricing</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div><p className="text-sm text-muted-foreground mb-1">Weekly</p><p className="font-bold text-foreground text-lg">₹{onboardingData.data.weeklyPrice}</p></div>
                <div><p className="text-sm text-muted-foreground mb-1">Monthly</p><p className="font-bold text-foreground text-lg">₹{onboardingData.data.monthlyPrice}</p></div>
                <div><p className="text-sm text-muted-foreground mb-1">Service Radius</p><p className="font-medium text-foreground">{onboardingData.data.serviceRadius} km</p></div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardContent className="pt-8">
        <p className="text-center text-muted-foreground">No profile data available. Please complete onboarding.</p>
      </CardContent>
    </Card>
  );
}
