<script lang="ts">
    import { enhance } from "$app/forms";

    import type { ActionData, PageData } from "./$types";

    export let data: PageData;
    export let form: ActionData;
</script>

<div class="flex flex-col gap-8 p-4">
    <h1 class="font-primary text-heading-h5 font-semibold text-content-heading">
        Verify your email address
    </h1>
    <div class="flex flex-col items-center gap-2">
        <p class="font-primary text-body-md font-regular text-content-subtle">We sent an 8-digit code to <strong>{data.email}</strong>.</p>
        <form method="post" use:enhance action="?/verify" class="flex flex-col gap-4 items-center">
            <div class="flex items-center gap-4">
                <label for="form-verify.code" class="font-primary text-body-md font-semibold text-content-body">Code</label>
                <input id="form-verify.code" name="code" required class="rounded-md border-gray-300" />
            </div>
            <button class="bg-surface-action-primary-normal hover:bg-surface-action-primary-hover text-content-on-action-primary-normal px-4 py-2 rounded-md cursor-pointer font-primary text-body-md font-semibold">Verify</button>
            <p>{form?.verify?.message ?? ""}</p>
        </form>
        <form method="post" use:enhance action="?/resend">
            <button class="text-content-disabled hover:text-content-action-hover cursor-pointer text-body-sm font-primary">Resend code</button>
            <p>{form?.resend?.message ?? ""}</p>
        </form>
    </div>
    <a href="/settings" class="font-primary text-content-disabled hover:text-content-action-hover cursor-pointer">Change your email</a>
</div>
