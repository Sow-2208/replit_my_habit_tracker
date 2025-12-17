import { useState, useEffect } from "react";
import { Habit, Motivation, DEFAULT_HABITS, MOTIVATIONAL_QUOTES } from "./types";
import { format, subDays, isSameDay, parseISO } from "date-fns";

export function useHabitStore() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem("focusflow_habits");
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  const [motivations, setMotivations] = useState<Motivation[]>(() => {
    const saved = localStorage.getItem("focusflow_motivation");
    return saved ? JSON.parse(saved) : MOTIVATIONAL_QUOTES;
  });

  useEffect(() => {
    localStorage.setItem("focusflow_habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("focusflow_motivation", JSON.stringify(motivations));
  }, [motivations]);

  const toggleHabit = (habitId: string, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;

      const isCompleted = habit.completedDates.includes(dateStr);
      let newCompletedDates;
      
      if (isCompleted) {
        newCompletedDates = habit.completedDates.filter(d => d !== dateStr);
      } else {
        newCompletedDates = [...habit.completedDates, dateStr];
      }

      // Recalculate streaks
      // Sort dates
      const sortedDates = [...newCompletedDates].sort();
      let currentStreak = 0;
      let maxStreak = 0;
      let tempStreak = 0;
      
      // Simple streak logic (consecutive days)
      // For a robust app we'd need more complex logic handling missed days vs non-scheduled days
      // Here we just count consecutive entries leading up to today/yesterday
      
      // Calculate current streak specifically
      const today = format(new Date(), "yyyy-MM-dd");
      const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
      
      if (newCompletedDates.includes(today)) {
        currentStreak = 1;
        let checkDate = subDays(new Date(), 1);
        while (newCompletedDates.includes(format(checkDate, "yyyy-MM-dd"))) {
          currentStreak++;
          checkDate = subDays(checkDate, 1);
        }
      } else if (newCompletedDates.includes(yesterday)) {
        currentStreak = 1; // You haven't done today yet, but streak is alive
        let checkDate = subDays(new Date(), 2);
        while (newCompletedDates.includes(format(checkDate, "yyyy-MM-dd"))) {
          currentStreak++;
          checkDate = subDays(checkDate, 1);
        }
      } else {
        currentStreak = 0;
      }

      // Calculate longest streak historically
      // This is O(N) simple pass
      // Convert strings to timestamps for easier math if needed, but here simple consecutive check
      // Assuming sortedDates is sorted ascending
      // Actually, let's just keep the existing longestStreak unless current exceeds it for simplicity in this prototype
      
      return {
        ...habit,
        completedDates: newCompletedDates,
        streak: currentStreak,
        longestStreak: Math.max(habit.longestStreak, currentStreak)
      };
    }));
  };

  const addHabit = (name: string, category: Habit['category']) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      category,
      completedDates: [],
      streak: 0,
      longestStreak: 0,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const addMotivation = (text: string, type: "quote" | "reason") => {
    const newMot: Motivation = {
      id: Date.now().toString(),
      text,
      type
    };
    setMotivations([...motivations, newMot]);
  };

  return {
    habits,
    motivations,
    toggleHabit,
    addHabit,
    deleteHabit,
    addMotivation
  };
}
