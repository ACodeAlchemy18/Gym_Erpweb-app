export interface Gym {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  radius: number; // in km - service area radius
  phone: string;
  email: string;
  website: string;
  rating: number;
  totalReviews: number;
  operatingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  pricing: {
    weekly: number;
    monthly: number;
    quarterly: number;
    halfYearly: number;
    yearly: number;
  };
  amenities: string[];
  features: string[];
  trainers: number;
  equipment: number;
  sqft: number;
  established: number;
  photos: string[];
  featured: boolean;
}

export const gyms: Gym[] = [
  {
    id: "1",
    name: "Iron Temple Fitness",
    slug: "iron-temple-fitness",
    tagline: "Where Champions Are Made",
    description: "Iron Temple Fitness is a premier strength and conditioning facility designed for serious athletes and fitness enthusiasts. Our state-of-the-art equipment, expert trainers, and motivating atmosphere will help you achieve your fitness goals faster than ever. We specialize in powerlifting, bodybuilding, and functional fitness training.",
    address: "123 Muscle Street",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    coordinates: { lat: 34.0522, lng: -118.2437 },
    radius: 5,
    phone: "(310) 555-0101",
    email: "info@irontemplefitness.com",
    website: "www.irontemplefitness.com",
    rating: 4.8,
    totalReviews: 342,
    operatingHours: {
      weekdays: "5:00 AM - 11:00 PM",
      saturday: "6:00 AM - 10:00 PM",
      sunday: "7:00 AM - 8:00 PM"
    },
    pricing: {
      weekly: 35,
      monthly: 99,
      quarterly: 249,
      halfYearly: 449,
      yearly: 799
    },
    amenities: ["Locker Rooms", "Showers", "Sauna", "Steam Room", "Towel Service", "Parking", "Juice Bar", "Pro Shop"],
    features: ["Personal Training", "Group Classes", "Nutrition Coaching", "Body Composition Analysis", "24/7 Access"],
    trainers: 12,
    equipment: 150,
    sqft: 25000,
    established: 2015,
    photos: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
      "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&q=80"
    ],
    featured: true
  },
  {
    id: "2",
    name: "FitZone Elite",
    slug: "fitzone-elite",
    tagline: "Elevate Your Fitness Journey",
    description: "FitZone Elite offers a comprehensive fitness experience with cutting-edge equipment and expert guidance. From cardio enthusiasts to strength training aficionados, we provide everything you need to transform your body and mind. Our certified trainers are dedicated to helping you reach your peak performance.",
    address: "456 Wellness Avenue",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    radius: 8,
    phone: "(415) 555-0202",
    email: "hello@fitzoneelite.com",
    website: "www.fitzoneelite.com",
    rating: 4.6,
    totalReviews: 256,
    operatingHours: {
      weekdays: "5:30 AM - 10:30 PM",
      saturday: "6:00 AM - 9:00 PM",
      sunday: "7:00 AM - 7:00 PM"
    },
    pricing: {
      weekly: 40,
      monthly: 119,
      quarterly: 299,
      halfYearly: 549,
      yearly: 949
    },
    amenities: ["Locker Rooms", "Showers", "Swimming Pool", "Hot Tub", "Towel Service", "Valet Parking", "Smoothie Bar", "Childcare"],
    features: ["Personal Training", "Yoga Classes", "Spin Classes", "CrossFit", "Pilates", "Boxing"],
    trainers: 18,
    equipment: 200,
    sqft: 35000,
    established: 2012,
    photos: [
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80",
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80",
      "https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=800&q=80",
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&q=80"
    ],
    featured: true
  },
  {
    id: "3",
    name: "PowerHouse Gym",
    slug: "powerhouse-gym",
    tagline: "Unleash Your Inner Strength",
    description: "PowerHouse Gym is the ultimate destination for those who take their fitness seriously. With a focus on strength training and functional fitness, we provide an intense workout environment that pushes you to your limits. Our no-nonsense approach and hardcore atmosphere attract dedicated athletes from across the region.",
    address: "789 Strength Lane",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    coordinates: { lat: 40.7128, lng: -74.006 },
    radius: 3,
    phone: "(212) 555-0303",
    email: "contact@powerhousegym.com",
    website: "www.powerhousegym.com",
    rating: 4.7,
    totalReviews: 428,
    operatingHours: {
      weekdays: "24 Hours",
      saturday: "24 Hours",
      sunday: "24 Hours"
    },
    pricing: {
      weekly: 30,
      monthly: 89,
      quarterly: 229,
      halfYearly: 399,
      yearly: 699
    },
    amenities: ["Locker Rooms", "Showers", "Sauna", "Towel Service", "Parking", "Supplement Store"],
    features: ["Personal Training", "Powerlifting", "Strongman Training", "Competition Prep", "24/7 Access"],
    trainers: 8,
    equipment: 180,
    sqft: 20000,
    established: 2008,
    photos: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800&q=80",
      "https://images.unsplash.com/photo-1533681904393-9ab6eee7e408?w=800&q=80",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80"
    ],
    featured: false
  },
  {
    id: "4",
    name: "Zen Fitness Studio",
    slug: "zen-fitness-studio",
    tagline: "Balance Body & Mind",
    description: "Zen Fitness Studio combines traditional fitness training with mindfulness practices to create a holistic wellness experience. Our beautiful, serene environment is designed to help you find peace while building strength. We specialize in yoga, pilates, meditation, and low-impact training for all fitness levels.",
    address: "321 Tranquil Road",
    city: "Seattle",
    state: "WA",
    zipCode: "98101",
    coordinates: { lat: 47.6062, lng: -122.3321 },
    radius: 6,
    phone: "(206) 555-0404",
    email: "namaste@zenfitnessstudio.com",
    website: "www.zenfitnessstudio.com",
    rating: 4.9,
    totalReviews: 189,
    operatingHours: {
      weekdays: "6:00 AM - 9:00 PM",
      saturday: "7:00 AM - 7:00 PM",
      sunday: "8:00 AM - 6:00 PM"
    },
    pricing: {
      weekly: 45,
      monthly: 129,
      quarterly: 329,
      halfYearly: 599,
      yearly: 1049
    },
    amenities: ["Locker Rooms", "Showers", "Meditation Room", "Herbal Tea Bar", "Towel Service", "Parking", "Aromatherapy"],
    features: ["Yoga Classes", "Pilates", "Meditation", "Breathwork", "Sound Healing", "Wellness Coaching"],
    trainers: 10,
    equipment: 80,
    sqft: 12000,
    established: 2018,
    photos: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80"
    ],
    featured: true
  },
  {
    id: "5",
    name: "Metro Athletic Club",
    slug: "metro-athletic-club",
    tagline: "Your Urban Fitness Destination",
    description: "Metro Athletic Club brings premium fitness to the heart of the city. Our modern facility features top-tier equipment, diverse class offerings, and amenities designed for the busy urban professional. Whether you're squeezing in a lunch workout or training for a marathon, we've got you covered.",
    address: "555 Downtown Boulevard",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    coordinates: { lat: 41.8781, lng: -87.6298 },
    radius: 4,
    phone: "(312) 555-0505",
    email: "info@metroathleticclub.com",
    website: "www.metroathleticclub.com",
    rating: 4.5,
    totalReviews: 312,
    operatingHours: {
      weekdays: "5:00 AM - 11:00 PM",
      saturday: "6:00 AM - 10:00 PM",
      sunday: "6:00 AM - 9:00 PM"
    },
    pricing: {
      weekly: 38,
      monthly: 109,
      quarterly: 279,
      halfYearly: 499,
      yearly: 879
    },
    amenities: ["Locker Rooms", "Showers", "Basketball Court", "Racquetball", "Towel Service", "Cafe", "Business Center", "Childcare"],
    features: ["Personal Training", "Group Fitness", "Swimming", "Tennis", "Basketball", "Corporate Memberships"],
    trainers: 15,
    equipment: 175,
    sqft: 40000,
    established: 2010,
    photos: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1571388208497-71bedc66e932?w=800&q=80",
      "https://images.unsplash.com/photo-1562771379-eafdca7a02f8?w=800&q=80",
      "https://images.unsplash.com/photo-1591027581407-bcc3e0f6a5f7?w=800&q=80"
    ],
    featured: false
  },
  {
    id: "6",
    name: "CrossFit Revolution",
    slug: "crossfit-revolution",
    tagline: "Forge Elite Fitness",
    description: "CrossFit Revolution is dedicated to building the fittest athletes through constantly varied, high-intensity functional movements. Our experienced coaches will guide you through challenging workouts in a supportive community environment. Join our tribe and discover what you're truly capable of.",
    address: "888 WOD Street",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    coordinates: { lat: 30.2672, lng: -97.7431 },
    radius: 7,
    phone: "(512) 555-0606",
    email: "box@crossfitrevolution.com",
    website: "www.crossfitrevolution.com",
    rating: 4.8,
    totalReviews: 267,
    operatingHours: {
      weekdays: "5:00 AM - 9:00 PM",
      saturday: "7:00 AM - 12:00 PM",
      sunday: "9:00 AM - 12:00 PM"
    },
    pricing: {
      weekly: 50,
      monthly: 149,
      quarterly: 399,
      halfYearly: 699,
      yearly: 1199
    },
    amenities: ["Locker Rooms", "Showers", "Outdoor Training Area", "Parking", "Recovery Room"],
    features: ["CrossFit Classes", "Olympic Lifting", "Gymnastics", "Endurance Training", "Competition Team", "Nutrition Coaching"],
    trainers: 6,
    equipment: 120,
    sqft: 15000,
    established: 2014,
    photos: [
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80",
      "https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?w=800&q=80",
      "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&q=80"
    ],
    featured: true
  }
];

export function getGymBySlug(slug: string): Gym | undefined {
  return gyms.find(gym => gym.slug === slug);
}

export function getFeaturedGyms(): Gym[] {
  return gyms.filter(gym => gym.featured);
}
