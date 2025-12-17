import { 
  habits, habitCompletions, motivations, reflections,
  type Habit, type InsertHabit, 
  type HabitCompletion, type InsertHabitCompletion,
  type Motivation, type InsertMotivation,
  type Reflection, type InsertReflection
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getHabits(): Promise<Habit[]>;
  getHabit(id: string): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  deleteHabit(id: string): Promise<void>;
  updateHabitStreak(id: string, streak: number, longestStreak: number): Promise<void>;
  
  getCompletions(habitId: string): Promise<HabitCompletion[]>;
  getAllCompletions(): Promise<HabitCompletion[]>;
  addCompletion(completion: InsertHabitCompletion): Promise<HabitCompletion>;
  removeCompletion(habitId: string, date: string): Promise<void>;
  
  getMotivations(): Promise<Motivation[]>;
  addMotivation(motivation: InsertMotivation): Promise<Motivation>;
  
  getReflection(month: number, year: number): Promise<Reflection | undefined>;
  saveReflection(reflection: InsertReflection): Promise<Reflection>;
}

export class DatabaseStorage implements IStorage {
  async getHabits(): Promise<Habit[]> {
    return await db.select().from(habits);
  }

  async getHabit(id: string): Promise<Habit | undefined> {
    const [habit] = await db.select().from(habits).where(eq(habits.id, id));
    return habit || undefined;
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const [habit] = await db.insert(habits).values(insertHabit).returning();
    return habit;
  }

  async deleteHabit(id: string): Promise<void> {
    await db.delete(habits).where(eq(habits.id, id));
  }

  async updateHabitStreak(id: string, streak: number, longestStreak: number): Promise<void> {
    await db.update(habits)
      .set({ streak, longestStreak })
      .where(eq(habits.id, id));
  }

  async getCompletions(habitId: string): Promise<HabitCompletion[]> {
    return await db.select().from(habitCompletions).where(eq(habitCompletions.habitId, habitId));
  }

  async getAllCompletions(): Promise<HabitCompletion[]> {
    return await db.select().from(habitCompletions);
  }

  async addCompletion(completion: InsertHabitCompletion): Promise<HabitCompletion> {
    const [result] = await db.insert(habitCompletions).values(completion).returning();
    return result;
  }

  async removeCompletion(habitId: string, date: string): Promise<void> {
    await db.delete(habitCompletions).where(
      and(
        eq(habitCompletions.habitId, habitId),
        eq(habitCompletions.completedDate, date)
      )
    );
  }

  async getMotivations(): Promise<Motivation[]> {
    return await db.select().from(motivations);
  }

  async addMotivation(motivation: InsertMotivation): Promise<Motivation> {
    const [result] = await db.insert(motivations).values(motivation).returning();
    return result;
  }

  async getReflection(month: number, year: number): Promise<Reflection | undefined> {
    const [reflection] = await db.select().from(reflections).where(
      and(eq(reflections.month, month), eq(reflections.year, year))
    );
    return reflection || undefined;
  }

  async saveReflection(insertReflection: InsertReflection): Promise<Reflection> {
    const existing = await this.getReflection(insertReflection.month, insertReflection.year);
    if (existing) {
      const [updated] = await db.update(reflections)
        .set({ content: insertReflection.content })
        .where(eq(reflections.id, existing.id))
        .returning();
      return updated;
    }
    const [result] = await db.insert(reflections).values(insertReflection).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
