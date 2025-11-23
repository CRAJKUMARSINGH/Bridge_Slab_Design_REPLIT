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

// Design data structure matching the workbook state
export const DesignDataSchema = z.object({
  span: z.number(),
  width: z.number(),
  supportWidth: z.number(),
  wearingCoat: z.number(),
  fck: z.number(),
  fy: z.number(),
  loadClass: z.string(),
  depth: z.number(),
  cover: z.number(),
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
