export interface User {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  country?: string;
  lifestylePreference?: 'Vegan' | 'Vegetarian' | 'Mixed' | 'Non-Veg';
  carbonScore?: number;
  createdAt: string;
  updatedAt: string;
}

export type ActivityCategory = 'transportation' | 'electricity' | 'food' | 'shopping' | 'waste';

export interface ActivityDetails {
  // transportation
  transportType?: 'car' | 'bike' | 'train' | 'bus' | 'flight';
  distanceKm?: number;
  fuelType?: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  // electricity
  kwh?: number;
  // food
  dietType?: 'Vegan' | 'Vegetarian' | 'Mixed' | 'Non-Veg';
  mealsCount?: number;
  // shopping
  electronicsCount?: number;
  fashionCount?: number;
  miscItemsCount?: number;
  // waste
  wasteWeightKg?: number;
  recyclePercent?: number;
}

export interface Activity {
  id: string;
  userId: string;
  category: ActivityCategory;
  emissionsKg: number;
  date: string; // YYYY-MM-DD
  details: ActivityDetails;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  targetReduction: number; // in kg CO2
  currentProgress: number; // in kg CO2 saved
  period: 'weekly' | 'monthly' | 'yearly';
  category: string;
  completed: boolean;
  createdAt: string;
  deadline: string; // YYYY-MM-DD
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  duration: string;
  participantsCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  status: 'joined' | 'completed';
  progress: number; // percentage or numerical
  joinedAt: string;
  completedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  emissionsBreakdown: {
    transportation: number;
    electricity: number;
    food: number;
    shopping: number;
    waste: number;
  };
  totalEmissions: number;
  recommendations: string[];
  trends: string;
}

export interface ChatHistory {
  id: string;
  userId: string;
  role: 'user' | 'model';
  message: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  totalCarbonSaved: number;
  points: number;
  updatedAt: string;
}
