import { db } from "$lib/server/db";
import { CartItemTable } from "$lib/server/db/schema";
import { and, eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ request, locals }) => {
    const userId = locals.user?.id;
    const { productId, sizeId, colorId } = await request.json();

    // console.log(request);
    // console.log(productId, sizeId, colorId);
    await db.delete(CartItemTable).where(
            and(
                eq(CartItemTable.productId, Number(productId)),
                eq(CartItemTable.userId, Number(userId)),
                eq(CartItemTable.sizeId, Number(sizeId)),
                eq(CartItemTable.colorId, Number(colorId)),
            )
        )
    return new Response("deletado com sucesso")
}