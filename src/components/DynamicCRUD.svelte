<script lang="ts">
	import * as Table from '@/components/ui/table';
	import { showToast } from '../stores/toast';
	import Button from '@/components/ui/button/button.svelte';
	import * as Dialog from '@/components/ui/dialog';
	import Input from '@/components/ui/input/input.svelte';
	import Label from '@/components/ui/label/label.svelte';
	import * as Alert from '@/components/ui/alert';
	// import CheckCircle2Icon from 'lucide-svelte/icons/check-circle-2';

	// Props
	export let fields: Array<{
		id: string | number;
		key: string;
		label: string;
		value?: string;
		required?: boolean;
		errorMessage?: string;
		options?: { hideTable?: boolean };
		type: string;
	}> = [];

	export let formTitle = 'Form Title';
	export let tableTitle = 'Data Table';
	export let onCreateSubmit: (values: Record<string, unknown>) => Promise<{
		success: boolean;
		data?: unknown;
		error?: string;
		message?: string;
		description?: string;
	}> = () => Promise.resolve({ success: true });
	export let onUpdateSubmit: (
		id: string | number | null,
		values: Record<string, unknown>
	) => Promise<{ success: boolean; data?: unknown; error?: string }> = () =>
		Promise.resolve({ success: true });
	export let onDeleteSubmit: (
		id: string | number | null
	) => Promise<{ success: boolean; data?: unknown; error?: string }> = () =>
		Promise.resolve({ success: true });

	export let onCreate: () => void = () => {};
	export let onUpdate: (id: string | number | null) => void = () => {};
	export let onDelete: (id: string | number | null) => void = () => {};
	export let onDetail: (id: string | number | null) => void = () => {};

	export let submitButtonText = 'Submit';
	export let canCreate = true;
	export let canUpdate = true;
	export let canDelete = true;
	export let canDetail = true;

	export let createTitle = 'Create New';
	export let updateTitle = 'Update';
	export let deleteTitle = 'Delete';
	export let detailTitle = 'Detail';

	export let customComponent = { create: false, update: false, delete: false, detail: false };
	export let data: Record<string, unknown>[] = [];

	// State
	let openCreateModal = false;
	let openUpdateModal = false;
	let openDeleteModal = false;
	let openDetailModal = false;
	let selectedRowId: string | number | null = null;
	let isLoading = false;
	let selectedRow: Record<string, unknown> | null = null;

	function handleCreate() {
		if (canCreate) {
			if (customComponent.create) return onCreate();
			openCreateModal = true;
			selectedRowId = null;
		}
	}

	function handleUpdate() {
		if (canUpdate && selectedRowId !== null) {
			if (customComponent.update) return onUpdate(selectedRowId);
			openUpdateModal = true;
		}
	}

	function handleDelete() {
		if (canDelete && selectedRowId !== null) {
			if (customComponent.delete) return onDelete(selectedRowId);
			openDeleteModal = true;
		}
	}

	function handleDetail() {
		if (canDetail && selectedRowId !== null) {
			selectedRow = data.find((item) => item.id === selectedRowId) ?? null;
			if (customComponent.detail) return onDetail(selectedRowId);
			openDetailModal = true;
		}
	}

	async function handleSubmitCreate() {
		fields = fields.map((f) => ({
			...f,
			errorMessage: f.required !== false && !f.value?.trim() ? `${f.label} cannot be empty.` : ''
		}));
		if (fields.some((f) => f.errorMessage)) return;

		const values = fields.reduce((acc, f) => ({ ...acc, [f.key]: f.value }), {});
		isLoading = true;

		try {
			const res = await onCreateSubmit(values);
			if (res.success) {
				showToast(res.message || 'Create Successful', res.description || '', 'success');
				openCreateModal = false;
				fields = fields.map((f) => ({ ...f, value: '' }));
			} else {
				showToast(res.message || 'Create Failed', res.error || 'An error occurred', 'error');
			}
		} catch (e) {
			showToast('Create Failed', String(e), 'error');
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex gap-1">
	{#if canCreate}
		<Button onclick={handleCreate} disabled={isLoading}>
			{createTitle}
		</Button>
	{/if}

	{#if canUpdate}
		<Button onclick={handleUpdate} disabled={isLoading || selectedRowId === null}>
			{updateTitle}
		</Button>
	{/if}

	{#if canDelete}
		<Button onclick={handleDelete} disabled={isLoading || selectedRowId === null}>
			{deleteTitle}
		</Button>
	{/if}

	{#if canDetail}
		<Button onclick={handleDetail} disabled={isLoading || selectedRowId === null}>
			{detailTitle}
		</Button>
	{/if}
</div>
<Table.Root>
	<Table.Caption>
		{tableTitle}
	</Table.Caption>

	<Table.Header>
		<Table.Row>
			{#each fields as field}
				<Table.Head>{field.label}</Table.Head>
			{/each}
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#each data as row (row.id)}
			<Table.Row
				class={`${selectedRowId === row.id ? 'bg-gray-100' : ''}`}
				onclick={() => (selectedRowId = row.id as null)}
			>
				{#each fields as field}
					<Table.Cell>{row[field.key]}</Table.Cell>
				{/each}
			</Table.Row>
		{/each}
		{#if data.length === 0}
			<Table.Row>
				<Table.Cell colspan={fields.length + 1} class="text-center text-gray-500">
					No data available
				</Table.Cell>
			</Table.Row>
		{/if}
	</Table.Body>
</Table.Root>

<!-- Modal Create -->
{#if openCreateModal}
	<Dialog.Root open={openCreateModal}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>{createTitle}</Dialog.Title>
			</Dialog.Header>
			<Dialog.Description>Fill in the details to create a new entry.</Dialog.Description>
			<form on:submit|preventDefault={handleSubmitCreate} id="create-form">
				<div class="grid gap-4 py-4">
					{#each fields as field}
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for={field.id as string} class="text-right">{field.label}</Label>
							<Input
								id={field.id as string}
								value={field.value}
								class={`col-span-3 ${field.errorMessage ? 'border-red-500' : ''}`}
								placeholder={field.label}
							/>
						</div>
						{#if field.errorMessage}
							<p class="text-right text-sm text-red-500">{field.errorMessage}</p>
						{/if}
					{/each}
				</div>
			</form>

			<Dialog.Footer>
				<Button
					type="submit"
					disabled={isLoading}
					onclick={() => {
						const form = document.getElementById('create-form') as HTMLFormElement;
						if (form) form.requestSubmit();
					}}
				>
					{submitButtonText}
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
