"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/server/db";
import { cache } from "react";

// Cache database/Supabase queries scoped to the request lifecycle
const getCachedUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

const getCachedDbUser = cache(async () => {
  const user = await getCachedUser();
  if (!user) return null;
  return await db.user.findUnique({
    where: { id: user.id },
  });
});

/**
 * Gets the current authenticated Supabase user.
 */
export async function getCurrentUserAction() {
  try {
    return await getCachedUser();
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

/**
 * Gets the matching user record from the Prisma database using the authenticated ID.
 */
export async function getCurrentDbUserAction() {
  try {
    return await getCachedDbUser();
  } catch (error) {
    console.error("Error fetching current DB user:", error);
    return null;
  }
}

