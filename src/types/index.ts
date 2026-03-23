// ═══════════════════════════════════════════════
// SMARTPLAY — Application Types
// ═══════════════════════════════════════════════

export type UserRole = 'athlete' | 'coach' | 'parent' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
  onboardingComplete: boolean
  subscription?: Subscription
}

export interface Subscription {
  status: 'trialing' | 'active' | 'past_due' | 'canceled'
  plan: 'player' | 'coach' | 'program'
  trialEnd?: string
  currentPeriodEnd?: string
}

export interface AthleteProfile {
  userId: string
  dateOfBirth: string
  position: string
  club: string
  city: string
  state: string
  bio: string
  height?: string
  weight?: string
  preferredFoot: 'left' | 'right' | 'both'
  jerseyNumber?: number
  graduationYear?: number
  gpa?: number
  highlights?: string[]
}

export interface TrainingSession {
  id: string
  userId: string
  date: string
  type: 'team_practice' | 'individual' | 'match' | 'fitness' | 'recovery'
  duration: number // minutes
  intensity: 1 | 2 | 3 | 4 | 5
  rpe: number // 1-10
  trainingLoad: number // duration * rpe
  notes?: string
  drills?: string[]
  coachId?: string
  createdAt: string
}

export interface WellnessEntry {
  id: string
  userId: string
  date: string
  sleep: number // hours
  sleepQuality: 1 | 2 | 3 | 4 | 5
  mood: 1 | 2 | 3 | 4 | 5
  energy: 1 | 2 | 3 | 4 | 5
  soreness: 1 | 2 | 3 | 4 | 5
  stress: 1 | 2 | 3 | 4 | 5
  hydration: number // liters
  readinessScore: number // computed 0-100
  notes?: string
}

export interface NutritionEntry {
  id: string
  userId: string
  date: string
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_training' | 'post_training'
  description: string
  calories?: number
  protein?: number
  carbs?: number
  fats?: number
  budgetFriendly: boolean
}

export interface Goal {
  id: string
  userId: string
  title: string
  description?: string
  category: 'technical' | 'physical' | 'tactical' | 'mental' | 'nutrition' | 'academic'
  targetDate?: string
  progress: number // 0-100
  status: 'active' | 'completed' | 'paused'
  milestones?: Milestone[]
  createdAt: string
}

export interface Milestone {
  id: string
  title: string
  completed: boolean
  completedAt?: string
}

export interface VideoClip {
  id: string
  userId: string
  title: string
  url: string
  thumbnailUrl?: string
  duration: number
  tags: string[]
  notes?: string
  coachFeedback?: string
  aiAnalysis?: string
  createdAt: string
}

export interface JournalEntry {
  id: string
  userId: string
  date: string
  prompt?: string
  content: string
  mood: 'great' | 'good' | 'okay' | 'tough' | 'struggling'
  tags: string[]
}

export interface CalendarEvent {
  id: string
  userId: string
  title: string
  type: 'practice' | 'match' | 'training' | 'meeting' | 'deadline' | 'rest'
  date: string
  startTime?: string
  endTime?: string
  location?: string
  notes?: string
  recurring?: boolean
}

export interface CoachTeam {
  id: string
  coachId: string
  name: string
  ageGroup: string
  athletes: string[] // user IDs
  season: string
}

export interface Announcement {
  id: string
  teamId: string
  coachId: string
  title: string
  content: string
  priority: 'normal' | 'important' | 'urgent'
  createdAt: string
}

export interface TrainingPlan {
  id: string
  coachId: string
  teamId?: string
  athleteId?: string
  title: string
  description?: string
  startDate: string
  endDate: string
  sessions: PlannedSession[]
}

export interface PlannedSession {
  id: string
  dayOfWeek: number // 0-6
  type: TrainingSession['type']
  focus: string
  drills: Drill[]
  duration: number
  intensity: 1 | 2 | 3 | 4 | 5
}

export interface Drill {
  id: string
  name: string
  description: string
  duration: number
  equipment: string[]
  category: 'technical' | 'tactical' | 'physical' | 'mental'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

// Dashboard widget types
export interface ReadinessData {
  score: number
  sleep: number
  mood: number
  energy: number
  soreness: number
  trend: 'up' | 'down' | 'stable'
}

export interface TrainingLoadData {
  date: string
  acute: number
  chronic: number
  ratio: number
}

export interface WeeklyStats {
  sessionsCompleted: number
  totalMinutes: number
  avgIntensity: number
  avgReadiness: number
  goalsProgress: number
  streak: number
}

// Navigation
export interface NavItem {
  label: string
  href: string
  icon?: string
  badge?: string | number
  children?: NavItem[]
}

// FAQ
export interface FAQItem {
  question: string
  answer: string
  category?: string
}

// Testimonial
export interface Testimonial {
  id: string
  name: string
  role: string
  club?: string
  quote: string
  avatar?: string
  rating?: number
}

// Pricing
export interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
  badge?: string
}
