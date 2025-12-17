<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';

    let {children} = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon}/>
</svelte:head>

<div class="flex flex-col items-center">
    <header class="h-[100px] w-[1440px] pl-[50px] pr-[50px] bg-white flex justify-between items-center">
        <div class="flex gap-[5px] items-center font-logo text-logo">
            <img src="/logo.svg" alt="User"/>
            Furniro
        </div>
        <nav class="w-[430px] flex justify-between items-center font-primary font-medium text-navbar">
            <a href="/">Home</a>
            <a href="/shop">Shop</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </nav>
        <div class="flex gap-10">
            <a href="/" class="size-[28px]">
                <img src="/logout.svg" alt="logout button">
            </a>
            <a href="/" class="size-[28px]">
                <img src="/search.svg" alt="logout button">
            </a>
            <a href="/" class="size-[28px]">
                <img src="/heart.svg" alt="logout button">
            </a>
            <a href="/" class="size-[28px]">
                <img src="/cart.svg" alt="logout button">
            </a>
        </div>
    </header>
    {@render children()}
</div>
