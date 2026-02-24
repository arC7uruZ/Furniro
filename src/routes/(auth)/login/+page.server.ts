import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoadEvent } from "./$types";
import { verifyEmailInput } from "$lib/server/email";
import { getUserFromEmail, getUserPasswordHash } from "$lib/server/user";
import { verifyPasswordHash } from "$lib/server/password";
import { createSession, deleteSession, deleteSessionTokenCookie, generateSessionToken, setSessionTokenCookie, type SessionFlags } from "$lib/server/session";

export const load = async (event: PageServerLoadEvent) => {
    if (event.locals.session !== null && event.locals.user !== null) {
        if (!event.locals.user.emailVerified) {
            redirect(302, "/verify-email");
        }

        if (!event.locals.user.registered2FA) {
            redirect(302, "/2fa/setup");
        }

        if (!event.locals.session.twoFactorVerified) {
            redirect(302, "/2fa");
        }
        redirect(302, "/")
    }

    return {};
}

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const email = formData.get("email");
        const password = formData.get("password");


        if (typeof email !== "string" || typeof password !== "string") {
            return fail(400, {
                message: "Invalid or missing fields",
                email: "",
            });
        }

        if (email === "" || password === "") {
            return fail(400, {
                message: "Please enter your email and password",
                email
            });
        }

        if (!verifyEmailInput(email)) {
            return fail(400, {
                message: "Invalid email",
                email
            });
        }

        const user = await getUserFromEmail(email);
        if (user === null) {
            return fail(400, {
                message: "Account does not exists",
                email
            })
        }

        const passwordHash = await getUserPasswordHash(user.id);
        const validPassword = await verifyPasswordHash(passwordHash, password);

        if (!validPassword) {
            return fail(400, {
                message: "Invalid password",
                email
            });
        }

        const sessionFlags: SessionFlags = {
            twoFactorVerified: false
        }

        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, user.id, sessionFlags);
        setSessionTokenCookie(event, sessionToken, session.expiresAt);

        if (!user.emailVerified) {
            redirect(302, "/verify-email");
        }

        // if (!user.registered2FA) {
        //     redirect(302, "/2fa/setup");
        // }
        // redirect(302, "/2fa");
        redirect(303, "/");
    }
} satisfies Actions