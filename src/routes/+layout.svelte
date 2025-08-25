<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppToast from '../components/AppToast.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import AppSidebar from '../components/AppSidebar.svelte';
	import QueryClient from '../hooks/QueryClient.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClient>
	<Sidebar.Provider>
		<AppSidebar />
		<main class="w-full px-2">
			<Sidebar.Trigger />
			{@render children?.()}
		</main>
	</Sidebar.Provider>
	<AppToast />
</QueryClient>
