<script lang="ts">
    import { enhance } from "$app/forms";

    import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<div class="flex flex-col items-center gap-8 p-4">
    <div class="flex flex-col items-center">
        <h1
            class="font-primary text-heading-h5 text-content-heading font-semibold"
        >
            Two-factor authentication
        </h1>
        <p class="font-primary text-body-sm text-content-subtle font-semibold">
            Enter the code from your authenticator app.
        </p>
    </div>
    <form method="post" use:enhance class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
                <label for="form-totp.code" class="font-primary text-content-body text-body-md font-semibold">Code</label>
                <input
                    id="form-totp.code"
                    name="code"
                    autocomplete="one-time-code"
                    required
                    class="rounded-md border-gray-300"
                />
            </div>
            <p class="font-primary text-body-sm font-semibold text-red-500">{form?.message ?? ""}</p>
        </div>
        <button class="bg-surface-action-primary-normal hover:bg-surface-action-primary-hover text-content-on-action-primary-normal font-semibold font-primary text-body-md cursor-pointer py-1 rounded-md">Verify</button>
    </form>
    <a href="/2fa/reset" class="text-content-action-normal hover:text-content-action-hover font-primary text-body-md font-semibold">Use recovery code</a>
</div>
