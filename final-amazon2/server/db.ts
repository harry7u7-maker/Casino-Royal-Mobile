import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  wallets,
  InsertWallet,
  transactions,
  InsertTransaction,
  gameStats,
  InsertGameStat,
  referrals,
  InsertReferral,
  chipPackages,
  userVerification,
  InsertUserVerification,
  paypalTransactions,
  InsertPaypalTransaction,
  dailyLoginBonuses,
  InsertDailyLoginBonus,
  pushNotifications,
  InsertPushNotification,
  notificationPreferences,
  InsertNotificationPreference
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Wallet functions
export async function getOrCreateWallet(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
  
  if (existing.length > 0) {
    return existing[0];
  }

  const newWallet: InsertWallet = {
    userId,
    balance: "1000.00",
    totalDeposited: "0.00",
    totalWithdrawn: "0.00",
  };

  await db.insert(wallets).values(newWallet);
  return db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1).then(r => r[0]);
}

export async function updateWalletBalance(userId: number, amount: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(wallets).set({ balance: amount }).where(eq(wallets.userId, userId));
}

// Transaction functions
export async function createTransaction(data: InsertTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(transactions).values(data);
  return true;
}

export async function getUserTransactions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(transactions).where(eq(transactions.userId, userId));
}

// Game stats functions
export async function getOrCreateGameStat(userId: number, gameType: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(gameStats)
    .where(and(eq(gameStats.userId, userId), eq(gameStats.gameType, gameType)))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const newStat: InsertGameStat = {
    userId,
    gameType,
    totalBets: "0.00",
    totalWinnings: "0.00",
    totalLosses: "0.00",
    gamesPlayed: 0,
  };

  await db.insert(gameStats).values(newStat);
  return db.select().from(gameStats)
    .where(and(eq(gameStats.userId, userId), eq(gameStats.gameType, gameType)))
    .limit(1)
    .then(r => r[0]);
}

export async function updateGameStat(userId: number, gameType: string, updates: Partial<InsertGameStat>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(gameStats)
    .set(updates)
    .where(and(eq(gameStats.userId, userId), eq(gameStats.gameType, gameType)));
}

// Referral functions
export async function createReferralCode(userId: number, code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const newReferral: InsertReferral = {
    userId,
    referralCode: code,
    referredCount: 0,
    bonusEarned: "0.00",
  };

  await db.insert(referrals).values(newReferral);
}

export async function getReferralByCode(code: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(referrals).where(eq(referrals.referralCode, code)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateReferralBonus(referralId: number, bonus: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(referrals).set({ bonusEarned: bonus }).where(eq(referrals.id, referralId));
}

// Chip packages functions
export async function getChipPackages() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(chipPackages).where(eq(chipPackages.isActive, 1));
}

// User verification functions
export async function createOrUpdateVerification(userId: number, data: InsertUserVerification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(userVerification).where(eq(userVerification.userId, userId)).limit(1);

  if (existing.length > 0) {
    await db.update(userVerification).set(data).where(eq(userVerification.userId, userId));
  } else {
    await db.insert(userVerification).values({ ...data, userId });
  }
}

export async function getUserVerification(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(userVerification).where(eq(userVerification.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// PayPal transaction functions
export async function createPaypalTransaction(data: InsertPaypalTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(paypalTransactions).values(data);
  return true;
}

export async function getPaypalTransaction(transactionId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(paypalTransactions).where(eq(paypalTransactions.transactionId, transactionId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updatePaypalTransaction(transactionId: string, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(paypalTransactions).set({ status }).where(eq(paypalTransactions.transactionId, transactionId));
}


// Daily login bonus functions
export async function createDailyBonus(data: InsertDailyLoginBonus) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(dailyLoginBonuses).values(data);
}

export async function getLastDailyBonus(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(dailyLoginBonuses)
    .where(eq(dailyLoginBonuses.userId, userId))
    .orderBy((table) => table.claimedAt)
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getDailyBonusHistory(userId: number, limit: number = 30) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(dailyLoginBonuses)
    .where(eq(dailyLoginBonuses.userId, userId))
    .orderBy((table) => table.claimedAt)
    .limit(limit);
}

// Push notification functions
export async function createPushNotification(data: InsertPushNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(pushNotifications).values(data);
}

export async function getPushNotifications(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(pushNotifications)
    .where(eq(pushNotifications.userId, userId))
    .orderBy((table) => table.createdAt)
    .limit(limit);
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(pushNotifications)
    .set({ read: 1, readAt: new Date() })
    .where(eq(pushNotifications.id, notificationId));
}

export async function markNotificationAsSent(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(pushNotifications)
    .set({ sent: 1, sentAt: new Date() })
    .where(eq(pushNotifications.id, notificationId));
}

// Notification preferences functions
export async function getOrCreateNotificationPreferences(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const newPrefs: InsertNotificationPreference = {
    userId,
    bonusNotifications: 1,
    gameNotifications: 1,
    promotionNotifications: 1,
    achievementNotifications: 1,
    referralNotifications: 1,
  };

  await db.insert(notificationPreferences).values(newPrefs);
  return newPrefs;
}

export async function updateNotificationPreferences(
  userId: number,
  updates: Partial<InsertNotificationPreference>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(notificationPreferences)
    .set(updates)
    .where(eq(notificationPreferences.userId, userId));
}
