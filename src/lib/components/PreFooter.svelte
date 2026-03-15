<script lang="ts">
    import {
        BadgeCheck,
        Headset,
        type Icon,
        Trophy,
        Truck,
    } from "@lucide/svelte";
    import { cn } from "tailwind-variants";

    type OptionItem = {
        title: string;
        description: string;
        icon: typeof Icon;
    };

    const options: OptionItem[] = [
        {
            title: "High Quality",
            description: "crated from top materials",
            icon: Trophy,
        },
        {
            title: "Warranty Protection",
            description: "over 2 years",
            icon: BadgeCheck,
        },
        {
            title: "Free Shipping",
            description: "order over R$ 150,00",
            icon: Truck,
        },
        {
            title: "24 / 7 Support",
            description: "dedicated support",
            icon: Headset,
        },
    ];
</script>

{#snippet optionItem(item: OptionItem)}
    {@const Icon = item.icon}
    <div class={cn("flex", "items-center", "gap-2")}>
        <Icon size={45} />
        <div class={cn("flex", "flex-col", "gap-0.5")}>
            <h3
                class={cn(
                    "font-primary",
                    "text-xl/tight",
                    "text-content-heading",
                    "font-semibold",
                )}
            >
                {item.title}
            </h3>
            <p
                class={cn(
                    "font-primary",
                    "text-base/tight",
                    "text-content-subtle",
                    "font-semibold",
                )}
            >
                {item.description}
            </p>
        </div>
    </div>
{/snippet}

<div
    class={cn(
        "flex",
        "w-full",
        "justify-between",
        "bg-surface-tertiary",
        "px-16",
        "py-24",
    )}
>
    {#each options as option (option.title)}
        {@render optionItem(option)}
    {/each}
</div>
