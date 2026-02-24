import { verifyEmailInput } from "$lib/server/email";
import { createPasswordResetSession, invalidateUserPasswordResetSession, sendPasswordResetEmail, setPasswordResetSessionTokenCookie } from "$lib/server/password-reset";
import { generateSessionToken } from "$lib/server/session";
import { getUserFromEmail } from "$lib/server/user";
import { fail, redirect, type Actions } from "@sveltejs/kit";

export const actions = {

    default: async (event) => {
        const formData = await event.request.formData();
        const email = formData.get("email");
        if (typeof email !== "string") {
            return fail(400, {
                message: "Invalid or missing fields",
                email: "",
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
                message: "Account does not exist",
                email
            });
        }

        invalidateUserPasswordResetSession(user.id);
        const sessionToken = generateSessionToken();
        const session = await createPasswordResetSession(sessionToken, user.id, user.email);
        sendPasswordResetEmail(session.email, session.code);
        setPasswordResetSessionTokenCookie(event, sessionToken, session.expiresAt);

        redirect(302, "/reset-password/verify-email");
    }

} satisfies Actions