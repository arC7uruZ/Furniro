<script lang="ts">
    import * as Carousel from "$lib/components/ui/carousel";
    import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";
    import { Button } from "bits-ui";
    import type { PageProps } from "./$types";
    import ProductCard from "$lib/components/ProductCard.svelte";
    import { cn } from "tailwind-variants";

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

    const products = $derived([...data.products]);
    let loading = $state(false);
    let hasMore = $state(true);

    async function showMore() {
        if (loading) return;

        loading = true;

        const res = await fetch(
            `/products?page=${Math.floor(products.length / 8) + 1}`,
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
        <div class="flex flex-col items-start max-w-135 gap-4">
            <p
                class="font-primary font-semibold text-heading-h5/8 text-content-heading"
            >
                New Arrival
            </p>
            <p
                class="font-primary font-bold text-heading-h1/16 text-content-primary"
            >
                Discover Our New Collection
            </p>
            <p
                class="font-primary font-regular text-body-lg/6 text-content-body"
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                tellus, luctus nec ullamcorper mattis.
            </p>
        </div>
        <Button.Root
            class="bg-surface-action-primary-normal hover:bg-surface-action-primary-hover disabled:bg-surface-action-disabled text-content-on-action-primary-normal hover:text-content-on-action-primary-hover disabled:text-content-on-action-disabled py-lg px-4xl font-primary font-semibold text-heading-h4 cursor-pointer"
        >
            BUY NOW
        </Button.Root>
    </div>
</section>

<section>
    <nav
        aria-labelledby="browse-the-range-title"
        class="flex flex-col items-center gap-xl py-xl"
    >
        <div class="flex flex-col items-center">
            <h2
                id="browse-the-range-title"
                class="font-primary font-bold text-heading-h4 text-content-heading"
            >
                Browse The Range
            </h2>
            <p class="font-primary font-normal text-xl text-content-body">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
        </div>
        <div class="flex gap-5">
            {#snippet CategoryCard(
                src: string,
                categoryId: number,
                caption: string,
            )}
                <a
                    href={`/shop?category=${categoryId}`}
                    class="flex flex-col items-center focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-stroke-focus hover:scale-105 transform transition-transform duration-300 ease-out rounded-xl"
                >
                    <img
                        {src}
                        alt=""
                        class="w-95.25 h-120.25 object-cover object-left rounded-xl"
                    />
                    <span
                        class="flex items-center justify-center p-sm font-primary font-semibold text-2xl"
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
    class="flex flex-col gap-8 items-center"
>
    <h2
        id="our-products-title"
        class="font-primary font-bold text-heading-h3 text-content-heading"
    >
        Our Products
    </h2>
    <ul class="grid grid-cols-4 gap-8 grid-rows-2">
        {#each products as product}
            <li>
                <ProductCard {...product} showOutlier />
            </li>
        {/each}
    </ul>
    <Button.Root
        class="flex justify-center items-center cursor-pointer px-3xl py-sm border font-primary font-semibold text-body-lg hover:bg-surface-action-neutral-hover disabled:bg-surface-action-disabled text-content-on-action-secondary-normal hover:text-content-on-action-secondary-hover disabled:text-content-on-action-disabled border-stroke-action-normal hover:border-stroke-action-hover disabled:border-stroke-action-disabled"
        onclick={showMore}
        disabled={loading}
    >
        {loading ? "Loading..." : "Show More"}
    </Button.Root>
</section>

<section
    class="flex items-stretch justify-between pl-24 py-12 gap-10 max-w-360 bg-surface-tertiary m-10"
>
    <div class="flex flex-col gap-10 max-w-105 justify-center items-start">
        <h2 class="font-primary font-bold text-heading-h3 leading-12">
            50+ Beautiful rooms inspiration
        </h2>
        <p class="font-primary font-medium text-base text-gray-2">
            Our designer already made a lot of beautiful prototipe of rooms that
            inspire you
        </p>
        <Button.Root
            class="bg-surface-action-primary-normal hover:bg-surface-action-primary-hover disabled:bg-surface-action-disabled text-content-on-action-primary-normal hover:text-content-on-action-primary-hover disabled:text-content-on-action-disabled py-4 px-12 font-primary font-semibold text-heading-h6 cursor-pointer"
        >
            Explore More
        </Button.Root>
    </div>
    <Carousel.Root
        setApi={(emblaApi) => (api = emblaApi)}
        opts={{ align: "start", loop: true }}
        class="w-200"
    >
        <Carousel.Content class="flex items-start min-h-145.5 w-full">
            {#each data.carouselProducts as product, i (i)}
                <Carousel.Item
                    class="relative flex items-center justify-center basis-6/14 mx-2"
                >
                    <img
                        src={product.productImg}
                        alt={product.productImgAlt}
                        class="object-cover object-top {current == i
                            ? 'h-145.5'
                            : 'h-100'} w-full transition-all duration-400 ease-out delay-200"
                    />
                    <div
                        class="flex items-end absolute bottom-4 left-4 {current ===
                        i
                            ? 'opacity-100'
                            : 'opacity-0'} transition-opacity duration-300 ease-out delay-400"
                    >
                        <a
                            href="/"
                            class="flex flex-col justify-center items-center p-8 bg-white/72"
                        >
                            <p
                                class="flex gap-2 items-center text-gray-2 font-primary font-medium text-base"
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

                            <p class="font-primary font-semibold text-[28px]">
                                {#if product.InnerPiece}
                                    {"Inner Piece"}
                                {:else}
                                    {"Outer Piece"}
                                {/if}
                            </p>
                        </a>
                        <a href="/" aria-label="next-room">
                            <div class="p-4 bg-primary">
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
            class="flex items-center justify-center absolute size-10 rounded-full end-18 top-1/2 -translate-y-1/2 group bg-surface-action-neutral-normal hover:bg-surface-action-neutral-hover shadow-2xl cursor-pointer"
        />
    </Carousel.Root>
</section>

<!-- <section class="flex overflow-clip w-full">
    <img src="/Group.png" alt="xibiuzinho" width="1784" height="735" class="w-446 h-183.75 object-contain">
</section> -->

<section
    class="flex flex-col items-center relative w-full max-w-360 h-183.75 overflow-hidden"
>
    <div class="flex flex-col items-center absolute">
        <p class="font-primary text-body-md text-content-subtle font-semibold">
            Share your setup with
        </p>
        <h3
            class="font-primary text-heading-h4 text-content-heading font-semibold"
        >
            #FurniroFurniture
        </h3>
    </div>
    <img src="/Group.png" alt="xibiuzinho" class="w-full h-full object-cover" />
</section>
