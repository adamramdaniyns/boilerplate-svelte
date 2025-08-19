<script lang="ts">
	import AppInput from './AppInput.svelte';

	export let fields: DefaultType[] = [];
	export let formTitle = 'Form Title';
	export let onSubmit: () => Promise<void> = () => Promise.resolve();
	export let submitButtonText = 'Submit';
	export let canSubmit = true;

	// Initialize error message
	let error = '';

	// initialize loading state
	let loading = false;

	async function handleSubmit() {
		fields = fields.map((field) => {
			const isEmpty = field.value.trim() === '';
			const isRequired = field.validation?.required !== false;

			return {
				...field,
				errorMessage: isRequired && isEmpty ? `${field.label} cannot be empty.` : ''
			};
		});

		const hasError = fields.some((f) => f.errorMessage && f.errorMessage !== '');
		if (hasError) {
			console.log('Validation failed:', fields);
			return;
		}

		try {
			loading = true;
			await onSubmit();
		} catch (error: unknown) {
			console.error('Form submission failed:', error);

			if (error instanceof Error) {
				error = error.message;
			} else {
				error = 'An unexpected error occurred.';
			}
		} finally {
			loading = false;
		}
	}
</script>

<div class="w-full">
	<p class="mb-6 text-left text-sm font-bold text-gray-800">{formTitle}</p>
	{#if error}
		<p class="mb-4 text-sm text-red-600">{error}</p>
	{/if}

	<form on:submit|preventDefault={handleSubmit}>
		{#each fields as field (field.id)}
			<AppInput {...field} bind:value={field.value} errorMessage={field.errorMessage} />
		{/each}

		{#if canSubmit}
			<div class="flex w-full justify-end">
				<button
					type="submit"
					disabled={loading}
					class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				>
					{loading ? 'Submitting...' : submitButtonText}
				</button>
			</div>
		{/if}
	</form>
</div>
