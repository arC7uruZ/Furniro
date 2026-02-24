import { db } from "$lib/server/db";
import { EmailVerificationRequestTable, UserTable } from "$lib/server/db/schema";
import { generateRandomOTP } from "$lib/server/utils";
import { encodeBase32 } from "@oslojs/encoding";
import type { RequestEvent } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

export interface EmailVerificationRequest {
    id: string,
    userId: number,
    code: string,
    email: string,
    expiresAt: Date,
}

export const createEmailVerificationRequest = async (userId: number, email: string): Promise<EmailVerificationRequest> => {
    await deleteUserEmailVerificationRequest(userId);
    const idBytes = new Uint8Array(20);
    crypto.getRandomValues(idBytes);
    const id = encodeBase32(idBytes).toLowerCase();

    const code = generateRandomOTP();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    await db.insert(EmailVerificationRequestTable).values({
        id,
        userId: userId,
        code,
        email,
        expiresAt: expiresAt.getTime(),
    })

    const request: EmailVerificationRequest = {
        id,
        userId,
        code,
        email,
        expiresAt,
    }

    return request;
}

export const deleteUserEmailVerificationRequest = async (userId: number): Promise<void> => {
    await db.delete(EmailVerificationRequestTable).where(eq(EmailVerificationRequestTable.userId, userId));
}

export const sendVerificationEmail = (email: string, code: string): void => {
    console.log(`To ${email}: Your verification code is ${code}`);
}

export const setEmailVerificationRequestCookie = (event: RequestEvent, request: EmailVerificationRequest): void => {
    event.cookies.set("email_verification", request.id, {
        httpOnly: true,
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
        expires: request.expiresAt,
    })
}

export const getUserEmailVerificationRequest = async (userId: number, id: string): Promise<EmailVerificationRequest | null> => {
    const row = await db.select().from(EmailVerificationRequestTable).where(and(eq(EmailVerificationRequestTable.id, id), eq(EmailVerificationRequestTable.userId, userId)));

    if (row.length === 0) {
        return null;
    }

    const request: EmailVerificationRequest = {
        id: row[0].id,
        userId: row[0].userId,
        code: row[0].code,
        email: row[0].email,
        expiresAt: new Date(row[0].expiresAt),
    };

    return request;
}

export const deleteEmailVerificationRequestCookie = (event: RequestEvent): void => {
    event.cookies.set("email_verification", "", {
        httpOnly: true,
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
        maxAge: 0
    });
}

export const getUserEmailVerificationRequestFromRequest = async (event: RequestEvent): Promise<EmailVerificationRequest | null> => {
    if (event.locals.user === null) {
        return null;
    }

    const id = event.cookies.get("email_verification") ?? null;
    if (id === null) {
        return null;
    }

    const request = getUserEmailVerificationRequest(event.locals.user.id, id);

    if (request === null) {
        deleteEmailVerificationRequestCookie(event);
    }

    return request;
}