import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { db } from "./db";
import { SessionTable, UserTable } from "./db/schema";
import type { RequestEvent } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { User } from "./user";

export interface SessionFlags {
    twoFactorVerified: boolean;
}

export interface Session extends SessionFlags {
    id: string;
    expiresAt: Date;
    userId: number;
}

type SessionValidationResult = { session: Session, user: User } | { session: null; user: null };

export const generateSessionToken = (): string => {
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
    return token;
}

export const createSession = async (token: string, userId: number, flags: SessionFlags): Promise<Session> => {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        twoFactorVerified: flags.twoFactorVerified,
    }

    await db.insert(SessionTable).values({
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt.getTime(),
        twoFactorVerified: session.twoFactorVerified,
    })

    return session;
}

export const deleteSession = async (sessionId: string): Promise<void> => {
    await db.delete(SessionTable).where(eq(SessionTable.id, sessionId));
}

export const setSessionTokenCookie = (event: RequestEvent, token: string, expiresAt: Date): void => {
    event.cookies.set("session", token, {
        httpOnly: true,
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
        expires: expiresAt,
    })
}

export const setSessionAs2FAVerified = async (sessionId: string): Promise<void> => {
    await db.update(SessionTable).set({
        twoFactorVerified: true
    }).where(eq(SessionTable.id, sessionId))
}

export const invalidateUserSessions = async (userId: number): Promise<void> => {
    await db.delete(SessionTable).where(eq(SessionTable.userId, userId));
}

export const validateSessionToken = async (token: string): Promise<SessionValidationResult> => {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const result = await db.select({
        sessionTableId: SessionTable.id,
        sessionTableUserId: SessionTable.userId,
        sessionTableExpiresAt: SessionTable.expiresAt,
        sessionTableTwoFactorVerified: SessionTable.twoFactorVerified,
        userTableId: UserTable.id,
        userTableEmail: UserTable.email,
        userTableUsername: UserTable.username,
        userTableEmailVerified: UserTable.emailVerified,
        userTableTOTPKey: UserTable.totpKey,
    }).from(SessionTable)
    .innerJoin(UserTable, eq(SessionTable.userId, UserTable.id))
    .where(eq(SessionTable.id, sessionId));

    // console.log("resultado: ", result);

    if (result.length === 0) {
        return { session: null, user: null };
    }

    const session: Session = {
        id: result[0].sessionTableId,
        userId: result[0].sessionTableUserId,
        expiresAt: new Date(result[0].sessionTableExpiresAt),
        twoFactorVerified: result[0].sessionTableTwoFactorVerified,
    }

    const user: User = {
        id: result[0].userTableId,
        email: result[0].userTableEmail,
        username: result[0].userTableUsername,
        emailVerified: result[0].userTableEmailVerified,
        registered2FA: Boolean(result[0].userTableTOTPKey),
    }

    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(SessionTable).where(eq(SessionTable.id, session.id));
        return { session: null, user: null };
    }

    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await db.update(SessionTable).set({expiresAt: session.expiresAt.getTime()}).where(eq(SessionTable.id, session.id));
    }

    return { session, user };
}

export const deleteSessionTokenCookie = (event: RequestEvent): void => {
    event.cookies.set("session", "", {
        httpOnly: true,
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
        maxAge: 0,
    });
}