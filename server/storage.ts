import {
  users,
  projects,
  investments,
  payouts,
  notifications,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Investment,
  type InsertInvestment,
  type ProjectWithInvestments,
  type InvestmentWithProject,
  type Payout,
  type InsertPayout,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<ProjectWithInvestments | undefined>;
  getProjects(filters?: { status?: string; location?: string; minInvestment?: number; maxInvestment?: number }): Promise<Project[]>;
  getProjectsByOwner(ownerId: string): Promise<Project[]>;
  updateProjectStatus(id: number, status: string): Promise<Project | undefined>;
  updateProjectFunding(id: number, amount: string): Promise<Project | undefined>;
  
  // Investment operations
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  getInvestment(id: number): Promise<InvestmentWithProject | undefined>;
  getInvestmentsByUser(userId: string): Promise<InvestmentWithProject[]>;
  getInvestmentsByProject(projectId: number): Promise<Investment[]>;
  updateInvestmentStatus(id: number, status: string): Promise<Investment | undefined>;
  
  // Payout operations
  createPayout(payout: InsertPayout): Promise<Payout>;
  getPayoutsByInvestment(investmentId: number): Promise<Payout[]>;
  getPayoutsByUser(userId: string): Promise<Payout[]>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  
  // Analytics operations
  getUserStats(userId: string, role: string): Promise<any>;
  getAdminStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Project operations
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async getProject(id: number): Promise<ProjectWithInvestments | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .leftJoin(users, eq(projects.siteOwnerId, users.id))
      .where(eq(projects.id, id));

    if (!project) return undefined;

    const projectInvestments = await db
      .select()
      .from(investments)
      .where(eq(investments.projectId, id));

    return {
      ...project.projects,
      siteOwner: project.users!,
      investments: projectInvestments,
    };
  }

  async getProjects(filters?: { status?: string; location?: string; minInvestment?: number; maxInvestment?: number }): Promise<Project[]> {
    let query = db.select().from(projects);
    
    if (filters) {
      const conditions = [];
      if (filters.status) conditions.push(eq(projects.status, filters.status));
      if (filters.location) conditions.push(sql`${projects.location} ILIKE ${`%${filters.location}%`}`);
      if (filters.minInvestment) conditions.push(gte(projects.minInvestment, filters.minInvestment.toString()));
      if (filters.maxInvestment) conditions.push(lte(projects.minInvestment, filters.maxInvestment.toString()));
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }
    
    return await query.orderBy(desc(projects.createdAt));
  }

  async getProjectsByOwner(ownerId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.siteOwnerId, ownerId))
      .orderBy(desc(projects.createdAt));
  }

  async updateProjectStatus(id: number, status: string): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({ status, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async updateProjectFunding(id: number, amount: string): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({ 
        currentFunding: sql`${projects.currentFunding} + ${amount}`,
        updatedAt: new Date() 
      })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  // Investment operations
  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const [newInvestment] = await db.insert(investments).values(investment).returning();
    return newInvestment;
  }

  async getInvestment(id: number): Promise<InvestmentWithProject | undefined> {
    const [result] = await db
      .select()
      .from(investments)
      .leftJoin(projects, eq(investments.projectId, projects.id))
      .where(eq(investments.id, id));

    if (!result) return undefined;

    return {
      ...result.investments,
      project: result.projects!,
    };
  }

  async getInvestmentsByUser(userId: string): Promise<InvestmentWithProject[]> {
    const results = await db
      .select()
      .from(investments)
      .leftJoin(projects, eq(investments.projectId, projects.id))
      .where(eq(investments.investorId, userId))
      .orderBy(desc(investments.createdAt));

    return results.map(result => ({
      ...result.investments,
      project: result.projects!,
    }));
  }

  async getInvestmentsByProject(projectId: number): Promise<Investment[]> {
    return await db
      .select()
      .from(investments)
      .where(eq(investments.projectId, projectId))
      .orderBy(desc(investments.createdAt));
  }

  async updateInvestmentStatus(id: number, status: string): Promise<Investment | undefined> {
    const [updatedInvestment] = await db
      .update(investments)
      .set({ status, updatedAt: new Date() })
      .where(eq(investments.id, id))
      .returning();
    return updatedInvestment;
  }

  // Payout operations
  async createPayout(payout: InsertPayout): Promise<Payout> {
    const [newPayout] = await db.insert(payouts).values(payout).returning();
    return newPayout;
  }

  async getPayoutsByInvestment(investmentId: number): Promise<Payout[]> {
    return await db
      .select()
      .from(payouts)
      .where(eq(payouts.investmentId, investmentId))
      .orderBy(desc(payouts.payoutDate));
  }

  async getPayoutsByUser(userId: string): Promise<Payout[]> {
    return await db
      .select({
        id: payouts.id,
        investmentId: payouts.investmentId,
        amount: payouts.amount,
        payoutDate: payouts.payoutDate,
        status: payouts.status,
        transactionId: payouts.transactionId,
        createdAt: payouts.createdAt,
      })
      .from(payouts)
      .leftJoin(investments, eq(payouts.investmentId, investments.id))
      .where(eq(investments.investorId, userId))
      .orderBy(desc(payouts.payoutDate));
  }

  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [updatedNotification] = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    return updatedNotification;
  }

  // Analytics operations
  async getUserStats(userId: string, role: string): Promise<any> {
    if (role === "investor") {
      const userInvestments = await db
        .select({
          totalInvested: sql<number>`COALESCE(SUM(${investments.amount}), 0)`,
          totalEarnings: sql<number>`COALESCE(SUM(${investments.totalEarnings}), 0)`,
          activeInvestments: sql<number>`COUNT(CASE WHEN ${investments.status} = 'active' THEN 1 END)`,
        })
        .from(investments)
        .where(eq(investments.investorId, userId));

      const monthlyPayouts = await db
        .select({
          monthlyIncome: sql<number>`COALESCE(SUM(${payouts.amount}), 0)`,
        })
        .from(payouts)
        .leftJoin(investments, eq(payouts.investmentId, investments.id))
        .where(
          and(
            eq(investments.investorId, userId),
            gte(payouts.payoutDate, sql`NOW() - INTERVAL '30 days'`)
          )
        );

      return {
        totalInvested: userInvestments[0]?.totalInvested || 0,
        totalEarnings: userInvestments[0]?.totalEarnings || 0,
        activeInvestments: userInvestments[0]?.activeInvestments || 0,
        monthlyIncome: monthlyPayouts[0]?.monthlyIncome || 0,
      };
    } else if (role === "site_owner") {
      const userProjects = await db
        .select({
          totalProjects: sql<number>`COUNT(*)`,
          activeProjects: sql<number>`COUNT(CASE WHEN ${projects.status} = 'active' THEN 1 END)`,
          totalFunding: sql<number>`COALESCE(SUM(${projects.currentFunding}), 0)`,
        })
        .from(projects)
        .where(eq(projects.siteOwnerId, userId));

      return {
        totalProjects: userProjects[0]?.totalProjects || 0,
        activeProjects: userProjects[0]?.activeProjects || 0,
        totalFunding: userProjects[0]?.totalFunding || 0,
        totalSavings: 2340, // Mock value - would calculate from energy generation
        energyGenerated: 1245, // Mock value - would come from energy monitoring
        co2Avoided: 890, // Mock value - calculated from energy generation
      };
    }

    return {};
  }

  async getAdminStats(): Promise<any> {
    const projectStats = await db
      .select({
        totalProjects: sql<number>`COUNT(*)`,
        activeProjects: sql<number>`COUNT(CASE WHEN ${projects.status} = 'active' THEN 1 END)`,
        pendingProjects: sql<number>`COUNT(CASE WHEN ${projects.status} = 'pending' THEN 1 END)`,
      })
      .from(projects);

    const userStats = await db
      .select({
        totalUsers: sql<number>`COUNT(*)`,
        investors: sql<number>`COUNT(CASE WHEN ${users.role} = 'investor' THEN 1 END)`,
        siteOwners: sql<number>`COUNT(CASE WHEN ${users.role} = 'site_owner' THEN 1 END)`,
      })
      .from(users);

    const investmentStats = await db
      .select({
        totalInvestment: sql<number>`COALESCE(SUM(${investments.amount}), 0)`,
        activeInvestments: sql<number>`COUNT(CASE WHEN ${investments.status} = 'active' THEN 1 END)`,
      })
      .from(investments);

    return {
      totalProjects: projectStats[0]?.totalProjects || 0,
      activeProjects: projectStats[0]?.activeProjects || 0,
      pendingProjects: projectStats[0]?.pendingProjects || 0,
      totalUsers: userStats[0]?.totalUsers || 0,
      investors: userStats[0]?.investors || 0,
      siteOwners: userStats[0]?.siteOwners || 0,
      totalInvestment: investmentStats[0]?.totalInvestment || 0,
      activeInvestments: investmentStats[0]?.activeInvestments || 0,
      energyGenerated: 156, // Mock value - would come from energy monitoring
    };
  }
}

export const storage = new DatabaseStorage();
