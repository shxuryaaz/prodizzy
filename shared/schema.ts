
import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === WAITLIST ===
export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: varchar("role", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWaitlistSchema = createInsertSchema(waitlistEntries).omit({
  id: true,
  createdAt: true
}).extend({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["Founder", "Student", "Operator", "Freelancer", "Investor", "Agency", "Other"]),
});

export type WaitlistEntry = typeof waitlistEntries.$inferSelect;
export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;
export type CreateWaitlistRequest = InsertWaitlistEntry;
export type WaitlistResponse = WaitlistEntry;

// =============================================
// STARTUP PROFILE
// =============================================

export const insertProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  job_title: z.string().min(1, "Job title is required"),
  company_name: z.string().min(1, "Company name is required"),
  company_description: z.string().min(1, "Description required").max(130, "Keep it under 130 characters"),
  industry: z.enum(["FinTech", "HealthTech", "AI/ML", "SaaS B2B", "Consumer", "Marketplace", "DeepTech", "Other"]),
  stage: z.enum(["Idea", "Pre-Product", "Pre-Revenue", "Early Revenue", "Scaling"]),
  business_model: z.enum(["B2B", "B2C", "Marketplace", "SaaS", "D2C", "Other"]),
  target_customer: z.string().min(1, "Required"),
  primary_problem: z.string().min(1, "Required"),
  goals: z.array(z.enum(["Investors", "Customers", "Co-founders", "Partners", "Enterprise Clients", "Mentors", "Talent"])).min(1, "Select at least one goal"),
  specific_ask: z.string().default(""),
  location: z.string().min(1, "Location required"),
  traction_range: z.enum(["0", "<100", "100-1k", "1k-10k", "10k+"]).optional(),
  revenue_status: z.enum(["Pre-revenue", "Early revenue", "Scaling revenue"]).optional(),
  fundraising_status: z.enum(["Not raising", "Planning", "Actively raising", "Closed recently"]).optional(),
  capital_use: z.array(z.string()).default([]),
});

export const updateProfileSchema = z.object({
  team_size: z.string().optional(),
  missing_roles: z.array(z.string()).optional(),
  hiring_urgency: z.string().optional(),
  partnership_why: z.array(z.string()).optional(),
  ideal_partner_type: z.string().optional(),
  partnership_maturity: z.string().optional(),
  round_type: z.string().optional(),
  investor_warmth: z.array(z.string()).optional(),
  geography: z.string().optional(),
  speed_preference: z.string().optional(),
  risk_appetite: z.string().optional(),
  existing_backers: z.string().optional(),
  notable_customers: z.string().optional(),
  deck_link: z.string().optional(),
  website: z.string().optional(),
  linkedin_url: z.string().optional(),
}).partial();

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export type StartupProfile = InsertProfile & {
  id: string;
  user_id: string;
  email: string;
  approved: boolean;
  onboarding_completed: boolean;
  created_at: string;
  team_size?: string | null;
  missing_roles?: string[] | null;
  hiring_urgency?: string | null;
  partnership_why?: string[] | null;
  ideal_partner_type?: string | null;
  partnership_maturity?: string | null;
  round_type?: string | null;
  investor_warmth?: string[] | null;
  geography?: string | null;
  speed_preference?: string | null;
  risk_appetite?: string | null;
  existing_backers?: string | null;
  notable_customers?: string | null;
  deck_link?: string | null;
  website?: string | null;
  linkedin_url?: string | null;
};

// Sanitized version shown to investors (no contact vectors)
export type PublicStartupProfile = Omit<StartupProfile, "email" | "name" | "linkedin_url" | "deck_link" | "website"> & {
  founder_label: string;
};

// =============================================
// INVESTOR PROFILE
// =============================================

export const insertInvestorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  firm_name: z.string().optional(),
  investor_type: z.enum(["VC", "Angel", "Family Office", "Strategic", "Other"]),
  check_size: z.enum(["<$50k", "$50k-$250k", "$250k-$1M", "$1M-$5M", "$5M+"]),
  sectors: z.array(z.string()).min(1, "Select at least one sector"),
  stages: z.array(z.string()).min(1, "Select at least one stage"),
  geography: z.string().default(""),
  thesis: z.string().optional(),
});

export type InsertInvestor = z.infer<typeof insertInvestorSchema>;

export type InvestorProfile = InsertInvestor & {
  id: string;
  user_id: string;
  email: string;
  onboarding_completed: boolean;
  created_at: string;
};

// =============================================
// CONNECTION REQUESTS
// =============================================

export const insertConnectionSchema = z.object({
  startup_id: z.string().uuid(),
  message: z.string().optional(),
});

export type InsertConnection = z.infer<typeof insertConnectionSchema>;

export type ConnectionRequest = {
  id: string;
  startup_id: string;
  investor_id: string;
  message: string | null;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  // joined fields
  investor?: Pick<InvestorProfile, "name" | "firm_name" | "investor_type" | "check_size">;
  startup?: Pick<StartupProfile, "company_name" | "industry" | "stage">;
};
