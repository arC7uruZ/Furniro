<script lang="ts">
    import { enhance } from "$app/forms";

    import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<div class="flex flex-col items-center gap-8">
    <h1 class="font-primary text-content-heading text-heading-h5 font-semibold">
        Forgot your password?
    </h1>
    <div class="flex flex-col items-center">
        <form method="post" use:enhance class="flex flex-col justify-between items-center gap-4 py-2">
            <div class="flex items-center gap-4">
                <label
                    for="form-forgot.email"
                    class="font-primary text-content-body text-body-md font-semibold"
                    >Email</label
                >
                <input
                    type="email"
                    id="form-forgot.email"
                    name="email"
                    required
                    value={form?.email ?? ""}
                    class="rounded-md border-gray-300"
                />
            </div>
            <p class="font-primary text-body-sm text-red-500 font-semibold">{form?.message ?? ""}</p>
            <button
                class="bg-surface-action-primary-normal hover:bg-surface-action-primary-hover text-content-on-action-primary-normal font-primary text-body-md font-semibold rounded-md py-1 w-full cursor-pointer"
                >Send</button
            >
        </form>
        <a href="/login" class="w-full flex justify-center rounded-md bg-surface-action-secondary-normal hover:bg-surface-action-secondary-hover border border-stroke-action-normal hover:border-stroke-action-hover text-content-on-action-secondary-normal hover:text-content-on-action-secondary-hover font-primary text-body-md font-semibold py-1">Sign in</a>
    </div>
</div>
