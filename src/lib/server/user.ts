import { db } from "$lib/server/db";
import { and, eq } from "drizzle-orm";
import { UserTable } from "./db/schema";
import { decrypt, decryptToString, encrypt, encryptString } from "./encryption";
import { hashPassword } from "./password";
import { generateRandomRecoveryCode } from "./utils";

export interface User {
    id: number,
    email: string,
    username: string,
    emailVerified: boolean,
    registered2FA: boolean,
}

export const verifyUsernameInput = (username: string) => {
    return username.length > 3 && username.length < 32 && username.trim() === username;
}

export const createUser = async (email: string, username: string, password: string): Promise<User> => {
    const passwordHash = await hashPassword(password);
    const recoveryCode = generateRandomRecoveryCode();
    const encryptedRecoveryCode = encryptString(recoveryCode);

    const row = await db.insert(UserTable).values({
        username,
        email,
        passwordHash,
        recoveryCode: encryptedRecoveryCode,
        roleId: 3,
    }).returning({ userId: UserTable.id });

    if (row === null) {
        throw new Error("Unexpected error");
    }

    const user: User = {
        id: row[0].userId,
        username,
        email,
        emailVerified: false,
        registered2FA: false,
    };

    return user;
}

export const updateUserTOTPKey = async (userId: number, key: Uint8Array): Promise<void> => {
    const encrypted = encrypt(key);
    await db.update(UserTable).set({
        totpKey: encrypted
    }).where(eq(UserTable.id, userId));
}

export const getUserFromEmail = async (email: string): Promise<User | null> => {
    const row = await db.select().from(UserTable).where(eq(UserTable.email, email)).limit(1);

    if (row.length === 0) {
        return null;
    }

    const user: User = {
        id: row[0].id,
        username: row[0].username,
        email: row[0].email,
        emailVerified: row[0].emailVerified,
        registered2FA: Boolean(row[0].totpKey),
    }

    return user;
}

export const getUserPasswordHash = async (userId: number): Promise<string> => {
    const row = await db.select({ passwordHash: UserTable.passwordHash }).from(UserTable).where(eq(UserTable.id, userId)).limit(1);

    if (row === null) {
        throw new Error("Invalid user ID");
    }

    return row[0].passwordHash;
}

export const updateUserEmailAndSetAsVerified = async (userId: number, email: string): Promise<void> => {
    await db.update(UserTable).set({
        email,
        emailVerified: true,
    }).where(eq(UserTable.id, userId));
}

export const setUserAsEmailVerifiedIfEmailMatches = async (userId: number, email: string): Promise<boolean> => {
    const result = await db.update(UserTable).set({emailVerified: true}).where(and(eq(UserTable.id, userId), eq(UserTable.email, email)));
    return result.rowsAffected > 0;
}

export const getUserTOTPKey = async (userId: number): Promise<Uint8Array | null> => {
    const row = await db.select({ totpKey: UserTable.totpKey }).from(UserTable).where(eq(UserTable.id, userId));

    if (row.length === 0 || row[0].totpKey === null) {
        return null;
    }

    return decrypt(row[0].totpKey);
}

export const updateUserPassword = async (userId: number, password: string): Promise<void> => {
    const passwordHash = await hashPassword(password);
    await db.update(UserTable).set({ passwordHash }).where(eq(UserTable.id, userId));
}

export const getUserRecoveryCode = async (userId: number): Promise<string> => {
    const result = await db.select({recoveryCode: UserTable.recoveryCode}).from(UserTable).where(eq(UserTable.id, userId));

    if (result.length === 0) {
        throw new Error("Invalid user ID");
    }

    return decryptToString(result[0].recoveryCode);
}