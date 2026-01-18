<script lang="ts">
    import * as Carousel from "$lib/components/ui/carousel";
    import {
        Share2,
        ArrowRightLeft,
        Heart,
        type Icon as IconType,
    } from "@lucide/svelte";
    import { Button } from "bits-ui";
    import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";

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

        console.log("current:", current);
    });

    const formatPrice = (price: number) => {
        return Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);
    };

    const carouselProducs = [
        {
            category: "Bed room",
            type: "Inner Piece",
            src: "/rooms/1.png",
            alt: "room 1",
        },
        {
            category: "Dinner",
            type: "Inner Piece",
            src: "/rooms/2.png",
            alt: "room 2",
        },
        {
            category: "Living",
            type: "Inner Piece",
            src: "/rooms/3.png",
            alt: "room 3",
        },
        {
            category: "Living",
            type: "Outer Piece",
            src: "/rooms/4.png",
            alt: "room 4",
        },
    ];

    const products = [
        {
            title: "Slytherine",
            description: "stylish cafe chair",
            price: 3_500.0,
            discount: 30,
            imgSrc: "/products/1.png",
            imgAlt: "a slytherin product",
            addedToCatalogDate: new Date("2024-01-15"),
        },
        {
            title: "Leviosa",
            description: "stylish cafe chair",
            price: 2_500.0,
            imgSrc: "/products/2.png",
            imgAlt: "a leviosa product",
            addedToCatalogDate: new Date("2024-03-22"),
        },
        {
            title: "Lolita",
            description: "Luxury big sofa",
            price: 14_000.0,
            discount: 50,
            imgSrc: "/products/3.png",
            imgAlt: "a lolita product",
            addedToCatalogDate: new Date("2024-02-10"),
        },
        {
            title: "Respira",
            description: "Oltdoor bar table and stool",
            price: 500.0,
            imgSrc: "/products/5.png",
            imgAlt: "a slytherin product",
            addedToCatalogDate: new Date("2025-12-15"),
        },
        {
            title: "Grifo",
            description: "Night lamp",
            price: 1_500.0,
            imgSrc: "/products/9.png",
            imgAlt: "a slytherin product",
            addedToCatalogDate: new Date("2024-01-30"),
        },
        {
            title: "Muggo",
            description: "Small mug",
            price: 150.0,
            imgSrc: "/products/10.png",
            imgAlt: "a slytherin product",
            addedToCatalogDate: new Date("2024-05-12"),
        },
        {
            title: "Pingky",
            description: "Cute bed set",
            price: 14_000.0,
            discount: 50,
            imgSrc: "/products/11.png",
            imgAlt: "a slytherin product",
            addedToCatalogDate: new Date("2026-01-01"),
        },
        {
            title: "Potty",
            description: "Minimalist flower pot",
            price: 500.0,
            imgSrc: "/products/12.png",
            imgAlt: "a slytherin product",
            addedToCatalogDate: new Date("2024-06-01"),
        },
    ];
</script>

<section
    class="flex flex-col p-12 items-end justify-center bg-[url('/bg-1.png')] bg-cover bg-center min-h-200 w-full"
>
    <div
        class="flex flex-col gap-16 p-xl justify-between items-start bg-surface-tertiary rounded-xl shadow-lg"
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
            {#snippet CategoryCard(url: string, path: string, caption: string)}
                <a
                    href={`/${path}`}
                    class="flex flex-col items-center focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-stroke-focus hover:scale-105 transform transition-transform duration-300 ease-out rounded-xl"
                >
                    <img
                        src="/furniture/{url}"
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
            {@render CategoryCard("image%20106.png", "dinner", "Dining")}
            {@render CategoryCard("image%20100.png", "living", "Living")}
            {@render CategoryCard("image%20101.png", "bedroom", "Bedroom")}
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
        {#snippet tag(type: "new" | "discount", value: string)}
            <div
                class="absolute top-5 right-5 flex justify-center items-center size-12 rounded-full {type ===
                'new'
                    ? 'bg-green-400'
                    : 'bg-red-400'} text-content-secondary font-primary font-medium text-base"
            >
                {value}
            </div>
        {/snippet}
        {#snippet ProductCard(
            title: string,
            description: string,
            price: number,
            src: string,
            alt: string,
            addedToCatalogDate: Date,
            discount?: number,
        )}
            <li>
                <a
                    href="/"
                    class="flex flex-col group w-71.25 h-111.5 relative"
                >
                    <img {src} {alt} width="285" height="301" />
                    <div
                        class="flex-1 flex flex-col justify-evenly p-4 bg-surface-subtle"
                    >
                        <h4 class="font-primary font-semibold text-2xl">
                            {title}
                        </h4>
                        <p
                            class="font-primary font-medium text-base text-content-subtle"
                        >
                            {description}
                        </p>
                        <div class="flex justify-between items-center">
                            {#if discount}
                                <p class="font-primary font-semibold text-xl">
                                    {formatPrice(
                                        (price * (100 - discount)) / 100,
                                    )}
                                </p>
                                <p
                                    class="font-primary font-medium text-base text-content-subtle line-through"
                                >
                                    {formatPrice(price)}
                                </p>
                            {:else}
                                <p class="font-primary font-semibold text-xl">
                                    {formatPrice(price)}
                                </p>
                            {/if}
                        </div>
                    </div>
                    {#if discount}
                        {@render tag("discount", `-${discount}%`)}
                    {:else if new Date().getTime() - addedToCatalogDate.getTime() < 1000 * 60 * 60 * 24 * 30}
                        {@render tag("new", "New")}
                    {/if}
                    <div
                        class="flex flex-col gap-sm p-xs justify-center items-center pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-all duration-300 ease-out size-full absolute bg-black/50"
                    >
                        <Button.Root
                            class="px-2xl py-sm font-primary font-semibold text-heading-h6 text-content-on-action-secondary-normal hover:text-content-on-action-primary-hover bg-surface-action-neutral-normal cursor-pointer hover:bg-surface-action-primary-hover"
                        >
                            Add to Cart
                        </Button.Root>
                        {#snippet IconButton(
                            text: string,
                            icon: typeof IconType,
                        )}
                            {@const Icon = icon}
                            <Button.Root
                                class="flex items-center px-xs py-2xs text-body-md/tight text-content-on-action-primary-normal hover:bg-surface-action-primary-hover font-semibold cursor-pointer gap-1"
                            >
                                <Icon class="size-5" />
                                {text}
                            </Button.Root>
                        {/snippet}
                        <div
                            class="flex justify-between text-content-on-action w-full"
                        >
                            {@render IconButton("Share", Share2)}
                            {@render IconButton("Compare", ArrowRightLeft)}
                            {@render IconButton("Like", Heart)}
                        </div>
                    </div>
                </a>
            </li>
        {/snippet}
        {#each products as product}
            {@render ProductCard(
                product.title,
                product.description,
                product.price,
                product.imgSrc,
                product.imgAlt,
                product.addedToCatalogDate,
                product.discount,
            )}
        {/each}
    </ul>
    <Button.Root
        class="flex justify-center items-center cursor-pointer px-3xl py-sm border font-primary font-semibold text-body-lg hover:bg-surface-action-neutral-hover text-content-on-action-secondary-normal hover:text-content-on-action-secondary-hover border-stroke-action-normal hover:border-stroke-action-hover"
    >
        Show More
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
        <a
            href="/"
            class="px-12 pt-4 pb-4 bg-primary text-white font-primary font-semibold text-base"
        >
            Explore More
        </a>
    </div>
    <Carousel.Root
        setApi={(emblaApi) => (api = emblaApi)}
        opts={{ align: "start", loop: true }}
        class="w-200"
    >
        <Carousel.Content class="flex items-start min-h-145.5 w-full">
            {#each carouselProducs as product, i (i)}
                <Carousel.Item
                    class="relative flex items-center justify-center basis-6/14 mx-2"
                >
                    <img
                        src={product.src}
                        alt={product.alt}
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
                                {product.category}
                            </p>

                            <p class="font-primary font-semibold text-[28px]">
                                {product.type}
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
        <Carousel.DotGroup/>
        <Carousel.Next
            class="flex items-center justify-center absolute size-10 rounded-full end-18 top-1/2 -translate-y-1/2 group bg-surface-action-neutral-normal hover:bg-surface-action-neutral-hover shadow-2xl cursor-pointer"
        />
    </Carousel.Root>
</section>

<!-- <section class="flex overflow-clip w-full">
    <img src="/Group.png" alt="xibiuzinho" width="1784" height="735" class="w-446 h-183.75 object-contain">
</section> -->

<section class="relative w-full max-w-360 h-183.75 overflow-hidden">
  <img
    src="/Group.png"
    alt="xibiuzinho"
    class="w-full h-full object-cover"
  />
</section>
