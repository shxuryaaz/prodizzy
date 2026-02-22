
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

// Intent-specific conditional schemas
export const intentValidationSchema = z.object({
  feedback_type: z.array(z.string()).optional(),
  target_audience: z.string().optional(),
  product_link: z.string().optional(),
  specific_questions: z.string().optional(),
  timeline: z.string().optional(),
  response_count: z.string().optional(),
}).optional();

export const intentHiringSchema = z.object({
  role: z.string().optional(),
  hiring_type: z.string().optional(),
  work_mode: z.string().optional(),
  budget_range: z.string().optional(),
  urgency: z.string().optional(),
  experience_level: z.string().optional(),
  key_skills: z.string().optional(),
}).optional();

export const intentPartnershipsSchema = z.object({
  requirement_type: z.array(z.string()).optional(),
  partner_description: z.string().optional(),
  goals: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
}).optional();

export const intentPromotionsSchema = z.object({
  promotion_type: z.array(z.string()).optional(),
  campaign_goal: z.string().optional(),
  target_audience: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  expected_outcome: z.string().optional(),
}).optional();

export const intentFundraisingSchema = z.object({
  capital_amount: z.string().optional(),
  fund_use: z.string().optional(),
  funding_type: z.string().optional(),
  annual_revenue: z.string().optional(),
  existing_loans: z.string().optional(),
  pitch_deck_link: z.string().optional(),
  investors_approached: z.string().optional(),
  investor_feedback: z.string().optional(),
  compliance_status: z.string().optional(),
  gst_filing_status: z.string().optional(),
  past_defaults: z.string().optional(),
  fundraising_reason: z.string().optional(),
  investor_types_sought: z.string().optional(),
  ticket_size: z.string().optional(),
  ready_for_engagement: z.string().optional(),
}).optional();

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
  // New fields
  phone: z.string().optional(),
  website: z.string().optional(),
  product_link: z.string().optional(),
  is_registered: z.boolean().optional(),
  product_description: z.string().optional(),
  num_users: z.string().optional(),
  monthly_revenue: z.string().optional(),
  traction_highlights: z.string().optional(),
  intents: z.array(z.string()).default([]),
  // Conditional intent data
  intent_validation: intentValidationSchema,
  intent_hiring: intentHiringSchema,
  intent_partnerships: intentPartnershipsSchema,
  intent_promotions: intentPromotionsSchema,
  intent_fundraising: intentFundraisingSchema,
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
  linkedin_url?: string | null;
  // New fields
  phone?: string | null;
  product_link?: string | null;
  is_registered?: boolean | null;
  product_description?: string | null;
  num_users?: string | null;
  monthly_revenue?: string | null;
  traction_highlights?: string | null;
  intents?: string[] | null;
  intent_validation?: z.infer<typeof intentValidationSchema> | null;
  intent_hiring?: z.infer<typeof intentHiringSchema> | null;
  intent_partnerships?: z.infer<typeof intentPartnershipsSchema> | null;
  intent_promotions?: z.infer<typeof intentPromotionsSchema> | null;
  intent_fundraising?: z.infer<typeof intentFundraisingSchema> | null;
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
// PARTNER PROFILE
// =============================================

export const insertPartnerSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  company_name: z.string().min(1, "Company name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(1, "Phone is required"),
  website: z.string().optional(),
  linkedin_url: z.string().optional(),
  partner_type: z.enum(["Agency", "Investor", "Service Provider", "Institutional Firm"]),
  services_offered: z.array(z.string()).default([]),
  industries_served: z.array(z.string()).default([]),
  stages_served: z.array(z.string()).default([]),
  pricing_model: z.string().optional(),
  average_deal_size: z.string().optional(),
  team_size: z.string().optional(),
  years_experience: z.string().optional(),
  tools_tech_stack: z.string().optional(),
  work_mode: z.string().optional(),
  portfolio_links: z.string().optional(),
  case_studies: z.string().optional(),
  past_clients: z.string().optional(),
  certifications: z.string().optional(),
  looking_for: z.array(z.string()).default([]),
  monthly_capacity: z.string().optional(),
  preferred_budget_range: z.string().optional(),
});

export type InsertPartner = z.infer<typeof insertPartnerSchema>;

export type PartnerProfile = InsertPartner & {
  id: string;
  user_id: string;
  approved: boolean;
  onboarding_completed: boolean;
  created_at: string;
};

// =============================================
// INDIVIDUAL PROFILE
// =============================================

export const insertIndividualSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(1, "Phone is required"),
  linkedin_url: z.string().optional(),
  portfolio_url: z.string().optional(),
  profile_type: z.enum(["Student", "Freelancer", "Professional", "Content Creator", "Community Admin"]),
  skills: z.array(z.string()).default([]),
  experience_level: z.string().optional(),
  tools_used: z.string().optional(),
  looking_for: z.array(z.string()).default([]),
  preferred_roles: z.string().optional(),
  preferred_industries: z.string().optional(),
  availability: z.string().optional(),
  work_mode: z.string().optional(),
  expected_pay: z.string().optional(),
  location: z.string().optional(),
  resume_url: z.string().optional(),
  projects: z.string().optional(),
  achievements: z.string().optional(),
  github_url: z.string().optional(),
});

export type InsertIndividual = z.infer<typeof insertIndividualSchema>;

export type IndividualProfile = InsertIndividual & {
  id: string;
  user_id: string;
  approved: boolean;
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
