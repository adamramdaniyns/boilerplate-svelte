<script>
	import { page } from '$app/state';
	import Button from '@/components/ui/button/button.svelte';
</script>

<div class="flex flex-col items-center justify-center bg-background p-4 text-center text-foreground">
	<div class="text-[6rem] font-extrabold tracking-tight md:text-[8rem] lg:text-[10rem] text-transparent">
		{page.error?.status}
	</div>
	<h1 class="mt-4 mb-2 text-3xl font-bold md:text-4xl">
		Oops
	</h1>
	<p class="mb-8 max-w-lg text-lg text-muted-foreground md:text-xl">
		{page.error?.message || 'An unexpected error occurred.'}
	</p>
	<Button href="/" variant="default">Back</Button>
</div>
