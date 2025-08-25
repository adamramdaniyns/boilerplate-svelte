<script lang="ts">
	import DynamicCrud from '../../components/DynamicCRUD.svelte';

	let fields: DefaultType[] = [
		{
			label: 'Name',
			type: 'text',
			placeholder: 'Enter your name',
			id: 'name',
			key: 'name',
			value: '',
			errorMessage: '',
			options: {
				canFilter: true
			},
			validation: {
				required: false
			}
		}
	];

	// form state
	let name = '';
	let selectedId = '';

	// data state
	let data: any = [];

	async function handleSubmit() {
		if (selectedId) {
			await fetch('/api/examples', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: name,
					id: selectedId
				})
			});
		} else {
			await fetch('/api/examples', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: name
				})
			});
		}

		return {
			success: true,
			data: fields,
			message: 'Data ' + (selectedId ? 'updated' : 'created') + ' successfully'
		};
	}

	async function handleDelete(id: string | number | null, refreshData: () => void): Promise<{
		success: boolean;
		data?: unknown;
		error?: string;
		message?: string;
		description?: string;
	}> {
		if (id === null) {
			return {
				success: false,
				error: 'No ID provided',
				message: 'Failed to delete form'
			};
		}

		const res = await fetch(`/api/examples`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id })
		});

		if (!res.ok) {
			const errorData = await res.json();
			console.error('Error deleting form:', errorData);
			return {
				success: false,
				error: errorData.error || 'Unknown error',
				message: 'Failed to delete form'
			};
		}

		const responseData = await res.json();

		refreshData();
		return {
			success: true,
			data: responseData.data,
			message: responseData.message || 'Form deleted successfully',
			description: responseData.description
		};
	}

	const fetchData = async (page?: number, limit?: number, filter?: Filter) => {
		let filterParams = '';
		if (filter?.key) {
			filterParams = `&key=${filter.key}&keywords=${encodeURIComponent(filter.keyWords)}`;
		}
		const res = await fetch(`/api/examples?page=${page}&limit=${limit}${filterParams}`);
		if (!res.ok) throw new Error('Network response was not ok');
		return await res.json();
	};

	// state custom components
	let openFormCreate = false;
	let openFormUpdate = false;
	let openFormDetail = false;
</script>

{#if openFormCreate}
	<!-- Custom Create Form -->
	<div class="mb-4 border p-4">
		<h2 class="mb-2 text-xl font-bold">Custom Create Form</h2>

		<form
			on:submit|preventDefault={async () => {
				const result = await handleSubmit();
				if (result.success) {
					openFormCreate = false;
					// Refresh data after successful creation
					data = await fetchData();
				}
			}}
		>
			{#each fields as field (field.id)}
				<div class="mb-4">
					<label class="mb-1 block text-sm font-medium" for={field.id}>{field.label}</label>
					<input
						class="w-full rounded-md border border-gray-300 p-2"
						type={field.type}
						id={field.id}
						placeholder={field.placeholder}
						bind:value={name}
					/>
					{#if field.errorMessage}
						<p class="mt-1 text-sm text-red-500">{field.errorMessage}</p>
					{/if}
				</div>
			{/each}
			<div class="flex justify-end">
				<button class="rounded-md bg-blue-500 px-4 py-2 text-white" type="submit">Create</button>
				<button
					class="ml-2 rounded-md bg-gray-300 px-4 py-2 text-black"
					type="button"
					on:click={() => (openFormCreate = false)}>Cancel</button
				>
			</div>
		</form>
	</div>
{:else if openFormUpdate}
	<!-- Custom Update Form -->
	<div class="mb-4 border p-4">
		<h2 class="mb-2 text-xl font-bold">Custom Update Form</h2>

		<form
			on:submit|preventDefault={async () => {
				const result = await handleSubmit();
				if (result.success) {
					openFormUpdate = false;
					// Refresh data after successful update
					data = await fetchData();
				}
			}}
		>
			{#each fields as field (field.id)}
				<div class="mb-4">
					<label class="mb-1 block text-sm font-medium" for={field.id}>{field.label}</label>
					<input
						class="w-full rounded-md border border-gray-300 p-2"
						type={field.type}
						id={field.id}
						placeholder={field.placeholder}
						bind:value={name}
					/>
					{#if field.errorMessage}
						<p class="mt-1 text-sm text-red-500">{field.errorMessage}</p>
					{/if}
				</div>
			{/each}

			<div class="flex justify-end">
				<button class="rounded-md bg-blue-500 px-4 py-2 text-white" type="submit">Update</button>
				<button
					class="ml-2 rounded-md bg-gray-300 px-4 py-2 text-black"
					type="button"
					on:click={() => (openFormUpdate = false)}>Cancel</button
				>
			</div>
		</form>
	</div>
{:else if openFormDetail}
	<!-- Custom Detail Form -->
	<div class="mb-4 border rounded-t-md">
		<div class="w-full p-4 bg-blue-400 text-white rounded-t-md">
			<h2 class="mb-2 text-xl font-bold">Custom Detail</h2>
		</div>

		<p class="p-4 text-sm">Name: {name}</p>

		<div class="p-4 w-full flex justify-end" on:click={() => (openFormDetail = false)}>
			<button class="rounded-md bg-gray-300 px-4 py-2 text-black text-sm hover:bg-gray-500">
				Back
			</button>
		</div>
	</div>
{:else}
	<div class="p-4">
		<DynamicCrud
			{fields}
			onGetData={fetchData}
			dataKey="dataSample"
			customComponent={{
				create: true, // custom component for create action
				update: true, // custom component for update action
				delete: false, // custom component for delete action
				detail: true // custom component for detail action
			}}
			onUpdate={(id) => {
				openFormUpdate = true;
			}}
			onCreate={() => {
				name = '';
				openFormCreate = true;
			}}
			onDeleteSubmit={handleDelete}
			onDetail={(id) => {
				openFormDetail = true;
			}}
			{data}
			on:rowSelect={(event) => {
				// on this event
				// you can get selected row data from <DynamicCrud />
				const selectedRow = event.detail;
				selectedId = selectedRow.id;
				name = selectedRow.name;
			}}
		/>
	</div>
{/if}
