import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  votes: integer("votes").default(0).notNull(),
  status: text("status").default('pending').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({ 
  id: true, 
  createdAt: true,
  votes: true,
  status: true 
});

export type Complaint = typeof complaints.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;

export type CreateComplaintRequest = InsertComplaint;
export type UpdateComplaintRequest = Partial<InsertComplaint>;

export type ComplaintResponse = Complaint;
export type ComplaintsListResponse = Complaint[];
