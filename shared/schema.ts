import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  decimal,
  boolean,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["site_owner", "investor", "admin"] }).notNull().default("investor"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Solar projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  location: varchar("location").notNull(),
  systemSize: integer("system_size").notNull(), // in kW
  totalFunding: decimal("total_funding", { precision: 10, scale: 2 }).notNull(),
  currentFunding: decimal("current_funding", { precision: 10, scale: 2 }).default("0"),
  expectedReturn: decimal("expected_return", { precision: 5, scale 2 }).notNull(), // APR percentage
  minInvestment: decimal("min_investment", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { 
    enum: ["pending", "approved", "funding", "active", "completed", "cancelled"] 
  }).notNull().default("pending"),
  siteOwnerId: varchar("site_owner_id").notNull(),
  monthlyElectricityBill: decimal("monthly_electricity_bill", { precision: 8, scale: 2 }),
  roofDetails: text("roof_details"),
  energyNeeds: text("energy_needs"),
  installationDate: timestamp("installation_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Investments table
export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  investorId: varchar("investor_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  lockInPeriod: integer("lock_in_period").notNull(), // in years
  expectedReturn: decimal("expected_return", { precision: 5, scale: 2 }).notNull(),
  status: varchar("status", { 
    enum: ["pending", "active", "completed", "cancelled"] 
  }).notNull().default("pending"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Investment returns/payouts table
export const payouts = pgTable("payouts", {
  id: serial("id").primaryKey(),
  investmentId: integer("investment_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  payoutDate: timestamp("payout_date").notNull(),
  status: varchar("status", { enum: ["pending", "completed", "failed"] }).notNull().default("pending"),
  transactionId: varchar("transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type", { 
    enum: ["investment", "payout", "project_update", "system"] 
  }).notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  investments: many(investments),
  notifications: many(notifications),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  siteOwner: one(users, {
    fields: [projects.siteOwnerId],
    references: [users.id],
  }),
  investments: many(investments),
}));

export const investmentsRelations = relations(investments, ({ one, many }) => ({
  project: one(projects, {
    fields: [investments.projectId],
    references: [projects.id],
  }),
  investor: one(users, {
    fields: [investments.investorId],
    references: [users.id],
  }),
  payouts: many(payouts),
}));

export const payoutsRelations = relations(payouts, ({ one }) => ({
  investment: one(investments, {
    fields: [payouts.investmentId],
    references: [investments.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, updatedAt: true });
export const insertInvestmentSchema = createInsertSchema(investments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPayoutSchema = createInsertSchema(payouts).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertPayout = z.infer<typeof insertPayoutSchema>;
export type Payout = typeof payouts.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Extended types for API responses
export type ProjectWithInvestments = Project & {
  investments: Investment[];
  siteOwner: User;
};

export type InvestmentWithProject = Investment & {
  project: Project;
};
