<script lang="ts">
	import DynamicCrud from '../../../components/DynamicCRUD.svelte';
	import CustomButton from '../dynamic-crud-custom-process/components/custom-button.svelte';

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

	let data: any = [];

	async function handleSubmit() {
		console.log(
			'Form submitted with values:',
			fields.map((field) => ({ [field.label]: field.value }))
		);

		return {
			success: true,
			data: fields,
			message: 'Login Success'
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
		{data}
		formTitle="Login Form"
		onCreateSubmit={handleSubmit}
		canMultiple={true}
		customProcess={true}
		processComponent={CustomButton} 
		on:rowSelect={(event) => {
			// on this event
			// you can get selected row data from <DynamicCrud />
			const selectedRow = event.detail;
			console.log('Selected Row:', selectedRow);
		}}
	/>
</div>
