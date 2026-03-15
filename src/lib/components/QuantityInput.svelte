<script lang="ts">
    import { ChevronDown, ChevronUp } from "@lucide/svelte";
    import { cn } from "tailwind-variants";

    let { value = $bindable(1), min = 1, max = 99 } = $props();

    function decrement() {
        if (value > min) value = value - 1;
    }

    function increment() {
        if (value < max) value = value + 1;
    }
</script>

<div
    class={cn(
        "flex",
        "items-center",
        "border",
        "rounded-md",
        "py-0",
        "w-fit",
        "border-gray-400",
        "has-focus:ring-1",
        "ring-primary",
    )}
>
    <input
        type="number"
        bind:value
        {min}
        {max}
        class={cn(
            "w-8",
            "p-0",
            "h-full",
            "text-center",
            "font-primary",
            "focus:ring-0",
            "text-base",
            "font-medium",
            "text-content-heading",
            "bg-transparent",
            "border-none",
            "outline-none",
            "[appearance:textfield]",
            "[&::-webkit-outer-spin-button]:appearance-none",
            "[&::-webkit-inner-spin-button]:appearance-none",
            "block"
        )}
    />
    <div class={cn("flex", "flex-col", "gap-0.5", "bg-gray-100", "rounded-r-md")}>
        <button
            onclick={increment}
            class={cn(
                "text-lg",
                "font-bold",
                "text-content-subtle",
                "cursor-pointer",
                "select-none",
                "p-1",
                "hover:bg-gray-200",
                "rounded-tr-md",
            )}
        >
            <ChevronUp size="12" strokeWidth="4" />
        </button>
        <button
            onclick={decrement}
            class={cn(
                "text-lg",
                "font-bold",
                "text-content-subtle",
                "cursor-pointer",
                "select-none",
                "p-1",
                // "bg-gray-100",
                "hover:bg-gray-200",
                "rounded-br-md",
            )}
        >
            <ChevronDown size="12" strokeWidth="4" />
        </button>
    </div>
</div>
