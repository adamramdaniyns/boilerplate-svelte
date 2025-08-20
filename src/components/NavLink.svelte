<script>
	export let subItem;
</script>

<div class="flex items-center">
	{#if subItem.icon}
		<span>
			<svelte:component this={subItem.icon} class="mr-2 h-4 w-4" />
		</span>
	{/if}
	<span>{subItem.title}</span>
</div>
