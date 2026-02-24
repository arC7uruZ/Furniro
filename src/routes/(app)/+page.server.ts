import type { PageServerLoad } from './$types';
import { ProductCategoryTable, ProductTable, ImageTable, SetTable, ProductSetTable } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ params, locals }) => {

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
    .groupBy(ProductTable.id)
    .limit(8);

    const carouselProducts = await db.select({
        productImg: ImageTable.imgSrc,
        productImgAlt: ImageTable.imgAlt,
        SetName: SetTable.title,
        InnerPiece: ProductTable.innerPiece,
    })
        .from(ProductTable)
        .innerJoin(ProductSetTable, eq(ProductTable.id, ProductSetTable.productId))
        .innerJoin(SetTable, eq(ProductSetTable.setId, SetTable.id))
        .innerJoin(ImageTable, and(eq(ImageTable.productId, ProductTable.id), eq(ImageTable.order, 0)))
        .groupBy(ProductTable.id)
        .limit(4);

    const categoryProducts = await db.select({
        productImg: ImageTable.imgSrc,
        SetName: SetTable.title,
        SetId: SetTable.id
    })
        .from(ProductTable)
        .innerJoin(ProductSetTable, eq(ProductTable.id, ProductSetTable.productId))
        .innerJoin(SetTable, eq(SetTable.id, ProductSetTable.setId))
        .innerJoin(ImageTable, and(eq(ImageTable.productId, ProductTable.id), eq(ImageTable.order, 0)))
        .groupBy(ProductSetTable.productId)
        .limit(3);


        console.log(categoryProducts);

    return {
        products,
        categoryProducts,
        carouselProducts
    };
};