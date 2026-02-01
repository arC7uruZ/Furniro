import { postCategory, postTable, postToCategory, userTable } from "$lib/db/schema";
import { count, desc, eq, inArray, like, or, and, countDistinct } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, locals, params, fetch }) => {

    // const serverPosts = fetch(`/api/posts?${params}`)
    // console.log("params: ", params);
    console.log("rodei caraio");

    const searchTerm = url.searchParams.get('text') || "";
    const selectedCategories = url.searchParams.getAll('category');
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = 3;
    const offset = (page - 1) * limit;

    const filters = [];

    if (searchTerm) {
        filters.push(or(like(postTable.title, `%${searchTerm}%`), like(postTable.content, `%${searchTerm}%`)));
    }

    if (selectedCategories.length > 0) {
        filters.push(inArray(postCategory.title, selectedCategories));
    }

    const subqueryIds = locals.db
        .selectDistinct({ id: postTable.post_id })
        .from(postTable)
        .leftJoin(postToCategory, eq(postTable.post_id, postToCategory.post_id))
        .leftJoin(postCategory, eq(postToCategory.post_category_id, postCategory.post_category_id))
        .where(and(...filters))
        .limit(limit)
        .orderBy(desc(postTable.created_at))
        .as('subquery_ids');

    const rows = await locals.db.select({
            post_id: postTable.post_id,
            title: postTable.title,
            content: postTable.content,
            img_src: postTable.img_src,
            img_alt: postTable.img_alt,
            created_at: postTable.created_at,
            updated_at: postTable.updated_at,
            posted_by: userTable.username,
            post_category: postCategory.title
        })
        .from(postTable)
        .innerJoin(subqueryIds, eq(postTable.post_id, subqueryIds.id))
        .leftJoin(userTable, eq(postTable.posted_by, userTable.user_id))
        .leftJoin(postToCategory, eq(postTable.post_id, postToCategory.post_id))
        .leftJoin(postCategory, eq(postToCategory.post_category_id, postCategory.post_category_id))
        .where(and(...filters)) // Aplica todos os filtros dinamicamente
        .orderBy(desc(postTable.created_at));

    const postsMap = new Map<number, {
        post_id: number,
        title: string,
        content: string,
        img_src: string,
        img_alt: string,
        created_at: number,
        updated_at: number,
        posted_by: string | null,
        post_categories: string[]
    }>();

    for (const row of rows) {
        if (!postsMap.has(row.post_id)) {
            postsMap.set(row.post_id, {
                post_id: row.post_id,
                title: row.title,
                content: row.content,
                img_src: row.img_src,
                img_alt: row.img_alt,
                created_at: row.created_at,
                updated_at: row.updated_at,
                posted_by: row.posted_by,
                post_categories: [],
            });
        }

        if (row.post_category) {
            postsMap.get(row.post_id)!.post_categories.push(row.post_category);
        }
    }

    const posts = Array.from(postsMap.values());
    let queryCount = await locals.db.select({ count: countDistinct(postTable.post_id) }).from(postTable).leftJoin(userTable, eq(postTable.posted_by, userTable.user_id))
        .leftJoin(postToCategory, eq(postTable.post_id, postToCategory.post_id))
        .leftJoin(postCategory, eq(postToCategory.post_category_id, postCategory.post_category_id)).where(and(...filters));

    const categories = await locals.db.select({
        title: postCategory.title,
        posts: count(postToCategory.post_id)
    }).from(postCategory)
        .leftJoin(postToCategory, eq(postCategory.post_category_id, postToCategory.post_category_id))
        .groupBy(postCategory.post_category_id)

    // console.log(queryCount)

    const recentPosts = await locals.db.select({
        title: postTable.title,
        imgSrc: postTable.img_src,
        imgAlt: postTable.img_alt,
        createdAt: postTable.created_at
    }).from(postTable).orderBy(desc(postTable.created_at)).limit(6);
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