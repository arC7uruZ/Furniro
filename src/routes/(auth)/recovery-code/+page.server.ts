import { getUserRecoveryCode } from "$lib/server/user";
import { redirect } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

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

    if (!event.locals.session.twoFactorVerified) {
        redirect(302, "/2fa");
    }

    const recoveryCode = await getUserRecoveryCode(event.locals.user.id);
    return {
        recoveryCode
    }
}