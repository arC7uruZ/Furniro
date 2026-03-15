<script>
    import ProductCard from "$lib/components/ProductCard.svelte";
    import { Button } from "bits-ui";
    import { cn } from "tailwind-variants";

    let {
        products,
        showMore,
        loading,
        cols,
        rows,
        showOutlier = false,
    } = $props();
</script>

<div class={cn("flex", "flex-col", "gap-8", "items-center")}>
    <ul
        class={cn("grid", "gap-8")}
        style:grid-template-columns="repeat({cols}, minmax(0, 1fr));"
    >
        {#each products as product}
            <li>
                <ProductCard {...product} {showOutlier} />
            </li>
        {/each}
    </ul>
    <Button.Root
        class={cn(
            "flex",
            "justify-center",
            "items-center",
            "cursor-pointer",
            "px-3xl",
            "py-sm",
            "border",
            "font-primary",
            "font-semibold",
            "text-xl",
            "hover:bg-surface-action-neutral-hover",
            "disabled:bg-surface-action-disabled",
            "text-content-on-action-secondary-normal",
            "hover:text-content-on-action-secondary-hover",
            "disabled:text-content-on-action-disabled",
            "border-stroke-action-normal",
            "hover:border-stroke-action-hover",
            "disabled:border-stroke-action-disabled",
        )}
        onclick={showMore}
        disabled={loading}
    >
        {loading ? "Loading..." : "Show More"}
    </Button.Root>
</div>
