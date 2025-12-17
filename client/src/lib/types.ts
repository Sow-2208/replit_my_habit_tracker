export type Habit = {
  id: string;
  name: string;
  category: "health" | "study" | "mindfulness" | "creative" | "other";
  completedDates: string[]; // ISO date strings YYYY-MM-DD
  streak: number;
  longestStreak: number;
  color?: string;
};

export type UserGoal = {
  id: string;
  title: string;
  targetDate?: string;
  completed: boolean;
};

export type Motivation = {
  id: string;
  text: string;
  author?: string;
  type: "quote" | "reason";
};

export const DEFAULT_HABITS: Habit[] = [
  {
    id: "1",
    name: "Wake up by 7:00 AM",
    category: "health",
    completedDates: [],
    streak: 0,
    longestStreak: 0,
    color: "hsl(142 70% 45%)"
  },
  {
    id: "2",
    name: "Study for 2 hours",
    category: "study",
    completedDates: [],
    streak: 0,
    longestStreak: 0,
    color: "hsl(199 89% 48%)"
  },
  {
    id: "3",
    name: "Read 10 pages",
    category: "mindfulness",
    completedDates: [],
    streak: 0,
    longestStreak: 0,
    color: "hsl(32 95% 44%)"
  },
  {
    id: "4",
    name: "No social media before noon",
    category: "mindfulness",
    completedDates: [],
    streak: 0,
    longestStreak: 0,
    color: "hsl(262 83% 58%)"
  }
];

export const MOTIVATIONAL_QUOTES: Motivation[] = [
  { id: "1", text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", type: "quote" },
  { id: "2", text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock", type: "quote" },
  { id: "3", text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", type: "quote" },
  { id: "4", text: "I want to build a disciplined life.", type: "reason" },
  { id: "5", text: "Consistency is the key to mastery.", type: "reason" },
];
