<script lang="ts">
	import DynamicCrud from '../../../components/DynamicCRUD.svelte';
	import { setLoading } from '@/hooks/loading';
	import { fetcherClient } from '../../../helpers/fetcher.client';

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
				required: true
			}
		},
		{
			label: 'Price',
			type: 'numeric',
			placeholder: 'Enter the price',
			id: 'price',
			key: 'price',
			value: '',
			errorMessage: '',
			options: {
				canFilter: true
			},
			validation: {
				required: true
			}
		},
		{
			label: 'Date',
			type: 'date',
			placeholder: 'Select the date',
			id: 'date',
			key: 'date',
			value: '',
			errorMessage: '',
			options: {
				canFilter: true
			},
			validation: {
				required: true
			}
		},
		{
			label: 'Category',
			type: 'select',
			placeholder: 'Select a category',
			id: 'category',
			key: 'category',
			value: '',
			errorMessage: '',
			options: {
				canFilter: true
			},
			validation: {
				required: true
			},
			datas: [
				{ label: 'Category 1', value: 'category1' },
				{ label: 'Category 2', value: 'category2' },
				{ label: 'Category 3', value: 'category3' }
			]
		}
	];

	interface formValue {
		name: string;
		year: string;
	}

	let data: any = [];

	async function handleSubmit(
		values: formValue,
		refreshData: () => void
	): Promise<{
		success: boolean;
		data?: unknown;
		error?: string;
		message?: string;
		description?: string;
	}> {
		const formBody = {
			...values,
			data: {
				year: values.year
			}
		};

		// this for global loading
		setLoading(true, 'Submitting...');
		const res = await fetch('/api/examples', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formBody)
		});

		if (!res.ok) {
			const errorData = await res.json();
			console.error('Error submitting form:', errorData);
			return {
				success: false,
				error: errorData.error || 'Unknown error',
				message: 'Failed to submit form'
			};
		}

		const data = await res.json();

		if (!data.success) {
			console.error('Error in response:', data);
			return {
				success: false,
				error: data.error || 'Unknown error',
				message: 'Failed to submit form'
			};
		}

		setLoading(false);
		refreshData();
		return {
			success: true,
			data: values,
			message: data.message || 'Form submitted successfully'
		};
	}

	async function handleUpdate(
		id: string | number | null,
		values: formValue,
		refreshData: () => void
	) {
		const formBody = {
			...values,
			id: id,
			data: {
				year: values.year as string
			}
		};

		// this for global loading
		setLoading(true, 'Updating...');
		const res = await fetch(`/api/examples`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formBody)
		});

		if (!res.ok) {
			const errorData = await res.json();
			console.error('Error updating form:', errorData);
			return {
				success: false,
				error: errorData.error || 'Unknown error',
				message: 'Failed to update form'
			};
		}

		const data = await res.json();

		if (!data.success) {
			console.error('Error in response:', data);
			return {
				success: false,
				error: data.error || 'Unknown error',
				message: 'Failed to update form'
			};
		}

		setLoading(false);
		refreshData();
		return {
			success: true,
			data: values,
			message: data.message || 'Form updated successfully'
		};
	}

	async function handleDelete(
		id: string | number | null,
		refreshData: () => void
	): Promise<{
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

		// this for global loading
		setLoading(true, 'Deleting...');
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

		setLoading(false);
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
		const res = await fetcherClient({
			method: 'GET',
			url: `/api/examples`,
			queryParams: {
				page: page?.toString() || "1",
				limit: limit?.toString() || "10",
				...(filter?.key
					? { key: filter.key, keywords: filter.keyWords }
					: {})
			}
		});
		return res;	
	};
</script>

<div class="p-4">
	<DynamicCrud
		{fields}
		onGetData={fetchData}
		dataKey="dataSample"
		customComponent={{
			create: false, // custom component for create action
			update: false, // custom component for update action
			delete: false, // custom component for delete action
			detail: false // custom component for detail action
		}}
		{data}
		formTitle="Form"
		onCreateSubmit={handleSubmit}
		onUpdateSubmit={handleUpdate}
		onDeleteSubmit={handleDelete}
		submitButtonText="Save"
		on:rowSelect={(event) => {
			// on this event
			// you can get selected row data from <DynamicCrud />
			const selectedRow = event.detail;
			console.log('Selected Row:', selectedRow);
		}}
	/>
</div>
