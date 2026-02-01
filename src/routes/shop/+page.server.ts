import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import { category, productTable, type } from '$lib/db/schema';
import { count, eq, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {

    const priceRange = await locals.db
        .select({
            minPrice: sql<number>`MIN(${productTable.price})`,
            maxPrice: sql<number>`MAX(${productTable.price})`,
        })
        .from(productTable);

    // console.log(result);
    const products = await locals.db.select().from(productTable).limit(8);

    let queryCount = await locals.db.select({ count: count() }).from(productTable);

    console.log(`queryCount: ${queryCount[0]?.count}`);

    return {
        priceRange,
        products,
        meta: {
            total: queryCount[0]?.count || 0,
        }
    };
};