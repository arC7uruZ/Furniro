<script lang="ts">
    import PageHeader from "$lib/components/PageHeader.svelte";
    import { ToggleGroup } from "bits-ui";
    import type { PageProps } from "./$types";
    import PostThumb from "./PostThumb.svelte";
    import { Search } from "@lucide/svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { onMount } from "svelte";

    const { data }: PageProps = $props();

    let allPosts = $derived([...data.posts]);
    let loading = $state(false);
    let hasMore = $derived(allPosts.length < data.meta.total);

    // $inspect("allPosts: ", allPosts);

    let currentOffset = $state(data.posts.length);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    async function loadMore() {
        if (loading || !hasMore) return;
        loading = true;

        await sleep(3000);

        try {
            const params = new URLSearchParams(page.url.searchParams);
            console.log("params: ", params.toString());
            const response = await fetch(`/api/posts?offset=${currentOffset}${params.size > 0 ? `&${params.toString()}` : ''}`);

            const newPosts = await response.json();
            console.log("new posts length: ", newPosts.length);

            if (newPosts.length === 0) {
                hasMore = false;
            } else {
                allPosts = [...allPosts, ...newPosts];
                currentOffset += newPosts.length;
            }
        } catch (e) {
            console.error("Erro ao carregar mais posts: ", e);
        } finally {
            loading = false;
        }
    }

    let observerNode: HTMLElement | undefined = $state();

    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && data.meta.total > data.posts.length) loadMore();
            },
            { threshold: 0.1 },
        );

        if (observerNode) observer.observe(observerNode);
        return () => observer.disconnect();
    });

    $effect(() => {
        allPosts = [...data.posts];
        currentOffset = data.posts.length;
        hasMore = true;
    });

    let selectedCategories = $derived(page.url.searchParams.getAll("category"));

    function handleCategoryChange(next: string[]) {
        const params = new URLSearchParams(page.url.searchParams);

        params.delete("category");
        next.forEach((cat) => params.append("category", cat));

        // params.set("page", "1");

        goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
    }

    let searchTimeout: any;
    function handleSearch(e: Event) {
        const val = (e.target as HTMLInputElement).value;
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const params = new URLSearchParams(page.url.searchParams);
            if (val) params.set("text", val);
            else params.delete("text");
            goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
        }, 300);
    }

    const intlDate = $derived(
        new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
    );
</script>

<PageHeader></PageHeader>
<div class="flex justify-between py-10 w-full">
    <main class="flex flex-1 flex-col items-end">
        {#if allPosts.length > 0}
            <ul class="flex flex-col gap-7">
                {#each allPosts as post (post.post_id)}
                    <li class="">
                        <PostThumb {post}></PostThumb>
                    </li>
                {/each}
            </ul>
        {:else}
            <div
                class="flex flex-col items-center justify-center py-20 w-full text-center"
            >
                <Search class="size-16 text-content-disabled mb-4" />
                <h3 class="text-heading-h4 font-semibold text-content-heading">
                    No posts found
                </h3>
                <p class="text-content-subtle">
                    Try adjusting your filters or search terms.
                </p>
            </div>
        {/if}
        <div
            bind:this={observerNode}
            class="h-10 w-full flex justify-center items-center py-10"
        >
            {#if loading}
                <p class="animate-pulse text-content-subtle font-semibold">
                    Loading more posts...
                </p>
            {/if}
            {#if !hasMore && allPosts.length > 0}
                <p>
                    Fim dos posts.
                </p>
            {/if}
        </div>
    </main>
    <aside class="flex flex-col gap-10 p-5">
        <div class="flex relative">
            <input
                type="text"
                oninput={handleSearch}
                class="rounded-md border-stroke-action-disabled w-104.75 placeholder:text-content-disabled"
                placeholder="Search Posts"
                value={page.url.searchParams.get("text") ?? ""}
            />
            <Search
                class="size-4 text-content-disabled absolute right-2 top-1/2 -translate-y-1/2"
            />
        </div>
        <div class="flex flex-col p-5 gap-10">
            <h2
                class="font-primary text-heading-h5 font-semibold text-content-heading"
            >
                Categories
            </h2>
            <ToggleGroup.Root
                type="multiple"
                value={selectedCategories}
                onValueChange={handleCategoryChange}
                class="flex flex-col gap-12"
            >
                {#each data.categories as category}
                    <!-- <button
                        onclick={toogleCategoryFilter}
                        class="flex justify-between items-center font-primary text-body-md text-content-disabled hover:text-content-action-hover font-semibold cursor-pointer"
                    >
                        <p>{category.title}</p>
                        <p>{category.posts}</p>
                    </button> -->
                    <ToggleGroup.Item
                        value={category.title}
                        class="flex justify-between items-center group data-[state=on]:bg-surface-tertiary cursor-pointer"
                    >
                        <span
                            class="font-primary text-body-md font-semibold transition-colors text-content-disabled group-hover:text-content-action-hover"
                        >
                            {category.title}
                        </span>
                        <span
                            class="font-primary text-body-md font-semibold transition-colors text-content-disabled group-hover:text-content-action-hover"
                            >{category.posts}</span
                        >
                    </ToggleGroup.Item>
                {/each}
            </ToggleGroup.Root>
        </div>
        <div class="flex flex-col p-5 gap-7">
            <h2
                class="font-primary text-heading-h5 text-content-heading font-semibold"
            >
                Recent Posts
            </h2>
            <div class="flex flex-col gap-6">
                {#each data.recentPosts as post}
                    <div
                        class="flex items-center gap-3 p-2 cursor-pointer group"
                    >
                        <img
                            src={post.imgSrc}
                            alt={post.imgAlt}
                            width="80"
                            height="80"
                            class="size-20 rounded-md"
                        />
                        <div class="flex flex-col gap-1">
                            <h3
                                class="font-primary text-body-md/5 font-semibold text-content-heading group-hover:text-content-action-hover max-w-52"
                            >
                                {post.title}
                            </h3>
                            <p
                                class="font-primary text-body-sm font-semibold text-content-subtle"
                            >
                                {`${intlDate.format(new Date(post.createdAt))}`}
                            </p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </aside>
</div>
