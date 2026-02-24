<script lang="ts">
    import { cn } from "$lib/utils";
    import type { LayoutProps } from "./$types";
    import AppFooter from "./AppFooter.svelte";
    import AppHeader from "./AppHeader.svelte";
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
