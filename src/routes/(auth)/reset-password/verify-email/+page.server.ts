import { setPasswordResetSessionAsEmailVerified, setPasswordResetSessionTokenCookie, validatePasswordResetSessionRequest } from "$lib/server/password-reset";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { setUserAsEmailVerifiedIfEmailMatches } from "$lib/server/user";

export const load = async (event: RequestEvent) => {
    const { session } = await validatePasswordResetSessionRequest(event);
    if (session === null) {
        redirect(302, "/forgot-password");
    }

    if (session.emailVerified) {
        if (!session.twoFactorVerified) {
            redirect(302, "/reset-password/2fa");
        }
        redirect(302, "/reset-password");
    }

    return {
        email: session.email
    };
}

export const actions = {

    default: async (event) => {
        const { session } = await validatePasswordResetSessionRequest(event);
        if (session === null) {
            return fail(401, {
                message: "Not authenticated"
            });
        }

        if (session.emailVerified) {
            return fail(403, {
                message: "Forbidden"
            });
        }

        const formData = await event.request.formData();
        const code = formData.get("code");
        if (typeof code !== "string") {
            return fail(400, {
                message: "Invalid or missing fields"
            });
        }

        if (code === "") {
            return fail(400, {
                message: "Please enter your code"
            });
        }

        if (code !== session.code) {
            return fail(400, {
                message: "Incorrect code"
            });
        }

        await setPasswordResetSessionAsEmailVerified(session.id);
        const emailMatches = await setUserAsEmailVerifiedIfEmailMatches(session.userId, session.email);
        if (!emailMatches) {
            return fail(400, {
                message: "Please restart the process"
            });
        }

        redirect(302, "/reset-password/2fa");
    }

} satisfies Actions;