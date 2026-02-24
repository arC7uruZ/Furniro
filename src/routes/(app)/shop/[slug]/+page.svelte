<script lang="ts">
    import { page } from "$app/state";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb";
    import { cn } from "$lib/utils";
    import { ChevronRight } from "@lucide/svelte";
    import type { PageProps } from "./$types";
    import { Separator } from "bits-ui";

    let { params }: PageProps = $props();

    const route = page.url.pathname.split("/").filter(Boolean).at(-1);
    const routeName = route ? route[0].toUpperCase() + route.slice(1) : "";

    const segments: Array<string> = page.url.pathname
        .split("/")
        .filter(Boolean);
    const breadcrumbs = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");

        let label;
        if (index !== segments.length - 1) {
            label = segment[0].toUpperCase() + segment.slice(1);
        } else {
            label = segment;
        }

        return {
            label,
            href,
        };
    });
</script>

<div
    class={cn(
        "h-16",
        "bg-surface-tertiary",
        "w-full",
        "flex",
        "justify-start",
        "items-center",
        "ps-10"
    )}
>
    <Breadcrumb.Root>
        <Breadcrumb.List class="inline-flex items-center">
            <Breadcrumb.Item>
                <Breadcrumb.Link href="/" class="flex items-center"
                    >Home</Breadcrumb.Link
                >
            </Breadcrumb.Item>
            <Breadcrumb.Separator
                class="flex items-center justify-center pt-1"
            />
            {#each breadcrumbs as breadcumb, index}
                {#if index === breadcrumbs.length - 1}
                    <Separator.Root
                        orientation="vertical"
                        class={cn(
                            "bg-gray-500",
                            "shrink-0",
                            "data-[orientation=vertical]:h-8",
                            "data-[orientation=vertical]:w-[2px]",
                        )}
                    />
                {/if}
                <Breadcrumb.Item>
                    <Breadcrumb.Link href={breadcumb.href}
                        >{breadcumb.label}</Breadcrumb.Link
                    >
                </Breadcrumb.Item>
                {#if index !== breadcrumbs.length - 1}
                    <Breadcrumb.Separator
                        class="flex items-center justify-center pt-1"
                    />
                {/if}
            {/each}
        </Breadcrumb.List>
    </Breadcrumb.Root>
</div>
