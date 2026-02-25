<script lang="ts">
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import type { WithoutChildren } from "bits-ui";
	import { getEmblaContext } from "./context.js";
	import { cn } from "$lib/utils.js";
	import { type Props } from "$lib/components/ui/button/index.js";
    import { Button } from "bits-ui";

	let {
		ref = $bindable(null),
		class: className,
		// variant = "outline",
		// size = "icon",
		...restProps
	}: WithoutChildren<Props> = $props();

    // let {
    //     ref = $bindable(null),
    //     ...restProps
    // } = $props();

	const emblaCtx = getEmblaContext("<Carousel.Next/>");
</script>

<Button.Root
	data-slot="carousel-next"
	aria-disabled={!emblaCtx.canScrollNext}
	onclick={emblaCtx.scrollNext}
	onkeydown={emblaCtx.handleKeyDown}
    {...restProps}
>
	<ArrowRightIcon class="size-5 text-content-on-action-neutral-normal group-hover:text-content-on-action-neutral-hover" />
	<span class="sr-only">Next slide</span>
</Button.Root>

<!-- <Button
	data-slot="carousel-next"
	{variant}
	{size}
	aria-disabled={!emblaCtx.canScrollNext}
	class={cn(
		"absolute size-10 rounded-full",
		emblaCtx.orientation === "horizontal"
			? "end-18 top-1/2 -translate-y-1/2"
			: "start-1/2 -bottom-12 -translate-x-1/2 rotate-90",
		className
	)}
	onclick={emblaCtx.scrollNext}
	onkeydown={emblaCtx.handleKeyDown}
	bind:ref
	{...restProps}
>
	<ArrowRightIcon class="size-4" />
	<span class="sr-only">Next slide</span>
</Button> -->
