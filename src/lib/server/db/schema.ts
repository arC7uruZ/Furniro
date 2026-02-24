import { blob, int, primaryKey, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const TagTable = sqliteTable("tag", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
});

export const CategoryTable = sqliteTable("category", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
});

export const SetTable = sqliteTable("set", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    description: text().notNull(),
})

export const WoodTable = sqliteTable("wood", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    origin: text(),
});

export const UpholsteryTable = sqliteTable("uphosltery", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    origin: text(),
});

export const ProductTable = sqliteTable("product", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    shortDescription: text().notNull(),
    description: text().notNull(),
    price: real().notNull(),
    slug: text().notNull(),
    discount: real(),
    createdAt: int().notNull(),
    updatedAt: int().notNull(),
    innerPiece: int({ mode: "boolean" }).notNull(),
    warrantyId: int().notNull().references(() => WarrantyTable.id),
}, (table) => [
    uniqueIndex("slug_idx").on(table.slug)
]);

export const ProductWoodTable = sqliteTable("product_wood", {
    productId: int().notNull().references(() => ProductTable.id),
    woodId: int().notNull().references(() => WoodTable.id),
}, (table) => [
    primaryKey({ columns: [table.productId, table.woodId]}),
])

export const ProductUpholsteryTable = sqliteTable("product_upholstery", {
    productId: int().notNull().references(() => ProductTable.id),
    upholsteryId: int().notNull().references(() => UpholsteryTable.id),
}, (table) => [
    primaryKey({ columns: [table.productId, table.upholsteryId]}),
])

export const ProductTagTable = sqliteTable("product_tag", {
    productId: int().notNull().references(() => ProductTable.id),
    tagId: int().notNull().references(() => TagTable.id),
}, (table) => [
    primaryKey({ columns: [table.productId, table.tagId]}),
])

export const ProductCategoryTable = sqliteTable("product_category", {
    productId: int().notNull().references(() => ProductTable.id),
    categoryId: int().notNull().references(() => CategoryTable.id),
}, (table) => [
    primaryKey({ columns: [table.productId, table.categoryId]}),
])

export const ProductSetTable = sqliteTable("product_set", {
    productId: int().notNull().references(() => ProductTable.id),
    setId: int().notNull().references(() => SetTable.id),
}, (table) => [
    primaryKey({ columns: [table.productId, table.setId]}),
])

export const ImageTable = sqliteTable("image", {
    id: int().primaryKey({ autoIncrement: true }),
    imgSrc: text().notNull(),
    imgAlt: text().notNull(),
    productId: int().notNull().references(() => ProductTable.id),
    order: int().notNull().default(0),
})

export const ColorTable = sqliteTable("color", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull().unique(),
    rgb: text().notNull().unique(),
})

export const SizeTable = sqliteTable("size", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull().unique(),
})

export const WarrantyTable = sqliteTable("warranty", {
    id: int().primaryKey({ autoIncrement: true }),
    summary: text().notNull(),
    period: int().notNull(),
    domesticPeriod: int().notNull(),
    covered: text().notNull(),
    notCovered: text().notNull(),
})

export const StockTable = sqliteTable("stock", {
    productId: int().notNull().references(() => ProductTable.id),
    sizeId: int().notNull().references(() => SizeTable.id),
    colorId: int().notNull().references(() => ColorTable.id),
    width: real().notNull(),
    heigth: real().notNull(),
    depth: real().notNull(),
    weight: real().notNull(),
    loadCapacity: real().notNull(),
    sku: text().notNull(),
    quantity: int().notNull(),
}, (table) => [
    primaryKey({ columns: [table.productId, table.colorId, table.sizeId]}),
    uniqueIndex("sku_idx").on(table.sku),
])

export const RoleTable = sqliteTable("role", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull().unique(),
});

export const UserTable = sqliteTable("user", {
    id: int().primaryKey({ autoIncrement: true }),
    username: text().notNull().unique(),
    email: text().notNull().unique(),
    passwordHash: text().notNull(),
    emailVerified: int({mode: "boolean"}).notNull().default(false),
    totpKey: blob().$type<Uint8Array>(),
    recoveryCode: blob().$type<Uint8Array>().notNull(),
    roleId: int().notNull().references(() => RoleTable.id),
});

export const PostTable = sqliteTable("post", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    content: text().notNull(),
    slug: text().notNull(),
    imgSrc: text().notNull(),
    imgAlt: text().notNull(),
    createdAt: int().notNull(),
    updatedAt: int().notNull(),
    postedById: int().notNull().references(() => UserTable.id),
});

export const TopicTable = sqliteTable("topic", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
});

export const PostTopicTable = sqliteTable("post_topic", {
    postId: int().notNull().references(() => PostTable.id),
    TopicId: int().notNull().references(() => TopicTable.id),
});

export const EmailVerificationRequestTable = sqliteTable("email_verification_request", {
    id: text().notNull().primaryKey(),
    userId: int().notNull().references(() => UserTable.id),
    email: text().notNull(),
    code: text().notNull(),
    expiresAt: int().notNull(),
});

export const SessionTable = sqliteTable("session", {
    id: text().notNull().primaryKey(),
    userId: int().notNull().references(() => UserTable.id),
    expiresAt: int().notNull(),
    twoFactorVerified: int({ mode: "boolean" }).notNull().default(false),
});

export const PasswordResetSessionTable = sqliteTable("password_reset_session", {
    id: text().notNull().primaryKey(),
    userId: int().notNull().references(() => UserTable.id),
    email: text().notNull(),
    code: text().notNull(),
    expiresAt: int().notNull(),
    emailVerified: int({ mode: "boolean" }).notNull().default(false),
    twoFactorVerified: int({ mode: "boolean" }).notNull().default(false),
})