<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/state";
    import ImageCarousel from "$lib/components/ImageCarousel.svelte";
    import ProductGrid from "$lib/components/ProductGrid.svelte";
    import StarRating from "$lib/components/StarRating.svelte";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb";
    import { formatPrice, intlDate } from "$lib/utils";
    import { Minus, Plus, Star } from "@lucide/svelte";
    import { Separator } from "bits-ui";
    import { cn } from "tailwind-variants";
    import type { PageProps } from "./$types";

    let { params, data }: PageProps = $props();

    const product = $derived(data.product);
    let reviewsSize = $state(5);
    $effect(() => {
        product.id;
        reviewsSize = 5;
    });
    let rateMedia = $state(
        (
            // svelte-ignore state_referenced_locally
                        product.reviews
                .map((review) => review.rate)
                .reduce((acc, item) => acc + item, 0) / product.reviews.length
        ).toFixed(2),
    );
    $effect(() => {
        product.id;
        rateMedia = (
            product.reviews
                .map((review) => review.rate)
                .reduce((acc, item) => acc + item, 0) / product.reviews.length
        ).toFixed(2);
    });
    const contentParagraph = $derived(product.description.split("\n"));
    // svelte-ignore state_referenced_locally
        let relatedProducts = $state([...data.relatedProducts]);
    $effect(() => {
        product.id;
        relatedProducts = [...data.relatedProducts];
    });
    let loading = $state(false);
    let hasMore = $state(true);

    let addedToCart = $state(false);

    async function showMore() {
        if (loading) return;

        loading = true;

        const res = await fetch(
            `/api/products?page=${Math.floor(relatedProducts.length / 4) + 1}&pageSize=4&category=${product.category}`,
        );
        const result = await res.json();

        if (result.products?.length === 0) {
            hasMore = false;
        } else {
            relatedProducts.push(...result?.products);
        }

        loading = false;
    }

    const route = page.url.pathname.split("/").filter(Boolean).at(-1);
    const routeName = route ? route[0].toUpperCase() + route.slice(1) : "";

    const segments: Array<string> = page.url.pathname
        .split("/")
        .filter(Boolean);

    segments.pop();
    // svelte-ignore state_referenced_locally
    segments.push(product.title);
    const breadcrumbs = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");

        let label;
        if (index !== segments.length - 1) {
            label = segment[0].toUpperCase() + segment.slice(1);
        } else {
            label = segment;
        }

        return {
            label,
            href,
        };
    });

    let selectedSize = $state("");
    let selectedColor = $state("");
    let selectedQuantity = $state(1);
</script>

<div
    class={cn(
        "h-16",
        "bg-surface-tertiary",
        "w-full",
        "flex",
        "justify-start",
        "items-center",
        "ps-10",
    )}
>
    <Breadcrumb.Root>
        <Breadcrumb.List class="inline-flex items-center">
            <Breadcrumb.Item>
                <Breadcrumb.Link href="/" class="flex items-center"
                    >Home</Breadcrumb.Link
                >
            </Breadcrumb.Item>
            <Breadcrumb.Separator
                class="flex items-center justify-center pt-1"
            />
            {#each breadcrumbs as breadcumb, index}
                {#if index === breadcrumbs.length - 1}
                    <Separator.Root
                        orientation="vertical"
                        class={cn(
                            "bg-gray-500",
                            "shrink-0",
                            "data-[orientation=vertical]:h-8",
                            "data-[orientation=vertical]:w-[2px]",
                        )}
                    />
                {/if}
                <Breadcrumb.Item>
                    <Breadcrumb.Link href={breadcumb.href}
                        >{breadcumb.label}</Breadcrumb.Link
                    >
                </Breadcrumb.Item>
                {#if index !== breadcrumbs.length - 1}
                    <Breadcrumb.Separator
                        class="flex items-center justify-center pt-1"
                    />
                {/if}
            {/each}
        </Breadcrumb.List>
    </Breadcrumb.Root>
</div>

<main>
    <section class={cn("flex", "items-start", "gap-16", "p-16")}>
        <ImageCarousel images={product.images} zoomTarget="#product-info" />
        <div
            id="product-info"
            class={cn("flex", "flex-col", "gap-4", "relative")}
        >
            <div class={cn("flex", "flex-col", "gap-2")}>
                <h2
                    class={cn(
                        "font-primary",
                        "font-semibold",
                        "text-5xl",
                        "text-content-heading",
                    )}
                >
                    {product.title}
                </h2>
                <div class={cn("flex", "gap-2", "items-center")}>
                    <p
                        class={cn(
                            "font-primary",
                            "text-content-subtle",
                            "text-base",
                            "font-semibold",
                        )}
                    >
                        {formatPrice(
                            product.discount
                                ? (product.price * (100 - product.discount)) /
                                      100
                                : product.price,
                        )}
                    </p>
                    {#if product.discount}
                        <p
                            class={cn(
                                "font-primary",
                                "text-content-subtle",
                                "text-xs",
                                "font-semibold",
                                "line-through",
                            )}
                        >
                            {formatPrice(product.price)}
                        </p>
                    {/if}
                </div>
                <div class={cn("flex", "items-center", "gap-4")}>
                    <StarRating rating={Number(rateMedia)} size={25} />
                    <Separator.Root
                        orientation="vertical"
                        class={cn("w-0.5", "h-5", "bg-gray-500")}
                    />
                    <p>{product.reviews.length} customers review</p>
                </div>
            </div>
            <p
                class={cn(
                    "font-primary",
                    "text-content-body",
                    "text-base",
                    "font-normal",
                )}
            >
                {product.shortDescription}
            </p>
            <form
                method="POST"
                use:enhance={() => {
                    return async ({ update }) => {
                        addedToCart = true;
                        await update({ reset: false });
                        setTimeout(() => (addedToCart = false), 1000);
                    };
                }}
                action="?/addToCart"
                class={cn("flex", "flex-col", "gap-8")}
            >
                <input name="productId" value={product.id} hidden required />
                <div class={cn("flex", "flex-col", "gap-2")}>
                    <p
                        class={cn(
                            "font-primary",
                            "text-base",
                            "font-normal",
                            "text-content-subtle",
                        )}
                    >
                        Size
                    </p>
                    <div class={cn("flex", "gap-2")}>
                        {#each product.sizes as size}
                            <label class={cn("relative")}>
                                <input
                                    required
                                    type="radio"
                                    name="size"
                                    value={size.id}
                                    bind:group={selectedSize}
                                    class={cn("peer", "sr-only", "top-10")}
                                />
                                <p
                                    class={cn(
                                        "flex",
                                        "items-center",
                                        "justify-center",
                                        "size-8",
                                        "rounded-md",
                                        "text-xs",
                                        "font-primary",
                                        "font-regular",
                                        "border",
                                        "transition-all",
                                        "bg-white",
                                        "border-gray-300",
                                        "peer-checked:bg-primary",
                                        "peer-checked:text-white",
                                        "peer-checked:border-primary",
                                        "peer-focus-visible:ring-2",
                                        "peer-focus-visible:ring-offset-2",
                                        "peer-focus-visible:ring-primary",
                                        "hover:border-primary/50",
                                        "cursor-pointer",
                                    )}
                                >
                                    {size.title}
                                </p>
                            </label>
                        {/each}
                    </div>
                </div>
                <div class={cn("flex", "flex-col", "gap-2")}>
                    <p
                        class={cn(
                            "font-primary",
                            "text-base",
                            "font-normal",
                            "text-content-subtle",
                        )}
                    >
                        Color
                    </p>
                    <div class={cn("flex", "gap-4")}>
                        {#each product.colors as color}
                            <label class={cn("relative")}>
                                <input
                                    required
                                    type="radio"
                                    name="color"
                                    value={color.id}
                                    bind:group={selectedColor}
                                    class={cn("peer", "sr-only", "top-10")}
                                />
                                <div
                                    class={cn(
                                        "size-7",
                                        "rounded-full",
                                        "transition-colors",
                                        "opacity-30",
                                        "peer-checked:opacity-100",
                                        "peer-focus-visible:ring-2",
                                        "peer-focus-visible:ring-offset-2",
                                        "peer-focus-visible:ring-primary",
                                        "cursor-pointer",
                                    )}
                                    style:background-color={color.rgb}
                                ></div>
                            </label>
                        {/each}
                    </div>
                </div>
                <div
                    class={cn("flex", "items-center", "justify-start", "gap-4")}
                >
                    <div class={cn("flex", "items-stretch", "w-fit")}>
                        <button
                            disabled={selectedQuantity === 0}
                            type="button"
                            class={cn(
                                "border-y-2",
                                "border-s-2",
                                "px-2",
                                "rounded-tl-md",
                                "rounded-bl-md",
                                "cursor-pointer",
                                "border-gray-300",
                                "text-content-body",
                                "disabled:text-content-disabled",
                            )}
                            onclick={() => {
                                if (selectedQuantity > 0) selectedQuantity--;
                            }}
                        >
                            <Minus size="16" />
                        </button>
                        <label class="-z-10">
                            <input
                                name="quantity"
                                type="number"
                                class={cn(
                                    "w-12",
                                    "font-primary",
                                    "text-content-body",
                                    "text-base",
                                    "text-center",
                                    "border-y-2",
                                    "border-x-0",
                                    "border-gray-300",
                                    "[appearance:textfield]",
                                    "[&::-webkit-outer-spin-button]:appearance-none",
                                    "[&::-webkit-inner-spin-button]:appearance-none",
                                )}
                                bind:value={selectedQuantity}
                            />
                        </label>
                        <button
                            class={cn(
                                "border-y-2",
                                "border-e-2",
                                "px-2",
                                "rounded-tr-md",
                                "rounded-br-md",
                                "cursor-pointer",
                                "border-gray-300",
                                "text-content-body",
                            )}
                            type="button"
                            onclick={() => selectedQuantity++}
                        >
                            <Plus size="16" />
                        </button>
                    </div>
                    <button
                        type="submit"
                        class={cn(
                            "px-8",
                            "py-2",
                            "border-2",
                            "rounded-md",
                            "font-primary",
                            "text-base",
                            "font-medium",
                            "whitespace-nowrap",
                            "cursor-pointer",
                            "transition-all",
                            "duration-300",
                            addedToCart
                                ? "bg-green-500 border-green-500 text-white scale-95"
                                : "border-gray-500",
                        )}
                    >
                        {addedToCart ? "✓ Adicionado!" : "Add to Cart"}
                    </button>
                    <button
                        formaction="?/compare"
                        class={cn(
                            "px-8",
                            "py-2",
                            "border-2",
                            "border-gray-500",
                            "rounded-md",
                            "font-primary",
                            "text-base",
                            "font-medium",
                            "flex",
                            "cursor-pointer",
                        )}
                    >
                        <Plus />
                        Compare
                    </button>
                </div>
            </form>
            <Separator.Root
                orientation="horizontal"
                class="h-0.5 my-8 bg-gray-300"
            />
            <div>
                <p
                    class={cn(
                        "font-primary",
                        "text-base",
                        "text-content-subtle",
                        "font-normal",
                    )}
                >
                    Category: {product.category}
                </p>
                <p
                    class={cn(
                        "font-primary",
                        "text-base",
                        "text-content-subtle",
                        "font-normal",
                    )}
                >
                    Tags:
                    {#each product.tags as tag, i}
                        <span
                            >{`${tag}${i !== product.tags.length - 1 ? ", " : ""}`}</span
                        >
                    {/each}
                </p>
            </div>
        </div>
    </section>
    <Separator.Root
        orientation="horizontal"
        class={cn("h-0.5", "bg-gray-300")}
    />
    <section class={cn("flex", "flex-col", "gap-8", "items-center", "py-20")}>
        <h2
            class={cn(
                "font-primary",
                "text-3xl",
                "text-content-heading",
                "font-semibold",
            )}
        >
            Description
        </h2>
        <div class={cn("flex", "flex-col", "gap-20", "items-center")}>
            <div class={cn("space-y-4", "max-w-250")}>
                {#each contentParagraph as paragraph}
                    <p
                        class={cn(
                            "font-primary",
                            "text-base",
                            "text-content-subtle",
                            "font-normal",
                            "text-justify",
                        )}
                    >
                        {paragraph}
                    </p>
                {/each}
            </div>
            <div class={cn("flex", "gap-16", "items-center", "justify-center")}>
                {#each product.images.slice(0, 2) as image}
                    <img
                        src={image.imgSrc}
                        alt={image.imgAlt}
                        class={cn(
                            "w-150",
                            "h-80",
                            "object-cover",
                            "object-center",
                            "rounded-md",
                        )}
                    />
                {/each}
            </div>
        </div>
    </section>
    <Separator.Root
        orientation="horizontal"
        class={cn("h-0.5", "bg-gray-300")}
    />
    <section class={cn("flex", "flex-col", "gap-8", "items-center", "py-10")}>
        <h2
            class={cn(
                "font-primary",
                "text-3xl",
                "text-content-heading",
                "font-semibold",
            )}
        >
            Related Products
        </h2>
        <ProductGrid
            products={relatedProducts}
            {showMore}
            {loading}
            cols="4"
            rows="1"
        />
    </section>
    <section class={cn("flex", "flex-col", "gap-8")}>
        <h2
            class={cn(
                "font-primary",
                "text-3xl",
                "text-content-heading",
                "font-semibold",
            )}
        >
            reviews
        </h2>
        <div class={cn("flex", "flex-col", "gap-8", "max-w-150")}>
            {#each product.reviews
                .sort((a, b) => b.rate - a.rate)
                .filter((item) => product.reviews.indexOf(item) < reviewsSize) as review}
                <div class={cn("flex", "flex-col", "gap-2")}>
                    <div class={cn("flex", "justify-between")}>
                        <div class={cn("flex")}>
                            {#each Array(review.rate)}
                                <Star
                                    fill="var(--color-yellow-500)"
                                    stroke="var(--color-amber-500)"
                                    strokeWidth="0"
                                />
                            {/each}
                            {#each Array(5 - review.rate)}
                                <Star
                                    fill="var(--color-gray-200)"
                                    strokeWidth="0"
                                />
                            {/each}
                        </div>
                        <p
                            class={cn(
                                "font-primary",
                                "text-sm",
                                "text-content-subtle",
                            )}
                        >
                            {`${intlDate.format(new Date(review.updatedAt))}`}
                        </p>
                    </div>
                    <p
                        class={cn(
                            "font-primary",
                            "text-base",
                            review.comment
                                ? "text-content-body"
                                : "text-content-subtle",
                            "font-regular",
                        )}
                    >
                        {#if review.comment}
                            {review.comment}
                        {:else}
                            O usuario não deixou nenhum comentário
                        {/if}
                    </p>
                </div>
            {/each}
            {#if reviewsSize < product.reviews.length}
                <button
                    onclick={() => (reviewsSize += 5)}
                    class={cn(
                        "px-4",
                        "py-2",
                        "rounded-md",
                        "bg-surface-action-primary-normal",
                        "hover:bg-surface-action-primary-hover",
                        "text-content-on-action-primary-normal",
                        "hover:text-content-on-action-primary-hover",
                        "font-primary",
                        "text-base",
                        "font-semibold",
                        "cursor-pointer",
                    )}>Carregar mais reviews</button
                >
            {/if}
        </div>
    </section>
</main>
