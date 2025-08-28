<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppToast from '../components/AppToast.svelte';
	import QueryClient from '../hooks/QueryClient.svelte';
	import { isLoading } from '@/hooks/loading';
	import AppLoading from '../components/AppLoading.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClient>
	<main class="w-full">
		{@render children?.()}
	</main>
	<AppToast />
</QueryClient>

{#if $isLoading}
	<div class="fixed inset-0 z-[9998] cursor-not-allowed bg-transparent"></div>
{/if}

<AppLoading />
