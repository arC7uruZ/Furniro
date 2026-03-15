<!-- StarRating.svelte -->
<script lang="ts">
    import { Star } from "@lucide/svelte";
    import { cn } from "tailwind-variants";

    let { rating, size = 20 }: { rating: number; size?: number } = $props();

    const id = Math.random().toString(36).slice(2);

    const stars = Array.from({ length: 5 }, (_, i) => {
        return Math.min(1, Math.max(0, rating - i));
    });
</script>

<!-- {#each stars as fill, i}
    <svg width={size} height={size} viewBox="0 0 24 24" style="overflow: hidden; display: block;" class="border border-black">
        <defs>
            <clipPath id="clip-{id}-{i}">
                <rect x="0" y="0" width={24 * fill} height="24" />
            </clipPath>
        </defs>
        <g clip-path="url(#clip-{id}-{i})">
            <Star {size} fill="var(--color-yellow-500)" strokeWidth="0" />
        </g>
    </svg>
{/each} -->

<div class={cn("flex")}>
    {#each stars as fill, i}
        <svg width={size} height={size} viewBox="0 0 {size} {size}">
            <defs>
                <clipPath id="star-clip-{i}">
                    <rect x="0" y="0" width={size * fill} height={size} />
                </clipPath>
            </defs>

            <!-- Estrela vazia (fundo) -->
            <Star {size} fill="var(--color-gray-200)" strokeWidth="0" />

            <!-- Estrela preenchida (clipada) -->
            <g clip-path="url(#star-clip-{i})">
                <Star {size} fill="var(--color-yellow-500)" strokeWidth="0" />
            </g>
        </svg>
    {/each}
</div>
