import { productTable } from '$lib/db/schema.js';
import { sql } from 'drizzle-orm';


export async function GET({ url, locals }) {
    // const offset = Number(url.searchParams.get('offset') ?? 0);

    // const products = await locals.db.select().from(productTable).limit(8).offset(offset);

    const result = await locals.db
        .select({
            minPrice: sql<number>`MIN(${productTable.price})`,
            maxPrice: sql<number>`MAX(${productTable.price})`,
        })
        .from(productTable);

    console.log(result);

    return new Response(JSON.stringify(result));
}