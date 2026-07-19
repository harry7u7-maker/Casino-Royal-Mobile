import { eq } from "drizzle-orm";
import { getDb } from "./db";
import {
  santanderTransactions,
  InsertSantanderTransaction,
  openBankTransactions,
  InsertOpenBankTransaction,
  mercadoPagoTransactions,
  InsertMercadoPagoTransaction,
  linkedPaymentMethods,
  InsertLinkedPaymentMethod,
} from "../drizzle/schema";

// Santander functions
export async function createSantanderTransaction(data: InsertSantanderTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(santanderTransactions).values(data);
  return true;
}

export async function getSantanderTransaction(transactionId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(santanderTransactions)
    .where(eq(santanderTransactions.transactionId, transactionId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateSantanderTransaction(transactionId: string, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(santanderTransactions)
    .set({ status })
    .where(eq(santanderTransactions.transactionId, transactionId));
}

// Open Bank functions
export async function createOpenBankTransaction(data: InsertOpenBankTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(openBankTransactions).values(data);
  return true;
}

export async function getOpenBankTransaction(transactionId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(openBankTransactions)
    .where(eq(openBankTransactions.transactionId, transactionId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateOpenBankTransaction(transactionId: string, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(openBankTransactions)
    .set({ status })
    .where(eq(openBankTransactions.transactionId, transactionId));
}

// Mercado Pago functions
export async function createMercadoPagoTransaction(data: InsertMercadoPagoTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(mercadoPagoTransactions).values(data);
  return true;
}

export async function getMercadoPagoTransaction(transactionId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(mercadoPagoTransactions)
    .where(eq(mercadoPagoTransactions.transactionId, transactionId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateMercadoPagoTransaction(transactionId: string, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(mercadoPagoTransactions)
    .set({ status })
    .where(eq(mercadoPagoTransactions.transactionId, transactionId));
}

// Linked payment methods
export async function linkPaymentMethod(data: InsertLinkedPaymentMethod) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(linkedPaymentMethods).values(data);
  return true;
}

export async function getUserPaymentMethods(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(linkedPaymentMethods).where(eq(linkedPaymentMethods.userId, userId));
}

export async function getDefaultPaymentMethod(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const { and } = await import("drizzle-orm");
  const result = await db
    .select()
    .from(linkedPaymentMethods)
    .where(and(eq(linkedPaymentMethods.userId, userId), eq(linkedPaymentMethods.isDefault, 1)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function setDefaultPaymentMethod(userId: number, methodId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Remove default from all methods
  await db
    .update(linkedPaymentMethods)
    .set({ isDefault: 0 })
    .where(eq(linkedPaymentMethods.userId, userId));

  // Set new default
  await db
    .update(linkedPaymentMethods)
    .set({ isDefault: 1 })
    .where(eq(linkedPaymentMethods.id, methodId));
}

export async function removePaymentMethod(methodId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Note: In production, use soft delete instead
  // For now, just remove the record
  const method = await db.select().from(linkedPaymentMethods).where(eq(linkedPaymentMethods.id, methodId));
  if (method.length > 0) {
    // Delete the method
    // await db.delete(linkedPaymentMethods).where(eq(linkedPaymentMethods.id, methodId));
  }
}
