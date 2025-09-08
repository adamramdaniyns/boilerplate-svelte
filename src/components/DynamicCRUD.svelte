<script lang="ts">
	import * as Table from '@/components/ui/table';
	import { showToast } from '../stores/toast';
	import Button from '@/components/ui/button/button.svelte';
	import * as Dialog from '@/components/ui/dialog';
	import Input from '@/components/ui/input/input.svelte';
	import Label from '@/components/ui/label/label.svelte';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { createEventDispatcher } from 'svelte';
	import { Loader2, SortAscIcon, SortDescIcon } from '@lucide/svelte';
	import { createSvelteTable, FlexRender } from '@/components/ui/data-table';
	import { getCoreRowModel, type RowSelectionState } from '@tanstack/table-core';
	import { createQuery } from '@tanstack/svelte-query';
	import { writable } from 'svelte/store';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import AppDatePicker from './AppDatePicker.svelte';
	import AppComboBox from './AppComboBox.svelte';

	// dispatch
	const dispatch = createEventDispatcher();

	// when selecting a row
	function handleRowSelect(row: Record<string, unknown>) {
		selectedRow = row;
		dispatch('rowSelect', row);
	}

	$: {
		// Update the selected rows when the checkbox state changes
		dispatch('rowSelect', selectedRows);
	}

	// Props
	export let fields: DefaultType[] = [];

	export let formTitle = 'Form Title';
	export let tableTitle = 'Data Table';
	export let onCreateSubmit: (
		values: any,
		refetch: () => void
	) => Promise<{
		success: boolean;
		data?: unknown;
		error?: string;
		message?: string;
		description?: string;
	}> = () => Promise.resolve({ success: true });
	export let onUpdateSubmit: (
		id: string | number | null,
		values: any,
		refreshData: () => void
	) => Promise<{
		success: boolean;
		data?: unknown;
		error?: string;
		message?: string;
		description?: string;
	}> = () => Promise.resolve({ success: true });
	export let onDeleteSubmit: (
		id: any | any[],
		refreshData: () => void
	) => Promise<{
		success: boolean;
		data?: unknown;
		error?: string;
		message?: string;
		description?: string;
	}> = () => Promise.resolve({ success: true });

	export let onCreate: () => void = () => {};
	export let onUpdate: (id: string | number | null) => void = () => {};
	export let onDelete: (id: string | number | null) => void = () => {};
	export let onDetail: (id: string | number | null) => void = () => {};

	// Custom process
	export let customProcess = false;
	export let processComponent: any | null = null;
	export let customActions: any | null = null;

	export let submitButtonText = 'Submit';
	export let canCreate = true;
	export let canUpdate = true;
	export let canDelete = true;
	export let canDetail = true;

	export let createTitle = 'Create New';
	export let updateTitle = 'Update';
	export let deleteTitle = 'Delete';
	export let detailTitle = 'Detail';
	export let canMultiple = false;
	export let dataKey: string;

	export let customComponent = { create: false, update: false, delete: false, detail: false };
	export let data: any[] = [];

	export let onGetData: (page: number, limit: number, filter: Filter) => Promise<ResponseStack>;

	// State
	let openCreateModal = false;
	let openUpdateModal = false;
	let openDeleteModal = false;
	let openDetailModal = false;
	let selectedRowId: string | number | null = null;
	let isLoading = false;
	let selectedRow: Record<string, unknown> | null = null;
	let selectedRows: any[] = [];
	let selectedRowIds: string[] = [];
	let sorting: { id: string; desc: boolean }[] = [];

	// state for filter data
	let filter: Filter = {
		key: '',
		keyWords: '',
		sort: {
			field: '',
			order: 'asc'
		}
	};

	let page = 1;
	let limit = 5;
	let formattedRows: Array<Record<string, unknown>> = [];
	let total: number = 0;
	let hasNextPage: boolean | undefined = false;

	// createquery for main fetching data
	let tanstackQuery = createQuery<ResponseStack>({
		queryKey: [dataKey],
		queryFn: async () => await onGetData(page, limit, filter),
		throwOnError: true,
		retry: 1,
		staleTime: 1000 * 60 * 30 // 30 minutes
	});

	$: {
		const datas = $tanstackQuery?.data as ResponseStack | undefined;
		const rows = datas?.rows ?? [];
		total = datas?.total ?? 0;
		hasNextPage = datas?.hasNextPage;

		formattedRows = rows.map((row, index) => ({
			...row,
			no: (page - 1) * limit + index + 1
		}));
	}

	// function for refreshdata
	function refreshData() {
		$tanstackQuery.refetch();
	}

	// Debounce state
	let debounceTimeout: ReturnType<typeof setTimeout>;

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
			fields.forEach((f) => {
				// find value from selectedRow
				if (selectedRow && selectedRow[f.key] !== undefined) {
					f.value = String(selectedRow[f.key]);
				} else {
					f.value = '';
				}
			});
			openUpdateModal = true;
		}
	}

	function handleDelete() {
		if (
			(canDelete && selectedRowId !== null && !canMultiple) ||
			(canMultiple && selectedRowIds.length > 0)
		) {
			if (customComponent.delete) return onDelete(selectedRowId);
			openDeleteModal = true;
		}
	}

	function handleDetail() {
		if (canDetail && selectedRowId !== null) {
			if (customComponent.detail) return onDetail(selectedRowId);
			openDetailModal = true;
		}
	}

	function capitalizeWord(text: string) {
		return text.charAt(0).toUpperCase() + text.slice(1);
	}

	function handleCloseModal(type: 'create' | 'update' | 'delete' | 'detail') {
		if (type === 'create') {
			openCreateModal = false;
			// remove value
			fields = fields.map((f) => ({ ...f, value: '' }));
		} else if (type === 'update') {
			openUpdateModal = false;
			selectedRowId = null;
		} else if (type === 'delete') {
			openDeleteModal = false;
			selectedRowId = null;
		} else if (type === 'detail') {
			openDetailModal = false;
			selectedRowId = null;
			selectedRow = null;
		}

		// remove error messages
		fields = fields.map((f) => ({ ...f, errorMessage: '' }));
	}

	// this for validation handler
	function validation() {
		fields = fields.map((f) => {
			let errorMessage = '';

			// Required
			if ((f.validation?.required ?? true) && !f.value?.trim()) {
				errorMessage = f.validation?.message?.[0] || `${f.label} cannot be empty.`;
			}
			// Min Length
			else if (f.validation?.minLength && f.value.length < f.validation.minLength) {
				errorMessage =
					f.validation.message?.[1] ||
					`${f.label} must be at least ${f.validation.minLength} characters long.`;
			}
			// Pattern
			else if (f.validation?.pattern && !f.validation.pattern.test(f.value)) {
				errorMessage =
					f.validation.message?.[2] || f.validation.message?.[1] || `${f.label} is not valid.`;
			}

			return { ...f, errorMessage };
		});

		// add more validation rules as needed

		if (fields.some((f) => f.errorMessage)) return true;

		return false;
	}

	async function handleSubmitCreate() {
		// format to date when type is date
		fields.forEach((f) => {
			if (f.type === 'date' && f.value) {
				f.value = new Date(f.value).toISOString();
			}
		});

		const isHasError = validation();
		if (isHasError) return;

		const values = fields.reduce((acc, f) => ({ ...acc, [f.key]: f.value }), {});

		isLoading = true;

		try {
			const res = await onCreateSubmit(values, refreshData);
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

	async function handleSubmitUpdate(id: string | number | null) {
		if (id === null) return;

		// format to date when type is date
		fields.forEach((f) => {
			if (f.type === 'date' && f.value) {
				f.value = new Date(f.value).toISOString();
			}
		});

		// validate fields
		const isHasError = validation();
		if (isHasError) return;

		// get values from input when modal is open
		const values = fields.reduce(
			(acc, f) => ({ ...acc, [f.key]: f.value ?? selectedRow?.[f.key] ?? '' }),
			{}
		);

		isLoading = true;

		try {
			const res = await onUpdateSubmit(id, values, refreshData);
			if (res.success) {
				showToast(res.message || 'Update Successful', res.description || '', 'success');
				openUpdateModal = false;
				selectedRowId = null;
				fields = fields.map((f) => ({ ...f, value: '' }));
			} else {
				showToast(res.message || 'Update Failed', res.error || 'An error occurred', 'error');
			}
		} catch (e) {
			showToast('Update Failed', String(e), 'error');
		} finally {
			isLoading = false;
		}
	}

	async function handleDeleteSubmit(id: string | string[], refreshData: () => void) {
		if (!id) return showToast('Delete Failed', 'Invalid ID', 'error');

		try {
			const res = await onDeleteSubmit(id, refreshData);
			if (res.success) {
				showToast(res.message || 'Delete Successful', res.description || '', 'success');
				openDeleteModal = false;
				selectedRowId = null;
				fields = fields.map((f) => ({ ...f, value: '' }));
			} else {
				showToast(res.message || 'Delete Failed', res.error || 'An error occurred', 'error');
			}
		} catch (e) {
			showToast('Delete Failed', String(e), 'error');
		} finally {
			isLoading = false;
		}
	}

	let rowSelection = writable<RowSelectionState>({});

	// init table
	const table = createSvelteTable<Record<string, unknown>>({
		get data() {
			return formattedRows;
		},
		columns: [
			// when canMultiple is true render checkbox
			...(canMultiple
				? [
						{
							id: 'select',
							enableSorting: false,
							enableHiding: false
						}
					]
				: []),
			// always show no column
			{
				accessorKey: 'no',
				header: 'No',
				cell: (props) => props.getValue(),
				enableColumnFilter: false
			},
			// only show when hideTable is false
			...fields
				.filter((field) => field.options?.hideTable !== true)
				.map((field) => ({
					accessorKey: field.key,
					header: field.label,
					cell: (props: { getValue: () => unknown }) => {
						if (field.type === 'numeric') {
							return formatNumber(props.getValue() as number);
						}
						if (field.type === 'date') {
							return formatDate(props.getValue());
						}
						return props.getValue();
					},
					sortable: true
				}))
		],
		state: {
			get sorting() {
				return sorting;
			},
			get pagination() {
				return {
					pageIndex: page,
					pageSize: limit
				};
			},
			get rowSelection() {
				let val;
				rowSelection.subscribe((s) => (val = s))();
				return val;
			}
		},
		getRowId: (row: any) => row.id,
		enableRowSelection: true,
		onSortingChange: (updater) => {
			sorting = typeof updater === 'function' ? updater(sorting) : updater;
			if (sorting.length > 0) {
				filter.sort.field = sorting[0].id;
				filter.sort.order = sorting[0].desc ? 'desc' : 'asc';
			} else {
				filter.sort.field = '';
				filter.sort.order = 'asc';
			}
			$tanstackQuery.refetch();
		},
		onRowSelectionChange: (updater) => {
			rowSelection.update((prev) => (typeof updater === 'function' ? updater(prev) : updater));
			const mappingSelectedRows = table.getSelectedRowModel().rows.map((r) => r.id.toString());
			selectedRowIds = mappingSelectedRows;
			selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
		},
		manualSorting: true,
		manualPagination: true,
		pageCount: Math.ceil(total / limit),
		getCoreRowModel: getCoreRowModel()
	});
	

	// format function
	function formatNumber(value: number): string {
		if (value === null || value === undefined) return '-';
		const valueNumber = Number(value);
		return isNaN(valueNumber) ? '-' : new Intl.NumberFormat('en-US').format(valueNumber);
	}

	function formatDate(value: any): string {
		if (!value) return '-';
		const dateObj = value instanceof Date ? value : new Date(value);
		if (isNaN(dateObj.getTime())) return '-';
		return new Intl.DateTimeFormat('en-US').format(dateObj);
	}

	function formatCurrency(value: string | number): string {
		const number = Number(value);
		if (isNaN(number)) return '';
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(number);
	}

	function onPageChange(
		updater:
			| ((state: {
					pageIndex: number;
					pageSize: number;
			  }) => { pageIndex: number; pageSize: number })
			| { pageIndex: number; pageSize: number }
	) {
		const newState =
			typeof updater === 'function' ? updater({ pageIndex: page, pageSize: limit }) : updater;

		page = newState.pageIndex;
		limit = newState.pageSize;

		$tanstackQuery.refetch();
	}

	function onLimitChanges(newLimit: number) {
		limit = newLimit;
		$tanstackQuery.refetch();
	}
</script>

<div class="w-full">
	<div class="mb-4 flex items-center justify-between">
		{#if customProcess}
			{#if processComponent}
				<svelte:component
					this={processComponent}
					{selectedRow}
					{canMultiple}
					{selectedRows}
					{fields}
					{onCreate}
					{onUpdate}
					{onDelete}
					{onDetail}
					{...customActions}
				/>
			{:else}
				<div>No custom process component provided</div>
			{/if}
		{:else}
			<div class="flex gap-1">
				{#if canCreate && !customProcess}
					<Button onclick={handleCreate} disabled={isLoading}>
						{createTitle}
					</Button>
				{/if}

				{#if canUpdate && !customProcess}
					<Button onclick={handleUpdate} disabled={isLoading || selectedRowId === null}>
						{updateTitle}
					</Button>
				{/if}

				{#if canDelete && !customProcess}
					<Button
						onclick={handleDelete}
						disabled={isLoading ||
							(!canMultiple && selectedRowId === null) ||
							(canMultiple && selectedRowIds.length === 0)}
					>
						{deleteTitle}
					</Button>
				{/if}

				{#if canDetail && !customProcess}
					<Button onclick={handleDetail} disabled={isLoading || selectedRowId === null}>
						{detailTitle}
					</Button>
				{/if}
			</div>
		{/if}

		<div class="flex items-center gap-2">
			<Input
				type="text"
				placeholder="Search..."
				class="max-ws-sm"
				oninput={(e) => {
					const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
					filter.keyWords = searchTerm;
					if (debounceTimeout) clearTimeout(debounceTimeout);
					debounceTimeout = setTimeout(() => {
						// fetchData();
						$tanstackQuery.refetch();
					}, 300);
				}}
			/>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" size="sm">
							{capitalizeWord(filter.key) || 'All'}
							<ChevronDownIcon class="ml-4 size-4" />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<!-- Only show when field can filter -->
					{#each fields as field (field.id)}
						{#if field.options && field.options.canFilter && field.options.canFilter}
							<DropdownMenu.CheckboxItem
								checked={filter.key === field.key}
								onCheckedChange={(checked) => {
									if (checked) {
										filter.key = field.key;
									} else {
										filter.key = '';
									}
								}}
							>
								{field.label}
							</DropdownMenu.CheckboxItem>
						{/if}
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>

	<div class="rounded-sm border">
		<Table.Root>
			<Table.Header class="[&:has([role=checkbox])]:pl-3">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head
								class="cursor-pointer"
								colspan={header.colSpan}
								onclick={header.column.getToggleSortingHandler()}
							>
								{#if header.column.id === 'select'}
									<Checkbox
										checked={table.getIsAllRowsSelected()}
										indeterminate={table.getIsSomeRowsSelected()}
										onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
										aria-label="Select all rows"
									/>
								{:else if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
									{#if header.column.getIsSorted() === 'asc'}
										<SortAscIcon class="ml-2 h-4 w-4" />
									{:else if header.column.getIsSorted() === 'desc'}
										<SortDescIcon class="ml-2 h-4 w-4" />
									{/if}
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>

			<Table.Body>
				{#if $tanstackQuery.isFetching}
					<Table.Row class="w-full">
						<Table.Cell
							colspan={table.getAllColumns().length}
							class="h-40 w-full flex-col items-center justify-center text-center"
						>
							<span class="flex h-full items-center justify-center text-center">
								<Loader2 class="size-10 animate-spin" />
							</span>
						</Table.Cell>
					</Table.Row>
				{:else if formattedRows.length > 0}
					{#each table.getRowModel().rows as row (row.id)}
						<Table.Row
							class={`hover:bg-muted ${selectedRowId == row.id && 'bg-muted'}`}
							data-state={row.getIsSelected() && 'selected'}
							onclick={() => {
								!canMultiple && (selectedRowId = row.id);
								!canMultiple && handleRowSelect(row.original);
							}}
						>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell>
									{#if cell.column.id === 'select'}
										<Checkbox
											checked={selectedRowIds.includes(row.id.toString())}
											onCheckedChange={(value) => row.toggleSelected(!!value)}
											aria-label="Select row"
										/>
									{:else}
										<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
									{/if}
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{:else if $tanstackQuery.isSuccess && formattedRows.length === 0}
					<Table.Row class="w-full">
						<Table.Cell
							colspan={table.getAllColumns().length}
							class="h-40 w-full flex-col items-center justify-center text-center"
						>
							<span class="flex h-full items-center justify-center text-center">
								No data available
							</span>
						</Table.Cell>
					</Table.Row>
				{:else if $tanstackQuery.isError}
					<Table.Row class="w-full">
						<Table.Cell
							colspan={table.getAllColumns().length}
							class="h-40 w-full flex-col items-center justify-center text-center"
						>
							<span class="flex h-full items-center justify-center text-center">
								{$tanstackQuery.error.message || 'An error occurred while fetching data.'}
							</span>
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>

	<!-- Pagination -->
	<div class="flex items-center justify-end space-x-2 pt-4">
		<div class="flex-1 text-sm text-muted-foreground">
			{formattedRows.length} of {total} entries
		</div>
		<div class="space-x-2">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" size="sm">
							{limit || 'Limit'}
							<ChevronDownIcon class="ml-4 size-4" />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					{#each [5, 10, 15, 20, 100] as item}
						<DropdownMenu.CheckboxItem
							checked={limit === item}
							onCheckedChange={(checked) => {
								if (checked) {
									onLimitChanges(item);
								}
							}}
						>
							{item} entries
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<Button
				variant="outline"
				size="sm"
				disabled={page - 1 === 0}
				onclick={() => onPageChange({ pageIndex: page - 1, pageSize: limit })}
			>
				Previous
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => onPageChange({ pageIndex: page + 1, pageSize: limit })}
				disabled={!hasNextPage}
			>
				Next
			</Button>
		</div>
	</div>
</div>

<!-- Modal Create -->
{#if openCreateModal}
	<Dialog.Root
		open={openCreateModal}
		onOpenChange={(open) => {
			if (!open) {
				handleCloseModal('create');
			}
			openCreateModal = open;
		}}
	>
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

							{#if field.type === 'date'}
								<AppDatePicker bind:value={field.value} />

							{:else if field.type === 'select'}
								<AppComboBox bind:value={field.value} datas={field.datas} placeholder={field.placeholder} />
							{:else}
								<Input
									id={field.id as string}
									bind:value={field.value}
									type={field.type}
									class={`col-span-3 ${field.errorMessage ? 'border-red-500' : ''}`}
									placeholder={field.label}
									oninput={(e) => {
										if (field.type === 'numeric') {
											const raw = (e.target as HTMLInputElement).value.replace(/[^\d]/g, '');
											field.value = raw ? formatCurrency(raw) : '';
										}
									}}
								/>
							{/if}
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

<!-- Modal Update -->
{#if openUpdateModal}
	<Dialog.Root
		open={openUpdateModal}
		onOpenChange={(open) => {
			if (!open) {
				handleCloseModal('update');
			}
			openUpdateModal = open;
		}}
	>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>{updateTitle}</Dialog.Title>
			</Dialog.Header>
			<Dialog.Description>Update the details of the selected entry.</Dialog.Description>
			<form on:submit|preventDefault={() => handleSubmitUpdate(selectedRowId)} id="update-form">
				<div class="grid gap-4 py-4">
					{#each fields as field}
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for={field.id as string} class="text-right">{field.label}</Label>
							{#if field.type === 'date'}
								<div class="">
									<AppDatePicker bind:value={field.value} />
								</div>
							{:else}
								<Input
									id={field.id as string}
									bind:value={field.value}
									type={field.type}
									class={`col-span-3 ${field.errorMessage ? 'border-red-500' : ''} w-full`}
									placeholder={field.label}
									oninput={(e) => {
										if (field.type === 'numeric') {
											const raw = (e.target as HTMLInputElement).value.replace(/[^\d]/g, '');
											field.value = raw ? formatCurrency(raw) : '';
										}
									}}
								/>
							{/if}
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
					onclick={() => {
						const form = document.getElementById('update-form') as HTMLFormElement;
						if (form) form.requestSubmit();
					}}
					disabled={isLoading || selectedRowId === null}
				>
					Update
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}

<!-- Modal delete -->
{#if openDeleteModal}
	<Dialog.Root open={openDeleteModal} onOpenChange={(open) => (openDeleteModal = open)}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>{deleteTitle}</Dialog.Title>
			</Dialog.Header>
			<Dialog.Description>Are you sure you want to delete this entry?</Dialog.Description>

			<Dialog.Footer>
				<Button
					onclick={() => {
						openDeleteModal = false;
						handleDeleteSubmit(
							canMultiple
								? selectedRowIds
								: typeof selectedRowId === 'string'
									? selectedRowId
									: selectedRowId !== null
										? String(selectedRowId)
										: '',
							refreshData
						);
					}}
					variant="destructive"
					disabled={isLoading ||
						(!canMultiple && selectedRowId === null) ||
						(canMultiple && selectedRowIds.length === 0)}
				>
					Delete
				</Button>
				<Button onclick={() => handleCloseModal('delete')} disabled={isLoading}>Cancel</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}

<!-- Modal Detail -->
{#if openDetailModal}
	<Dialog.Root open={openDetailModal} onOpenChange={(open) => (openDetailModal = open)}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>{detailTitle}</Dialog.Title>
			</Dialog.Header>
			<Dialog.Description>Details of the selected entry.</Dialog.Description>

			<div class="grid gap-4 py-4">
				{#each fields as field}
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for={field.id as string} class="text-right">{field.label}</Label>

						{#if field.type === 'date'}
							<p class="col-span-3">
								{selectedRow && selectedRow[field.key] ? formatDate(selectedRow[field.key]) : 'N/A'}
							</p>
						{:else if field.type === 'numeric'}
							<p class="col-span-3">
								{selectedRow && selectedRow[field.key]
									? formatNumber(Number(selectedRow[field.key]))
									: 'N/A'}
							</p>
						{:else}
							<p class="col-span-3">{selectedRow ? selectedRow[field.key] : 'N/A'}</p>
						{/if}
					</div>
				{/each}
			</div>

			<Dialog.Footer>
				<Button onclick={() => handleCloseModal('detail')} disabled={isLoading}>Close</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
