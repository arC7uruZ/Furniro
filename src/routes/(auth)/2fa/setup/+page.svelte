<script lang="ts">
    import { enhance } from "$app/forms";

    import type { ActionData, PageData } from "./$types";

    export let data: PageData;
    export let form: ActionData;
</script>

<div class="flex flex-col items-stretch gap-4 p-4">
    <h1 class="font-primary text-heading-h6 text-content-heading font-semibold">
        Set up two-factor authentication
    </h1>
    <div class="flex items-center justify-center">
        <div class="size-40">
            {@html data.qrCode}
        </div>
    </div>
    <form method="post" use:enhance class="flex flex-col items-stretch gap-4">
        <input name="key" value={data.encodedTOTPKey} hidden required />
        <div class="flex flex-col gap-2">
            <label
                for="form-totp.code"
                class="font-primary text-content-subtle text-body-sm font-medium"
                >Verify the code from the app</label
            >
            <input
                type="text"
                name="code"
                id="form-totp.code"
                required
                class="border-gray-300 rounded-md"
            />
            <p class="font-primary text-body-sm font-semibold text-red-500">
                {form?.message ?? ""}
            </p>
        </div>
        <div class="flex justify-between">
            <button
                class="bg-surface-action-primary-normal hover:bg-surface-action-primary-hover cursor-pointer text-white px-6 py-2 font-primary text-body-md font-medium rounded-md"
                >Save</button
            >
        </div>
    </form>
</div>
