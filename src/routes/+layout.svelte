<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/favicon.svg";
    import AnchorButton from "$lib/public/AnchorButton.svelte";
    import { page } from "$app/state";
    import { Button, NavigationMenu, Separator } from "bits-ui";
    import { LogOut, Search, Heart, ShoppingCart } from "@lucide/svelte";

    let { children } = $props();

    const isActive = (path: string) => {
        return page.url.pathname === path;
    };
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="w-dvw flex flex-col justify-center items-center">
    <div class="flex flex-col items-center w-full max-w-360">
        <header
            class="h-25 w-full pl-12.5 pr-12.5 bg-surface-neutral flex justify-between items-center"
        >
            <Button.Root
                href="/"
                class="flex gap-1.25 items-center font-primary text-4xl font-semibold p-sm text-content-heading cursor-pointer"
            >
                <img src="/logo.svg" alt="User" />
                Furniro
            </Button.Root>
            <!-- {#snippet NavItem(text: string, href: string)}
                    <NavigationMenu.Item>
                        <NavigationMenu.Link href={href} data-active={isActive(href) ? "true" : undefined} class="p-sm text-content-heading hover:text-content-action-hover data-active:bg-surface-action data-active:text-content-on-action cursor-pointer font-primary text-xl/normal font-semibold">
                            {text}
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>
            {/snippet}
            <NavigationMenu.Root>
                <NavigationMenu.List class="w-107.5 flex justify-between items-center font-primary font-medium text-navbar">
                    {@render NavItem("Home", "/")}
                    {@render NavItem("Shop", "/shop")}
                    {@render NavItem("About", "/about")}
                    {@render NavItem("Contact", "/contact")}
                </NavigationMenu.List>
            </NavigationMenu.Root> -->
            <nav
                class="w-107.5 flex justify-between items-center font-primary font-medium text-navbar"
            >
                <AnchorButton href="/" dataActive={isActive("/")}
                    >Home</AnchorButton
                >
                <AnchorButton href="/shop" dataActive={isActive("/shop")}
                    >Shop</AnchorButton
                >
                <AnchorButton href="/about" dataActive={isActive("/about")}
                    >About</AnchorButton
                >
                <AnchorButton href="/contact" dataActive={isActive("/contact")}
                    >Contact</AnchorButton
                >
            </nav>
            <div class="flex items-center">
                <AnchorButton>
                    <LogOut
                        class="size-7 text-content-on-action-neutral-normal hover:text-content-on-action-neutral-hover cursor-pointer"
                    />
                </AnchorButton>
                <AnchorButton>
                    <Search
                        class="size-7 text-content-on-action-neutral-normal hover:text-content-on-action-neutral-hover cursor-pointer"
                    />
                </AnchorButton>
                <AnchorButton>
                    <Heart
                        class="size-7 text-content-on-action-neutral-normal hover:text-content-on-action-neutral-hover cursor-pointer"
                    />
                </AnchorButton>
                <AnchorButton>
                    <ShoppingCart
                        class="size-7 text-content-on-action-neutral-normal hover:text-content-on-action-neutral-hover cursor-pointer"
                    />
                </AnchorButton>
            </div>
        </header>
        {@render children()}
        <footer class="flex flex-col items-center gap-10 py-10 w-full">
            <Separator.Root
                decorative
                class="border-b-2 w-full border-black"
            />
            <div class="flex flex-col max-w-max gap-5 items-center">
                <div class="flex gap-10">
                    {#snippet navButton(text: string, href: string)}
                        <Button.Root
                            {href}
                            class="p-sm text-content-on-action-neutral-normal hover:text-content-on-action-neutral-hover data-active:bg-surface-action-primary-normal data-active:text-content-on-action-primary-normal cursor-pointer font-primary text-xl/normal font-semibold"
                        >
                            {text}
                        </Button.Root>
                    {/snippet}
                    <div class="flex flex-col flex-1 gap-5">
                        <h3
                            class="text-content-heading font-primary text-2xl font-semibold"
                        >
                            Furniro
                        </h3>
                        <p
                            class="text-content-body font-primary text-base font-regular align-baseline"
                        >
                            400 University Drive Suite 200 Coral, Gables, FL
                            33134 USA
                        </p>
                    </div>
                    <div class="flex flex-col flex-1 items-center">
                        <div class="flex flex-col gap-4">
                            <h3
                                class="px-sm font-primary text-xl/normal font-semibold text-content-disabled"
                            >
                                Links
                            </h3>
                            <div class="flex flex-col">
                                {@render navButton("Home", "/")}
                                {@render navButton("Shop", "/shop")}
                                {@render navButton("About", "/about")}
                                {@render navButton("Contact", "/contact")}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col flex-1 items-center">
                        <div class="flex flex-col gap-4">
                            <h3
                                class="px-sm font-primary text-xl/normal font-semibold text-content-disabled"
                            >
                                Links
                            </h3>
                            <div class="flex flex-col">
                                {@render navButton(
                                    "Payment Options",
                                    "/payment",
                                )}
                                {@render navButton("Returns", "/return")}
                                {@render navButton(
                                    "Privacy Policies",
                                    "/privacy",
                                )}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-14 items-start">
                        <h3
                            class="font-primary text-xl/normal font-semibold text-content-disabled"
                        >
                            NewsLetter
                        </h3>
                        <div class="flex gap-4">
                            <input
                                class="border-t-0 border-x-0 border-b-2 border-black min-w-67 p-1 ps-0 placeholder:font-primary placeholder:text-body-sm placeholder:font-regular placeholder:text-content-disabled"
                                placeholder="Enter Your Email address"
                            />
                            <Button.Root
                                class="p-1 border-b-2 border-black font-primary text-content-body bg-surface-neutral hover:bg-surface-action-neutral-hover text-body-sm font-semibold cursor-pointer"
                            >
                                SUBSCRIBE
                            </Button.Root>
                        </div>
                    </div>
                </div>
                <Separator.Root
                    decorative
                    class="border-b-2 w-full border-black"
                />
                <p class="font-primary text-body-sm font-semibold text-content-heading">
                    2026 furniro. All rights reserved
                </p>
            </div>
        </footer>
    </div>
</div>
