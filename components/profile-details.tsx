'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useOnboarding } from '@/contexts/onboarding-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Scale,
  Heart,
  Dumbbell,
  User,
  Building,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export function ProfileDetails() {
  const { user } = useAuth();
  const { getOnboardingData } = useOnboarding();

  if (!user) return null;

  const onboardingData = getOnboardingData(user.id);

  const getRoleTitle = (role: string) => {
    const roleMap: Record<string, string> = {
      user: 'Fitness Enthusiast',
      admin: 'Platform Admin',
      owner: 'Gym Owner',
    };
    return roleMap[role] || role;
  };


  const getIconForRole = (role: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      user: <Target className="h-5 w-5" />,
      admin: <User className="h-5 w-5" />,
      owner: <Building className="h-5 w-5" />,
    };
    return iconMap[role];
  };

  // User Profile Details
  if (user.role === 'user' && onboardingData) {
    return (
      <div className="space-y-6">
        {/* Fitness Profile */}
        {onboardingData.data.fitnessGoal && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                Fitness Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fitness Goal</p>
                  <p className="font-medium text-foreground capitalize">
                    {onboardingData.data.fitnessGoal?.replace(/-/g, ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Experience Level</p>
                  <p className="font-medium text-foreground capitalize">
                    {onboardingData.data.experienceLevel}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Body Metrics */}
        {onboardingData.data.height && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Scale className="h-5 w-5 text-primary" />
                Body Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Height</p>
                  <p className="font-medium text-foreground">{onboardingData.data.height} cm</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Weight</p>
                  <p className="font-medium text-foreground">{onboardingData.data.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Age</p>
                  <p className="font-medium text-foreground">{onboardingData.data.age} years</p>
                </div>
              </div>
              {onboardingData.data.height && onboardingData.data.weight && (
                <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">BMI</p>
                  <p className="font-semibold text-foreground">
                    {(
                      onboardingData.data.weight /
                      ((onboardingData.data.height / 100) * (onboardingData.data.height / 100))
                    ).toFixed(1)}{' '}
                    kg/m²
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Health Information */}
        {(onboardingData.data.medicalConditions || onboardingData.data.injuries) && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5 text-primary" />
                Health Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {onboardingData.data.medicalConditions && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Medical Conditions</p>
                  <p className="text-foreground">
                    {onboardingData.data.medicalConditions || 'None reported'}
                  </p>
                </div>
              )}
              {onboardingData.data.injuries && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Current Injuries/Pain</p>
                  <p className="text-foreground">
                    {onboardingData.data.injuries || 'None reported'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Preferences */}
        {onboardingData.data.preferredActivities && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Dumbbell className="h-5 w-5 text-primary" />
                Fitness Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Preferred Activities</p>
                  <p className="font-medium text-foreground capitalize">
                    {onboardingData.data.preferredActivities?.replace(/-/g, ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Days Per Week</p>
                  <p className="font-medium text-foreground">
                    {onboardingData.data.availableDays} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Admin Profile Details
  if (user.role === 'admin' && onboardingData) {
    return (
      <div className="space-y-6">
        {/* Admin Profile */}
        {onboardingData.data.department && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Admin Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Department</p>
                  <p className="font-medium text-foreground capitalize">
                    {onboardingData.data.department}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Experience</p>
                  <p className="font-medium text-foreground">
                    {onboardingData.data.experience} years
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Responsibilities */}
        {onboardingData.data.responsibilities && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5 text-primary" />
                Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">
                {onboardingData.data.responsibilities}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Access Level */}
        {onboardingData.data.accessLevel && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-primary" />
                Access & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-primary/20 text-primary capitalize">
                {onboardingData.data.accessLevel} Access
              </Badge>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }


  // Trainer Profile Details
// Trainer Profile Details
if (user.role === 'trainer' && onboardingData) {
  const data = onboardingData.data;

  const daysOrder = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return (
    <div className="space-y-6">

      {/* ABOUT */}
      {data.bio && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{data.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* SPECIALIZATIONS */}
      {data.specializations?.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Specializations</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {data.specializations.map((item: string) => (
              <Badge key={item} className="bg-primary/20 text-primary">
                {item.replace('_', ' ')}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* CERTIFICATIONS */}
      {data.certifications?.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {data.certifications.map((item: string) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* EXPERIENCE */}
      {data.yearsExperience && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{data.yearsExperience} years</p>
          </CardContent>
        </Card>
      )}

      {/* RATES */}
      {(data.hourlyRate || data.packageRate || data.groupClassRate) && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {data.hourlyRate && <p>Session: ₹ {data.hourlyRate}</p>}
            {data.packageRate && <p>Package (10): ₹ {data.packageRate}</p>}
            {data.groupClassRate && <p>Group: ₹ {data.groupClassRate}</p>}
          </CardContent>
        </Card>
      )}

      {/* WEEKLY SCHEDULE */}
      {data.availability && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {daysOrder.map((day) => {
              const d = data.availability[day];
              if (!d?.enabled) return null;

              return (
                <div key={day} className="flex justify-between">
                  <span>{day}</span>
                  <span className="text-muted-foreground">
                    {d.start} - {d.end}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* SOCIAL LINKS */}
      {(data.instagram || data.twitter || data.linkedin || data.website) && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.instagram && <p>Instagram: {data.instagram}</p>}
            {data.twitter && <p>Twitter: {data.twitter}</p>}
            {data.linkedin && <p>LinkedIn: {data.linkedin}</p>}
            {data.website && <p>Website: {data.website}</p>}
          </CardContent>
        </Card>
      )}

      {/* GYM */}
      {data.gymId && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Associated Gym</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{data.gymId}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


  // Owner Profile Details
  if (user.role === 'owner' && onboardingData) {
    return (
      <div className="space-y-6">
        {/* Gym Information */}
        {onboardingData.data.gymName && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building className="h-5 w-5 text-primary" />
                Gym Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gym Name</p>
                <p className="font-medium text-foreground text-lg">
                  {onboardingData.data.gymName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="text-foreground whitespace-pre-wrap">
                  {onboardingData.data.gymAddress}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Area</p>
                <p className="font-medium text-foreground">{onboardingData.data.gymArea} sq.ft</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Facilities */}
        {(onboardingData.data.equipment || onboardingData.data.facilities) && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Dumbbell className="h-5 w-5 text-primary" />
                Facilities & Equipment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {onboardingData.data.equipment && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Main Equipment</p>
                  <p className="text-foreground whitespace-pre-wrap">
                    {onboardingData.data.equipment}
                  </p>
                </div>
              )}
              {onboardingData.data.facilities && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Additional Facilities</p>
                  <p className="text-foreground whitespace-pre-wrap">
                    {onboardingData.data.facilities || 'None'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Operations */}
        {onboardingData.data.operatingHours && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Operating Hours</p>
                  <p className="font-medium text-foreground">
                    {onboardingData.data.operatingHours}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Trainers</p>
                  <p className="font-medium text-foreground">{onboardingData.data.trainers}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-1">Total Staff Members</p>
                <p className="font-medium text-foreground">
                  {onboardingData.data.staffMembers}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing */}
        {onboardingData.data.weeklyPrice && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-primary" />
                Membership Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Weekly</p>
                  <p className="font-bold text-foreground text-lg">
                    ${onboardingData.data.weeklyPrice}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Monthly</p>
                  <p className="font-bold text-foreground text-lg">
                    ${onboardingData.data.monthlyPrice}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Service Radius</p>
                  <p className="font-medium text-foreground">
                    {onboardingData.data.serviceRadius} km
                  </p>
                </div>
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
        <p className="text-center text-muted-foreground">
          No profile data available. Please complete onboarding.
        </p>
      </CardContent>
    </Card>
  );
}
