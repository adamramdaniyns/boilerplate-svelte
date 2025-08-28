<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	let open = false;
	export let value = '';
	export let placeholder = '';
	let triggerRef: HTMLButtonElement | null = null;

	export let datas: { label: string; value: string }[] = [];

	let selectedValue = "";

	$: {
		selectedValue = datas.find((f) => f.value === value)?.label ?? '';
	}

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef?.focus();
		});
	}

	function handleSearch(key: string) {
		datas = datas.filter((data) =>
			data.label.toLowerCase().includes(key.toLowerCase())
		);
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef} class="w-full col-span-3">
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class="w-full col-span-3 justify-between"
				role="combobox"
				aria-expanded={open}
			>
				{selectedValue || placeholder || 'Select a data'}
				<ChevronsUpDownIcon class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-full p-0 col-span-3">
		<Command.Root class="col-span-3">
			<Command.Input placeholder={placeholder} onchange={(e) => handleSearch((e.currentTarget as HTMLInputElement).value)} />
			<Command.List class="col-span-3">
				<Command.Empty>No data found.</Command.Empty>
				<Command.Group value="frameworks">
					{#each datas as data (data.value)}
						<Command.Item
							value={data.value}
							onSelect={() => {
								value = data.value;
								closeAndFocusTrigger();
							}}
						>
							<CheckIcon class={cn(value !== data.value && 'text-transparent')} />
							{data.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
