<script lang="ts">
    import * as Alert from '@/components/ui/alert';
    import { toast } from '../stores/toast';
    import { onDestroy } from 'svelte';
    
    const unsubscribe = toast.subscribe(value => $toast = value);
    onDestroy(unsubscribe);
</script>

{#if $toast.isOpen}
    <Alert.Root>
        <Alert.Title>{$toast.message}</Alert.Title>
        <Alert.Description>{$toast.description}</Alert.Description>
    </Alert.Root>
{/if}