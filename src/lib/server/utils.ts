import { encodeBase32UpperCaseNoPadding } from "@oslojs/encoding";

export const generateRandomRecoveryCode = (): string => {
    const recoveryCodeBytes = new Uint8Array(10);
    crypto.getRandomValues(recoveryCodeBytes);
    const recoveryCode = encodeBase32UpperCaseNoPadding(recoveryCodeBytes);
    return recoveryCode;
}

export const generateRandomOTP = (): string => {
    const recoveryCodeBytes = new Uint8Array(5);
    crypto.getRandomValues(recoveryCodeBytes);
    const recoveryCode = encodeBase32UpperCaseNoPadding(recoveryCodeBytes);
    return recoveryCode;
}