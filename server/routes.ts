import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.complaints.list.path, async (req, res) => {
    const allComplaints = await storage.getComplaints();
    res.json(allComplaints);
  });

  app.post(api.complaints.create.path, async (req, res) => {
    try {
      const input = api.complaints.create.input.parse(req.body);
      const complaint = await storage.createComplaint(input);
      res.status(201).json(complaint);
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

  app.patch(api.complaints.resolve.path, async (req, res) => {
    const id = Number(req.params.id);
    const updated = await storage.resolveComplaint(id);
    if (!updated) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(updated);
  });

  // Call seedDatabase once
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  try {
    const existingComplaints = await storage.getComplaints();
    if (existingComplaints.length === 0) {
      await storage.createComplaint({
        title: "Wi-Fi in Library is too slow",
        description: "The connection drops constantly in the main reading room.",
        category: "Infrastructure"
      });
      await storage.createComplaint({
        title: "Late grading for CS101",
        description: "We haven't received grades for assignments submitted 3 weeks ago.",
        category: "Academics"
      });
      await storage.createComplaint({
        title: "Cafeteria hours too short",
        description: "Please extend cafeteria hours till 10 PM during exam weeks.",
        category: "Facilities"
      });
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}