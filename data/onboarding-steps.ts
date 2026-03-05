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
   'textarea'|'multiselect'|'image'|'range'|'weeklyAvailability'|'list';
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  help?: string;
}

const USER_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'fitness_profile',
    title: 'Fitness Profile',
    description: 'Tell us about your fitness goals and current status',
    icon: 'Target',
    fields: [
      {
        name: 'fitnessGoal',
        label: 'Primary Fitness Goal',
        type: 'select',
        required: true,
        options: [
          { value: 'weight-loss', label: 'Weight Loss' },
          { value: 'muscle-gain', label: 'Muscle Gain' },
          { value: 'maintenance', label: 'Maintenance' },
          { value: 'endurance', label: 'Endurance Training' },
          { value: 'flexibility', label: 'Flexibility & Yoga' },
          { value: 'rehabilitation', label: 'Rehabilitation' },
        ],
      },
      {
        name: 'experienceLevel',
        label: 'Experience Level',
        type: 'select',
        required: true,
        options: [
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' },
        ],
      },
    ],
  },
  {
    id: 'body_metrics',
    title: 'Body Metrics',
    description: 'Enter your height and weight for personalized recommendations',
    icon: 'Scale',
    fields: [
      {
        name: 'height',
        label: 'Height (cm)',
        type: 'number',
        placeholder: '170',
        required: true,
        help: 'Enter your height in centimeters',
      },
      {
        name: 'weight',
        label: 'Weight (kg)',
        type: 'number',
        placeholder: '70',
        required: true,
        help: 'Enter your current weight in kilograms',
      },
      {
        name: 'age',
        label: 'Age',
        type: 'number',
        placeholder: '25',
        required: true,
      },
    ],
  },
  {
    id: 'health_info',
    title: 'Health Information',
    description: 'Any medical conditions or injuries we should know about?',
    icon: 'Heart',
    fields: [
      {
        name: 'medicalConditions',
        label: 'Medical Conditions (if any)',
        type: 'textarea',
        placeholder: 'e.g., Asthma, Diabetes, etc.',
        required: false,
        help: 'Leave blank if none',
      },
      {
        name: 'injuries',
        label: 'Current Injuries or Pain',
        type: 'textarea',
        placeholder: 'Describe any current injuries or pain areas',
        required: false,
        help: 'This helps trainers create safe workout plans',
      },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'What are your fitness preferences?',
    icon: 'Dumbbell',
    fields: [
      {
        name: 'preferredActivities',
        label: 'Preferred Activities',
        type: 'select',
        required: true,
        options: [
          { value: 'cardio', label: 'Cardio' },
          { value: 'strength', label: 'Strength Training' },
          { value: 'yoga', label: 'Yoga' },
          { value: 'crossfit', label: 'CrossFit' },
          { value: 'swimming', label: 'Swimming' },
          { value: 'mixed', label: 'Mixed Workout' },
        ],
      },
      {
        name: 'availableDays',
        label: 'Available Days Per Week',
        type: 'number',
        placeholder: '4',
        required: true,
        help: 'How many days can you commit to the gym?',
      },
    ],
  },
];

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

const OWNER_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'gym_info',
    title: 'Gym Information',
    description: 'Tell us about your gym',
    icon: 'Building',
    fields: [
      {
        name: 'gymName',
        label: 'Gym Name',
        type: 'text',
        placeholder: 'Your Gym Name',
        required: true,
      },
      {
  name: 'gymAddress',
  label: 'Gym Location',
  type: 'select',
  required: true,
  options: [
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'hyderabad', label: 'Hyderabad' },
  ],
},

     {
  name: 'gymArea',
  label: 'Gym Area (sq.ft)',
  type: 'range',
  required: true,
}

    ],
  },
  {
    id: 'gym_facilities',
    title: 'Facilities & Equipment',
    description: 'What facilities and equipment do you offer?',
    icon: 'Dumbbell',
    fields: [
      {
  name: 'equipment',
  label: 'Equipment',
  type: 'list',
  required: true,
},

     {
  name: 'facilities',
  label: 'Additional Facilities',
  type: 'list',
  required: false,
},

    ],
  },
  {
    id: 'gym_operations',
    title: 'Operations',
    description: 'Operating hours and staff details',
    icon: 'Clock',
    fields: [
     {
  name: 'openTime',
  label: 'Opening Time',
  type: 'time',
  required: true,
},
{
  name: 'closeTime',
  label: 'Closing Time',
  type: 'time',
  required: true,
},

      {
        name: 'trainers',
        label: 'Number of Trainers',
        type: 'number',
        placeholder: '5',
        required: true,
      },
      {
        name: 'staffMembers',
        label: 'Total Staff Members',
        type: 'number',
        placeholder: '10',
        required: true,
      },
    ],
  },
  {
    id: 'gym_pricing',
    title: 'Pricing & Services',
    description: 'Set your membership pricing',
    icon: 'DollarSign',
    fields: [
      {
        name: 'weeklyPrice',
        label: 'Weekly Membership (₹)',
        type: 'number',
        placeholder: '20',
        required: true,
      },
      {
        name: 'monthlyPrice',
        label: 'Monthly Membership (₹)',
        type: 'number',
        placeholder: '80',
        required: true,
      },
      {
  name: 'serviceRadius',
  label: 'Service Radius (km)',
  type: 'range',
  required: true,
},

    ],
  },
];

const TRAINER_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'trainer_profile',
    title: 'Trainer Profile',
    description: 'Tell us about your fitness expertise and specialization',
    icon: 'Award',
    fields: [
      {
  name: 'avatar',
  label: 'Profile Photo',
  type: 'image',
  required: true,
},

      {
        name: 'specializations',
        label: 'Specializations',
        type: 'multiselect',
        required: true,
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
      {
        name: 'yearsExperience',
        label: 'Years of Experience',
        type: 'range',
        placeholder: '5',
        required: true,
        help: 'Total years of professional training experience',
      },
      {
        name: 'certifications',
        label: 'Certifications',
        type: 'multiselect',
        required: true,
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
      {
        name: 'bio',
        label: 'Bio',
        type: 'textarea',
        placeholder: 'Tell clients about yourself, achievements, training style...',
        required: true,
      },
    ],
  },

  {
    id: 'trainer_rates',
    title: 'Training Rates',
    description: 'Set your hourly and package rates',
    icon: 'DollarSign',
    fields: [
      {
        name: 'hourlyRate',
        label: 'Hourly Rate (₹)',
        type: 'number',
        placeholder: '50',
        required: true,
      },
      {
        name: 'packageRate',
        label: 'Package Rate (10 Sessions, ₹)',
        type: 'number',
        placeholder: '450',
        required: true,
      },
      {
        name: 'groupClassRate',
        label: 'Group Class Rate (per person, ₹)',
        type: 'number',
        placeholder: '15',
        required: true,
      },
    ],
  },

  {
    id: 'trainer_availability',
    title: 'Availability',
    description: 'Set your working days',
    icon: 'Clock',
    fields: [
      
      {
  name: 'availability',
  label: 'Weekly Availability',
  type: 'weeklyAvailability',
  required: true,
},
{
  name: 'instagram',
  label: 'Instagram',
  type: 'text',
  required: false,
},
{
  name: 'twitter',
  label: 'Twitter',
  type: 'text',
  required: false,
},
{
  name: 'linkedin',
  label: 'LinkedIn',
  type: 'text',
  required: false,
},
{
  name: 'website',
  label: 'Website',
  type: 'text',
  required: false,
},


    ],
  },

  {
    id: 'trainer_gym',
    title: 'Associate Gym',
    description: 'Select the gym(s) where you will train clients',
    icon: 'Dumbbell',
    fields: [
      {
        name: 'gymId',
        label: 'Select Your Gym',
        type: 'select',
        required: true,
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

  // ⭐ NEW STEP → Preview
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
    case 'user':
      return USER_ONBOARDING_STEPS;
    case 'admin':
      return ADMIN_ONBOARDING_STEPS;
    case 'owner':
      return OWNER_ONBOARDING_STEPS;
    case 'trainer':
      return TRAINER_ONBOARDING_STEPS;
    default:
      return [];
  }
}

export function getTotalSteps(role: UserRole): number {
  return getOnboardingSteps(role).length;
}
