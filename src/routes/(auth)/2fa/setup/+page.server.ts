import { setSessionAs2FAVerified } from "$lib/server/session";
import { updateUserTOTPKey } from "$lib/server/user";
import { decodeBase64, encodeBase64 } from "@oslojs/encoding";
import { createTOTPKeyURI, verifyTOTP, verifyTOTPWithGracePeriod } from "@oslojs/otp";
import { fail, redirect, type Actions, type RequestEvent } from "@sveltejs/kit";
import { renderSVG } from "uqr";

export const load = async (event: RequestEvent) => {
    if (event.locals.user === null || event.locals.session === null) {
        redirect(302, "/login");
    }

    if (!event.locals.user.emailVerified) {
        redirect(302, "/verify-email");
    }

    if (event.locals.user.registered2FA && !event.locals.session.twoFactorVerified) {
        redirect(302, "/2fa");
    }

    const totpKey = new Uint8Array(20);
    crypto.getRandomValues(totpKey);
    const encodedTOTPKey = encodeBase64(totpKey);
    const keyURI = createTOTPKeyURI("Furniro", event.locals.user.username, totpKey, 30, 6);
    const qrCode = renderSVG(keyURI);
    return {
        encodedTOTPKey,
        qrCode,
    }
}

export const actions = {

    default: async (event) => {
        if (event.locals.session === null || event.locals.user === null) {
            return fail(401, {
                message: "Not authenticated"
            });
        }

        if (!event.locals.user.emailVerified) {
            return fail(403, {
                message: "Forbidden"
            });
        }

        if (event.locals.user.registered2FA && !event.locals.session.twoFactorVerified) {
            return fail(403, {
                message: "Forbidden"
            });
        }

        const formData = await event.request.formData();
        const encodedKey = formData.get("key");
        const code = formData.get("code")

        if (typeof encodedKey !== "string" || typeof code !== "string") {
            return fail(400, {
                message: "Invalid or missing fields"
            });
        }

        if (code === "") {
            return fail(400, {
                message: "Please enter your code"
            });
        }

        if (encodedKey.length !== 28) {
            return fail(400, {
                message: "Please enter your code"
            });
        }

        let key: Uint8Array;

        try {
            key = decodeBase64(encodedKey);
            console.log("key: ", key)
        } catch {
            return fail(400, {
                message: "Invalid key"
            });
        }

        if (key.byteLength !== 20) {
            return fail(400, {
                message: "Invalid key"
            });
        }

        if (!verifyTOTPWithGracePeriod(key, 30, 6, code, 30)) {
            return fail(400, {
                message: "Invalid code"
            });
        }

        await updateUserTOTPKey(event.locals.user.id, key);
        await setSessionAs2FAVerified(event.locals.session.id);
        return redirect(302, "/recovery-code");
    }

} satisfies Actions