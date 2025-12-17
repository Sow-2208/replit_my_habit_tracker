import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHabitSchema, insertMotivationSchema, insertReflectionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === HABITS ===
  app.get("/api/habits", async (_req, res) => {
    try {
      const habits = await storage.getHabits();
      const completions = await storage.getAllCompletions();
      
      const habitsWithCompletions = habits.map(habit => ({
        ...habit,
        completedDates: completions
          .filter(c => c.habitId === habit.id)
          .map(c => c.completedDate)
      }));
      
      res.json(habitsWithCompletions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch habits" });
    }
  });

  app.post("/api/habits", async (req, res) => {
    try {
      const data = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit(data);
      res.status(201).json({ ...habit, completedDates: [] });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create habit" });
      }
    }
  });

  app.delete("/api/habits/:id", async (req, res) => {
    try {
      await storage.deleteHabit(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete habit" });
    }
  });

  // === COMPLETIONS ===
  app.post("/api/habits/:id/toggle", async (req, res) => {
    try {
      const { date } = req.body;
      const habitId = req.params.id;
      
      if (!date) {
        return res.status(400).json({ error: "Date is required" });
      }
      
      const completions = await storage.getCompletions(habitId);
      const existing = completions.find(c => c.completedDate === date);
      
      if (existing) {
        await storage.removeCompletion(habitId, date);
        res.json({ completed: false });
      } else {
        await storage.addCompletion({ habitId, completedDate: date });
        res.json({ completed: true });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to toggle completion" });
    }
  });

  // === MOTIVATIONS ===
  app.get("/api/motivations", async (_req, res) => {
    try {
      const motivations = await storage.getMotivations();
      res.json(motivations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch motivations" });
    }
  });

  app.post("/api/motivations", async (req, res) => {
    try {
      const data = insertMotivationSchema.parse(req.body);
      const motivation = await storage.addMotivation(data);
      res.status(201).json(motivation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to add motivation" });
      }
    }
  });

  // === REFLECTIONS ===
  app.get("/api/reflections/:month/:year", async (req, res) => {
    try {
      const month = parseInt(req.params.month);
      const year = parseInt(req.params.year);
      const reflection = await storage.getReflection(month, year);
      res.json(reflection || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reflection" });
    }
  });

  app.post("/api/reflections", async (req, res) => {
    try {
      const data = insertReflectionSchema.parse(req.body);
      const reflection = await storage.saveReflection(data);
      res.status(201).json(reflection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to save reflection" });
      }
    }
  });

  // Seed default motivations if empty
  app.post("/api/seed", async (_req, res) => {
    try {
      const existing = await storage.getMotivations();
      if (existing.length === 0) {
        const defaults = [
          { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", type: "quote" },
          { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock", type: "quote" },
          { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", type: "quote" },
          { text: "Small daily improvements are the key to staggering long-term results.", author: null, type: "quote" },
          { text: "I want to build a disciplined life.", author: null, type: "reason" },
        ];
        for (const m of defaults) {
          await storage.addMotivation(m);
        }
      }
      res.json({ seeded: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to seed" });
    }
  });

  return httpServer;
}
