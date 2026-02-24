<script lang="ts">
    import { cn } from "$lib/utils";
    import { Button, Separator } from "bits-ui";
</script>

{#snippet navButton(text: string, href: string)}
    <Button.Root
        {href}
        class={cn(
            "p-sm",
            "text-content-on-action-neutral-normal",
            "hover:text-content-on-action-neutral-hover",
            "data-active:bg-surface-action-primary-normal",
            "data-active:text-content-on-action-primary-normal",
            "cursor-pointer",
            "font-primary",
            "text-xl/normal",
            "font-semibold",
        )}
    >
        {text}
    </Button.Root>
{/snippet}
<footer
    class={cn("flex", "flex-col", "items-center", "gap-10", "py-10", "w-full")}
>
    <Separator.Root
        decorative
        class={cn("border-b-2", "w-full", "border-stroke-action-disabled")}
    />
    <div class={cn("flex", "flex-col", "max-w-max", "gap-5", "items-center")}>
        <div class={cn("flex", "gap-10")}>
            <div class={cn("flex", "flex-col", "flex-1", "gap-5")}>
                <h3
                    class={cn(
                        "text-content-heading",
                        "font-primary",
                        "text-2xl",
                        "font-semibold",
                    )}
                >
                    Furniro
                </h3>
                <p
                    class={cn(
                        "text-content-body",
                        "font-primary",
                        "text-base",
                        "font-regular",
                        "align-baseline",
                    )}
                >
                    400 University Drive Suite 200 Coral, Gables, FL 33134 USA
                </p>
            </div>
            <div class={cn("flex", "flex-col", "flex-1", "items-center")}>
                <div class={cn("flex", "flex-col", "gap-4")}>
                    <h3
                        class={cn(
                            "px-sm",
                            "font-primary",
                            "text-xl/normal",
                            "font-semibold",
                            "text-content-disabled",
                        )}
                    >
                        Links
                    </h3>
                    <div class={cn("flex", "flex-col")}>
                        {@render navButton("Home", "/")}
                        {@render navButton("Shop", "/shop")}
                        {@render navButton("About", "/about")}
                        {@render navButton("Contact", "/contact")}
                    </div>
                </div>
            </div>
            <div class={cn("flex", "flex-col", "flex-1", "items-center")}>
                <div class={cn("flex", "flex-col", "gap-4")}>
                    <h3
                        class={cn(
                            "px-sm",
                            "font-primary",
                            "text-xl/normal",
                            "font-semibold",
                            "text-content-disabled",
                        )}
                    >
                        Links
                    </h3>
                    <div class={cn("flex", "flex-col")}>
                        {@render navButton("Payment Options", "/payment")}
                        {@render navButton("Returns", "/return")}
                        {@render navButton("Privacy Policies", "/privacy")}
                    </div>
                </div>
            </div>
            <div class={cn("flex", "flex-col", "gap-14", "items-start")}>
                <h3
                    class={cn(
                        "font-primary",
                        "text-xl/normal",
                        "font-semibold",
                        "text-content-disabled",
                    )}
                >
                    NewsLetter
                </h3>
                <div class={cn("flex", "gap-4")}>
                    <input
                        class={cn(
                            "border-t-0",
                            "border-x-0",
                            "border-b-2",
                            "border-black",
                            "min-w-67",
                            "p-1",
                            "ps-0",
                            "placeholder:font-primary",
                            "placeholder:text-body-sm",
                            "placeholder:font-regular",
                            "placeholder:text-content-disabled",
                        )}
                        placeholder="Enter Your Email address"
                    />
                    <Button.Root
                        class={cn(
                            "p-1",
                            "border-b-2",
                            "border-black",
                            "font-primary",
                            "text-content-body",
                            "bg-surface-neutral",
                            "hover:bg-surface-action-neutral-hover",
                            "text-body-sm",
                            "font-semibold",
                            "cursor-pointer",
                        )}
                    >
                        SUBSCRIBE
                    </Button.Root>
                </div>
            </div>
        </div>
        <Separator.Root
            decorative
            class={cn("border-b-2", "w-full", "border-stroke-action-disabled")}
        />
        <p
            class={cn(
                "font-primary",
                "text-body-sm",
                "font-semibold",
                "text-content-heading",
            )}
        >
            2026 furniro. All rights reserved
        </p>
    </div>
</footer>
