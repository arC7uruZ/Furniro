<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<div class="flex flex-col items-center p-4 gap-8">
    <h1 class="font-primary text-content-heading text-heading-h6 font-semibold">Recovery code</h1>
    <p class="font-primary text-content-body text-body-lg">Your recovery code is: <strong>{data.recoveryCode}</strong></p>
    <p class="font-primary text-content-subtle text-body-sm max-w-80 text-center">
        You can use this recovery code if you lose access to your second
        factors.
    </p>
    <a href="/" class="bg-surface-action-primary-normal hover:bg-surface-action-primary-hover text-content-on-action-primary-normal font-primary text-body-md font-semibold rounded-md px-4 py-2">Next</a>
</div>
