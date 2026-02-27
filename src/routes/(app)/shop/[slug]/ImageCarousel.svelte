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
    let options: EmblaOptionsType = { loop: true };
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
    let zoomInfo = $state({
        littleRectPercentX: 0,
        littleRectPercentY: 0,
        bigRectPercentX: 0,
        bigRectPercentY: 0,
        ratioX: 0,
        ratioY: 0,
    });
    let zoomSize = $state({ width: 100, height: 100 });
    let zoomRatio = $state(5);
    let zoomRectWidth = $derived(zoomSize.width / zoomRatio);
    let zoomRectHeight = $derived(zoomSize.height / zoomRatio);

    const handleMouseMove = (e: MouseEvent) => {
        const target = e.target as HTMLImageElement;
        const currentTarget = e.currentTarget as HTMLElement;
        const {
            left: containerX,
            top: containerY,
            width: containerWidth,
            height: containerHeight,
        } = currentTarget.getBoundingClientRect();

        let imgHeight =
            target.naturalHeight > target.naturalWidth
                ? containerHeight
                : target.naturalHeight / (target.naturalWidth / containerWidth);
        let imgWidth =
            target.naturalWidth > target.naturalHeight
                ? containerWidth
                : target.naturalWidth /
                  (target.naturalHeight / containerHeight);

        let imgOffsetX = (containerWidth - imgWidth) / 2;
        let imgOffsetY = (containerHeight - imgHeight) / 2;

        const mouseXRaw = e.clientX - containerX;
        const mouseYRaw = e.clientY - containerY;

        const isInsideImage =
            mouseXRaw >= imgOffsetX &&
            mouseXRaw <= imgOffsetX + imgWidth &&
            mouseYRaw >= imgOffsetY &&
            mouseYRaw <= imgOffsetY + imgHeight;

        if (!isInsideImage) {
            showZoom = false;
            return;
        }

        let mouseX = e.clientX - (containerX + imgOffsetX);
        let mouseY = e.clientY - (containerY + imgOffsetY);

        let x = mouseX - zoomRectWidth / 2;
        let y = mouseY - zoomRectHeight / 2;

        x = Math.max(0, Math.min(x, imgWidth - zoomRectWidth));
        y = Math.max(0, Math.min(y, imgHeight - zoomRectHeight));

        let littleRectPercentX = ((x + imgOffsetX) / containerWidth) * 100;
        let littleRectPercentY = ((y + imgOffsetY) / containerHeight) * 100;
        let bigRectPercentX = (x / (imgWidth - zoomRectWidth)) * 100;
        let bigRectPercentY = (y / (imgHeight - zoomRectHeight)) * 100;

        let ratioX = (imgWidth / zoomRectWidth) * 100;
        let ratioY = (imgHeight / zoomRectHeight) * 100;

        zoomInfo = {
            littleRectPercentX,
            littleRectPercentY,
            bigRectPercentX,
            bigRectPercentY,
            ratioX,
            ratioY,
        };
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

        zoomSize = {
            width: target.getBoundingClientRect().width,
            height: target.getBoundingClientRect().height,
        };

        console.log("portal width: ", target.getBoundingClientRect().width);
        console.log("portal height: ", target.getBoundingClientRect().height);
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
                        "gap-2.5",
                    )}
                >
                    {#each images as image}
                        <div
                            role="img"
                            class={cn(
                                "min-w-0",
                                "grow-0",
                                "shrink-0",
                                "basis-full",
                                "relative",
                                "overflow-hidden",
                                "cursor-pointer",
                                { "cursor-crosshair": showZoom },
                                "rounded-xl",
                            )}
                        >
                            <img
                                onmousemove={handleMouseMove}
                                onmouseleave={() => (showZoom = false)}
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
                                        // "-translate-1/2",
                                    )}
                                    style:top="{zoomInfo.littleRectPercentY}%"
                                    style:left="{zoomInfo.littleRectPercentX}%"
                                    style:width="{zoomRectWidth}px"
                                    style:height="{zoomRectHeight}px"
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
            class="z-50 border-2 border-gray-100 shadow-2xl rounded-xl bg-white overflow-hidden absolute inset-0"
            style:background-image="url({images[selectedIndex].imgSrc})"
            style:background-size="{zoomInfo.ratioX}% {zoomInfo.ratioY}%"
            style:background-position="{zoomInfo.bigRectPercentX}% {zoomInfo.bigRectPercentY}%"
            style:background-repeat="no-repeat"
        ></div>
    {/if}
</div>
