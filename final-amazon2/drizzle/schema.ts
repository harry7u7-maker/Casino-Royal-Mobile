import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Wallet table for user balances
export const wallets = mysqlTable("wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("1000.00").notNull(),
  totalDeposited: decimal("totalDeposited", { precision: 10, scale: 2 }).default("0.00").notNull(),
  totalWithdrawn: decimal("totalWithdrawn", { precision: 10, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = typeof wallets.$inferInsert;

// Transactions table
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["deposit", "withdrawal", "game_bet", "game_win", "referral_bonus"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  paymentMethod: varchar("paymentMethod", { length: 64 }),
  transactionId: varchar("transactionId", { length: 255 }).unique(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

// Game statistics
export const gameStats = mysqlTable("gameStats", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  gameType: varchar("gameType", { length: 64 }).notNull(),
  totalBets: decimal("totalBets", { precision: 10, scale: 2 }).default("0.00").notNull(),
  totalWinnings: decimal("totalWinnings", { precision: 10, scale: 2 }).default("0.00").notNull(),
  totalLosses: decimal("totalLosses", { precision: 10, scale: 2 }).default("0.00").notNull(),
  gamesPlayed: int("gamesPlayed").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GameStat = typeof gameStats.$inferSelect;
export type InsertGameStat = typeof gameStats.$inferInsert;

// Referral codes
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  referralCode: varchar("referralCode", { length: 32 }).notNull().unique(),
  referredCount: int("referredCount").default(0).notNull(),
  bonusEarned: decimal("bonusEarned", { precision: 10, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

// Chip packages for purchase
export const chipPackages = mysqlTable("chipPackages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  chips: int("chips").notNull(),
  priceInDollars: decimal("priceInDollars", { precision: 10, scale: 2 }).notNull(),
  bonus: int("bonus").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChipPackage = typeof chipPackages.$inferSelect;
export type InsertChipPackage = typeof chipPackages.$inferInsert;

// User verification (age, KYC)
export const userVerification = mysqlTable("userVerification", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  ageVerified: int("ageVerified").default(0).notNull(),
  dateOfBirth: varchar("dateOfBirth", { length: 10 }),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserVerification = typeof userVerification.$inferSelect;
export type InsertUserVerification = typeof userVerification.$inferInsert;

// PayPal transactions
export const paypalTransactions = mysqlTable("paypalTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  transactionId: varchar("transactionId", { length: 255 }).notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 64 }).notNull(),
  payerEmail: varchar("payerEmail", { length: 320 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaypalTransaction = typeof paypalTransactions.$inferSelect;
export type InsertPaypalTransaction = typeof paypalTransactions.$inferInsert;


// Santander Banca Móvil transactions
export const santanderTransactions = mysqlTable("santanderTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  transactionId: varchar("transactionId", { length: 255 }).notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 64 }).notNull(),
  accountNumber: varchar("accountNumber", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SantanderTransaction = typeof santanderTransactions.$inferSelect;
export type InsertSantanderTransaction = typeof santanderTransactions.$inferInsert;

// Open Bank transactions
export const openBankTransactions = mysqlTable("openBankTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  transactionId: varchar("transactionId", { length: 255 }).notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 64 }).notNull(),
  accountNumber: varchar("accountNumber", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OpenBankTransaction = typeof openBankTransactions.$inferSelect;
export type InsertOpenBankTransaction = typeof openBankTransactions.$inferInsert;

// Mercado Pago transactions
export const mercadoPagoTransactions = mysqlTable("mercadoPagoTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  transactionId: varchar("transactionId", { length: 255 }).notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 64 }).notNull(),
  payerEmail: varchar("payerEmail", { length: 320 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MercadoPagoTransaction = typeof mercadoPagoTransactions.$inferSelect;
export type InsertMercadoPagoTransaction = typeof mercadoPagoTransactions.$inferInsert;

// Payment methods linked to users
export const linkedPaymentMethods = mysqlTable("linkedPaymentMethods", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  provider: mysqlEnum("provider", ["paypal", "santander", "openbank", "mercadopago"]).notNull(),
  accountNumber: varchar("accountNumber", { length: 20 }),
  accountEmail: varchar("accountEmail", { length: 320 }),
  isDefault: int("isDefault").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LinkedPaymentMethod = typeof linkedPaymentMethods.$inferSelect;
export type InsertLinkedPaymentMethod = typeof linkedPaymentMethods.$inferInsert;


// Daily bonuses and streaks
export const dailyBonuses = mysqlTable("dailyBonuses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  lastClaimedAt: timestamp("lastClaimedAt"),
  currentStreak: int("currentStreak").default(0).notNull(),
  maxStreak: int("maxStreak").default(0).notNull(),
  bonusAmount: decimal("bonusAmount", { precision: 10, scale: 2 }).default("50.00").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailyBonus = typeof dailyBonuses.$inferSelect;
export type InsertDailyBonus = typeof dailyBonuses.$inferInsert;

// Challenges and tournaments
export const challenges = mysqlTable("challenges", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["daily", "weekly", "monthly", "special"]).notNull(),
  targetAmount: decimal("targetAmount", { precision: 10, scale: 2 }).notNull(),
  prizePool: decimal("prizePool", { precision: 10, scale: 2 }).notNull(),
  startsAt: timestamp("startsAt").notNull(),
  endsAt: timestamp("endsAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = typeof challenges.$inferInsert;

// User challenge progress
export const userChallenges = mysqlTable("userChallenges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  challengeId: int("challengeId").notNull(),
  progress: decimal("progress", { precision: 10, scale: 2 }).default("0.00").notNull(),
  completed: int("completed").default(0).notNull(),
  completedAt: timestamp("completedAt"),
  prizeEarned: decimal("prizeEarned", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserChallenge = typeof userChallenges.$inferSelect;
export type InsertUserChallenge = typeof userChallenges.$inferInsert;

// Leaderboard
export const leaderboard = mysqlTable("leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  rank: int("rank").notNull(),
  totalWinnings: decimal("totalWinnings", { precision: 10, scale: 2 }).default("0.00").notNull(),
  gamesPlayed: int("gamesPlayed").default(0).notNull(),
  winRate: decimal("winRate", { precision: 5, scale: 2 }).default("0.00").notNull(),
  period: mysqlEnum("period", ["daily", "weekly", "monthly", "alltime"]).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Leaderboard = typeof leaderboard.$inferSelect;
export type InsertLeaderboard = typeof leaderboard.$inferInsert;

// Achievements and badges
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 255 }),
  requirement: varchar("requirement", { length: 255 }).notNull(),
  rewardChips: decimal("rewardChips", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

// User achievements
export const userAchievements = mysqlTable("userAchievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementId: int("achievementId").notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;

// VIP subscriptions
export const vipSubscriptions = mysqlTable("vipSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  tier: mysqlEnum("tier", ["none", "silver", "gold", "platinum"]).default("none").notNull(),
  monthlyFee: decimal("monthlyFee", { precision: 10, scale: 2 }).default("0.00"),
  dailyBonus: decimal("dailyBonus", { precision: 10, scale: 2 }).default("0.00"),
  betMultiplier: decimal("betMultiplier", { precision: 5, scale: 2 }).default("1.00"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  autoRenew: int("autoRenew").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VipSubscription = typeof vipSubscriptions.$inferSelect;
export type InsertVipSubscription = typeof vipSubscriptions.$inferInsert;

// Cosmetics store
export const cosmetics = mysqlTable("cosmetics", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["theme", "effect", "avatar", "animation"]).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Cosmetic = typeof cosmetics.$inferSelect;
export type InsertCosmetic = typeof cosmetics.$inferInsert;

// User cosmetics (owned items)
export const userCosmetics = mysqlTable("userCosmetics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  cosmeticId: int("cosmeticId").notNull(),
  equipped: int("equipped").default(0),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
});

export type UserCosmetic = typeof userCosmetics.$inferSelect;
export type InsertUserCosmetic = typeof userCosmetics.$inferInsert;

// Lucky spins (free spins with ads)
export const luckySpins = mysqlTable("luckySpins", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  remainingSpins: int("remainingSpins").default(0).notNull(),
  lastResetAt: timestamp("lastResetAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LuckySpin = typeof luckySpins.$inferSelect;
export type InsertLuckySpin = typeof luckySpins.$inferInsert;

// Ad impressions tracking
export const adImpressions = mysqlTable("adImpressions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  adNetwork: varchar("adNetwork", { length: 64 }).notNull(),
  adType: varchar("adType", { length: 64 }).notNull(),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0.00"),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

export type AdImpression = typeof adImpressions.$inferSelect;
export type InsertAdImpression = typeof adImpressions.$inferInsert;

// Social sharing rewards
export const socialShares = mysqlTable("socialShares", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  platform: mysqlEnum("platform", ["facebook", "instagram", "tiktok", "twitter", "whatsapp"]).notNull(),
  bonusAwarded: decimal("bonusAwarded", { precision: 10, scale: 2 }).default("0.00"),
  sharedAt: timestamp("sharedAt").defaultNow().notNull(),
});

export type SocialShare = typeof socialShares.$inferSelect;
export type InsertSocialShare = typeof socialShares.$inferInsert;

// Google AdMob configuration
export const admobConfig = mysqlTable("admobConfig", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  bannerAdUnitId: varchar("bannerAdUnitId", { length: 255 }),
  interstitialAdUnitId: varchar("interstitialAdUnitId", { length: 255 }),
  rewardedAdUnitId: varchar("rewardedAdUnitId", { length: 255 }),
  totalAdRevenue: decimal("totalAdRevenue", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdmobConfig = typeof admobConfig.$inferSelect;
export type InsertAdmobConfig = typeof admobConfig.$inferInsert;

// Daily bonuses (automatic bonuses for login)
export const dailyLoginBonuses = mysqlTable("dailyLoginBonuses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bonusAmount: decimal("bonusAmount", { precision: 10, scale: 2 }).notNull(),
  claimedAt: timestamp("claimedAt").defaultNow().notNull(),
  streak: int("streak").default(1).notNull(),
  lastClaimedAt: timestamp("lastClaimedAt"),
});

export type DailyLoginBonus = typeof dailyLoginBonuses.$inferSelect;
export type InsertDailyLoginBonus = typeof dailyLoginBonuses.$inferInsert;

// Push notifications
export const pushNotifications = mysqlTable("pushNotifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  type: mysqlEnum("type", ["bonus", "game", "promotion", "achievement", "referral"]).notNull(),
  data: text("data"),
  sent: int("sent").default(0).notNull(),
  sentAt: timestamp("sentAt"),
  read: int("read").default(0).notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PushNotification = typeof pushNotifications.$inferSelect;
export type InsertPushNotification = typeof pushNotifications.$inferInsert;

// Notification preferences
export const notificationPreferences = mysqlTable("notificationPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  bonusNotifications: int("bonusNotifications").default(1).notNull(),
  gameNotifications: int("gameNotifications").default(1).notNull(),
  promotionNotifications: int("promotionNotifications").default(1).notNull(),
  achievementNotifications: int("achievementNotifications").default(1).notNull(),
  referralNotifications: int("referralNotifications").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;
