import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import * as paymentMethods from "./payment-methods";
import { createRedsysClient } from "./redsys-integration";
import * as dailyBonusService from "./daily-bonus-service";
import * as notificationService from "./notification-service";
import { initializeAdmob, trackAdImpression } from "./admob-integration";
import * as paypalIntegration from "./paypal-integration";

const COOKIE_NAME = "session";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  wallet: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      const wallet = await db.getOrCreateWallet(ctx.user.id);
      return wallet;
    }),

    updateBalance: protectedProcedure
      .input(z.object({
        amount: z.string(),
        type: z.enum(["deposit", "withdrawal", "game_bet", "game_win", "referral_bonus"]),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const wallet = await db.getOrCreateWallet(ctx.user.id);
        const currentBalance = parseFloat(wallet.balance as any);
        const amountNum = parseFloat(input.amount);
        const newBalance = (currentBalance + amountNum).toFixed(2);

        await db.updateWalletBalance(ctx.user.id, newBalance);
        await db.createTransaction({
          userId: ctx.user.id,
          type: input.type as any,
          amount: input.amount,
          description: input.description,
          status: "completed",
        });

        return { success: true, newBalance };
      }),
  }),

  gameStats: router({
    getStats: protectedProcedure
      .input(z.object({ gameType: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getOrCreateGameStat(ctx.user.id, input.gameType);
      }),

    updateStats: protectedProcedure
      .input(z.object({
        gameType: z.string(),
        totalBets: z.string().optional(),
        totalWinnings: z.string().optional(),
        totalLosses: z.string().optional(),
        gamesPlayed: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { gameType, ...updates } = input;
        await db.updateGameStat(ctx.user.id, gameType, updates as any);
        return { success: true };
      }),
  }),

  chipPackages: router({
    list: publicProcedure.query(async () => {
      return db.getChipPackages();
    }),
  }),

  transactions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserTransactions(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        type: z.enum(["deposit", "withdrawal", "game_bet", "game_win", "referral_bonus"]),
        amount: z.string(),
        description: z.string().optional(),
        paymentMethod: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createTransaction({
          userId: ctx.user.id,
          ...input,
          status: "completed",
        });
      }),
  }),

  verification: router({
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserVerification(ctx.user.id);
    }),

    verifyAge: protectedProcedure
      .input(z.object({
        dateOfBirth: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const dob = new Date(input.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();

        if (age < 18) {
          throw new Error("Must be 18 or older to use this service");
        }

        await db.createOrUpdateVerification(ctx.user.id, {
          userId: ctx.user.id,
          ageVerified: 1,
          dateOfBirth: input.dateOfBirth,
          verifiedAt: new Date(),
        });

        return { success: true, ageVerified: true };
      }),
  }),

  referrals: router({
    generateCode: protectedProcedure.mutation(async ({ ctx }) => {
      const code = `REF${ctx.user.id}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      await db.createReferralCode(ctx.user.id, code);
      return { code };
    }),

    getReferralInfo: protectedProcedure.query(async ({ ctx }) => {
      const referral = await db.getReferralByCode(`REF${ctx.user.id}`);
      return referral || { referralCode: null, referredCount: 0, bonusEarned: "0.00" };
    }),
  }),

  redsys: router({
    createPayment: protectedProcedure
      .input(z.object({
        amount: z.string(),
        description: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const redsys = createRedsysClient();
        const orderId = `ORD${ctx.user.id}${Date.now()}`;
        
        const result = await redsys.createPayment({
          amount: input.amount,
          currency: "MXN",
          description: input.description,
          userId: ctx.user.id,
          orderId,
        });

        if (result.transactionId) {
          await db.createTransaction({
            userId: ctx.user.id,
            type: "deposit" as const,
            amount: input.amount as any,
            description: `Redsys Payment: ${input.description}`,
            paymentMethod: "redsys",
            status: "pending" as const,
          });
        }

        return result;
      }),

    getPaymentStatus: protectedProcedure
      .input(z.object({ transactionId: z.string() }))
      .query(async ({ input }) => {
        const redsys = createRedsysClient();
        return redsys.getPaymentStatus(input.transactionId);
      }),

    getAuthMethods: protectedProcedure
      .input(z.object({ transactionId: z.string() }))
      .query(async ({ input }) => {
        const redsys = createRedsysClient();
        return redsys.getAuthenticationMethods(input.transactionId);
      }),

    startAuthorization: protectedProcedure
      .input(z.object({ transactionId: z.string(), authMethodId: z.string().optional() }))
      .mutation(async ({ input }) => {
        const redsys = createRedsysClient();
        return redsys.startAuthorization(input.transactionId, input.authMethodId);
      }),
  }),

  paypal: router({
    createOrder: protectedProcedure
      .input(z.object({
        packageId: z.number(),
        amount: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const transactionId = `PP${Date.now()}${Math.random().toString(36).substring(7)}`;
        
        await db.createPaypalTransaction({
          userId: ctx.user.id,
          transactionId,
          amount: input.amount,
          status: "pending",
        });

        return { transactionId, status: "pending" };
      }),

    completeOrder: protectedProcedure
      .input(z.object({
        transactionId: z.string(),
        status: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updatePaypalTransaction(input.transactionId, input.status);
        return { success: true };
      }),
  }),

  santander: router({
    createOrder: protectedProcedure
      .input(z.object({
        packageId: z.number(),
        amount: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const transactionId = `SN${Date.now()}${Math.random().toString(36).substring(7)}`;
        
        await paymentMethods.createSantanderTransaction({
          userId: ctx.user.id,
          transactionId,
          amount: input.amount,
          status: "pending",
        });

        return { transactionId, status: "pending" };
      }),
  }),

  openbank: router({
    createOrder: protectedProcedure
      .input(z.object({
        packageId: z.number(),
        amount: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const transactionId = `OB${Date.now()}${Math.random().toString(36).substring(7)}`;
        
        await paymentMethods.createOpenBankTransaction({
          userId: ctx.user.id,
          transactionId,
          amount: input.amount,
          status: "pending",
        });

        return { transactionId, status: "pending" };
      }),
  }),

  mercadopago: router({
    createOrder: protectedProcedure
      .input(z.object({
        packageId: z.number(),
        amount: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const transactionId = `MP${Date.now()}${Math.random().toString(36).substring(7)}`;
        
        await paymentMethods.createMercadoPagoTransaction({
          userId: ctx.user.id,
          transactionId,
          amount: input.amount,
          status: "pending",
        });

        return { transactionId, status: "pending" };
      }),
  }),

  nubank: router({
    createOrder: protectedProcedure
      .input(z.object({
        packageId: z.number(),
        amount: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const transactionId = `NU${Date.now()}${Math.random().toString(36).substring(7)}`;
        
        await db.createTransaction({
          userId: ctx.user.id,
          type: "deposit",
          amount: input.amount,
          description: `Nubank payment: ${transactionId}`,
          status: "pending",
        });

        return { transactionId, status: "pending" };
      }),
  }),

  clip: router({
    createOrder: protectedProcedure
      .input(z.object({
        packageId: z.number(),
        amount: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const transactionId = `CL${Date.now()}${Math.random().toString(36).substring(7)}`;
        
        await db.createTransaction({
          userId: ctx.user.id,
          type: "deposit",
          amount: input.amount,
          description: `Clip payment: ${transactionId}`,
          status: "pending",
        });

        return { transactionId, status: "pending" };
      }),
  }),

  dailyBonus: router({
    claimBonus: protectedProcedure.mutation(async ({ ctx }) => {
      return dailyBonusService.claimDailyBonus(ctx.user.id);
    }),

    getInfo: protectedProcedure.query(async ({ ctx }) => {
      return dailyBonusService.getDailyBonusInfo(ctx.user.id);
    }),

    getSchedule: publicProcedure.query(() => {
      return dailyBonusService.getBonusProgressionSchedule();
    }),
  }),

  notifications: router({
    getNotifications: protectedProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ ctx, input }) => {
        return db.getPushNotifications(ctx.user.id, input.limit);
      }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.notificationId);
        return { success: true };
      }),

    getPreferences: protectedProcedure.query(async ({ ctx }) => {
      return db.getOrCreateNotificationPreferences(ctx.user.id);
    }),

    updatePreferences: protectedProcedure
      .input(z.object({
        bonusNotifications: z.boolean().optional(),
        gameNotifications: z.boolean().optional(),
        promotionNotifications: z.boolean().optional(),
        achievementNotifications: z.boolean().optional(),
        referralNotifications: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const updates = Object.fromEntries(
          Object.entries(input).map(([k, v]) => [k, v ? 1 : 0])
        );
        await db.updateNotificationPreferences(ctx.user.id, updates as any);
        return { success: true };
      }),
  }),

  admob: router({
    trackAdImpression: protectedProcedure
      .input(z.object({
        adType: z.enum(["banner", "interstitial", "rewarded"]),
        revenue: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = trackAdImpression({
          adNetwork: "google_admob",
          adType: input.adType,
          revenue: input.revenue || 0,
          impressionCount: 1,
        });
        return result;
      }),

    getConfig: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return initializeAdmob({});
    }),
  }),

  admin: router({
    getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return {
        totalUsers: 0,
        totalRevenue: "0.00",
        totalTransactions: 0,
        activeUsers: 0,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
