<script lang="ts">
    import { enhance } from "$app/forms";

    import type { ActionData, PageData } from "./$types";

    export let data: PageData;
    export let form: ActionData;
</script>

<div class="flex flex-col items-center gap-4 p-4">
    <div class="flex flex-col items-center">
        <h1
            class="font-primary text-heading-h5 text-content-heading font-semibold"
        >
            Verify your email address
        </h1>
    </div>
    <div class="flex flex-col items-center gap-2">
        <p class="font-primary text-body-sm text-content-subtle font-regular">
            We sent an 8-digit code to {data.email}.
        </p>
        <form
            method="post"
            use:enhance
            class="flex flex-col items-center gap-8"
        >
            <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                    <label
                        for="form-verify.code"
                        class="font-primary text-body-md text-content-body font-semibold"
                        >Code</label
                    >
                    <input
                        id="form-verify.code"
                        name="code"
                        required
                        class="rounded-md border-gray-300"
                    />
                </div>
                <p>{form?.message ?? ""}</p>
            </div>
            <button
                class="bg-surface-action-primary-normal hover:bg-surface-action-primary-hover w-full rounded-md text-content-on-action-primary-normal font-primary text-body-md font-semibold py-1"
                >verify</button
            >
        </form>
    </div>
</div>
