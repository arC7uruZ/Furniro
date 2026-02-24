import { db } from '$lib/server/db';
import { ImageTable, ProductCategoryTable, ProductSetTable, ProductTable, SetTable } from '$lib/server/db/schema.js';
import { and, asc, count, desc, eq, gte, like, lte, min, ne } from 'drizzle-orm';


export async function GET({ url, locals }) {
    const pageSize = Number(url.searchParams.get('pageSize') ?? 8);
    const page = Number(url.searchParams.get('page') ?? 1);

    const nameFilter = url.searchParams.get('name');
    const typeFilter = url.searchParams.get('type');
    const setFilter = url.searchParams.get('set');
    const minPrice = Number(url.searchParams.get('minPrice'));
    const maxPrice = Number(url.searchParams.get('maxPrice'));
    const discount = Boolean(url.searchParams.get('discount'));
    const newFilter = Boolean(url.searchParams.get('new'));
    const sort = url.searchParams.get('sort');

    // console.log(`sort: ${sort}`);

    function getOrderBy(sort: string | null) {
        switch (sort) {
            case 'price_asc':
                return asc(ProductTable.price);
            case 'price_desc':
                return desc(ProductTable.price);
            case 'date_asc':
                return asc(ProductTable.createdAt);
            case 'date_desc':
                return desc(ProductTable.createdAt);
            case 'title_asc':
                return asc(ProductTable.title);
            case 'title_desc':
                return desc(ProductTable.title);
            default:
                return undefined;
        }
    }

    const where: any[] = [];

    if (minPrice) {
        where.push(gte(ProductTable.price, minPrice));
    }

    if (maxPrice) {
        where.push(lte(ProductTable.price, maxPrice));
    }

    if (discount) {
        where.push(ne(ProductTable.discount, 0));
    }

    if (newFilter) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        where.push(gte(ProductTable.createdAt, thirtyDaysAgo.getTime()));
    }

    if (nameFilter) {
        where.push(like(ProductTable.title, `%${nameFilter}%`));
    }


    let query: any = db.select({
        id: ProductTable.id,
        title: ProductTable.title,
        description: ProductTable.shortDescription,
        price: ProductTable.price,
        discount: ProductTable.discount,
        set: SetTable.title,
        imgSrc: ImageTable.imgSrc,
        imgAlt: ImageTable.imgAlt,
        createdAt: ProductTable.createdAt
    }).from(ProductTable)
        .innerJoin(ProductSetTable, eq(ProductSetTable.productId, ProductTable.id))
        .innerJoin(SetTable, eq(ProductSetTable.setId, SetTable.id))
        .innerJoin(ImageTable, and(eq(ImageTable.productId, ProductTable.id), eq(ImageTable.order, 0)))
        .groupBy(ProductTable.id);

    let queryCount: any = db.select({ count: count() }).from(ProductTable)
        .innerJoin(ProductSetTable, eq(ProductSetTable.productId, ProductTable.id))
        .innerJoin(SetTable, eq(ProductSetTable.setId, SetTable.id))
        .innerJoin(ImageTable, and(eq(ImageTable.productId, ProductTable.id), eq(ImageTable.order, 0)))

    if (setFilter) {
        where.push(eq(SetTable.title, setFilter));
    }

    if (typeFilter) {
        if (typeFilter === "inner") {
            where.push(eq(ProductTable.innerPiece, true));
        } else {
            where.push(eq(ProductTable.innerPiece, false));
        }
    }

    if (where.length > 0) {
        query = query.where(and(...where));
        queryCount = queryCount.where(and(...where));
    }

    const orderBy = getOrderBy(sort);

    if (orderBy) {
        query = query.orderBy(orderBy);
    }

    const totalCount = await queryCount;
    const products = (await query.limit(pageSize).offset((page - 1) * pageSize));

    // console.log(`totalCount: ${JSON.stringify(totalCount)}`);
    // console.log(`products: ${JSON.stringify(products)}`);

    return new Response(JSON.stringify({
        products,
        meta: {
            total: totalCount[0]?.count || 0,
            page,
            pageSize
        }
    }));
}