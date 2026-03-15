<script lang="ts">
    import { Calendar, Tag, User } from "@lucide/svelte";
    import { Button } from "bits-ui";
    import { cn } from "tailwind-variants";

    const { post, ...props } = $props();

    const contentParagraph = $derived(post.content.split("\n"));
    const createdDate = $derived(new Date(post.createdAt));
    const intlDate = $derived(
        new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
    );

    // console.log(post);
</script>

<div class={cn("flex", "items-start", "w-fit", "flex-col", "gap-10", "p-5")}>
    <div class={cn("flex", "flex-col", "gap-4")}>
        <img
            src={post.imgSrc}
            alt={post.imgAlt}
            width="819"
            height="496"
            class={cn(
                "w-204.75",
                "h-124",
                "object-cover",
                "object-center",
                "rounded-xl",
            )}
        />
        <div class={cn("flex", "gap-4")}>
            <div
                class={cn(
                    "flex",
                    "items-center",
                    "gap-2",
                    "text-content-subtle",
                    "font-primary",
                    "text-base",
                    "font-regular",
                )}
            >
                <User class={cn("size-4")} />
                <p>{post.postedBy}</p>
            </div>
            <div
                class={cn(
                    "flex",
                    "items-center",
                    "gap-2",
                    "text-content-subtle",
                    "font-primary",
                    "text-base",
                    "font-regular",
                )}
            >
                <Calendar class={cn("size-4")} />
                <!-- <p>{`${createdDate.getDay()} ${createdDate.getMonth()}`}</p> -->
                <p>{`${intlDate.format(createdDate)}`}</p>
            </div>
            <div
                class={cn(
                    "flex",
                    "items-center",
                    "gap-2",
                    "text-content-subtle",
                    "font-primary",
                    "text-base",
                    "font-regular",
                )}
            >
                <Tag class={cn("size-4")} />
                <!-- <p>{`${createdDate.getDay()} ${createdDate.getMonth()}`}</p> -->
                <ul class={cn("flex", "gap-2")}>
                    {#each post.topics as topic}
                        <li class={cn("not-last:after:content-[',']")}>
                            {topic}
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
    <article class={cn("flex", "flex-col", "items-start", "gap-4")}>
        <h2
            class={cn(
                "font-primary",
                "text-3xl",
                "font-semibold",
                "text-content-heading",
                "max-w-200",
            )}
        >
            {post.title}
        </h2>
        <div class={cn("space-y-2", "line-clamp-5")}>
            {#each contentParagraph as paragraph}
                <p
                    class={cn(
                        "font-primary",
                        "text-base",
                        "font-regular",
                        "text-content-subtle",
                        "max-w-200",
                        "text-justify",
                    )}
                >
                    {paragraph}
                </p>
            {/each}
        </div>
        <Button.Root
            class={cn(
                "p-1",
                "font-primary",
                "text-base",
                "font-semibold",
                "border-b-2",
                "text-content-on-action-neutral-normal",
                "hover:text-content-on-action-neutral-hover",
                "cursor-pointer",
            )}
        >
            Read More
        </Button.Root>
    </article>
</div>
