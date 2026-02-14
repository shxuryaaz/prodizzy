
import { db } from "./db";
import {
  waitlistEntries,
  type InsertWaitlistEntry,
  type WaitlistResponse
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistResponse>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistResponse | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistResponse> {
    const [created] = await db.insert(waitlistEntries).values(entry).returning();
    return created;
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistResponse | undefined> {
    const [entry] = await db.select().from(waitlistEntries).where(eq(waitlistEntries.email, email));
    return entry;
  }
}

export const storage = new DatabaseStorage();
