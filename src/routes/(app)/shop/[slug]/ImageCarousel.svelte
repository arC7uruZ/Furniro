<script lang="ts">
    import { ChevronLeft, ChevronRight } from "@lucide/svelte";
    import type {
        EmblaCarouselType,
        EmblaOptionsType,
        EmblaPluginType,
    } from "embla-carousel";
    import useEmblaCarousel from "embla-carousel-svelte";
    import { cn } from "tailwind-variants";
    let { images, zoomTarget } = $props();

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

    let showZoom = $state(false);
    let zoomPos = $state({ x: 0, y: 0 });

    const handleMouseMove = (e: MouseEvent) => {
        const { left, top, width, height } = (
            e.currentTarget as HTMLElement
        ).getBoundingClientRect();

        // Calcula a porcentagem da posição do mouse dentro da imagem
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;

        zoomPos = { x, y };
        showZoom = true;
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

    const portal = (node: HTMLElement, targetSelector: string) => {
        let target = document.querySelector(targetSelector);

        if (!target) {
            console.warn(`Alvo do portal "${targetSelector}" não encontrado.`);
            return;
        }

        target.appendChild(node);

        return {
            destroy() {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            },
        };
    };
</script>

<div class={cn("flex", "justify-start", "w-full")}>
    <div class={cn("flex", "gap-2.5", "h-fit")}>
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
                            "opacity-40 hover:opacity-70":
                                selectedIndex !== index,
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
                                    "border-orange-500":
                                        selectedIndex === index,
                                    "border-transparent":
                                        selectedIndex !== index,
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
                            role="img"
                            onmousemove={handleMouseMove}
                            onmouseleave={() => (showZoom = false)}
                            class={cn(
                                "min-w-0",
                                "grow-0",
                                "shrink-0",
                                "basis-full",
                                "pl-2.5",
                                "relative",
                                "overflow-hidden",
                                "cursor-crosshair",
                                "rounded-xl",
                            )}
                        >
                            <img
                                src={image.imgSrc}
                                alt={image.imgAlt}
                                class={cn(
                                    "size-100",
                                    "rounded-xl",
                                    "object-contain",
                                    "object-center",
                                )}
                            />
                            {#if showZoom}
                                <div
                                    class={cn(
                                        "absolute",
                                        "pointer-events-none",
                                        "border",
                                        "border-gray-400",
                                        "bg-white/20",
                                        "shadow-lg",
                                        "size-33.5",
                                        "-translate-1/2",
                                    )}
                                    style:top="{zoomPos.y}%"
                                    style:left="{zoomPos.x}%"
                                ></div>
                            {/if}
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

    {#if showZoom}
        <div
            use:portal={zoomTarget}
            class="z-50 border-2 border-gray-100 shadow-2xl rounded-xl bg-white overflow-hidden absolute inset-0 aspect-square"
            style:background-image="url({images[selectedIndex].imgSrc})"
            style:background-size="300%"
            style:background-position="{zoomPos.x}% {zoomPos.y}%"
            style:background-repeat="no-repeat"
        ></div>
    {/if}
</div>
