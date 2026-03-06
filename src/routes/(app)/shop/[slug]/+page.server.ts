import { db } from "$lib/server/db";
import {
    CartItemTable,
    CategoryTable,
    ColorTable,
    ImageTable,
    ProductCategoryTable,
    ProductTable,
    ProductTagTable,
    SizeTable,
    StockTable,
    TagTable,
} from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {

    const rows = await db.select({
        id: ProductTable.id,
        title: ProductTable.title,
        shortDescription: ProductTable.shortDescription,
        description: ProductTable.description,
        price: ProductTable.price,
        innerPiece: ProductTable.innerPiece,
        category: CategoryTable.title,
        discount: ProductTable.discount,
        slug: ProductTable.slug,
        tag: TagTable.title,
        sku: StockTable.sku,
        imgId: ImageTable.id,
        imgSrc: ImageTable.imgSrc,
        imgAlt: ImageTable.imgAlt,
        imgOrder: ImageTable.order,
        sizeId: SizeTable.id,
        sizeTitle: SizeTable.title,
        colorId: ColorTable.id,
        colorTitle: ColorTable.title,
        colorRgb: ColorTable.rgb,
    }).from(ProductTable)
        .innerJoin(ImageTable, eq(ProductTable.id, ImageTable.productId))
        .innerJoin(ProductCategoryTable, eq(ProductTable.id, ProductCategoryTable.productId))
        .innerJoin(CategoryTable, eq(ProductCategoryTable.categoryId, CategoryTable.id))
        .innerJoin(ProductTagTable, eq(ProductTagTable.productId, ProductTable.id))
        .innerJoin(TagTable, eq(ProductTagTable.tagId, TagTable.id))
        .innerJoin(StockTable, eq(StockTable.productId, ProductTable.id))
        .innerJoin(SizeTable, eq(StockTable.sizeId, SizeTable.id))
        .innerJoin(ColorTable, eq(StockTable.colorId, ColorTable.id))
        .where(eq(ProductTable.slug, params.slug))

    const productsMap = new Map<number, {
        id: number,
        title: string,
        shortDescription: string,
        description: string,
        slug: string,
        discount: number | null,
        price: number,
        innerPiece: boolean,
        sku: string,
        category: string,
        tags: string[],
        images: {
            id: number,
            imgSrc: string,
            imgAlt: string,
            imgOrder: number
        }[],
        sizes: {
            id: number,
            title: string,
        }[],
        colors: {
            id: number,
            title: string,
            rgb: string
        }[],
    }>();

    for (const row of rows) {
        if (!productsMap.has(row.id)) {
            productsMap.set(row.id, {
                id: row.id,
                title: row.title,
                shortDescription: row.shortDescription,
                description: row.description,
                price: row.price,
                slug: row.slug,
                discount: row.discount,
                innerPiece: row.innerPiece,
                sku: row.sku,
                category: row.category,
                tags: [],
                images: [],
                sizes: [],
                colors: [],
            })
        }

        if (row.imgId) {
            if (!productsMap.get(row.id)!.images.find((img) => img.id === row.imgId)) {
                productsMap.get(row.id)!.images.push({ id: row.imgId, imgSrc: row.imgSrc, imgAlt: row.imgAlt, imgOrder: row.imgOrder });
            }
        }

        if (row.sizeId) {
            if (!productsMap.get(row.id)!.sizes.find((size) => size.id === row.sizeId)) {
                productsMap.get(row.id)!.sizes.push({ id: row.sizeId, title: row.sizeTitle });
            }
        }

        if (row.colorId) {
            if (!productsMap.get(row.id)!.colors.find((color) => color.id === row.colorId)) {
                productsMap.get(row.id)!.colors.push({ id: row.colorId, title: row.colorTitle, rgb: row.colorRgb });
            }
        }

        if (row.tag) {
            if (!productsMap.get(row.id)!.tags.find((tag) => tag === row.tag)) {
                productsMap.get(row.id)!.tags.push(row.tag);
            }
        }
    }

    const product = Array.from(productsMap.values())[0];

    const relatedProducts = await db.select({
        title: ProductTable.title,
        description: ProductTable.shortDescription,
        price: ProductTable.price,
        slug: ProductTable.slug,
        imgSrc: ImageTable.imgSrc,
        imgAlt: ImageTable.imgAlt,
        createdAt: ProductTable.createdAt,
        discount: ProductTable.discount,
    }).from(ProductTable)
        .innerJoin(ImageTable, and(eq(ImageTable.productId, ProductTable.id), eq(ImageTable.order, 0)))
        .innerJoin(ProductCategoryTable, eq(ProductTable.id, ProductCategoryTable.productId))
        .innerJoin(CategoryTable, eq(ProductCategoryTable.categoryId, CategoryTable.id))
        .where(eq(CategoryTable.title, product.category))
        .groupBy(ProductTable.id)
        .limit(4);

    // console.log(product)
    return {
        product,
        relatedProducts,
    }
}

export const actions = {
    addToCart: async (event) => {

        if (event.locals.user === null || event.locals.session === null) {
            redirect(302, `/login?redirectTo=${event.url.pathname}`)
        }
        const form = await event.request.formData();

        const productId = form.get("productId");
        const quantity = form.get("quantity");
        const colorId = form.get("color");
        const sizeId = form.get("size");

        if (typeof productId !== "string" || typeof quantity !== "string" || typeof colorId !== "string" || typeof sizeId !== "string") {
            return fail(400, {
                message: "invalid or missing fields",
            });
        }

        if (productId === "" || quantity === "" || colorId === "" || sizeId === "") {
            return fail(400, {
                message: "Please insert products data"
            })
        }

        const cartItem = await db.query.CartItemTable.findFirst({
            where: and(eq(CartItemTable.productId, Number(productId)), eq(CartItemTable.colorId, Number(colorId)), eq(CartItemTable.sizeId, Number(sizeId)))
        })

        if (cartItem) {
            await db.update(CartItemTable).set({
                quantity: cartItem.quantity + Number(quantity),
                updatedAt: new Date(),
            }).where(and(eq(CartItemTable.colorId, Number(colorId)), eq(CartItemTable.sizeId, Number(sizeId)), eq(CartItemTable.productId, Number(productId))))
        } else {
            await db.insert(CartItemTable).values({
                userId: event.locals.user.id,
                productId: Number(productId),
                colorId: Number(colorId),
                sizeId: Number(sizeId),
                quantity: Number(quantity),
                createdAt: new Date(),
                updatedAt: new Date(),
            })
        }
    },

    compare: async (event) => {
        const form = await event.request.formData();
        console.log("form", form);
    }


} satisfies Actions