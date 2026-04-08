import { UserRole } from '@/contexts/auth-context';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  fields: OnboardingField[];
}

export interface OnboardingField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'date' | 'time' |
   'textarea' | 'multiselect' | 'image' | 'range' | 'weeklyAvailability' | 'list' |
   'phone' | 'social' | 'location'|'multiimage';
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  help?: string;
}

// ─────────────────────────────────────────────────────────────────
// USER ONBOARDING — 6 steps
// ─────────────────────────────────────────────────────────────────
const USER_ONBOARDING_STEPS: OnboardingStep[] = [
  // STEP 1 — Profile Photo + Basic Info
  {
    id: 'profile_setup',
    title: 'Profile Setup',
    description: 'Upload your photo and tell us a bit about yourself',
    icon: 'User',
    fields: [
      {
        name: 'avatar',
        label: 'Profile Photo',
        type: 'image',
        required: false,
        help: 'Upload a clear photo of yourself (optional)',
      },
      {
        name: 'displayName',
        label: 'Display Name',
        type: 'text',
        placeholder: 'How should trainers address you?',
        required: true,
      },
      {
        name: 'dateOfBirth',
        label: 'Date of Birth',
        type: 'date',
        required: true,
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        required: true,
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'non_binary', label: 'Non-binary' },
          { value: 'prefer_not', label: 'Prefer not to say' },
        ],
      },
    ],
  },

  // STEP 2 — Location
  {
    id: 'location',
    title: 'Your Location',
    description: 'Help us find gyms near you',
    icon: 'MapPin',
    fields: [
      {
        name: 'city',
        label: 'City',
        type: 'select',
        required: true,
        options: [
          { value: 'mumbai', label: 'Mumbai' },
          { value: 'delhi', label: 'Delhi' },
          { value: 'bangalore', label: 'Bangalore' },
          { value: 'hyderabad', label: 'Hyderabad' },
          { value: 'pune', label: 'Pune' },
          { value: 'chennai', label: 'Chennai' },
          { value: 'kolkata', label: 'Kolkata' },
          { value: 'ahmedabad', label: 'Ahmedabad' },
          { value: 'jaipur', label: 'Jaipur' },
          { value: 'lucknow', label: 'Lucknow' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        name: 'area',
        label: 'Area / Locality',
        type: 'text',
        placeholder: 'e.g. Andheri West, Koramangala...',
        required: false,
        help: 'Helps us show gyms closest to you',
      },
      {
        name: 'pincode',
        label: 'PIN Code',
        type: 'text',
        placeholder: '400001',
        required: false,
      },
      {
        name: 'preferredDistance',
        label: 'Max Distance to Gym (km)',
        type: 'select',
        required: true,
        options: [
          { value: '2', label: 'Within 2 km' },
          { value: '5', label: 'Within 5 km' },
          { value: '10', label: 'Within 10 km' },
          { value: '20', label: 'Within 20 km' },
          { value: 'any', label: 'Any distance' },
        ],
      },
    ],
  },

  // STEP 3 — Physical Information
  {
    id: 'physical_info',
    title: 'Physical Information',
    description: 'Your body metrics for personalised fitness recommendations',
    icon: 'Scale',
    fields: [
      {
        name: 'height',
        label: 'Height (cm)',
        type: 'number',
        placeholder: '170',
        required: true,
        help: 'Enter your height in centimetres',
      },
      {
        name: 'weight',
        label: 'Current Weight (kg)',
        type: 'number',
        placeholder: '70',
        required: true,
      },
      {
        name: 'targetWeight',
        label: 'Target Weight (kg)',
        type: 'number',
        placeholder: '65',
        required: false,
        help: 'Leave blank if not applicable',
      },
      {
        name: 'bodyType',
        label: 'Body Type',
        type: 'select',
        required: false,
        options: [
          { value: 'ectomorph', label: 'Ectomorph (Lean / slim)' },
          { value: 'mesomorph', label: 'Mesomorph (Athletic / muscular)' },
          { value: 'endomorph', label: 'Endomorph (Heavier / stocky)' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
      {
        name: 'activityLevel',
        label: 'Current Activity Level',
        type: 'select',
        required: true,
        options: [
          { value: 'sedentary', label: 'Sedentary (desk job, little movement)' },
          { value: 'lightly_active', label: 'Lightly active (light exercise 1-2 days/week)' },
          { value: 'moderately_active', label: 'Moderately active (3-4 days/week)' },
          { value: 'very_active', label: 'Very active (5+ days/week)' },
        ],
      },
    ],
  },

  // STEP 4 — Medical Information
  {
    id: 'medical_info',
    title: 'Medical Information',
    description: 'Helps trainers design safe workout plans for you',
    icon: 'Heart',
    fields: [
      {
        name: 'bloodGroup',
        label: 'Blood Group',
        type: 'select',
        required: false,
        options: [
          { value: 'A+', label: 'A+' },
          { value: 'A-', label: 'A-' },
          { value: 'B+', label: 'B+' },
          { value: 'B-', label: 'B-' },
          { value: 'AB+', label: 'AB+' },
          { value: 'AB-', label: 'AB-' },
          { value: 'O+', label: 'O+' },
          { value: 'O-', label: 'O-' },
          { value: 'unknown', label: 'Don\'t know' },
        ],
      },
      {
        name: 'chronicConditions',
        label: 'Chronic Medical Conditions',
        type: 'multiselect',
        required: false,
        options: [
          { value: 'diabetes', label: 'Diabetes' },
          { value: 'hypertension', label: 'High Blood Pressure' },
          { value: 'heart_disease', label: 'Heart Disease' },
          { value: 'asthma', label: 'Asthma' },
          { value: 'thyroid', label: 'Thyroid Disorder' },
          { value: 'arthritis', label: 'Arthritis' },
          { value: 'pcod', label: 'PCOD/PCOS' },
          { value: 'none', label: 'None' },
        ],
        help: 'Select all that apply',
      },
      {
        name: 'injuries',
        label: 'Current Injuries or Pain Areas',
        type: 'textarea',
        placeholder: 'e.g. Lower back pain, knee injury, shoulder issue...',
        required: false,
        help: 'Describe any areas that need special attention during workouts',
      },
      {
        name: 'medications',
        label: 'Any Regular Medications?',
        type: 'textarea',
        placeholder: 'List medications that may affect your workout...',
        required: false,
        help: 'This is kept private and only visible to your assigned trainer',
      },
      {
        name: 'surgeries',
        label: 'Past Surgeries or Procedures',
        type: 'textarea',
        placeholder: 'e.g. ACL repair (2022), appendix removal...',
        required: false,
      },
      {
        name: 'doctorClearance',
        label: 'Do you have a doctor\'s clearance to exercise?',
        type: 'select',
        required: false,
        options: [
          { value: 'yes', label: 'Yes, cleared to exercise' },
          { value: 'no', label: 'No, not cleared' },
          { value: 'na', label: 'Not required / healthy' },
        ],
      },
    ],
  },

  // STEP 5 — Fitness Goals
  {
    id: 'fitness_goals',
    title: 'Fitness Goals',
    description: 'What are you working towards?',
    icon: 'Target',
    fields: [
      {
        name: 'primaryGoal',
        label: 'Primary Fitness Goal',
        type: 'select',
        required: true,
        options: [
          { value: 'weight-loss', label: 'Weight Loss' },
          { value: 'muscle-gain', label: 'Muscle Gain' },
          { value: 'maintenance', label: 'Maintain Current Shape' },
          { value: 'endurance', label: 'Build Endurance / Stamina' },
          { value: 'flexibility', label: 'Flexibility & Mobility' },
          { value: 'rehabilitation', label: 'Injury Rehabilitation' },
          { value: 'sports', label: 'Sports Performance' },
          { value: 'stress', label: 'Stress Relief / Mental Wellness' },
        ],
      },
      {
        name: 'experienceLevel',
        label: 'Gym Experience Level',
        type: 'select',
        required: true,
        options: [
          { value: 'beginner', label: 'Beginner (never worked out)' },
          { value: 'some', label: 'Some experience (tried before)' },
          { value: 'intermediate', label: 'Intermediate (1-2 years)' },
          { value: 'advanced', label: 'Advanced (3+ years)' },
        ],
      },
      {
        name: 'preferredActivities',
        label: 'Preferred Workout Types',
        type: 'multiselect',
        required: false,
        options: [
          { value: 'cardio', label: 'Cardio' },
          { value: 'strength', label: 'Strength Training' },
          { value: 'yoga', label: 'Yoga' },
          { value: 'crossfit', label: 'CrossFit' },
          { value: 'swimming', label: 'Swimming' },
          { value: 'hiit', label: 'HIIT' },
          { value: 'zumba', label: 'Zumba / Dance' },
          { value: 'pilates', label: 'Pilates' },
        ],
      },
      {
        name: 'availableDaysPerWeek',
        label: 'Days Available Per Week',
        type: 'select',
        required: true,
        options: [
          { value: '1', label: '1 day' },
          { value: '2', label: '2 days' },
          { value: '3', label: '3 days' },
          { value: '4', label: '4 days' },
          { value: '5', label: '5 days' },
          { value: '6', label: '6 days' },
          { value: '7', label: 'Every day' },
        ],
      },
    ],
  },

  // STEP 6 — Social Media
  {
    id: 'social_media',
    title: 'Social Media',
    description: 'Add your social profiles (all optional)',
    icon: 'Share',
    fields: [
      {
        name: 'instagram',
        label: 'Instagram',
        type: 'text',
        placeholder: '@yourusername',
        required: false,
        help: 'Your Instagram handle',
      },
      {
        name: 'twitter',
        label: 'Twitter / X',
        type: 'text',
        placeholder: '@yourusername',
        required: false,
      },
      {
        name: 'facebook',
        label: 'Facebook',
        type: 'text',
        placeholder: 'facebook.com/yourprofile',
        required: false,
      },
      {
        name: 'youtube',
        label: 'YouTube',
        type: 'text',
        placeholder: 'youtube.com/@yourchannel',
        required: false,
        help: 'Share your fitness journey videos',
      },
      {
        name: 'fitnessGoalNote',
        label: 'Anything else you want your trainer to know?',
        type: 'textarea',
        placeholder: 'Any specific requests, preferences, or notes...',
        required: false,
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// ADMIN ONBOARDING — unchanged
// ─────────────────────────────────────────────────────────────────
const ADMIN_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'admin_profile',
    title: 'Admin Profile',
    description: 'Complete your admin profile information',
    icon: 'User',
    fields: [
      {
        name: 'department',
        label: 'Department',
        type: 'select',
        required: true,
        options: [
          { value: 'operations', label: 'Operations' },
          { value: 'finance', label: 'Finance' },
          { value: 'support', label: 'Customer Support' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'tech', label: 'Technical' },
        ],
      },
      {
        name: 'experience',
        label: 'Years of Experience',
        type: 'number',
        placeholder: '5',
        required: true,
      },
    ],
  },
  {
    id: 'admin_responsibilities',
    title: 'Responsibilities',
    description: 'Define your primary responsibilities',
    icon: 'CheckCircle',
    fields: [
      {
        name: 'responsibilities',
        label: 'Primary Responsibilities',
        type: 'textarea',
        placeholder: 'List your main duties and responsibilities',
        required: true,
      },
    ],
  },
  {
    id: 'admin_permissions',
    title: 'Access & Permissions',
    description: 'Configure your access level',
    icon: 'Lock',
    fields: [
      {
        name: 'accessLevel',
        label: 'Access Level',
        type: 'select',
        required: true,
        options: [
          { value: 'limited', label: 'Limited Access' },
          { value: 'standard', label: 'Standard Access' },
          { value: 'full', label: 'Full Access' },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// OWNER ONBOARDING — unchanged from original
// ─────────────────────────────────────────────────────────────────
const OWNER_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'gym_info',
    title: 'Gym Information',
    description: 'Tell us about your gym',
    icon: 'Building',
    fields: [
      { name: 'gymName', label: 'Gym Name', type: 'text', placeholder: 'Your Gym Name', required: true },
      {
        name: 'gymAddress', label: 'Gym Location', type: 'select', required: true,
        options: [
          { value: 'mumbai', label: 'Mumbai' },
          { value: 'delhi', label: 'Delhi' },
          { value: 'bangalore', label: 'Bangalore' },
          { value: 'hyderabad', label: 'Hyderabad' },
          { value: 'pune', label: 'Pune' },
          { value: 'chennai', label: 'Chennai' },
          { value: 'lucknow', label: 'Lucknow' },
        ],
      },
      { name: 'gymArea', label: 'Gym Area (sq.ft)', type: 'range', required: true },
    ],
  },

  {
    id: 'gym_facilities',
    title: 'Facilities & Equipment',
    description: 'What facilities and equipment do you offer?',
    icon: 'Dumbbell',
    fields: [
      { name: 'equipment', label: 'Equipment', type: 'list', required: true },
      { name: 'facilities', label: 'Additional Facilities', type: 'list', required: false },
    ],
  },

  {
    id: 'gym_operations',
    title: 'Operations',
    description: 'Operating hours and staff details',
    icon: 'Clock',
    fields: [
      { name: 'openTime', label: 'Opening Time', type: 'time', required: true },
      { name: 'closeTime', label: 'Closing Time', type: 'time', required: true },
      { name: 'trainers', label: 'Number of Trainers', type: 'number', placeholder: '5', required: true },
      { name: 'staffMembers', label: 'Total Staff Members', type: 'number', placeholder: '10', required: true },
    ],
  },

  {
    id: 'gym_pricing',
    title: 'Pricing & Services',
    description: 'Set your membership pricing',
    icon: 'DollarSign',
    fields: [
      { name: 'weeklyPrice', label: 'Weekly Membership (₹)', type: 'number', placeholder: '20', required: true },
      { name: 'monthlyPrice', label: 'Monthly Membership (₹)', type: 'number', placeholder: '80', required: true },
      { name: 'serviceRadius', label: 'Service Radius (km)', type: 'range', required: true },
    ],
  },

  // 🔥 NEW STEP
  {
    id: 'gym_photos',
    title: 'Gym Photos',
    description: 'Upload photos of your gym',
    icon: 'Image',
    fields: [
      {
        name: 'gymPhotos',
        label: 'Upload Gym Photos',
        type: 'multiimage',
        required: false,
      }
    ]
  }
];
// ─────────────────────────────────────────────────────────────────
// TRAINER ONBOARDING — unchanged from original
// ─────────────────────────────────────────────────────────────────
const TRAINER_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'trainer_profile',
    title: 'Trainer Profile',
    description: 'Tell us about your fitness expertise and specialization',
    icon: 'Award',
    fields: [
      { name: 'avatar', label: 'Profile Photo', type: 'image', required: true },
      {
        name: 'specializations', label: 'Specializations', type: 'multiselect', required: true,
        options: [
          { value: 'strength', label: 'Strength Training' },
          { value: 'hiit', label: 'HIIT' },
          { value: 'yoga', label: 'Yoga' },
          { value: 'pilates', label: 'Pilates' },
          { value: 'crossfit', label: 'CrossFit' },
          { value: 'boxing', label: 'Boxing' },
          { value: 'weight_loss', label: 'Weight Loss' },
          { value: 'bodybuilding', label: 'Bodybuilding' },
          { value: 'functional', label: 'Functional Fitness' },
          { value: 'rehab', label: 'Rehabilitation' },
        ],
      },
      { name: 'yearsExperience', label: 'Years of Experience', type: 'range', placeholder: '5', required: true, help: 'Total years of professional training experience' },
      {
        name: 'certifications', label: 'Certifications', type: 'multiselect', required: true,
        options: [
          { value: 'nasm', label: 'NASM-CPT' },
          { value: 'ace', label: 'ACE-CPT' },
          { value: 'issa', label: 'ISSA-CPT' },
          { value: 'cscs', label: 'NSCA-CSCS' },
          { value: 'acsm', label: 'ACSM' },
          { value: 'crossfit_l1', label: 'CrossFit Level 1' },
          { value: 'yoga_r200', label: 'Yoga Alliance RYT-200' },
        ],
      },
      { name: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Tell clients about yourself, achievements, training style...', required: true },
    ],
  },
  {
    id: 'trainer_rates',
    title: 'Training Rates',
    description: 'Set your hourly and package rates',
    icon: 'DollarSign',
    fields: [
      { name: 'hourlyRate', label: 'Hourly Rate (₹)', type: 'number', placeholder: '50', required: true },
      { name: 'packageRate', label: 'Package Rate (10 Sessions, ₹)', type: 'number', placeholder: '450', required: true },
      { name: 'groupClassRate', label: 'Group Class Rate (per person, ₹)', type: 'number', placeholder: '15', required: true },
    ],
  },
  {
    id: 'trainer_availability',
    title: 'Availability & Social',
    description: 'Set your working days and social profiles',
    icon: 'Clock',
    fields: [
      { name: 'availability', label: 'Weekly Availability', type: 'weeklyAvailability', required: true },
      { name: 'instagram', label: 'Instagram', type: 'text', required: false },
      { name: 'twitter', label: 'Twitter', type: 'text', required: false },
      { name: 'linkedin', label: 'LinkedIn', type: 'text', required: false },
      { name: 'website', label: 'Website', type: 'text', required: false },
    ],
  },
  {
    id: 'trainer_gym',
    title: 'Associate Gym',
    description: 'Select the gym(s) where you will train clients',
    icon: 'Dumbbell',
    fields: [
      {
        name: 'gymId', label: 'Select Your Gym', type: 'select', required: true,
        options: [
          { value: 'gym_1', label: 'FitZone Premium - Mumbai' },
          { value: 'gym_2', label: 'Elite Fitness Club - Delhi' },
          { value: 'gym_3', label: 'PowerHub Gym - Bangalore' },
          { value: 'gym_4', label: 'FitCo Gym - Hyderabad' },
          { value: 'gym_5', label: 'Strong Start - Pune' },
          { value: 'gym_6', label: 'Flex Fitness - Chennai' },
        ],
      },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Preview your profile before publishing',
    icon: 'CheckCircle',
    fields: [],
  },
];

export function getOnboardingSteps(role: UserRole): OnboardingStep[] {
  switch (role) {
    case 'user': return USER_ONBOARDING_STEPS;
    case 'admin': return ADMIN_ONBOARDING_STEPS;
    case 'owner': return OWNER_ONBOARDING_STEPS;
    case 'trainer': return TRAINER_ONBOARDING_STEPS;
    default: return [];
  }
}

export function getTotalSteps(role: UserRole): number {
  return getOnboardingSteps(role).length;
}
