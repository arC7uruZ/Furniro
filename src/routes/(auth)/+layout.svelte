<script lang="ts">
    import "./layout.css";
    let { children } = $props();
</script>

<main class="w-dvw h-dvh flex items-center justify-center bg-surface-primary">
    <section class="p-4 border shadow-md border-gray-200 bg-white rounded-xl">
        {@render children()}
    </section>
</main>