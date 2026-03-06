<script lang="ts">
    import { invalidate, invalidateAll } from "$app/navigation";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import { formatPrice } from "$lib/utils";
    import { Trash2 } from "@lucide/svelte";
    import { cn } from "tailwind-variants";
    import type { PageProps } from "./$types";
    import QuantityInput from "./QuantityInput.svelte";

    let { data }: PageProps = $props();

    // svelte-ignore state_referenced_locally
    let cartItems = $state(data.cartItems);

    $effect(() => {
        cartItems = data.cartItems;
    });

    async function deleteItem(item: {
        productId: number;
        imgSrc: string;
        imgAlt: string;
        title: string;
        price: number;
        discount: number | null;
        sizeId: number;
        sizeTitle: string;
        colorId: number;
        colorRgb: string;
        quantity: number;
    }) {
        // console.log(item)
        await fetch("/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                productId: item.productId,
                sizeId: item.sizeId,
                colorId: item.colorId,
            }),
        });

        await invalidateAll();
    }
</script>

{#snippet columnTitle(title: string)}
    <th
        class={cn(
            title === "" ? "min-w-16" : "min-w-32",
            "py-4",
            "text-left",
            "font-primary",
            "text-base",
            "text-content-heading",
            "font-semibold",
        )}
    >
        {title}
    </th>
{/snippet}

<PageHeader />

<section class={cn("py-10")}>
    <div>
        {#if cartItems.length > 0}
            <div class={cn("flex", "gap-10")}>
                <table>
                    <thead>
                        <tr class={cn("bg-surface-tertiary")}>
                            {@render columnTitle("")}
                            {@render columnTitle("Product")}
                            {@render columnTitle("Price")}
                            {@render columnTitle("Size")}
                            {@render columnTitle("Color")}
                            {@render columnTitle("Quantity")}
                            {@render columnTitle("Subtotal")}
                            {@render columnTitle("")}
                        </tr>
                    </thead>
                    <tbody>
                        {#each cartItems as item}
                            <tr>
                                <td class={cn("pr-4", "py-4")}>
                                    <img
                                        src={item.imgSrc}
                                        alt={item.imgAlt}
                                        class={cn("size-22.5", "rounded-md")}
                                    />
                                </td>
                                <td
                                    class={cn(
                                        "font-primary",
                                        "text-base",
                                        "text-content-subtle",
                                        "font-semibold",
                                        "text-left",
                                    )}
                                >
                                    {item.title}
                                </td>
                                <td
                                    class={cn(
                                        "font-primary",
                                        "text-base",
                                        "text-content-subtle",
                                        "font-normal",
                                        "text-left",
                                    )}
                                >
                                    {item.price}
                                </td>
                                <td
                                    class={cn(
                                        "font-primary",
                                        "text-base",
                                        "text-content-subtle",
                                        "font-normal",
                                        "text-left",
                                    )}
                                >
                                    {item.sizeTitle}
                                </td>
                                <td>
                                    <div
                                        class={cn("size-7", "rounded-full")}
                                        style:background-color={item.colorRgb}
                                    ></div>
                                </td>
                                <td>
                                    <QuantityInput bind:value={item.quantity} />
                                </td>
                                <td
                                    class={cn(
                                        "font-primary",
                                        "text-base",
                                        "text-content-subtle",
                                        "font-normal",
                                        "text-left",
                                    )}
                                >
                                    {formatPrice(item.price * item.quantity)}
                                </td>
                                <td class={cn("text-right")}>
                                    <button
                                        class={cn(
                                            "flex",
                                            "justify-center",
                                            "cursor-pointer",
                                        )}
                                        onclick={async () =>
                                            await deleteItem(item)}
                                        type="button"
                                    >
                                        <Trash2
                                            size="20"
                                            strokeWidth="2"
                                            class={cn("stroke-primary")}
                                        />
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
                <div
                    class={cn(
                        "flex",
                        "flex-col",
                        "items-center",
                        "gap-8",
                        "bg-surface-tertiary",
                        "p-10",
                    )}
                >
                    <h2
                        class={cn(
                            "font-primary",
                            "text-3xl",
                            "text-content-heading",
                            "font-semibold",
                        )}
                    >
                        Total
                    </h2>
                    <div
                        class={cn("flex", "flex-col", "items-center", "gap-2")}
                    >
                        <p
                            class={cn(
                                "flex",
                                "gap-8",
                                "justify-between",
                                "w-full",
                                "font-primary",
                                "text-sm",
                                "text-content-heading",
                                "font-semibold",
                            )}
                        >
                            subtotal <span
                                class={cn("text-content-subtle", "font-medium")}
                                >{formatPrice(
                                    cartItems
                                        .map(
                                            (item) =>
                                                item.price * item.quantity,
                                        )
                                        .reduce((acc, price) => acc + price),
                                )}</span
                            >
                        </p>
                        <p
                            class={cn(
                                "flex",
                                "gap-10",
                                "justify-between",
                                "w-full",
                                "font-primary",
                                "text-sm",
                                "text-content-heading",
                                "font-semibold",
                            )}
                        >
                            total a pagar <span
                                class={cn("text-content-primary", "text-base")}
                                >{formatPrice(
                                    cartItems
                                        .map(
                                            (item) =>
                                                item.price * item.quantity,
                                        )
                                        .reduce((acc, price) => acc + price),
                                )}</span
                            >
                        </p>
                    </div>
                    <button
                        class={cn(
                            "px-4",
                            "py-2",
                            "rounded-md",
                            "border",
                            "border-gray-700",
                            "bg-surface-action-secondary-normal",
                            "hover:bg-surface-action-secondary-hover",
                            "cursor-pointer",
                            "text-content-heading",
                            "text-base",
                            "font-primary",
                            "font-semibold"
                        )}>Ir para pagamento</button
                    >
                </div>
            </div>
        {:else}
            <div
                class={cn("flex", "flex-col", "gap-2", "items-center", "p-10")}
            >
                <h2
                    class={cn(
                        "font-primary",
                        "text-3xl",
                        "text-content-heading",
                        "font-semibold",
                    )}
                >
                    Carrinho vazio
                </h2>
                <p
                    class={cn(
                        "font-primary",
                        "text-base",
                        "text-content-subtle",
                        "font-semibold",
                    )}
                >
                    Adicione produtos ao carrinho
                </p>
                <a
                    href="/shop"
                    class={cn(
                        "px-4",
                        "py-2",
                        "rounded-md",
                        "border",
                        "border-stroke-action-normal",
                        "hover:border-stroke-action-hover",
                        "bg-surface-action-primary-normal",
                        "hover:bg-surface-action-primary-hover",
                        "font-primary",
                        "text-base",
                        "font-semibold",
                        "text-content-on-action-primary-normal",
                    )}>ir para o shop</a
                >
            </div>
        {/if}
    </div>
    <div></div>
</section>
