<script lang="ts">
    import AppFooter from "$lib/components/AppFooter.svelte";
    import AppHeader from "$lib/components/AppHeader.svelte";
    import { cn } from "tailwind-variants";
    import type { LayoutProps } from "./$types";
    import "./layout.css";

    let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
    <link rel="icon" href="/logo.svg" />
</svelte:head>

<div class={cn("w-dvw", "flex", "flex-col", "justify-center", "items-center")}>
    <div class={cn("flex", "flex-col", "items-center", "w-full", "max-w-360")}>
        <AppHeader {data} />
        {@render children()}
        <AppFooter />
    </div>
</div>
