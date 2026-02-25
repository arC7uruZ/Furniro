import { db } from "$lib/server/db";
import { ColorTable, ImageTable, ProductTable, SizeTable, StockTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {

    const rows = await db.select({
        id: ProductTable.id,
        title: ProductTable.title,
        shortDescription: ProductTable.shortDescription,
        description: ProductTable.description,
        price: ProductTable.price,
        innerPiece: ProductTable.innerPiece,
        imgSrc: ImageTable.imgSrc,
        imgAlt: ImageTable.imgAlt,
        imgOrder: ImageTable.order,
        size: SizeTable.title,
        colorTitle: ColorTable.title,
        colorRgb: ColorTable.rgb,
    }).from(ProductTable)
        .innerJoin(ImageTable, eq(ProductTable.id, ImageTable.productId))
        .innerJoin(StockTable, eq(StockTable.productId, ProductTable.id))
        .innerJoin(SizeTable, eq(StockTable.sizeId, SizeTable.id))
        .innerJoin(ColorTable, eq(StockTable.colorId, ColorTable.id))
        .where(eq(ProductTable.slug, params.slug))

    const productsMap = new Map<number, {
        id: number,
        title: string,
        shortDescription: string,
        description: string,
        price: number,
        innerPiece: boolean,
        images: {
            imgSrc: string,
            imgAlt: string,
            imgOrder: number
        }[],
        sizes: string[],
        colors: {
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
                innerPiece: row.innerPiece,
                images: [],
                sizes: [],
                colors: [],
            })
        }

        if (row.imgSrc) {
            if (!productsMap.get(row.id)!.images.find((img) => img.imgSrc === row.imgSrc)) {
                productsMap.get(row.id)!.images.push({imgSrc: row.imgSrc, imgAlt: row.imgAlt, imgOrder: row.imgOrder});
            }
        }

        if (row.size) {
            if (productsMap.get(row.id)!.sizes.indexOf(row.size) < 0) {
                productsMap.get(row.id)!.sizes.push(row.size);
            }
        }

        if (row.colorTitle) {
            if (!productsMap.get(row.id)!.colors.find((color) => color.title === row.colorTitle)) {
                productsMap.get(row.id)!.colors.push({title: row.colorTitle, rgb: row.colorRgb});
            }
        }
    }

    const product = Array.from(productsMap.values())[0];

    // console.log(product)
    return {
        product,
    }
}