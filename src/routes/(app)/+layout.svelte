<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import AppSidebar from '../../components/AppSidebar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Sidebar.Provider>
	<AppSidebar />
	<main class="w-full px-2">
		<Sidebar.Trigger />
		{@render children?.()}
	</main>
</Sidebar.Provider>
