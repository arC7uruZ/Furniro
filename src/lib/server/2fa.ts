import { and, eq } from "drizzle-orm"
import { db } from "./db"
import { SessionTable, UserTable } from "./db/schema"
import { decryptToString, encryptString } from "./encryption";
import { generateRandomRecoveryCode } from "./utils";

export const resetUser2FAWithRecoveryCode = async (userId: number, recoveryCode: string): Promise<boolean> => {
    const row = await db.select({ recoveryCode: UserTable.recoveryCode }).from(UserTable).where(eq(UserTable.id, userId)).get();
    // const row = await db.query.userTable.findFirst({
    //     where: eq(userTable.user_id, userId),
    // })

    if (row === undefined) {
        return false;
    }

    const userRecoveryCode = decryptToString(row.recoveryCode); 

    if (recoveryCode !== userRecoveryCode) {
        return false;
    }

    const newRecoveryCode = generateRandomRecoveryCode();
    const encryptedNewRecoveryCode = encryptString(newRecoveryCode);

    await db.update(SessionTable).set({
        twoFactorVerified: true,
    }).where(eq(SessionTable.userId, userId));

    const result = await db.update(UserTable).set({
        recoveryCode: encryptedNewRecoveryCode,
        totpKey: null,
    }).where(and(eq(UserTable.id, userId), eq(UserTable.recoveryCode, row.recoveryCode)));

    return result.rowsAffected > 0;
}