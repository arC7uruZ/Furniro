<script lang="ts">
    import { Button } from "bits-ui";
    import {
        Share2,
        ArrowRightLeft,
        Heart,
        type Icon as IconType,
    } from "@lucide/svelte";
    import { cn } from "tailwind-variants";
    import { formatPrice } from "$lib/utils";

    let {
        imgSrc,
        imgAlt,
        title,
        description,
        discount,
        price,
        createdAt,
        showOutlier = false,
        slug = ""
    } = $props();
</script>

{#snippet tag(type: "new" | "discount", value: string)}
    <div
        class={cn(
            "absolute",
            "top-5",
            "right-5",
            "flex",
            "justify-center",
            "items-center",
            "size-12",
            "rounded-full",
            { "bg-green-400": type === "new" },
            { "bg-red-400": type !== "new" },
            "text-content-secondary",
            "font-primary",
            "font-medium",
            "text-base",
        )}
    >
        {value}
    </div>
{/snippet}
{#snippet IconButton(text: string, icon: typeof IconType)}
    {@const Icon = icon}
    <Button.Root
        class={cn(
            "flex",
            "items-center",
            "px-xs",
            "py-2xs",
            "text-body-md/tight",
            "text-content-on-action-primary-normal",
            "hover:bg-surface-action-primary-hover",
            "font-semibold",
            "cursor-pointer",
            "gap-1",
        )}
    >
        <Icon class="size-5" />
        {text}
    </Button.Root>
{/snippet}
<div>
    <a
        href={slug ? `/shop/${slug}`: "/"}
        class={cn(
            "flex",
            "flex-col",
            "group",
            "w-71.25",
            "h-111.5",
            "relative",
        )}
    >
        <img
            src={imgSrc}
            alt={imgAlt}
            width="285"
            height="301"
            class={cn("object-cover", "w-71.25", "h-75.25", "object-center")}
        />
        <div
            class={cn(
                "flex-1",
                "flex",
                "flex-col",
                "justify-evenly",
                "p-4",
                "bg-surface-subtle",
            )}
        >
            <h4 class={cn("font-primary", "font-semibold", "text-2xl")}>
                {title}
            </h4>
            <p
                class={cn(
                    "font-primary",
                    "font-medium",
                    "text-base",
                    "text-content-subtle",
                )}
            >
                {description}
            </p>
            <div class={cn("flex", "justify-between", "items-center")}>
                {#if discount}
                    <p class={cn("font-primary", "font-semibold", "text-xl")}>
                        {formatPrice((price * (100 - discount)) / 100)}
                    </p>
                    <p
                        class={cn(
                            "font-primary",
                            "font-medium",
                            "text-base",
                            "text-content-subtle",
                            "line-through",
                        )}
                    >
                        {formatPrice(price)}
                    </p>
                {:else}
                    <p class={cn("font-primary", "font-semibold", "text-xl")}>
                        {formatPrice(price)}
                    </p>
                {/if}
            </div>
        </div>
        {#if discount}
            {@render tag("discount", `-${discount}%`)}
        {:else if new Date().getTime() - createdAt < 1000 * 60 * 60 * 24 * 150}
            {@render tag("new", "New")}
        {/if}
        {#if showOutlier}
            <div
                class={cn(
                    "flex",
                    "flex-col",
                    "gap-sm",
                    "p-xs",
                    "justify-center",
                    "items-center",
                    "pointer-events-none",
                    "opacity-0",
                    "group-hover:opacity-100",
                    "group-hover:pointer-events-auto",
                    "group-focus-within:opacity-100",
                    "group-focus-within:pointer-events-auto",
                    "transition-all",
                    "duration-300",
                    "ease-out",
                    "size-full",
                    "absolute",
                    "bg-black/50",
                )}
            >
                <Button.Root
                    class={cn(
                        "px-2xl",
                        "py-sm",
                        "font-primary",
                        "font-semibold",
                        "text-heading-h6",
                        "text-content-on-action-secondary-normal",
                        "hover:text-content-on-action-primary-hover",
                        "bg-surface-action-neutral-normal",
                        "cursor-pointer",
                        "hover:bg-surface-action-primary-hover",
                    )}
                >
                    Add to Cart
                </Button.Root>
                <div
                    class={cn(
                        "flex",
                        "justify-between",
                        "text-content-on-action",
                        "w-full",
                    )}
                >
                    {@render IconButton("Share", Share2)}
                    {@render IconButton("Compare", ArrowRightLeft)}
                    {@render IconButton("Like", Heart)}
                </div>
            </div>
        {/if}
    </a>
</div>
