<script lang="ts">
	import DynamicCrud from '../components/DynamicCRUD.svelte';

	let fields: DefaultType[] = [
		{
			label: 'Name',
			type: 'text',
			placeholder: 'Enter name',
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
		},
		{
			label: "Year",
			type: "text",
			placeholder: "Enter the year",
			id: "year",
			key: "year",
			value: "",
			errorMessage: "",
			options: {
				canFilter: true,
				hideTable: true
			},
			validation: {
				required: false
			}
		}
	];

	interface formValue {
		name: string;
		year: string;
	}

	let data: any = [];

	async function handleSubmit(values: formValue, refreshData: () => void): Promise<{
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
		}

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

		refreshData();
		return {
			success: true,
			data: values,
			message: data.message || 'Form submitted successfully',
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
		onUpdate={(id) => {
			// default action for update

			// or u can fetch the data from the server
			// fetch(`/api/users/${id}`)

			// or when using custom component
			// you can using custom function
			// for example using state for changes component
		}}
		{data}
		formTitle="Login Form"
		onCreateSubmit={handleSubmit}
		submitButtonText="Login"
		on:rowSelect={(event) => {
			// on this event
			// you can get selected row data from <DynamicCrud />
			const selectedRow = event.detail;
			console.log('Selected Row:', selectedRow);
		}}
	/>
</div>
