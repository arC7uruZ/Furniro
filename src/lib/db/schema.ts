import { int, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const type = sqliteTable("product_type", {
    type_id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
})

export const category = sqliteTable("product_category", {
    category_id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    description: text().notNull(),
})

export const productTable = sqliteTable("product_table", {
    product_id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    description: text().notNull(),
    price: real().notNull(),
    img_src: text().notNull(),
    img_alt: text().notNull(),
    discount: real(),
    category: int().notNull().references(() => category.category_id),
    type: int().notNull().references(() => type.type_id),
    created_at: int().notNull(),
    updated_at: int().notNull(),
})

export const userRole = sqliteTable("user_role", {
    role_id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull().unique(),
});

export const userTable = sqliteTable("user_table", {
    user_id: int().primaryKey({ autoIncrement: true }),
    username: text().notNull().unique(),
    role: int().notNull().references(() => userRole.role_id),
});

export const postTable = sqliteTable("post_table", {
    post_id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    content: text().notNull(),
    img_src: text().notNull(),
    img_alt: text().notNull(),
    created_at: int().notNull(),
    updated_at: int().notNull(),
    posted_by: int().notNull().references(() => userTable.user_id),
});

export const postCategory = sqliteTable("post_category", {
    post_category_id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
});

export const postToCategory = sqliteTable("post_to_category", {
    post_id: int().notNull().references(() => postTable.post_id),
    post_category_id: int().notNull().references(() => postCategory.post_category_id),
});