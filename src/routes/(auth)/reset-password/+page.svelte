<script lang="ts">
    import { enhance } from "$app/forms";

    import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<div class="flex flex-col gap-8 p-4">
    <h1 class="font-primary text-heading-h5 text-content-heading font-semibold">
        Enter your new password
    </h1>
    <form method="post" use:enhance class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
                <label for="form-reset.password" class="font-primary text-content-body text-body-md font-semibold">Password</label>
                <input
                    type="password"
                    id="form-reset.password"
                    name="password"
                    autocomplete="new-password"
                    required
                    class="rounded-md border-gray-300"
                />
            </div>
            <p class="font-primary text-body-sm text-red-500 font-semibold">{form?.message ?? ""}</p>
        </div>
        <button class="bg-surface-action-primary-normal hover:bg-surface-action-primary-hover text-content-on-action-primary-normal font-primary text-body-md font-semibold rounded-md py-1 cursor-pointer">Reset password</button>
    </form>
</div>
