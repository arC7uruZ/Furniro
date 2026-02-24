<script lang="ts">
    import { enhance } from "$app/forms";

    import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<div class="flex flex-col items-center gap-8 p-4">
    <h1 class="font-primary text-content-heading text-heading-h5 font-semibold">
        Recover your account
    </h1>
    <form method="post" use:enhance class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <div class="flex gap-2 items-center">
                <label for="form-totp.code" class="font-primary text-body-md text-content-body font-semibold">Recovery code</label>
                <input id="form-totp.code" name="code" required class="rounded-md border-gray-300"/>
            </div>
            <p class="font-primary text-body-sm text-red-500 font-semibold">{form?.message ?? ""}</p>
        </div>
        <button class="bg-surface-action-primary-normal hover:bg-surface-action-primary-hover text-content-on-action-primary-normal rounded-md font-primary text-body-md font-semibold cursor-pointer py-2">Verify</button>
    </form>
</div>
