
import type { Express } from "express";
import type { Server } from "http";
import { createClient } from "@supabase/supabase-js";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { insertProfileSchema, updateProfileSchema } from "@shared/schema";
import { z } from "zod";

async function getUserFromRequest(req: any): Promise<{ id: string; email: string } | null> {
  const token = req.headers.authorization?.slice(7);
  if (!token) return null;
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ? { id: user.id, email: user.email! } : null;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.waitlist.create.path, async (req, res) => {
    try {
      const input = api.waitlist.create.input.parse(req.body);

      const existing = await storage.getWaitlistEntryByEmail(input.email);
      if (existing) {
        return res.status(409).json({ message: "This email is already on the waitlist." });
      }

      const entry = await storage.createWaitlistEntry(input);
      res.status(201).json(entry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // GET /api/profile
  app.get(api.profile.get.path, async (req, res) => {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const profile = await storage.getProfileByUserId(user.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    return res.json(profile);
  });

  // PUT /api/profile — full upsert after onboarding
  app.put(api.profile.upsert.path, async (req, res) => {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    try {
      const input = insertProfileSchema.parse(req.body);
      const profile = await storage.upsertProfile(user.id, user.email, input);
      return res.status(201).json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // PATCH /api/profile — progressive profiling updates
  app.patch(api.profile.update.path, async (req, res) => {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    try {
      const patch = updateProfileSchema.parse(req.body);
      const profile = await storage.patchProfile(user.id, patch);
      return res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  return httpServer;
}
