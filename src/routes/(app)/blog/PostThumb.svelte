<script lang="ts">
    import { Button } from "bits-ui";
    import type { PageProps } from "./$types";
    import { User, Calendar, Tag } from "@lucide/svelte";

    const { post, ...props } = $props();

    const contentParagraph = $derived(post.content.split("\n"));
    const createdDate = $derived(new Date(post.created_at));
    const intlDate = $derived(
        new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
    );

    // console.log(post);
</script>

<div class="flex items-start w-fit flex-col gap-10 p-5">
    <div class="flex flex-col gap-4">
        <img
            src={post.img_src}
            alt={post.img_alt}
            width="819"
            height="496"
            class="w-204.75 h-124 object-cover object-center rounded-xl"
        />
        <div class="flex gap-4">
            <div
                class="flex items-center gap-2 text-content-subtle font-primary text-base font-regular"
            >
                <User class="size-4" />
                <p>{post.posted_by}</p>
            </div>
            <div
                class="flex items-center gap-2 text-content-subtle font-primary text-base font-regular"
            >
                <Calendar class="size-4" />
                <!-- <p>{`${createdDate.getDay()} ${createdDate.getMonth()}`}</p> -->
                <p>{`${intlDate.format(createdDate)}`}</p>
            </div>
            <div
                class="flex items-center gap-2 text-content-subtle font-primary text-base font-regular"
            >
                <Tag class="size-4" />
                <!-- <p>{`${createdDate.getDay()} ${createdDate.getMonth()}`}</p> -->
                <ul class="flex gap-2">
                    {#each post.post_categories as category}
                        <li class="not-last:after:content-[',']">
                            {category}
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
    <article class="flex flex-col items-start gap-4">
        <h2
            class="font-primary text-heading-h4 font-semibold text-content-heading max-w-200"
        >
            {post.title}
        </h2>
        <div class="space-y-2 line-clamp-5">
            {#each contentParagraph as paragraph}
                <p
                    class="font-primary text-body-md font-regular text-content-subtle max-w-200 text-justify"
                >
                    {paragraph}
                </p>
            {/each}
        </div>
        <Button.Root
            class="p-1 font-primary text-body-md font-semibold border-b-2 text-content-on-action-neutral-normal hover:text-content-on-action-neutral-hover cursor-pointer"
        >
            Read More
        </Button.Root>
    </article>
</div>
