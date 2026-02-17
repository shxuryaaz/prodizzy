
import { supabase } from "./db";
import type { InsertWaitlistEntry, WaitlistResponse } from "@shared/schema";

export interface IStorage {
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistResponse>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistResponse | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistResponse> {
    const { data, error } = await supabase
      .from("waitlist_entries")
      .insert({ name: entry.name, email: entry.email, role: entry.role })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { ...data, createdAt: data.created_at } as WaitlistResponse;
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistResponse | undefined> {
    const { data, error } = await supabase
      .from("waitlist_entries")
      .select()
      .eq("email", email)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return undefined;
    return { ...data, createdAt: data.created_at } as WaitlistResponse;
  }
}

export const storage = new DatabaseStorage();
