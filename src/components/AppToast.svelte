<script lang="ts">
	import * as Alert from '@/components/ui/alert';
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import { toast } from '../stores/toast';
	import CheckCircle from '@lucide/svelte/icons/check-circle';

	// Only allow "default" or "destructive" as variant values
	let variant: 'default' | 'destructive' | undefined;
	$: variant =
		$toast.type === 'default' ? 'default' : $toast.type === 'error' ? 'destructive' : 'default';

	function handleCloseAlert() {
		$toast.isOpen = false;
	}
</script>

{#if variant === 'destructive'}
	<!-- Show alert dialog for better UX -->
	<AlertDialog.Root open={$toast.isOpen}>
		<AlertDialog.Content class="z-[999999]">
			<AlertDialog.Title>
				{$toast.message}
			</AlertDialog.Title>
			<AlertDialog.Description>
              {$toast.description}
			</AlertDialog.Description>
            <AlertDialog.Footer>
                <AlertDialog.Cancel onclick={handleCloseAlert} class="bg-red-500 text-white">Close</AlertDialog.Cancel>
            </AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{:else}
	<div
		class={`fixed bottom-4 z-[9999] ${$toast.isOpen && variant === 'default' ? 'right-4' : '-right-[99px]'} transition-all duration-300 ease-in-out`}
	>
		<Alert.Root {variant}>
			<CheckCircle />
			<Alert.Title>
				{$toast.message}
			</Alert.Title>
			<Alert.Description>{$toast.description}</Alert.Description>
		</Alert.Root>
	</div>
{/if}
