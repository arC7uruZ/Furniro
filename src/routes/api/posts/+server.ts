import { json } from '@sveltejs/kit';
import { postCategory, postTable, postToCategory, userTable } from "$lib/server/db/schema";
import { and, desc, eq, inArray, like, or } from "drizzle-orm";
import { db } from '$lib/server/db';

export const GET = async ({ url, locals }) => {

    const offset = Number(url.searchParams.get('offset')) || 0;
    const searchTerm = url.searchParams.get('text') || "";
    const selectedCategories = url.searchParams.getAll('category');
    const limit = 3;

    const filters = [];

    console.log("offset: ", offset);


    if (searchTerm) {
        filters.push(or(like(postTable.title, `%${searchTerm}%`), like(postTable.content, `%${searchTerm}%`)));
    }

    if (selectedCategories.length > 0) {
        filters.push(inArray(postCategory.title, selectedCategories));
    }

    const subqueryIds = db
        .selectDistinct({ id: postTable.post_id })
        .from(postTable)
        .leftJoin(postToCategory, eq(postTable.post_id, postToCategory.post_id))
        .leftJoin(postCategory, eq(postToCategory.post_category_id, postCategory.post_category_id))
        .where(and(...filters))
        .limit(limit)
        .offset(offset)
        .orderBy(desc(postTable.created_at))
        .as('subquery_ids');

    const rows = await db.select({
        post_id: postTable.post_id,
        title: postTable.title,
        content: postTable.content,
        img_src: postTable.img_src,
        img_alt: postTable.img_alt,
        created_at: postTable.created_at,
        updated_at: postTable.updated_at,
        posted_by: postTable.posted_by,
        post_category: postCategory.title
    })
        .from(postTable)
        .innerJoin(subqueryIds, eq(postTable.post_id, subqueryIds.id))
        // .leftJoin(userTable, eq(postTable.posted_by, userTable.user_id))
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

    // console.log("posts: ", posts);
    return json(posts);
};