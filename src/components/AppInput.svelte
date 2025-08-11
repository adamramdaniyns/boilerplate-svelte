<script>
	export let label = '';
	export let type = 'text';
	export let placeholder = '';
	export let errorMessage = '';
	export let value = '';
	export let id = '';
	export let required = true;

	let localError = '';

	function validateInput() {
		if (required && value.trim() === '') {
			localError = `${label} is required`;
		} else {
			localError = '';
		}
	}

	function handleBlur() {
		validateInput();
	}
</script>

<div class="mb-4">
	<label for={id} class="mb-2 block text-sm font-medium text-gray-700">{label}</label>
	<input
		{type}
		{id}
		bind:value
		class="w-full text-black rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		{placeholder}
	/>
	{#if errorMessage}
		<p class="mt-2 text-sm text-red-600">{errorMessage}</p>
	{:else if localError}
		<p class="mt-2 text-sm text-red-600">{localError}</p>
	{/if}
</div>
