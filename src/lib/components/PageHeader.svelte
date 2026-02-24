<script lang="ts">
    import { page } from "$app/state";
    import { cn } from "$lib/utils";

    const route = page.url.pathname.split("/").filter(Boolean).at(-1);
    const routeName = route ? route[0].toUpperCase() + route.slice(1) : "";

    const segments: Array<string> = page.url.pathname
        .split("/")
        .filter(Boolean);
    const breadcrumbs = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");

        return {
            label: segment,
            href,
        };
    });
</script>

<header
    class={cn(
        "flex",
        "items-center",
        "justify-center",
        "relative",
        "overflow-hidden",
        "min-h-85",
        "w-full",
        "before:bg-[url('/bg-blur.png')]",
        "before:bg-cover",
        "before:bg-center",
        "before:scale-110",
        "before:blur-xs",
        "before:absolute",
        "before:-z-1",
        "before:size-full",
    )}
>
    <div
        class={cn(
            "flex",
            "flex-col",
            "items-center",
            "gap-4",
            "bg-[url('/logo.svg')]",
            "bg-top",
            "pt-12",
            "bg-no-repeat",
        )}
    >
        <h1 class={cn("font-primary", "text-heading-h2", "font-semibold")}>
            {routeName}
        </h1>
        <nav>
            <ol class="flex items-center">
                <li
                    class="font-primary text-body-md font-semibold text-content-heading"
                >
                    <a href="/">Home</a>
                </li>
                {#each breadcrumbs as bread}
                    <li
                        class={cn(
                            "before:content-['>']",
                            "before:mx-2",
                            "font-primary",
                            "text-body-md",
                            "font-regular",
                            "text-content-heading",
                        )}
                    >
                        <a href={bread.href} class="cursor-pointer">
                            {bread.label}
                        </a>
                    </li>
                {/each}
            </ol>
        </nav>
    </div>
</header>
