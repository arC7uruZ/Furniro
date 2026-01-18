<script lang="ts">
    import { Button } from 'bits-ui';
    let { dataActive=false, ...props } = $props();
</script>

<Button.Root {...props} {...(dataActive ? {"data-active":"true"} : {})} class="p-sm text-content-on-action-neutral-normal hover:text-content-on-action-neutral-hover data-active:bg-surface-action-primary-normal data-active:text-content-on-action-primary-normal cursor-pointer font-primary text-xl/normal font-semibold"/>