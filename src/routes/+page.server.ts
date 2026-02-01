import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import { category, productTable, type } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {

    const products = await db.select().from(productTable).limit(8);

    const carouselProducts = await db.select({
        productImg: productTable.img_src,
        productImgAlt: productTable.img_alt,
        categoryName: category.title,
        typeName: type.title,
    })
        .from(productTable)
        .innerJoin(category, eq(productTable.category, category.category_id))
        .innerJoin(type, eq(productTable.type, type.type_id))
        .groupBy(productTable.product_id)
        .limit(4);

    const categoryProducts = await db.select({
        productImg: productTable.img_src,
        categoryName: category.title,
        categoryId: category.category_id
    })
        .from(productTable)
        .innerJoin(category, eq(productTable.category, category.category_id))
        .groupBy(productTable.category)
        .limit(3);

    return {
        products,
        categoryProducts,
        carouselProducts
    };
};