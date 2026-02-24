import { resetUser2FAWithRecoveryCode } from "$lib/server/2fa";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, RequestEvent } from "./$types";

export const load = async (event: RequestEvent) => {
    if (event.locals.session === null || event.locals.user === null) {
        redirect(302, "/login");
    }

    if (!event.locals.user.emailVerified) {
        redirect(302, "/verify-email");
    }

    if (!event.locals.user.registered2FA) {
        redirect(302, "/2fa/setup");
    }

    if (event.locals.session.twoFactorVerified) {
        redirect(302, "/");
    }

    return {};
}

export const actions = {
    default: async (event) => {
        if (event.locals.session === null || event.locals.user === null) {
            return fail(401, {
                message: "Not authenticated"
            });
        }

        if (!event.locals.user.emailVerified || !event.locals.user.registered2FA || event.locals.session.twoFactorVerified) {
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

        const valid = await resetUser2FAWithRecoveryCode(event.locals.user.id, code);
        if (!valid) {
            return fail(400, {
                message: "Invalid recovery code"
            });
        }

        redirect(302, "/2fa/setup");
    }

} satisfies Actions;