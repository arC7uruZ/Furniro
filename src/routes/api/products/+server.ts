import { db } from '$lib/server/db';
import { CategoryTable, ImageTable, ProductCategoryTable, ProductSetTable, ProductTable, SetTable } from '$lib/server/db/schema.js';
import { and, asc, count, desc, eq, gte, like, lte, ne, SQL } from 'drizzle-orm';


export async function GET({ url }) {
    const pageSize = Number(url.searchParams.get('pageSize') ?? 8);
    const page = Number(url.searchParams.get('page') ?? 1);

    const nameFilter = url.searchParams.get('name');
    const typeFilter = url.searchParams.get('type');
    const categoryFilter = url.searchParams.get('category');
    const setFilter = url.searchParams.get('set');
    const minPrice = Number(url.searchParams.get('minPrice'));
    const maxPrice = Number(url.searchParams.get('maxPrice'));
    const discount = Boolean(url.searchParams.get('discount'));
    const newFilter = Boolean(url.searchParams.get('new'));
    const sort = url.searchParams.get('sort');

    // console.log(`sort: ${sort}`);

    function getOrderBy(sort: string | null) {
        switch (sort) {
            case 'price_asc': return asc(ProductTable.price);
            case 'price_desc': return desc(ProductTable.price);
            case 'date_asc': return asc(ProductTable.createdAt);
            case 'date_desc': return desc(ProductTable.createdAt);
            case 'title_asc': return asc(ProductTable.title);
            case 'title_desc': return desc(ProductTable.title);
            default: return undefined;
        }
    }

    const where: SQL[] = [];

    if (minPrice) where.push(gte(ProductTable.price, minPrice));
    if (maxPrice) where.push(lte(ProductTable.price, maxPrice));
    if (discount) where.push(ne(ProductTable.discount, 0));
    if (nameFilter) where.push(like(ProductTable.title, `%${nameFilter}%`));
    if (setFilter) where.push(eq(SetTable.title, setFilter.toLowerCase()));
    if (typeFilter) where.push(eq(ProductTable.innerPiece, typeFilter === "inner"));
    if (categoryFilter) where.push(eq(CategoryTable.title, categoryFilter));
    if (newFilter) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        where.push(gte(ProductTable.createdAt, thirtyDaysAgo.getTime()));
    }

    const whereClause = where.length > 0 ? and(...where) : undefined;
    const orderBy = getOrderBy(sort);

    const [totalCount, products] = await Promise.all([
        db.select({ count: count() }).from(ProductTable)
            .innerJoin(ProductSetTable, eq(ProductSetTable.productId, ProductTable.id))
            .innerJoin(ProductCategoryTable, eq(ProductCategoryTable.productId, ProductTable.id))
            .innerJoin(CategoryTable, eq(ProductCategoryTable.categoryId, CategoryTable.id))
            .innerJoin(SetTable, eq(ProductSetTable.setId, SetTable.id))
            .innerJoin(ImageTable, and(eq(ImageTable.productId, ProductTable.id), eq(ImageTable.order, 0)))
            .where(whereClause),
        db.select({
            id: ProductTable.id,
            title: ProductTable.title,
            description: ProductTable.shortDescription,
            slug: ProductTable.slug,
            price: ProductTable.price,
            discount: ProductTable.discount,
            set: SetTable.title,
            imgSrc: ImageTable.imgSrc,
            imgAlt: ImageTable.imgAlt,
            createdAt: ProductTable.createdAt
        }).from(ProductTable)
            .innerJoin(ProductSetTable, eq(ProductSetTable.productId, ProductTable.id))
            .innerJoin(ProductCategoryTable, eq(ProductCategoryTable.productId, ProductTable.id))
            .innerJoin(CategoryTable, eq(ProductCategoryTable.categoryId, CategoryTable.id))
            .innerJoin(SetTable, eq(ProductSetTable.setId, SetTable.id))
            .innerJoin(ImageTable, and(eq(ImageTable.productId, ProductTable.id), eq(ImageTable.order, 0)))
            .where(whereClause)
            .groupBy(ProductTable.id)
            .orderBy(...(orderBy ? [orderBy] : []))
            .limit(pageSize)
            .offset((page - 1) * pageSize)
    ]);

    return new Response(JSON.stringify({
        products,
        meta: {
            total: totalCount[0]?.count || 0,
            page,
            pageSize
        }
    }));
}