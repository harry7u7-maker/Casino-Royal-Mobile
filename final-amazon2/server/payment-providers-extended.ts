import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { transactions, InsertTransaction } from "../drizzle/schema";

// Nubank integration
export async function createNubankTransaction(userId: number, amount: string, transactionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(transactions).values({
    userId,
    type: "deposit",
    amount,
    description: `Nubank payment: ${transactionId}`,
    status: "pending",
  });

  return { transactionId, status: "pending" };
}

export async function updateNubankTransaction(transactionId: string, status: "pending" | "completed" | "failed" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(transactions)
    .where(eq(transactions.description, `Nubank payment: ${transactionId}`))
    .limit(1);

  if (result.length > 0) {
    await db
      .update(transactions)
      .set({ status })
      .where(eq(transactions.id, result[0].id));
  }
}

// Clip integration
export async function createClipTransaction(userId: number, amount: string, transactionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(transactions).values({
    userId,
    type: "deposit",
    amount,
    description: `Clip payment: ${transactionId}`,
    status: "pending",
  });

  return { transactionId, status: "pending" };
}

export async function updateClipTransaction(transactionId: string, status: "pending" | "completed" | "failed" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(transactions)
    .where(eq(transactions.description, `Clip payment: ${transactionId}`))
    .limit(1);

  if (result.length > 0) {
    await db
      .update(transactions)
      .set({ status })
      .where(eq(transactions.id, result[0].id));
  }
}

// Webhook handlers
export async function handleNubankWebhook(payload: any) {
  const { transactionId, status, amount } = payload;

  if (status === "approved") {
    await updateNubankTransaction(transactionId, "completed");
    return { success: true, message: "Transaction approved" };
  } else if (status === "declined") {
    await updateNubankTransaction(transactionId, "failed");
    return { success: false, message: "Transaction declined" };
  }

  return { success: false, message: "Unknown status" };
}

export async function handleClipWebhook(payload: any) {
  const { transactionId, status, amount } = payload;

  if (status === "completed") {
    await updateClipTransaction(transactionId, "completed");
    return { success: true, message: "Transaction completed" };
  } else if (status === "failed") {
    await updateClipTransaction(transactionId, "failed");
    return { success: false, message: "Transaction failed" };
  }

  return { success: false, message: "Unknown status" };
}
