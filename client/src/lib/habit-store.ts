import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, subDays } from "date-fns";

export type HabitWithCompletions = {
  id: string;
  name: string;
  category: string;
  color: string | null;
  streak: number;
  longestStreak: number;
  completedDates: string[];
};

export type Motivation = {
  id: string;
  text: string;
  author: string | null;
  type: string;
};

async function fetchHabits(): Promise<HabitWithCompletions[]> {
  const res = await fetch("/api/habits");
  if (!res.ok) throw new Error("Failed to fetch habits");
  return res.json();
}

async function fetchMotivations(): Promise<Motivation[]> {
  const res = await fetch("/api/motivations");
  if (!res.ok) throw new Error("Failed to fetch motivations");
  return res.json();
}

async function createHabit(data: { name: string; category: string; color?: string }) {
  const res = await fetch("/api/habits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create habit");
  return res.json();
}

async function deleteHabit(id: string) {
  const res = await fetch(`/api/habits/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete habit");
}

async function toggleCompletion(habitId: string, date: string) {
  const res = await fetch(`/api/habits/${habitId}/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date }),
  });
  if (!res.ok) throw new Error("Failed to toggle completion");
  return res.json();
}

async function seedMotivations() {
  await fetch("/api/seed", { method: "POST" });
}

export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: fetchHabits,
  });
}

export function useMotivations() {
  const query = useQuery({
    queryKey: ["motivations"],
    queryFn: async () => {
      await seedMotivations();
      return fetchMotivations();
    },
  });
  return query;
}

export function useAddHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useToggleHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ habitId, date }: { habitId: string; date: string }) => 
      toggleCompletion(habitId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}
