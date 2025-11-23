import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Projects table for bridge designs
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  district: text("district"),
  engineer: text("engineer"),
  // Store all engineering parameters as JSON
  designData: jsonb("design_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Design data structure - Submersible Skew Bridge
export const DesignDataSchema = z.object({
  // Geometry
  span: z.number().optional(),
  width: z.number().optional(),
  supportWidth: z.number().optional(),
  depth: z.number().optional(),
  cover: z.number().optional(),
  
  // Materials
  fck: z.number().optional(),
  fy: z.number().optional(),
  wearingCoat: z.number().optional(),
  loadClass: z.string().optional(),
  
  // Hydraulics
  discharge: z.number().optional(),
  floodLevel: z.number().optional(),
  crossSectionalArea: z.number().optional(),
  velocity: z.number().optional(),
  afflux: z.number().optional(),
  
  // Pier Design
  pierWidth: z.number().optional(),
  numberOfPiers: z.number().optional(),
  pierDepth: z.number().optional(),
  
  // Abutment Design
  abutmentHeight: z.number().optional(),
  abutmentWidth: z.number().optional(),
  
  // Stability
  stabilityFOS: z.number().optional(),
  baseWidth: z.number().optional(),
  
  // Full design data structure
  input: z.any().optional(),
  output: z.any().optional(),
  
  // Additional notes
  designType: z.string().optional().default("Submersible Skew Bridge"),
  location: z.string().optional(),
});

export const insertProjectSchema = createInsertSchema(projects, {
  designData: DesignDataSchema,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type DesignData = z.infer<typeof DesignDataSchema>;
