<script lang="ts">
    import { page } from "$app/state";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb";
    import { formatPrice } from "$lib/utils";
    import { Separator } from "bits-ui";
    import type { PageProps } from "./$types";
    import ImageCarousel from "./ImageCarousel.svelte";
    import { cn } from "tailwind-variants";

    let { params, data }: PageProps = $props();

    const product = $derived(data.product);

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
    console.log(product.colors);
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

<main class={cn("flex")}>
    <ImageCarousel images={product.images} />
    <div class={cn("flex", "flex-col", "gap-2", "p-10")}>
        <div>
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
            <p
                class={cn(
                    "font-primary",
                    "text-content-subtle",
                    "text-base",
                    "font-semibold",
                )}
            >
                {formatPrice(product.price)}
            </p>
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
        <form class={cn("flex", "flex-col", "gap-4")}>
            <div class={cn("flex", "flex-col", "gap-2")}>
                <p
                    class={cn(
                        "font-primary",
                        "text-body-md",
                        "font-normal",
                        "text-content-subtle",
                    )}
                >
                    Size
                </p>
                <div class={cn("flex", "gap-2")}>
                    {#each product.sizes as size}
                        <label>
                            <input
                                type="radio"
                                name="size-selection"
                                value={size}
                                bind:group={selectedSize}
                                class={cn("peer", "sr-only")}
                            />
                            <p
                                class={cn(
                                    "flex",
                                    "items-center",
                                    "justify-center",
                                    "size-8",
                                    "rounded-md",
                                    "text-body-sm",
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
                                {size}
                            </p>
                        </label>
                    {/each}
                </div>
            </div>
            <div class={cn("flex", "flex-col", "gap-2")}>
                <p
                    class={cn(
                        "font-primary",
                        "text-body-md",
                        "font-normal",
                        "text-content-subtle",
                    )}
                >
                    Color
                </p>
                <div class={cn("flex", "gap-4")}>
                    {#each product.colors as color}
                        <label>
                            <input
                                type="radio"
                                name="color-selection"
                                value={color}
                                bind:group={selectedColor}
                                class={cn("peer", "sr-only")}
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
        </form>
    </div>
</main>
