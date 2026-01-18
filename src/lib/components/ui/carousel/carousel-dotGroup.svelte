<script lang="ts">
    import { getEmblaContext } from "./context";
    import * as Carousel from "$lib/components/ui/carousel";

    const emblaCtx = getEmblaContext("<Carousel.DotGroup/>");
    const emblaApi = emblaCtx?.api;

</script>

<div class="flex gap-2 bg-surface-tertiary p-4 rounded-xl absolute right-64 bottom-24">
    {#each emblaCtx.scrollSnaps as _, index (index)}
        <Carousel.Dot
            onclick={() => emblaCtx?.scrollTo(index)}
            selected={emblaCtx.selectedIndex === index ? true : false}
            class="cursor-pointer p-2"
        />
    {/each}
</div>