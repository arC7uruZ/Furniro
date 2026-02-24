import { db } from "$lib/server/db";
import { count, eq } from "drizzle-orm";
import { UserTable } from "$lib/server/db/schema";

export const verifyEmailInput = (email: string) => {
    return /^.+@.+\..+$/.test(email) && email.length < 256;
}

export const checkEmailAvailability = async (email: string) => {
    const row = await db.select({ count: count() }).from(UserTable).where(eq(UserTable.email, email)).limit(1)
    return row[0].count === 0;
}