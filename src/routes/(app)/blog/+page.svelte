<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import PostThumb from "$lib/components/PostThumb.svelte";
    import { intlDate } from "$lib/utils";
    import { Search } from "@lucide/svelte";
    import { ToggleGroup } from "bits-ui";
    import { onMount } from "svelte";
    import { cn } from "tailwind-variants";
    import type { PageProps } from "./$types";
    import PreFooter from "$lib/components/PreFooter.svelte";

    const { data }: PageProps = $props();

    let allPosts = $derived([...data.posts]);
    let loading = $state(false);
    let hasMore = $derived(allPosts.length < data.meta.total);

    // $inspect("allPosts: ", allPosts);

    // svelte-ignore state_referenced_locally
    let currentOffset = $state(data.posts.length);

    const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
    async function loadMore() {
        if (loading || !hasMore) return;
        loading = true;

        await sleep(3000);

        try {
            const params = new URLSearchParams(page.url.searchParams);
            console.log("params: ", params.toString());
            const response = await fetch(
                `/api/posts?offset=${currentOffset}${params.size > 0 ? `&${params.toString()}` : ""}`,
            );

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
                if (
                    entries[0].isIntersecting &&
                    data.meta.total > data.posts.length
                )
                    loadMore();
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

    let selectedTopics = $derived(page.url.searchParams.getAll("topic"));

    function handleTopicChange(next: string[]) {
        const params = new URLSearchParams(page.url.searchParams);

        params.delete("topic");
        next.forEach((topic) => params.append("topic", topic));

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
</script>

<PageHeader />
<div class={cn("flex", "justify-between", "py-10", "w-full")}>
    <main class={cn("flex", "flex-1", "flex-col", "items-end")}>
        {#if allPosts.length > 0}
            <ul class={cn("flex", "flex-col", "gap-7")}>
                {#each allPosts as post (post.id)}
                    <li class="">
                        <PostThumb {post}></PostThumb>
                    </li>
                {/each}
            </ul>
        {:else}
            <div
                class={cn(
                    "flex",
                    "flex-col",
                    "items-center",
                    "justify-center",
                    "py-20",
                    "w-full",
                    "text-center",
                )}
            >
                <Search
                    class={cn("size-16", "text-content-disabled", "mb-4")}
                />
                <h3
                    class={cn(
                        "text-3xl",
                        "font-semibold",
                        "text-content-heading",
                    )}
                >
                    No posts found
                </h3>
                <p class={cn("text-content-subtle")}>
                    Try adjusting your filters or search terms.
                </p>
            </div>
        {/if}
        <div
            bind:this={observerNode}
            class={cn(
                "h-10",
                "w-full",
                "flex",
                "justify-center",
                "items-center",
                "py-10",
            )}
        >
            {#if loading}
                <p
                    class={cn(
                        "animate-pulse",
                        "text-content-subtle",
                        "font-semibold",
                    )}
                >
                    Loading more posts...
                </p>
            {/if}
            {#if !hasMore && allPosts.length > 0}
                <p>Fim dos posts.</p>
            {/if}
        </div>
    </main>
    <aside class={cn("flex", "flex-col", "gap-10", "p-5")}>
        <div class={cn("flex relative")}>
            <input
                type="text"
                oninput={handleSearch}
                class={cn(
                    "rounded-md",
                    "border-stroke-action-disabled",
                    "w-104.75",
                    "placeholder:text-content-disabled",
                )}
                placeholder="Search Posts"
                value={page.url.searchParams.get("text") ?? ""}
            />
            <Search
                class={cn(
                    "size-4",
                    "text-content-disabled",
                    "absolute",
                    "right-2",
                    "top-1/2",
                    "-translate-y-1/2",
                )}
            />
        </div>
        <div class={cn("flex", "flex-col", "p-5", "gap-10")}>
            <h2
                class={cn(
                    "font-primary",
                    "text-2xl",
                    "font-semibold",
                    "text-content-heading",
                )}
            >
                Topics
            </h2>
            <ToggleGroup.Root
                type="multiple"
                value={selectedTopics}
                onValueChange={handleTopicChange}
                class={cn("flex", "flex-col", "gap-12")}
            >
                {#each data.topics as topic}
                    <!-- <button
                        onclick={toogleCategoryFilter}
                        class="flex justify-between items-center font-primary text-body-md text-content-disabled hover:text-content-action-hover font-semibold cursor-pointer"
                    >
                        <p>{category.title}</p>
                        <p>{category.posts}</p>
                    </button> -->
                    <ToggleGroup.Item
                        value={topic.title}
                        class={cn(
                            "flex",
                            "justify-between",
                            "items-center",
                            "group",
                            "data-[state=on]:bg-surface-tertiary",
                            "cursor-pointer",
                        )}
                    >
                        <span
                            class={cn(
                                "font-primary",
                                "text-base",
                                "font-semibold",
                                "transition-colors",
                                "text-content-disabled",
                                "group-hover:text-content-action-hover",
                            )}
                        >
                            {topic.title}
                        </span>
                        <span
                            class={cn(
                                "font-primary",
                                "text-base",
                                "font-semibold",
                                "transition-colors",
                                "text-content-disabled",
                                "group-hover:text-content-action-hover",
                            )}>{topic.posts}</span
                        >
                    </ToggleGroup.Item>
                {/each}
            </ToggleGroup.Root>
        </div>
        <div class={cn("flex", "flex-col", "p-5", "gap-7")}>
            <h2
                class={cn(
                    "font-primary",
                    "text-2xl",
                    "text-content-heading",
                    "font-semibold",
                )}
            >
                Recent Posts
            </h2>
            <div class={cn("flex", "flex-col", "gap-6")}>
                {#each data.recentPosts as post}
                    <div
                        class={cn(
                            "flex",
                            "items-center",
                            "gap-3",
                            "p-2",
                            "cursor-pointer",
                            "group",
                        )}
                    >
                        <img
                            src={post.imgSrc}
                            alt={post.imgAlt}
                            width="80"
                            height="80"
                            class={cn("size-20", "rounded-md")}
                        />
                        <div class={cn("flex", "flex-col", "gap-1")}>
                            <h3
                                class={cn(
                                    "font-primary",
                                    "text-base/5",
                                    "font-semibold",
                                    "text-content-heading",
                                    "group-hover:text-content-action-hover",
                                    "max-w-52",
                                )}
                            >
                                {post.title}
                            </h3>
                            <p
                                class={cn(
                                    "font-primary",
                                    "text-xs",
                                    "font-semibold",
                                    "text-content-subtle",
                                )}
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
<PreFooter />
