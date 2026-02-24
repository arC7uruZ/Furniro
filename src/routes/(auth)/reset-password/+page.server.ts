import { deletePasswordResetSessionTokenCookie, invalidateUserPasswordResetSession, validatePasswordResetSessionRequest } from "$lib/server/password-reset";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, RequestEvent } from "./$types";
import { verifyPasswordStrength } from "$lib/server/password";
import { createSession, generateSessionToken, invalidateUserSessions, setSessionTokenCookie, type SessionFlags } from "$lib/server/session";
import { updateUserPassword } from "$lib/server/user";

export const load = async (event: RequestEvent) => {
    const { session, user } = await validatePasswordResetSessionRequest(event);

    if (session === null) {
        redirect(302, "/forgot-password");
    }

    if (!session.emailVerified) {
        redirect(302, "/reset-password/verify-email");
    }

    if (user.registered2FA && !session.twoFactorVerified) {
        redirect(302, "/reset-password/2fa");
    }

    return {};
}

export const actions = {
    default: async (event) => {
        const { session: passwordResetSession, user } = await validatePasswordResetSessionRequest(event);

        if (passwordResetSession === null) {
            return fail(401, {
                message: "Not authenticated"
            });
        }

        if (!passwordResetSession.emailVerified) {
            return fail(403, {
                message: "Forbidden"
            });
        }

        if (user.registered2FA && !passwordResetSession.twoFactorVerified) {
            return fail(403, {
                message: "Forbidden"
            });
        }

        const formData = await event.request.formData();
        const password = formData.get("password");
        if (typeof password !== "string") {
            return fail(400, {
                message: "Invalid or missing fields"
            });
        }

        const strongPassword = await verifyPasswordStrength(password);
        if (!strongPassword) {
            return fail(400, {
                message: "Weak password"
            });
        }

        await invalidateUserPasswordResetSession(passwordResetSession.userId);
        await invalidateUserSessions(passwordResetSession.userId);
        await updateUserPassword(passwordResetSession.userId, password);

        const sessionFlags: SessionFlags = {
            twoFactorVerified: passwordResetSession.twoFactorVerified
        }
        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, user.id, sessionFlags);
        setSessionTokenCookie(event, sessionToken, session.expiresAt);
        deletePasswordResetSessionTokenCookie(event);
        redirect(302, "/");
    }

} satisfies Actions