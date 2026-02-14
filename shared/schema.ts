
import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: varchar("role", { length: 50 }).notNull(), // Founder, Student, Operator, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertWaitlistSchema = createInsertSchema(waitlistEntries).omit({ 
  id: true, 
  createdAt: true 
}).extend({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["Founder", "Student", "Operator", "Freelancer", "Investor", "Agency", "Other"]),
});

// === EXPLICIT API CONTRACT TYPES ===
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;
export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;

// Request/Response types
export type CreateWaitlistRequest = InsertWaitlistEntry;
export type WaitlistResponse = WaitlistEntry;
