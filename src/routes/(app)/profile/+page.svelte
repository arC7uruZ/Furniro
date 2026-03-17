<script lang="ts">
    import { cn } from "tailwind-variants";
    import type { PageProps } from "./$types";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import {
        fromDate,
        getLocalTimeZone,
        toCalendarDate,
    } from "@internationalized/date";
    import { DatePicker } from "bits-ui";
    import { ChevronLeft, ChevronRight } from "@lucide/svelte";
    let { data }: PageProps = $props();

    // svelte-ignore state_referenced_locally
    let date = $state(
        toCalendarDate(
            fromDate(new Date(data.user.dateOfBirth), getLocalTimeZone()),
        ),
    );

    $inspect(date);
</script>

{#snippet inputField(
    labelText: string,
    inputPlaceholder: string,
    inputId: string,
)}
    <div class={cn("flex", "flex-col", "gap-1")}>
        <label
            for="firstName"
            class={cn(
                "font-primary",
                "text-base",
                "text-content-heading",
                "font-medium",
            )}
        >
            {labelText}
        </label>
        <input
            id={inputId}
            name={inputId}
            class={cn(
                "rounded-md",
                "border-gray-300",
                "bg-gray-50",
                "font-primary",
                "text-sm",
            )}
            placeholder={inputPlaceholder}
        />
    </div>
{/snippet}

<PageHeader />
<section class={cn("w-full", "flex", "justify-center")}>
    <div class={cn("max-w-200", "w-full", "flex", "flex-col", "gap-8")}>
        <div class={cn("flex", "justify-between")}>
            <div class={cn("flex", "items-center", "gap-2")}>
                <img
                    src={data.user.profileImage}
                    alt="user profile avatar"
                    width="80"
                    height="80"
                    class={cn("overflow-hidden", "rounded-full", "size-20")}
                />
                <div
                    class={cn(
                        "flex",
                        "flex-col",
                        "justify-center",
                        "h-full",
                        "gap-2",
                    )}
                >
                    <h2
                        class={cn(
                            "font-primary",
                            "text-2xl",
                            "text-content-heading",
                            "font-semibold",
                        )}
                    >
                        {data.user.firstName}
                    </h2>
                    <p
                        class={cn(
                            "font-primary",
                            "text-base",
                            "text-content-subtle",
                            "font-semibold",
                        )}
                    >
                        {data.user.email}
                    </p>
                </div>
            </div>
            <div class={cn("flex", "items-center")}>
                <button
                    class={cn(
                        "px-4",
                        "py-2",
                        "rounded-md",
                        "bg-surface-action-primary-normal",
                        "hover:bg-surface-action-primary-hover",
                        "text-base",
                        "text-content-on-action-primary-normal",
                        "font-semibold",
                        "font-primary",
                        "cursor-pointer",
                    )}
                >
                    Edit
                </button>
            </div>
        </div>
        <div class={cn("flex", "flex-col", "gap-4")}>
            <div class={cn("flex", "justify-between")}>
                {@render inputField(
                    "First name",
                    "Your first name",
                    "firstName",
                )}
                {@render inputField("Last name", "Your last name", "lastName")}
            </div>
            <div class={cn("flex", "justify-between")}>
                {@render inputField("Email", "Your email", "email")}
                {@render inputField("Last name", "Your last name", "lastName")}
            </div>
            <div class={cn("flex", "justify-between")}>
                <div class={cn("flex", "flex-col", "gap-1")}>
                    <DatePicker.Root bind:value={date}>
                        <DatePicker.Label
                            class={cn(
                                "font-primary",
                                "text-base",
                                "text-content-heading",
                                "font-medium",
                            )}
                        >
                            Birth Date
                        </DatePicker.Label>
                        <DatePicker.Input>
                            {#snippet children({ segments })}
                                {#each segments as { part, value }}
                                    <DatePicker.Segment {part}>
                                        {value}
                                    </DatePicker.Segment>
                                {/each}
                                <DatePicker.Trigger>0</DatePicker.Trigger>
                            {/snippet}
                        </DatePicker.Input>
                        <DatePicker.Content>
                            <DatePicker.Calendar
                                class={cn(
                                    "shadow-2xl",
                                    "bg-white",
                                    "p-2",
                                    "border",
                                    "rounded-md",
                                    "border-gray-300",
                                )}
                            >
                                {#snippet children({ months, weekdays })}
                                    <DatePicker.Header
                                        class={cn(
                                            "flex",
                                            "items-center",
                                            "justify-between",
                                        )}
                                    >
                                        <DatePicker.PrevButton
                                            class={cn(
                                                "hover:bg-orange-200",
                                                "p-2",
                                                "rounded-sm",
                                                "cursor-pointer",
                                            )}
                                        >
                                            <ChevronLeft size="20" />
                                        </DatePicker.PrevButton>
                                        <DatePicker.Heading
                                            class={cn(
                                                "font-primary",
                                                "text-base",
                                                "font-semibold",
                                                "text-content-subtle",
                                            )}
                                        />
                                        <DatePicker.NextButton
                                            class={cn(
                                                "hover:bg-orange-200",
                                                "p-2",
                                                "rounded-sm",
                                                "cursor-pointer",
                                            )}
                                        >
                                            <ChevronRight size="20" />
                                        </DatePicker.NextButton>
                                    </DatePicker.Header>
                                    <div class={cn()}>
                                        {#each months as month (month.value)}
                                            <DatePicker.Grid
                                                class={cn(
                                                    "select-none",
                                                    "border-collapse",
                                                )}
                                            >
                                                <DatePicker.GridHead
                                                    class={cn()}
                                                >
                                                    <DatePicker.GridRow
                                                        class={cn(
                                                            "flex",
                                                            "justify-between",
                                                        )}
                                                    >
                                                        {#each weekdays as day}
                                                            <DatePicker.HeadCell
                                                                class={cn(
                                                                    "w-10",
                                                                    "font-primary",
                                                                    "text-xl",
                                                                )}
                                                            >
                                                                {day}
                                                            </DatePicker.HeadCell>
                                                        {/each}
                                                    </DatePicker.GridRow>
                                                </DatePicker.GridHead>
                                                <DatePicker.GridBody>
                                                    {#each month.weeks as weekDates}
                                                        <DatePicker.GridRow
                                                            class={cn(
                                                                "flex",
                                                                "w-full",
                                                            )}
                                                        >
                                                            {#each weekDates as date}
                                                                <DatePicker.Cell
                                                                    {date}
                                                                    month={month.value}
                                                                    class={cn(
                                                                        "size-10",
                                                                        "flex",
                                                                        "items-center",
                                                                        "justify-center",
                                                                        "rounded-sm",
                                                                        "hover:bg-orange-200",
                                                                        "cursor-pointer",
                                                                    )}
                                                                >
                                                                    <DatePicker.Day
                                                                    />
                                                                </DatePicker.Cell>
                                                            {/each}
                                                        </DatePicker.GridRow>
                                                    {/each}
                                                </DatePicker.GridBody>
                                            </DatePicker.Grid>
                                        {/each}
                                    </div>
                                {/snippet}
                            </DatePicker.Calendar>
                        </DatePicker.Content>
                    </DatePicker.Root>
                </div>
            </div>
        </div>
    </div>
</section>
