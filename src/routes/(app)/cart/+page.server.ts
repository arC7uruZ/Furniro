import { db } from "$lib/server/db"
import { CartItemTable, ColorTable, ImageTable, ProductTable, SizeTable } from "$lib/server/db/schema"
import { and, eq } from "drizzle-orm"
import type { Actions, PageServerLoad, PageServerLoadEvent } from "./$types"
import { fail } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ locals, depends }: PageServerLoadEvent) => {

    if (locals.user === null || locals.session === null) {
        return {
            session: locals.session,
            user: locals.user,
            cartItems: [],
        }
    }

    const cartItems = await db.select({
        productId: ProductTable.id,
        imgSrc: ImageTable.imgSrc,
        imgAlt: ImageTable.imgAlt,
        title: ProductTable.title,
        price: ProductTable.price,
        discount: ProductTable.discount,
        sizeId: SizeTable.id,
        sizeTitle: SizeTable.title,
        colorId: ColorTable.id,
        colorRgb: ColorTable.rgb,
        quantity: CartItemTable.quantity,
    }).from(CartItemTable)
        .innerJoin(ProductTable, eq(CartItemTable.productId, ProductTable.id))
        .innerJoin(SizeTable, eq(SizeTable.id, CartItemTable.sizeId))
        .innerJoin(ColorTable, eq(ColorTable.id, CartItemTable.colorId))
        .innerJoin(ImageTable, and(eq(ImageTable.productId, ProductTable.id), eq(ImageTable.order, 0)))
        .where(eq(CartItemTable.userId, locals.user.id))
        // .groupBy(CartItemTable.productId)

    console.log(cartItems);

    return {
        session: locals.session,
        user: locals.user,
        cartItems
    }
}

export const actions = {
    deleteCartItem: async (event) => {
        console.log("xibiu");
        const formData = await event.request.formData();
        const userId = formData.get("userId");
        const productId = formData.get("productId");
        const sizeId = formData.get("sizeId");
        const colorId = formData.get("colorId");
1
        if (typeof userId !== "string" || typeof productId !== "string" || typeof sizeId !== "string" || typeof colorId !== "string") {
            return fail(400, {
                message: "Invalid fields",
            });
        }

        if (userId === "" || productId === "" || sizeId === "" || colorId === "") {
            return fail(400, {
                message: "Fields cannot be empty",
            });
        }

        await db.delete(CartItemTable).where(
            and(
                eq(CartItemTable.productId, Number(productId)),
                eq(CartItemTable.userId, Number(userId)),
                eq(CartItemTable.sizeId, Number(sizeId)),
                eq(CartItemTable.colorId, Number(colorId)),
            )
        )
    }
} satisfies Actions