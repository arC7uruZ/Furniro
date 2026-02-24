import { ImageTable, ProductTable } from '$lib/server/db/schema';
import { and, count, eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ params, locals }) => {

    const priceRange = await db
        .select({
            minPrice: sql<number>`MIN(${ProductTable.price})`,
            maxPrice: sql<number>`MAX(${ProductTable.price})`,
        })
        .from(ProductTable);

    const products = await db.select({
        title: ProductTable.title,
        description: ProductTable.shortDescription,
        price: ProductTable.price,
        imgSrc: ImageTable.imgSrc,
        imgAlt: ImageTable.imgAlt,
        createdAt: ProductTable.createdAt,
        discount: ProductTable.discount,
    }).from(ProductTable)
        .innerJoin(ImageTable, and(eq(ImageTable.productId, ProductTable.id), eq(ImageTable.order, 0)))
        .limit(8);

    let queryCount = await db.select({ count: count() }).from(ProductTable);

    console.log(`products: ${JSON.stringify(products)}`);

    return {
        priceRange,
        products,
        meta: {
            total: queryCount[0]?.count || 0,
        }
    };
};