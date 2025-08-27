<script lang="ts">
	import { isLoading, messageLoading } from '$lib/hooks/loading';
	import * as Alert from '@/components/ui/alert';
	import { Loader2 } from '@lucide/svelte';
	import { fly } from 'svelte/transition';
</script>

{#if $isLoading}
	<div
		class="fixed right-4 top-4 z-[9999] transition-all duration-400 ease-in-out"
		transition:fly={{ x: 300, duration: 400 }}
	>
		<Alert.Root variant="default" class="bg-black text-white">
			<Loader2 class="animate-spin" />
			<Alert.Title>Wait</Alert.Title>
			<Alert.Description class="text-gray-100">
               {$messageLoading || ' Please wait a moment...'}
            </Alert.Description>
		</Alert.Root>
	</div>
{/if}
