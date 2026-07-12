"use server";

import { db } from "@/server/db";

export async function createUserInDbAction(id: string, emailAddress: string) {
  try {
    // Check if user already exists to prevent duplicate keys on retries
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      await db.user.create({
        data: {
          id,
          emailAddress,
          credits: 150, // default credits from schema
        },
      });
    }
    return { success: true };
  } catch (error: unknown) {
    console.error("Error creating user in database:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
