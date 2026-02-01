import { category, productTable, type } from '$lib/db/schema.js';
import { and, asc, count, desc, eq, gte, like, lte, min, ne } from 'drizzle-orm';


export async function GET({ url, locals }) {
    const pageSize = Number(url.searchParams.get('pageSize') ?? 8);
    const page = Number(url.searchParams.get('page') ?? 1);

    const nameFilter = url.searchParams.get('name');
    const typeFilter = url.searchParams.get('type');
    const categoryFilter = url.searchParams.get('category');
    const minPrice = Number(url.searchParams.get('minPrice'));
    const maxPrice = Number(url.searchParams.get('maxPrice'));
    const discount = Boolean(url.searchParams.get('discount'));
    const newFilter = Boolean(url.searchParams.get('new'));
    const sort = url.searchParams.get('sort');

    // console.log(`sort: ${sort}`);

    function getOrderBy(sort: string | null) {
        switch (sort) {
            case 'price_asc':
                return asc(productTable.price);
            case 'price_desc':
                return desc(productTable.price);
            case 'date_asc':
                return asc(productTable.created_at);
            case 'date_desc':
                return desc(productTable.created_at);
            case 'title_asc':
                return asc(productTable.title);
            case 'title_desc':
                return desc(productTable.title);
            default:
                return undefined;
        }
    }

    const where: any[] = [];

    if (minPrice) {
        where.push(gte(productTable.price, minPrice));
    }

    if (maxPrice) {
        where.push(lte(productTable.price, maxPrice));
    }

    if (discount) {
        where.push(ne(productTable.discount, 0));
    }

    if (newFilter) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        where.push(gte(productTable.created_at, thirtyDaysAgo.getTime()));
    }

    if (nameFilter) {
        where.push(like(productTable.title, `%${nameFilter}%`));
    }

    let query = locals.db.select({
        product_id: productTable.product_id,
        title: productTable.title,
        description: productTable.description,
        price: productTable.price,
        discount: productTable.discount,
        category: productTable.category,
        type: productTable.type,
        img_src: productTable.img_src,
        img_alt: productTable.img_alt,
        created_at: productTable.created_at
    }).from(productTable);

    let queryCount = locals.db.select({ count: count() }).from(productTable);

    if (categoryFilter) {
        query = query
            .innerJoin(category, eq(category.category_id, productTable.category));

        queryCount = queryCount
            .innerJoin(category, eq(category.category_id, productTable.category));

        where.push(eq(category.title, categoryFilter));
    }

    if (typeFilter) {
        query = query
            .innerJoin(type, eq(type.type_id, productTable.type));

        queryCount = queryCount
            .innerJoin(type, eq(type.type_id, productTable.type));

        where.push(eq(type.title, typeFilter));
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