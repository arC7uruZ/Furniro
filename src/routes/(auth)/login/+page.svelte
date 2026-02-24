<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<div class="flex flex-col items-center gap-8">
    <h1 class="font-primary text-heading-h5 font-semibold">Sign in</h1>
    <div class="flex flex-col gap-8 items-center">
        <form
            method="post"
            use:enhance
            class="flex flex-col gap-4 items-center"
        >
            <div class="flex flex-col gap-2">
                <div class="flex gap-4 items-center justify-between">
                    <label
                        for="form-login.email"
                        class="font-primary text-content-body text-body-md font-semibold"
                        >Email</label
                    >
                    <input
                        type="email"
                        id="form-login.email"
                        name="email"
                        autocomplete="username"
                        required
                        value={form?.email ?? ""}
                        class="rounded-md font-primary text-body-sm font-regular"
                    />
                </div>
                <div class="flex gap-4 items-center justify-between">
                    <label
                        for="form-login.password"
                        class="font-primary text-content-body text-body-md font-semibold"
                        >Password</label
                    >
                    <input
                        type="password"
                        name="password"
                        id="form-login.password"
                        autocomplete="current-password"
                        required
                        class="rounded-md font-primary text-body-sm font-regular"
                    />
                </div>
            </div>
            <p class="font-primary text-body-sm font-semibold text-red-500">
                {form?.message ?? ""}
            </p>
            <button
                class="px-4 py-2 bg-surface-action-primary-normal hover:bg-surface-action-primary-hover text-content-on-action-primary-normal font-primary font-semibold rounded-md cursor-pointer"
                >continue</button
            >
        </form>
        <div class="flex gap-6">
            <a
                href="/signup"
                class="text-primary-600 font-semibold hover:text-primary-700"
                >Create an account</a
            >
            <a
                href="/forgot-password"
                class="text-primary-600 font-semibold hover:text-primary-700"
                >Forgot password?</a
            >
        </div>
    </div>
</div>
