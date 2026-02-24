import { eq } from "drizzle-orm"
import { db } from "$lib/server/db"
import { PasswordResetSessionTable, UserTable } from "$lib/server/db/schema"
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { generateRandomOTP } from "./utils";
import type { RequestEvent } from "@sveltejs/kit";
import type { User } from "./user";

export interface PasswordResetSession {
    id: string,
    userId: number,
    email: string,
    expiresAt: Date,
    code: string,
    emailVerified: boolean,
    twoFactorVerified: boolean,
}

export type PasswordResetSessionValidationResult =
    | { session: PasswordResetSession; user: User }
    | { session: null, user: null }

export const invalidateUserPasswordResetSession = async (userId: number): Promise<void> => {
    await db.delete(PasswordResetSessionTable).where(eq(PasswordResetSessionTable.userId, userId));
}

export const createPasswordResetSession = async (token: string, userId: number, email: string): Promise<PasswordResetSession> => {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: PasswordResetSession = {
        id: sessionId,
        userId,
        email,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10),
        code: generateRandomOTP(),
        emailVerified: false,
        twoFactorVerified: false
    }

    await db.insert(PasswordResetSessionTable).values({
        id: session.id,
        userId: session.userId,
        email: session.email,
        code: session.code,
        expiresAt: session.expiresAt.getTime(),
    });

    return session;
}

export const sendPasswordResetEmail = (email: string, code: string): void => {
    console.log(`To ${email}: Your reset code is ${code}`);
}

export const setPasswordResetSessionTokenCookie = (event: RequestEvent, token: string, expiresAt: Date): void => {
    event.cookies.set("password_reset_session", token, {
        expires: expiresAt,
        sameSite: "lax",
        httpOnly: true,
        path: "/",
        secure: !import.meta.env.DEV,
    });
}

export const validatePasswordResetSessionToken = async (token: string): Promise<PasswordResetSessionValidationResult> => {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    const row = await db.select({
        passwordResetSessionId: PasswordResetSessionTable.id,
        passwordResetSessionUserId: PasswordResetSessionTable.userId,
        passwordResetSessionEmail: PasswordResetSessionTable.email,
        passwordResetSessionCode: PasswordResetSessionTable.code,
        passwordResetSessionExpiresAt: PasswordResetSessionTable.expiresAt,
        passwordResetSessionEmailVerified: PasswordResetSessionTable.emailVerified,
        passwordResetSessionTwoFactorVerified: PasswordResetSessionTable.twoFactorVerified,
        userId: UserTable.id,
        email: UserTable.email,
        username: UserTable.username,
        emailVerified: UserTable.emailVerified,
        totpKey: UserTable.totpKey,
    }).from(PasswordResetSessionTable).innerJoin(UserTable, eq(UserTable.id, PasswordResetSessionTable.userId))
    .where(eq(PasswordResetSessionTable.id, sessionId)).limit(1);

    if (row.length === 0) {
        return { session: null, user: null };
    }

    const session: PasswordResetSession = {
        id: row[0].passwordResetSessionId,
        userId: row[0].passwordResetSessionUserId,
        email: row[0].passwordResetSessionEmail,
        code: row[0].passwordResetSessionCode,
        expiresAt: new Date(row[0].passwordResetSessionExpiresAt),
        emailVerified: row[0].passwordResetSessionEmailVerified,
        twoFactorVerified: row[0].passwordResetSessionTwoFactorVerified,
    };

    const user: User = {
        id: row[0].userId,
        email: row[0].email,
        username: row[0].username,
        emailVerified: Boolean(row[0].emailVerified),
        registered2FA: Boolean(row[0].totpKey),
    }

    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(PasswordResetSessionTable).where(eq(PasswordResetSessionTable.id, session.id));
        return { session: null, user: null };
    }

    return { session, user };
}

export const deletePasswordResetSessionTokenCookie = (event: RequestEvent): void => {
    event.cookies.set("password_reset_session", "", {
        maxAge: 0,
        sameSite: "lax",
        httpOnly: true,
        path: "/",
        secure: !import.meta.env.DEV,
    });
} 

export const validatePasswordResetSessionRequest = async (event: RequestEvent): Promise<PasswordResetSessionValidationResult> => {
    const token = event.cookies.get("password_reset_session") ?? null;
    if (token === null) {
        return { session: null, user: null };
    }

    const result = await validatePasswordResetSessionToken(token);
    if (result.session === null) {
        deletePasswordResetSessionTokenCookie(event);
    }

    return result;
}

export const setPasswordResetSessionAsEmailVerified = async (sessionId: string): Promise<void> => {
    await db.update(PasswordResetSessionTable).set({
        emailVerified: true,
    })
}

export const setPasswordResetSessionAs2FAVerified = async (sessionId: string): Promise<void> => {
    await db.update(PasswordResetSessionTable).set({
        twoFactorVerified: true,
    })
}