<script lang="ts">
    import { enhance } from "$app/forms";

    import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<div class="flex flex-col items-center gap-10">
    <div class="flex flex-col gap-2 items-center">
        <h1 class="font-primary text-heading-h5 font-semibold">
            Create an account
        </h1>
        <p
            class="font-primary text-body-sm font-light text-content-subtle max-w-100 text-center"
        >
            Your username must be at least 3 characters long and your password
            must be at least 8 characters long.
        </p>
    </div>
    <form method="post" use:enhance class="flex flex-col gap-4">
        <div class="flex items-center justify-between w-full gap-10">
            <label
                for="form-signup.username"
                class="font-primary text-body-md font-semibold text-content-body"
                >Username</label
            >
            <input
                id="form-signup.username"
                name="username"
                required
                value={form?.username ?? ""}
                minlength="4"
                maxlength="31"
                class="rounded-md border-gray-300"
            />
        </div>
        <div class="flex items-center justify-between w-full gap-10">
            <label
                for="form-signup.email"
                class="font-primary text-body-md font-semibold text-content-body"
                >Email</label
            >
            <input
                type="email"
                id="form-signup.email"
                name="email"
                autocomplete="username"
                required
                value={form?.email ?? ""}
                class="rounded-md border-gray-300"
            />
        </div>
        <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between w-full gap-10">
                <label
                    for="form-signup.password"
                    class="font-primary text-body-md font-semibold text-content-body"
                    >Password</label
                >
                <input
                    type="password"
                    id="form-signup.password"
                    name="password"
                    autocomplete="new-password"
                    required
                    class="rounded-md border-gray-300"
                />
            </div>
            <p class="font-primary text-body-sm text-red-500 font-semibold">{form?.message ?? ""}</p>
        </div>
        <button
            class="bg-primary-600 hover:bg-primary-700 text-white font-primary text-heading-h6 font-semibold rounded-md py-1 mt-4 cursor-pointer"
            >Continue</button
        >
        <a
            href="/login"
            class="bg-white hover:bg-surface-action-neutral-hover border-primary border rounded-md font-primary text-heading-h6 font-semibold py-1 text-primary flex items-center justify-center"
            >Sign in</a
        >
    </form>
</div>
