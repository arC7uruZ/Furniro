<script lang="ts">
    import { enhance } from "$app/forms";

    import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<div class="flex flex-col gap-8 p-4">
    <h1 class="font-primary text-heading-h5 text-content-heading font-semibold">
        Two-factor authentication
    </h1>
    <div class="flex flex-col gap-2">
        <h2 class="font-primary text-body-md text-content-subtle font-medium">
            Enter the code from your authenticator app.
        </h2>
        <form
            method="post"
            use:enhance
            action="?/totp"
            class="flex flex-col items-center gap-4"
        >
            <div class="flex flex-col items-stretch w-full">
                <div class="flex gap-2 items-center">
                    <label for="form-totp.code" class="font-primary text-content-body text-body-md font-semibold">Code</label>
                    <input
                        id="form-totp.code"
                        name="code"
                        required
                        class="rounded-md border-gray-300 w-full"
                    />
                </div>
                <p>{form?.totp?.message ?? ""}</p>
            </div>
            <button
                class="bg-surface-action-primary-normal hover:bg-surface-action-primary-hover w-full py-1 rounded-md font-primary text-content-on-action-primary-normal font-semibold cursor-pointer"
                >Verify</button
            >
        </form>
    </div>
    <div class="flex flex-col gap-2">
        <h2 class="font-primary text-body-md text-content-subtle font-medium">
            Use your recovery code instead
        </h2>
        <form
            method="post"
            use:enhance
            action="?/recovery_code"
            class="flex flex-col gap-4"
        >
            <div class="flex flex-col items-stretch">
                <div class="flex gap-2 items-center">
                    <label for="form-recovery-code.code" class="font-primary text-content-body text-body-md/tight font-semibold">Recovery code</label>
                    <input
                        id="form-recovery-code.code"
                        name="code"
                        required
                        class="rounded-md border-gray-300 w-full"
                    /><br />
                </div>
                <p>{form?.recoveryCode?.message ?? ""}</p>
            </div>
            <button class="bg-surface-action-secondary-normal hover:bg-surface-action-secondary-hover border-stroke-action-normal hover:border-stroke-action-hover border rounded-md py-1 font-primary text-body-md text-content-on-action-secondary-normal font-semibold cursor-pointer">Verify</button>
        </form>
    </div>
</div>
