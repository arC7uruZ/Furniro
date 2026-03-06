<script lang="ts">
    import ProductGrid from "$lib/components/ProductGrid.svelte";
    import * as Carousel from "$lib/components/ui/carousel";
    import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";
    import { Button } from "bits-ui";
    import { cn } from "tailwind-variants";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    let api = $state<CarouselAPI>();

    const count = $derived(api ? api.scrollSnapList().length : 0);
    let current = $state(0);

    $effect(() => {
        if (api) {
            current = api.selectedScrollSnap();
            api.on("select", () => {
                current = api!.selectedScrollSnap();
            });
        }

        // console.log("current:", current);
    });

    const products = $state([...data.products]);
    let loading = $state(false);
    let hasMore = $state(true);

    async function showMore() {
        if (loading) return;

        loading = true;

        const res = await fetch(
            `/api/products?page=${Math.floor(products.length / 8) + 1}`,
        );
        const result = await res.json();

        if (result.products?.length === 0) {
            hasMore = false;
        } else {
            products.push(...result?.products);
        }

        loading = false;
    }
</script>

<section
    class={cn(
        "flex",
        "flex-col",
        "p-12",
        "items-end",
        "justify-center",
        "bg-[url('/bg-1.png')]",
        "bg-cover",
        "bg-center",
        "min-h-200",
        "w-full",
    )}
>
    <div
        class={cn(
            "flex",
            "flex-col",
            "gap-16",
            "p-xl",
            "justify-between",
            "items-start",
            "bg-surface-tertiary",
            "rounded-xl",
            "shadow-lg",
        )}
    >
        <div
            class={cn("flex", "flex-col", "items-start", "max-w-135", "gap-4")}
        >
            <p
                class={cn(
                    "font-primary",
                    "font-semibold",
                    "text-2xl/8",
                    "text-content-heading",
                )}
            >
                New Arrival
            </p>
            <p
                class={cn(
                    "font-primary",
                    "font-bold",
                    "text-6xl/16",
                    "text-content-primary",
                )}
            >
                Discover Our New Collection
            </p>
            <p
                class={cn(
                    "font-primary",
                    "font-regular",
                    "text-2xl/6",
                    "text-content-body",
                )}
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                tellus, luctus nec ullamcorper mattis.
            </p>
        </div>
        <Button.Root
            class={cn(
                "bg-surface-action-primary-normal",
                "text-content-on-action-primary-normal",
                "hover:bg-surface-action-primary-hover",
                "hover:text-content-on-action-primary-hover",
                "disabled:bg-surface-action-disabled",
                "disabled:text-content-on-action-disabled",
                "py-lg",
                "px-4xl",
                "font-primary",
                "font-semibold",
                "text-3xl",
                "cursor-pointer",
            )}
        >
            BUY NOW
        </Button.Root>
    </div>
</section>

<section>
    <nav
        aria-labelledby="browse-the-range-title"
        class={cn("flex", "flex-col", "items-center", "gap-xl", "py-xl")}
    >
        <div class={cn("flex", "flex-col", "items-center")}>
            <h2
                id="browse-the-range-title"
                class={cn(
                    "font-primary",
                    "font-bold",
                    "text-3xl",
                    "text-content-heading",
                )}
            >
                Browse The Range
            </h2>
            <p
                class={cn(
                    "font-primary",
                    "font-normal",
                    "text-xl",
                    "text-content-body",
                )}
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
        </div>
        <div class={cn("flex", "gap-5")}>
            {#snippet CategoryCard(
                src: string,
                categoryId: number,
                caption: string,
            )}
                <a
                    href={`/shop?category=${categoryId}`}
                    class={cn(
                        "flex",
                        "flex-col",
                        "items-center",
                        "focus-visible:outline-offset-2",
                        "focus-visible:outline-2",
                        "focus-visible:outline-stroke-focus",
                        "hover:scale-105",
                        "transform",
                        "transition-transform",
                        "duration-300",
                        "ease-out",
                        "rounded-xl",
                    )}
                >
                    <img
                        {src}
                        alt=""
                        class={cn(
                            "w-95.25",
                            "h-120.25",
                            "object-cover",
                            "object-left",
                            "rounded-xl",
                        )}
                    />
                    <span
                        class={cn(
                            "flex",
                            "items-center",
                            "justify-center",
                            "p-sm",
                            "font-primary",
                            "font-semibold",
                            "text-2xl",
                        )}
                    >
                        {caption}
                    </span>
                </a>
            {/snippet}
            {#each data.categoryProducts as categoryProduct}
                {@render CategoryCard(
                    categoryProduct.productImg,
                    categoryProduct.SetId,
                    categoryProduct.SetName,
                )}
            {/each}
        </div>
    </nav>
</section>

<section
    aria-labelledby="our-products-title"
    class={cn("flex", "flex-col", "gap-8", "items-center")}
>
    <h2
        id="our-products-title"
        class={cn(
            "font-primary",
            "font-bold",
            "text-4xl",
            "text-content-heading",
        )}
    >
        Our Products
    </h2>
    <ProductGrid {products} {showMore} {loading} showOutlier cols="4" rows="2" />
</section>

<section
    class={cn(
        "flex",
        "items-stretch",
        "justify-between",
        "pl-24",
        "py-12",
        "gap-10",
        "max-w-360",
        "bg-surface-tertiary",
        "m-10",
    )}
>
    <div
        class={cn(
            "flex",
            "flex-col",
            "gap-10",
            "max-w-105",
            "justify-center",
            "items-start",
        )}
    >
        <h2 class={cn("font-primary", "font-bold", "text-4xl", "leading-12")}>
            50+ Beautiful rooms inspiration
        </h2>
        <p
            class={cn(
                "font-primary",
                "font-medium",
                "text-base",
                "text-gray-2",
            )}
        >
            Our designer already made a lot of beautiful prototipe of rooms that
            inspire you
        </p>
        <Button.Root
            class={cn(
                "bg-surface-action-primary-normal",
                "hover:bg-surface-action-primary-hover",
                "disabled:bg-surface-action-disabled",
                "text-content-on-action-primary-normal",
                "hover:text-content-on-action-primary-hover",
                "disabled:text-content-on-action-disabled",
                "py-4",
                "px-12",
                "font-primary",
                "font-semibold",
                "text-xl",
                "cursor-pointer",
            )}
        >
            Explore More
        </Button.Root>
    </div>
    <Carousel.Root
        setApi={(emblaApi) => (api = emblaApi)}
        opts={{ align: "start", loop: true }}
        class={cn("w-200")}
    >
        <Carousel.Content
            class={cn("flex", "items-start", "min-h-145.5", "w-full")}
        >
            {#each data.carouselProducts as product, i (i)}
                <Carousel.Item
                    class={cn(
                        "relative",
                        "flex",
                        "items-center",
                        "justify-center",
                        "basis-6/14",
                        "mx-2",
                    )}
                >
                    <img
                        src={product.productImg}
                        alt={product.productImgAlt}
                        class={cn(
                            "object-cover",
                            "object-top",
                            {
                                "h-145.5": current === i,
                                "h-100": current !== i,
                            },
                            "w-full",
                            "transition-all",
                            "duration-400",
                            "ease-out",
                            "delay-200",
                        )}
                    />
                    <div
                        class={cn(
                            "flex",
                            "items-end",
                            "absolute",
                            "bottom-4",
                            "left-4",

                            {
                                "opacity-100": current === i,
                                "opacity-0": current !== i,
                            },
                            "transition-opacity",
                            "duration-300",
                            "ease-out",
                            "delay-400",
                        )}
                    >
                        <a
                            href="/"
                            class={cn(
                                "flex",
                                "flex-col",
                                "justify-center",
                                "items-center",
                                "p-8",
                                "bg-white/72",
                            )}
                        >
                            <p
                                class={cn(
                                    "flex",
                                    "gap-2",
                                    "items-center",
                                    "text-gray-2",
                                    "font-primary",
                                    "font-medium",
                                    "text-base",
                                )}
                            >
                                0{i + 1}
                                <span>
                                    <svg
                                        width="27"
                                        height="1"
                                        viewBox="0 0 27 1"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M0 0.5H27" stroke="#616161" />
                                    </svg>
                                </span>
                                {product.SetName}
                            </p>

                            <p
                                class={cn(
                                    "font-primary",
                                    "font-semibold",
                                    "text-3xl",
                                )}
                            >
                                {#if product.InnerPiece}
                                    {"Inner Piece"}
                                {:else}
                                    {"Outer Piece"}
                                {/if}
                            </p>
                        </a>
                        <a href="/" aria-label="next-room">
                            <div class={cn("p-4", "bg-primary")}>
                                <svg
                                    width="20"
                                    height="14"
                                    viewBox="0 0 20 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M18.75 6.75H0.75M18.75 6.75L12.75 0.75M18.75 6.75L12.75 12.75"
                                        stroke="white"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </div>
                        </a>
                    </div>
                </Carousel.Item>
            {/each}
        </Carousel.Content>
        <!-- <Carousel.Previous /> -->
        <!-- <div class="flex items-center gap-4">
            <Carousel.Dot></Carousel.Dot>
            <Carousel.Dot selected></Carousel.Dot>
        </div> -->
        <Carousel.DotGroup />
        <Carousel.Next
            class={cn(
                "flex",
                "items-center",
                "justify-center",
                "absolute",
                "size-10",
                "rounded-full",
                "end-18",
                "top-1/2",
                "-translate-y-1/2",
                "group",
                "bg-surface-action-neutral-normal",
                "hover:bg-surface-action-neutral-hover",
                "shadow-2xl",
                "cursor-pointer",
            )}
        />
    </Carousel.Root>
</section>

<section
    class={cn(
        "flex",
        "flex-col",
        "items-center",
        "relative",
        "w-full",
        "max-w-360",
        "h-183.75",
        "overflow-hidden",
    )}
>
    <div class={cn("flex", "flex-col", "items-center", "absolute")}>
        <p
            class={cn(
                "font-primary",
                "text-base",
                "text-content-subtle",
                "font-semibold",
            )}
        >
            Share your setup with
        </p>
        <h3
            class={cn(
                "font-primary",
                "text-3xl",
                "text-content-heading",
                "font-semibold",
            )}
        >
            #FurniroFurniture
        </h3>
    </div>
    <img
        src="/Group.png"
        alt="PostImages"
        class={cn("w-full", "h-full", "object-cover")}
    />
</section>
