import { db } from "./db";
import { complaints, type Complaint, type InsertComplaint } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getComplaints(): Promise<Complaint[]>;
  getComplaint(id: number): Promise<Complaint | undefined>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  resolveComplaint(id: number): Promise<Complaint | undefined>;
  upvoteComplaint(id: number): Promise<Complaint | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getComplaints(): Promise<Complaint[]> {
    return await db.select().from(complaints);
  }

  async getComplaint(id: number): Promise<Complaint | undefined> {
    const [complaint] = await db.select().from(complaints).where(eq(complaints.id, id));
    return complaint;
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const [complaint] = await db.insert(complaints).values(insertComplaint).returning();
    return complaint;
  }

  async resolveComplaint(id: number): Promise<Complaint | undefined> {
    const [complaint] = await db
      .update(complaints)
      .set({ status: 'resolved' })
      .where(eq(complaints.id, id))
      .returning();
    return complaint;
  }

  async upvoteComplaint(id: number): Promise<Complaint | undefined> {
    const existing = await this.getComplaint(id);
    if (!existing) return undefined;
    const [complaint] = await db
      .update(complaints)
      .set({ votes: existing.votes + 1 })
      .where(eq(complaints.id, id))
      .returning();
    return complaint;
  }
}

export const storage = new DatabaseStorage();