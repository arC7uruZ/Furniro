import { ProductTable } from '$lib/server/db/schema.js';
import { sql } from 'drizzle-orm';


export async function GET({ url, locals }) {
    // const offset = Number(url.searchParams.get('offset') ?? 0);

    // const products = await locals.db.select().from(productTable).limit(8).offset(offset);

    const result = await locals.db
        .select({
            minPrice: sql<number>`MIN(${ProductTable.price})`,
            maxPrice: sql<number>`MAX(${ProductTable.price})`,
        })
        .from(ProductTable);

    console.log(result);

    return new Response(JSON.stringify(result));
}