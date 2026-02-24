import { resetUser2FAWithRecoveryCode } from "$lib/server/2fa";
import { setPasswordResetSessionAs2FAVerified, validatePasswordResetSessionRequest } from "$lib/server/password-reset.js";
import { getUserTOTPKey } from "$lib/server/user";
import { verifyTOTP } from "@oslojs/otp";
import { fail, redirect, type Actions, type RequestEvent } from "@sveltejs/kit";

export const load = async (event: RequestEvent) => {
    const { session, user } = await validatePasswordResetSessionRequest(event);

    if (session === null) {
        redirect(302, "/forgot-password");
    }

    if (!session.emailVerified) {
        redirect(302, "/reset-password/verify-email");
    }

    if (!user.registered2FA) {
        redirect(302, "/reset-password");
    }

    if (session.twoFactorVerified) {
        redirect(302, "/reset-password");
    }

    return {};
}

export const actions = {
    totp: async (event) => {
        const { session, user } = await validatePasswordResetSessionRequest(event);
        if (session === null) {
            return fail(401, {
                totp: {
                    message: "Not authenticated"
                }
            });
        }

        if (!session.emailVerified || !user.registered2FA || session.twoFactorVerified) {
            return fail(403, {
                totp: {
                    message: "Forbidden"
                }
            });
        }

        const formData = await event.request.formData();
        const code = formData.get("code");
        if (typeof code !== "string") {
            return fail(400, {
                totp: {
                    message: "Invalid or missing fields"
                }
            });
        }

        if (code === "") {
            return fail(400, {
                totp: {
                    message: "Please enter your code"
                }
            });
        }

        const totpKey = await getUserTOTPKey(session.userId);
        if (totpKey === null) {
            return fail(403, {
                totp: {
                    message: "Forbideen"
                }
            });
        }

        if (!verifyTOTP(totpKey, 30, 6, code)) {
            return fail(400, {
                totp: {
                    message: "Invalid code"
                }
            });
        }

        await setPasswordResetSessionAs2FAVerified(session.id);
        redirect(302, "/reset-password");
    },

    recovery_code: async (event) => {
        const { session, user } = await validatePasswordResetSessionRequest(event);
        if (session === null) {
            return fail(401, {
                recoveryCode: {
                    message: "Not authenticated"
                }
            });
        }

        if (!session.emailVerified || !user.registered2FA || session.twoFactorVerified) {
            return fail(403, {
                recoveryCode: {
                    message: "Forbidden"
                }
            });
        }

        const formData = await event.request.formData();
        const code = formData.get("code");
        if (typeof code !== "string") {
            return fail(400, {
                recoveryCode: {
                    message: "Invalid or missing fields"
                }
            });
        }

        if (code === "") {
            return fail(400, {
                recoveryCode: {
                    message: "Please enter your code"
                }
            });
        }

        const valid = resetUser2FAWithRecoveryCode(session.userId, code);
        if (!valid) {
            return fail(400, {
                recoveryCode: {
                    message: "Invalid code"
                }
            });
        }

        redirect(302, "/reset-password");
    }
} satisfies Actions