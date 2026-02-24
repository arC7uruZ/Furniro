import { PostCategoryTable, PostTable, PostToCategoryTable, UserTable } from "$lib/server/db/schema";
import { count, desc, eq, inArray, like, or, and, countDistinct } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";

export const load: PageServerLoad = async ({ url, locals, params, fetch }) => {

    // const serverPosts = fetch(`/api/posts?${params}`)
    // console.log("params: ", params);
    // console.log("rodei caraio");

    const searchTerm = url.searchParams.get('text') || "";
    const selectedCategories = url.searchParams.getAll('category');
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = 3;
    const offset = (page - 1) * limit;

    const filters = [];

    if (searchTerm) {
        filters.push(or(like(PostTable.title, `%${searchTerm}%`), like(PostTable.content, `%${searchTerm}%`)));
    }

    if (selectedCategories.length > 0) {
        filters.push(inArray(PostCategoryTable.title, selectedCategories));
    }

    const subqueryIds = db
        .selectDistinct({ id: PostTable.id })
        .from(PostTable)
        .leftJoin(PostToCategoryTable, eq(PostTable.id, PostToCategoryTable.postId))
        .leftJoin(PostCategoryTable, eq(PostToCategoryTable.postCategoryId, PostCategoryTable.id))
        .where(and(...filters))
        .limit(limit)
        .orderBy(desc(PostTable.createdAt))
        .as('subquery_ids');

    const rows = await db.select({
            id: PostTable.id,
            title: PostTable.title,
            content: PostTable.content,
            imgSrc: PostTable.imgSrc,
            imgAlt: PostTable.imgAlt,
            createdAt: PostTable.createdAt,
            updatedAt: PostTable.updatedAt,
            postedBy: PostTable.postedById,
            postCategory: PostCategoryTable.title
        })
        .from(PostTable)
        .innerJoin(subqueryIds, eq(PostTable.id, subqueryIds.id))
        // .leftJoin(UserTable, eq(PostTable.posted_by, UserTable.user_id))
        .leftJoin(PostToCategoryTable, eq(PostTable.id, PostToCategoryTable.postId))
        .leftJoin(PostCategoryTable, eq(PostToCategoryTable.postCategoryId, PostCategoryTable.id))
        .where(and(...filters)) // Aplica todos os filtros dinamicamente
        .orderBy(desc(PostTable.createdAt));

    const postsMap = new Map<number, {
        id: number,
        title: string,
        content: string,
        imgSrc: string,
        imgAlt: string,
        createdAt: Date,
        updatedAt: Date,
        postedBy: string | null,
        postCategories: string[]
    }>();

    for (const row of rows) {
        if (!postsMap.has(row.id)) {
            postsMap.set(row.id, {
                id: row.id,
                title: row.title,
                content: row.content,
                imgSrc: row.imgSrc,
                imgAlt: row.imgAlt,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
                postedBy: row.postedBy,
                postCategories: [],
            });
        }

        if (row.postCategory) {
            postsMap.get(row.id)!.postCategories.push(row.postCategory);
        }
    }

    const posts = Array.from(postsMap.values());
    let queryCount = await db.select({ count: countDistinct(PostTable.id) }).from(PostTable).leftJoin(UserTable, eq(PostTable.postedById, UserTable.id))
        .leftJoin(PostToCategoryTable, eq(PostTable.id, PostToCategoryTable.postId))
        .leftJoin(PostCategoryTable, eq(PostToCategoryTable.postCategoryId, PostCategoryTable.id)).where(and(...filters));

    const categories = await db.select({
        title: PostCategoryTable.title,
        posts: count(PostToCategoryTable.postId)
    }).from(PostCategoryTable)
        .leftJoin(PostToCategoryTable, eq(PostCategoryTable.id, PostToCategoryTable.postCategoryId))
        .groupBy(PostCategoryTable.id)

    // console.log(queryCount)

    const recentPosts = await db.select({
        title: PostTable.title,
        imgSrc: PostTable.imgSrc,
        imgAlt: PostTable.imgAlt,
        createdAt: PostTable.createdAt
    }).from(PostTable).orderBy(desc(PostTable.createdAt)).limit(6);
    // console.log("posts: ", posts);

    return {
        posts,
        categories,
        recentPosts,
        meta: {
            total: queryCount[0]?.count || 0,
        }
    };
}