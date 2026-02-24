import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad, PageServerLoadEvent } from "./$types";
import { checkEmailAvailability, verifyEmailInput } from "$lib/server/email";
import { createUser, verifyUsernameInput } from "$lib/server/user";
import { verifyPasswordStrength } from "$lib/server/password";
import { createEmailVerificationRequest, sendVerificationEmail, setEmailVerificationRequestCookie } from "$lib/server/email-verification";
import { createSession, generateSessionToken, setSessionTokenCookie, type SessionFlags } from "$lib/server/session";

export const load: PageServerLoad = (event: PageServerLoadEvent) => {
    if (event.locals.session !== null && event.locals.user !== null) {
        if (!event.locals.user.emailVerified) {
            redirect(302, "/verify-email");
        }
        if (!event.locals.user.registered2FA) {
            redirect(302, "2fa/setup");
        }
        if (!event.locals.session.twoFactorVerified) {
            redirect(302, "/2fa");
        }
        redirect(302, "/");
    }
    return {};
}

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const email = formData.get("email");
        const username = formData.get("username");
        const password = formData.get("password");
        
        if (typeof email !== "string" || typeof username !== "string" || typeof password !== "string") {
            return fail(400, {
                message: "Invalid of missing fields",
                email: "",
                username: "",
            });
        }

        if (email === "" || username === "" || password === "") {
            return fail(400, {
                message: "Please enter your username, email and password",
                email,
                username,
            });
        }

        if (!verifyEmailInput(email)) {
            return fail(400, {
                message: "invalid email",
                email,
                username,
            });
        }

        const emailAvailable = checkEmailAvailability(email);
        if (!emailAvailable) {
            return fail(400, {
                message: "Email is already used",
                email,
                username,
            });
        }

        if (!verifyUsernameInput(username)) {
            return fail(400, {
                message: "Invalid Username",
                email,
                username,
            });
        }
        
        const strongPassword = await verifyPasswordStrength(password);
        if (!strongPassword) {
            return fail(400, {
                message: "Weak password",
                email,
                username,
            });
        }

        const user = await createUser(email, username, password);
        const emailVerificationRequest = await createEmailVerificationRequest(user.id, user.email);
        sendVerificationEmail(emailVerificationRequest.email, emailVerificationRequest.code);
        setEmailVerificationRequestCookie(event, emailVerificationRequest);

        const sessionFlags: SessionFlags = {
            twoFactorVerified: false,
        }

        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, user.id, sessionFlags);
        setSessionTokenCookie(event, sessionToken, session.expiresAt);
        redirect(302, "/2fa/setup");
    },
} satisfies Actions