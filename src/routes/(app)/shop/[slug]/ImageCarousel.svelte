<script lang="ts">
    import { ChevronLeft, ChevronRight } from "@lucide/svelte";
    import type {
        EmblaCarouselType,
        EmblaOptionsType,
        EmblaPluginType,
    } from "embla-carousel";
    import useEmblaCarousel from "embla-carousel-svelte";
    import { cn } from "tailwind-variants";
    let { images } = $props();

    let emblaApi: EmblaCarouselType;
    let emblaApiThumb: EmblaCarouselType;
    let options: EmblaOptionsType = { loop: false };
    let thumbsOptions: EmblaOptionsType = {
        loop: false,
        axis: "y",
        dragFree: true,
        containScroll: "keepSnaps",
    };
    let plugins: EmblaPluginType[] = [];

    let selectedIndex = $state(0);
    const goToPrev = () => emblaApi?.scrollPrev();
    const goToNext = () => emblaApi?.scrollNext();
    const goToIndex = (index: number) => {
        emblaApi?.scrollTo(index);
        emblaApiThumb?.scrollTo(index);
    };

    const onInit = (event: CustomEvent<EmblaCarouselType>) => {
        emblaApi = event.detail;
        const updateIndex = () => {
            selectedIndex = emblaApi.selectedScrollSnap();
            emblaApiThumb?.scrollTo(selectedIndex);
        };
        emblaApi.on("select", updateIndex);
        emblaApi.on("init", updateIndex);
    };

    const onInitThumb = (event: CustomEvent<EmblaCarouselType>) => {
        emblaApiThumb = event.detail;
        console.log(emblaApiThumb.slideNodes());
    };
</script>

<div class={cn("flex", "gap-2.5")}>
    <div
        class={cn("overflow-hidden")}
        onemblaInit={onInitThumb}
        use:useEmblaCarousel={{ options: thumbsOptions, plugins }}
    >
        <div class={cn("flex", "flex-col", "max-h-100", "-mt-2.5")}>
            {#each images as image, index (image.imgOrder)}
                <button
                    onclick={() => goToIndex(index)}
                    class={cn("pt-2.5", "cursor-pointer", {
                        "opacity-100": selectedIndex === index,
                        "opacity-40 hover:opacity-70": selectedIndex !== index,
                    })}
                >
                    <img
                        src={image.imgSrc}
                        alt={image.imgAlt}
                        class={cn(
                            "size-22.5",
                            "rounded-md",
                            "object-cover",
                            "border-2",
                            "transition-colors",
                            {
                                "border-orange-500": selectedIndex === index,
                                "border-transparent": selectedIndex !== index,
                            },
                        )}
                    />
                </button>
            {/each}
        </div>
    </div>
    <div class={cn("relative")}>
        <div
            class={cn("overflow-hidden")}
            onemblaInit={onInit}
            use:useEmblaCarousel={{ options, plugins }}
        >
            <div
                class={cn(
                    "flex",
                    "touch-pan-y",
                    "touch-pinch-zoom",
                    "max-w-100",
                    "-ml-2.5",
                )}
            >
                {#each images as image}
                    <div
                        class={cn(
                            "min-w-0",
                            "grow-0",
                            "shrink-0",
                            "basis-full",
                            "pl-2.5",
                        )}
                    >
                        <img
                            src={image.imgSrc}
                            alt={image.imgAlt}
                            class={cn("size-100", "rounded-xl")}
                        />
                    </div>
                {/each}
            </div>
        </div>
        <button
            class={cn(
                "rounded-full",
                "bg-white",
                "shadow-2xl",
                "size-10",
                "flex",
                "items-center",
                "justify-center",
                "cursor-pointer",
                "absolute",
                "left-2",
                "top-1/2",
            )}
            onclick={goToPrev}
        >
            <ChevronLeft />
        </button>
        <button
            class={cn(
                "rounded-full",
                "bg-white",
                "shadow-2xl",
                "size-10",
                "flex",
                "items-center",
                "justify-center",
                "cursor-pointer",
                "absolute",
                "right-2",
                "top-1/2",
            )}
            onclick={goToNext}
        >
            <ChevronRight />
        </button>
    </div>
</div>
