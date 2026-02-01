<script lang="ts">
    import PageHeader from "$lib/components/PageHeader.svelte";
    import * as Sheet from "$lib/components/ui/sheet/index";
    import {
        SlidersHorizontal,
        Grid2x2,
        GalleryVertical,
        XIcon,
        ChevronLeft,
        ChevronRight,
        ChevronDown,
    } from "@lucide/svelte";
    import {
        Separator,
        Label,
        Switch,
        Slider,
        Select,
        Pagination,
    } from "bits-ui";
    import type { PageProps } from "./$types";
    import { SvelteMap } from "svelte/reactivity";

    let { data }: PageProps = $props();

    // svelte-ignore state_referenced_locally
    let minPossiblePrice = Math.floor(data.priceRange[0].minPrice);
    // svelte-ignore state_referenced_locally
    let maxPossiblePrice = Math.ceil(data.priceRange[0].maxPrice);

    const filter: SvelteMap<string, string | number | boolean> =
        new SvelteMap();

    let nameFilter = $derived(filter.get("name") || "");
    let typeFilter = $derived(filter.get("type") || "");
    let categoryFilter = $derived(filter.get("category") || "");
    let discountFilter = $derived(filter.get("discount") || false) as boolean;
    let newFilter = $derived(filter.get("new") || false) as boolean;
    let value = $derived([
        filter.get("minPrice") || minPossiblePrice,
        filter.get("maxPrice") || maxPossiblePrice,
    ]) as number[];

    // $inspect("Current Filters", filter);

    $effect(() => {
        if (nameFilter !== "") {
            filter.set("name", nameFilter);
        } else {
            filter.delete("name");
        }
    });

    $effect(() => {
        if (Math.min(...(value as number[])) !== minPossiblePrice) {
            filter.set("minPrice", Math.min(...(value as number[])));
        } else {
            filter.delete("minPrice");
        }
    });

    $effect(() => {
        if (Math.max(...(value as number[])) !== maxPossiblePrice) {
            filter.set("maxPrice", Math.max(...(value as number[])));
        } else {
            filter.delete("maxPrice");
        }
    });

    $effect(() => {
        if (typeFilter !== "") {
            filter.set("type", typeFilter);
        } else {
            filter.delete("type");
        }
    });

    $effect(() => {
        if (categoryFilter !== "") {
            filter.set("category", categoryFilter);
        } else {
            filter.delete("category");
        }
    });

    $effect(() => {
        if (discountFilter) {
            filter.set("discount", discountFilter);
        } else {
            filter.delete("discount");
        }
    });

    $effect(() => {
        if (newFilter) {
            filter.set("new", newFilter);
        } else {
            filter.delete("new");
        }
    });

    const formatPrice = (price: number) => {
        return Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);
    };

    let products = $derived([...data.products]);
    let totalProducts = $derived(data.meta.total);
    let queryParams = $derived.by(() => {
        let params = new URLSearchParams();

        for (const [key, value] of filter) {
            params.append(key, String(value));
        }

        return params.toString();
    });
    let sort = $state("default");
    let pageSize = $state(8);
    let page = $derived.by(() => {
        queryParams; // depend on queryParams to reset page when filters change
        pageSize;
        return 1;
    });

    // console.log(`Total products: ${totalProducts}`);

    let loading = $state(false);
    let hasMore = $state(true);

    // $inspect("page", page);

    $effect(() => {
        const controller = new AbortController();

        (async () => {
            const res = await fetch(
                `/products?page=${page}&pageSize=${pageSize}&${queryParams.toString()}${
                    sort !== "default" ? `&sort=${sort}` : ""
                }`,
                { signal: controller.signal },
            );

            const response = await res.json();

            products = response.products;
            totalProducts = response.meta.total;
        })();

        return () => {
            controller.abort();
        };
    });

    const sortOptions = [
        // { value: "default", label: "Default" },
        { value: "price_asc", label: "Price: Low to High" },
        { value: "price_desc", label: "Price: High to Low" },
        { value: "date_asc", label: "Newest Arrivals" },
        { value: "date_desc", label: "Oldest Arrivals" },
        { value: "title_asc", label: "Title: A to Z" },
        { value: "title_desc", label: "Title: Z to A" },
    ];

    const pageSizes = [
        { value: "8", label: "8" },
        { value: "16", label: "16" },
        { value: "24", label: "24" },
        { value: "32", label: "32" },
    ];
</script>

<main class="w-full">
    <PageHeader />
    <div class="flex justify-evenly py-5 bg-surface-tertiary">
        <div class="flex items-center justify-evenly w-full">
            <div class="flex items-center gap-7">
                <div class="flex gap-2 items-center">
                    <Sheet.Root>
                        <Sheet.Trigger class="flex items-center gap-2 cursor-pointer">
                            <SlidersHorizontal />
                            <h3>filter</h3>
                        </Sheet.Trigger>
                        <Sheet.Content
                            class="w-129.5 bg-surface-neutral"
                            side="left"
                        >
                            <Sheet.Header
                                class="flex flex-col gap-4 px-10 py-6"
                            >
                                <Sheet.Title
                                    class="font-primary flex justify-between text-5xl font-semibold"
                                    >Filter
                                    {#if filter.size > 0}
                                        <button
                                            class="font-primary text-base font-regular border rounded-full px-4 cursor-pointer hover:bg-gray-100"
                                            onclick={() => filter.clear()}
                                        >
                                            clear filters
                                        </button>
                                    {/if}
                                </Sheet.Title>
                                <Sheet.Description class="flex flex-wrap gap-2">
                                    {#each filter as filterItem, index (index)}
                                        <div
                                            class="bg-primary text-white px-4 py-1 rounded-full flex gap-2 items-center"
                                        >
                                            <p>
                                                {#if typeof filterItem[1] !== "boolean"}
                                                    {filterItem[0]}:
                                                    <strong
                                                        >{filterItem[1]}</strong
                                                    >
                                                {:else}
                                                    {filterItem[0]}
                                                {/if}
                                            </p>
                                            <XIcon
                                                class="size-4 cursor-pointer"
                                                onclick={() => {
                                                    filter.delete(
                                                        filterItem[0],
                                                    );
                                                }}
                                            />
                                        </div>
                                    {/each}
                                </Sheet.Description>
                            </Sheet.Header>
                            <Separator.Root
                                decorative
                                class="border border-gray-200"
                            />
                            <div class="flex gap-4 px-10 py-6 items-center">
                                <label
                                    for="filter-by-name"
                                    class="font-primary text-2xl font-semibold text-content-heading"
                                    >Name</label
                                >
                                <input
                                    id="filter-by-name"
                                    type="text"
                                    placeholder="Search by name"
                                    bind:value={nameFilter}
                                    class="w-full border-stroke-action-disabled border-2 rounded-lg"
                                />
                            </div>
                            <Separator.Root
                                decorative
                                class="border border-gray-200"
                            />
                            <div
                                class="flex flex-col gap-4 px-10 py-6 items-start font-primary text-2xl font-semibold text-content-heading"
                            >
                                Type
                                <div class="flex gap-10">
                                    <div>
                                        <input
                                            id="filter-by-name"
                                            type="radio"
                                            name="type"
                                            value="Inner Piece"
                                            class="checked:bg-black"
                                            bind:group={typeFilter}
                                        />
                                        <label
                                            for="filter-by-name"
                                            class="font-primary text-[18px] font-regular"
                                            >Inner Piece</label
                                        >
                                    </div>
                                    <div>
                                        <input
                                            id="filter-by-name"
                                            type="radio"
                                            name="type"
                                            value="Outer Piece"
                                            class="checked:bg-black"
                                            bind:group={typeFilter}
                                        />
                                        <label
                                            for="filter-by-name"
                                            class="font-primary text-[18px] font-regular"
                                            >Outer Piece</label
                                        >
                                    </div>
                                </div>
                            </div>
                            <Separator.Root
                                decorative
                                class="border border-gray-200"
                            />
                            <div
                                class="flex flex-col gap-4 px-10 py-6 items-start font-primary text-2xl font-semibold text-content-heading"
                            >
                                Category
                                <div class="flex gap-10">
                                    <div>
                                        <input
                                            id="filter-by-name"
                                            type="radio"
                                            name="category"
                                            value="Dinner"
                                            class="checked:bg-black"
                                            bind:group={categoryFilter}
                                        />
                                        <label
                                            for="filter-by-name"
                                            class="font-primary text-[18px] font-regular"
                                            >Dinner</label
                                        >
                                    </div>
                                    <div>
                                        <input
                                            id="filter-by-name"
                                            type="radio"
                                            name="category"
                                            value="Living"
                                            class="checked:bg-black"
                                            bind:group={categoryFilter}
                                        />
                                        <label
                                            for="filter-by-name"
                                            class="font-primary text-[18px] font-regular"
                                            >Living</label
                                        >
                                    </div>
                                    <div>
                                        <input
                                            id="filter-by-name"
                                            type="radio"
                                            name="category"
                                            value="Bed Room"
                                            class="checked:bg-black"
                                            bind:group={categoryFilter}
                                        />
                                        <label
                                            for="filter-by-name"
                                            class="font-primary text-[18px] font-regular"
                                            >BedRoom</label
                                        >
                                    </div>
                                </div>
                            </div>
                            <Separator.Root
                                decorative
                                class="border border-gray-200"
                            />
                            <div class="flex gap-20 px-10 py-6">
                                <div class="flex items-center gap-2">
                                    <Label.Root
                                        for="discount"
                                        class="font-primary text-2xl font-semibold text-content-heading"
                                        >Discount</Label.Root
                                    >
                                    <Switch.Root
                                        id="discount"
                                        name="discount"
                                        bind:checked={discountFilter}
                                        class="focus-visible:ring-foreground focus-visible:ring-offset-background data-[state=checked]:bg-surface-action-primary-hover data-[state=unchecked]:bg-content-disabled data-[state=unchecked]:shadow-mini-inset focus-visible:outline-hidden peer inline-flex h-6 min-h-6 w-11 shrink-0 cursor-pointer items-center rounded-full px-0.75 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Switch.Thumb
                                            class="bg-content-on-action-primary-normal data-[state=unchecked]:shadow-mini pointer-events-none block size-5 shrink-0 rounded-full transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
                                        />
                                    </Switch.Root>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Label.Root
                                        for="new"
                                        class="font-primary text-2xl font-semibold text-content-heading"
                                        >New</Label.Root
                                    >
                                    <Switch.Root
                                        id="new"
                                        name="new"
                                        bind:checked={newFilter}
                                        class="focus-visible:ring-foreground focus-visible:ring-offset-background data-[state=checked]:bg-surface-action-primary-hover data-[state=unchecked]:bg-content-disabled data-[state=unchecked]:shadow-mini-inset focus-visible:outline-hidden peer inline-flex h-6 min-h-6 w-11 shrink-0 cursor-pointer items-center rounded-full px-0.75 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Switch.Thumb
                                            class="bg-content-on-action-primary-normal data-[state=unchecked]:shadow-mini pointer-events-none block size-5 shrink-0 rounded-full transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
                                        />
                                    </Switch.Root>
                                </div>
                            </div>
                            <Separator.Root
                                decorative
                                class="border border-gray-200"
                            />
                            <div
                                class="w-full flex flex-col gap-8 items-center"
                            >
                                <div class="flex gap-4 items-center">
                                    <div class="flex gap-1 items-center">
                                        <p>
                                            Min - <strong
                                                >R$ {value[0]},00</strong
                                            >
                                        </p>
                                    </div>
                                    <div class="flex gap-1 items-center">
                                        <p>
                                            Max - <strong
                                                >R$ {value[1]},00</strong
                                            >
                                        </p>
                                    </div>
                                </div>
                                <div class="w-full max-w-1/2">
                                    <Slider.Root
                                        step={1}
                                        min={minPossiblePrice}
                                        max={maxPossiblePrice}
                                        type="multiple"
                                        bind:value
                                        class="relative flex w-full touch-none select-none items-center"
                                    >
                                        {#snippet children({
                                            tickItems,
                                            thumbs,
                                        })}
                                            <span
                                                class="bg-gray-200 relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
                                            >
                                                <Slider.Range
                                                    class="bg-primary absolute h-full"
                                                />
                                            </span>
                                            {#each thumbs as thumb (thumb)}
                                                <Slider.Thumb
                                                    index={thumb}
                                                    class="border-border-input bg-primary hover:border-gray-400 focus-visible:ring-primary dark:bg-secondary dark:shadow-card data-active:border-stone-400 z-5 focus-visible:outline-hidden data-active:scale-[0.98] block size-6.25 cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                                />
                                            {/each}
                                            {#each tickItems as { index } (index)}
                                                <Slider.Tick
                                                    {index}
                                                    class="dark:bg-background/20 bg-background z-1 h-2 w-px"
                                                />
                                            {/each}
                                        {/snippet}
                                    </Slider.Root>
                                </div>
                            </div>
                        </Sheet.Content>
                    </Sheet.Root>
                </div>
                <Grid2x2 />
                <GalleryVertical />
                <Separator.Root
                    decorative
                    orientation="vertical"
                    class="border h-8"
                />
                <p
                    class="font-primary text-body-md font-medium text-content-body"
                >
                    Showing {(page - 1) * pageSize + 1}-{Math.min(
                        pageSize * page,
                        totalProducts,
                    )} of {totalProducts} Results
                </p>
            </div>

            <div class="flex items-center gap-7">
                <div class="flex items-center gap-4">
                    <p
                        class="font-primary text-content-heading text-heading-h6 font-medium"
                    >
                        Show
                    </p>
                    <Select.Root
                        type="single"
                        onValueChange={(v) => {
                            pageSize = Number.parseInt(v) || pageSize;
                        }}
                        items={pageSizes}
                        allowDeselect={true}
                    >
                        <Select.Trigger
                            class="h-input min-w-20 rounded-md border-stroke-action-disabled bg-surface-neutral data-placeholder:text-foreground-alt/50 inline-flex gap-4 touch-none select-none items-center border ps-4 pe-1 py-1 text-sm transition-colors cursor-pointer"
                            aria-label="Select a page size"
                        >
                            {pageSize}
                            <ChevronDown
                                class="text-content-body ml-auto size-6"
                            />
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Content
                                class="focus-override border-stroke-action-disabled bg-surface-neutral shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-50 h-auto min-w-(--bits-select-anchor-width) select-none rounded-xl border data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
                                sideOffset={10}
                            >
                                <!-- <Select.ScrollUpButton
                                class="flex w-full items-center justify-center"
                            >
                                <ChevronsUp class="size-3" />
                            </Select.ScrollUpButton> -->
                                <Select.Viewport class="">
                                    {#each pageSizes as size, i (i + size.value)}
                                        <Select.Item
                                            class="first:rounded-t-xl last:rounded-b-xl data-highlighted:bg-gray-100 outline-hidden data-disabled:opacity-50 flex h-10 w-full select-none justify-center items-center text-sm capitalize cursor-pointer"
                                            value={size.value}
                                            label={size.label}
                                        >
                                            {#snippet children({ selected })}
                                                {size.label}
                                                <!-- {#if selected}
                                                <div class="ml-auto">
                                                    <Check aria-label="check" />
                                                </div>
                                            {/if} -->
                                            {/snippet}
                                        </Select.Item>
                                    {/each}
                                </Select.Viewport>
                                <!-- <Select.ScrollDownButton
                                class="flex w-full items-center justify-center"
                            >
                                <CaretDoubleDown class="size-3" />
                            </Select.ScrollDownButton> -->
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>
                </div>
                <div class="flex items-center gap-4">
                    <p
                        class="font-primary text-heading text-heading-h6 font-medium"
                    >
                        Sort By
                    </p>
                    <Select.Root
                        type="single"
                        onValueChange={(v) => (sort = v)}
                        items={sortOptions}
                        allowDeselect={true}
                    >
                        <Select.Trigger
                            class="h-input rounded-md border-stroke-action-disabled bg-surface-neutral data-placeholder:text-foreground-alt/50 inline-flex gap-4 touch-none select-none items-center border min-w-40 ps-4 pe-1 py-1 text-sm transition-colors cursor-pointer"
                            aria-label="Select a page size"
                        >
                            <!-- <Palette
                            class="text-muted-foreground mr-[9px] size-6"
                        /> -->
                            {sortOptions.find((option) => option.value === sort)
                                ?.label || "Default"}
                            <ChevronDown
                                class="text-content-body ml-auto size-6"
                            />
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Content
                                class="focus-override border-stroke-action-disabled bg-surface-neutral shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-50 h-auto min-w-(--bits-select-anchor-width) select-none rounded-xl border data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
                                sideOffset={10}
                            >
                                <!-- <Select.ScrollUpButton
                                class="flex w-full items-center justify-center"
                            >
                                <ChevronsUp class="size-3" />
                            </Select.ScrollUpButton> -->
                                <Select.Viewport class="">
                                    {#each sortOptions as option, i (i + option.value)}
                                        <Select.Item
                                            class="first:rounded-t-xl last:rounded-b-xl data-highlighted:bg-gray-100 outline-hidden data-disabled:opacity-50 flex h-10 w-full select-none justify-center items-center text-sm capitalize cursor-pointer"
                                            value={option.value}
                                            label={option.label}
                                        >
                                            {#snippet children({ selected })}
                                                {option.label}
                                                <!-- {#if selected}
                                                <div class="ml-auto">
                                                    <Check aria-label="check" />
                                                </div>
                                            {/if} -->
                                            {/snippet}
                                        </Select.Item>
                                    {/each}
                                </Select.Viewport>
                                <!-- <Select.ScrollDownButton
                                class="flex w-full items-center justify-center"
                            >
                                <CaretDoubleDown class="size-3" />
                            </Select.ScrollDownButton> -->
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>
                </div>
            </div>
        </div>
    </div>
    <section
        aria-labelledby="our-products-title"
        class="flex flex-col gap-8 items-center w-full p-8"
    >
        <ul
            class="grid grid-cols-4 gap-8 grid-rows-2 w-full justify-items-center"
        >
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
                discount: number | null,
            )}
                <li>
                    <a
                        href="/"
                        class="flex flex-col group w-71.25 h-111.5 relative"
                    >
                        <img
                            {src}
                            {alt}
                            width="285"
                            height="301"
                            class="object-cover w-71.25 h-75.25 object-center"
                        />
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
                                    <p
                                        class="font-primary font-semibold text-xl"
                                    >
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
                                    <p
                                        class="font-primary font-semibold text-xl"
                                    >
                                        {formatPrice(price)}
                                    </p>
                                {/if}
                            </div>
                        </div>
                        {#if discount}
                            {@render tag("discount", `-${discount}%`)}
                        {:else if new Date().getTime() - addedToCatalogDate.getTime() < 1000 * 60 * 60 * 24 * 150}
                            {@render tag("new", "New")}
                        {/if}
                        <!-- <div
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
                        </div> -->
                    </a>
                </li>
            {/snippet}
            {#each products as product}
                {@render ProductCard(
                    product.title,
                    product.description,
                    product.price,
                    product.img_src,
                    product.img_alt,
                    new Date(product.created_at),
                    product.discount,
                )}
            {/each}
        </ul>
        <Pagination.Root count={totalProducts} perPage={pageSize} bind:page>
            {#snippet children({ pages, range })}
                <div class="my-8 flex items-center">
                    <Pagination.PrevButton
                        class="hover:bg-surface-action-secondary-hover disabled:bg-surface-action-disabled disabled:text-content-subtle mr-6.25 inline-flex size-10 items-center justify-center rounded-[9px] bg-surface-action-secondary-normal active:scale-[0.98] disabled:cursor-not-allowed hover:disabled:bg-surface-action-disabled cursor-pointer"
                    >
                        <ChevronLeft class="size-6" />
                    </Pagination.PrevButton>
                    <div class="flex items-center gap-2.5">
                        {#each pages as page (page.key)}
                            {#if page.type === "ellipsis"}
                                <div
                                    class="text-content-body select-none text-[15px] font-medium"
                                >
                                    ...
                                </div>
                            {:else}
                                <Pagination.Page
                                    {page}
                                    class="bg-surface-action-secondary-normal hover:bg-surface-action-secondary-hover data-selected:bg-surface-action-primary-normal data-selected:text-content-on-action-primary-normal inline-flex size-10 select-none items-center justify-center rounded-[9px] text-[15px] font-medium active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-surface-action-disabled cursor-pointer"
                                >
                                    {page.value}
                                </Pagination.Page>
                            {/if}
                        {/each}
                    </div>
                    <Pagination.NextButton
                        class="hover:bg-surface-action-secondary-hover disabled:bg-surface-action-disabled disabled:text-content-subtle ml-7.25 inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent active:scale-[0.98] disabled:cursor-not-allowed hover:disabled:bg-surface-action-disabled cursor-pointer"
                    >
                        <ChevronRight class="size-6" />
                    </Pagination.NextButton>
                </div>
                <!-- <p class="text-muted-foreground text-center text-[13px]">
                    Showing {range.start} - {range.end}
                </p> -->
            {/snippet}
        </Pagination.Root>
        <!-- <Button.Root
                class="flex justify-center items-center cursor-pointer px-3xl py-sm border font-primary font-semibold text-body-lg hover:bg-surface-action-neutral-hover disabled:bg-surface-action-disabled text-content-on-action-secondary-normal hover:text-content-on-action-secondary-hover disabled:text-content-on-action-disabled border-stroke-action-normal hover:border-stroke-action-hover disabled:border-stroke-action-disabled"
                onclick={showMore}
                disabled={loading}
            >
                {loading ? "Loading..." : "Show More"}
            </Button.Root> -->
    </section>
</main>
