<script lang="ts">
	import DynamicCrud from '../../components/DynamicCRUD.svelte';
	import CustomButton from './components/custom-button.svelte';

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
	let selectedRow: any = null;

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

	const dummyDataUser = [
		{ id: 1, email: 'user1@example.com', password: 'password1' },
		{ id: 2, email: 'user2@example.com', password: 'password2' },
		{ id: 3, email: 'user3@example.com', password: 'password3' },
		{ id: 4, email: 'user4@example.com', password: 'password4' },
		{ id: 5, email: 'user5@example.com', password: 'password5' },
		{ id: 6, email: 'user6@example.com', password: 'password6' },
		{ id: 7, email: 'user7@example.com', password: 'password7' },
		{ id: 8, email: 'user8@example.com', password: 'password8' },
		{ id: 9, email: 'user9@example.com', password: 'password9' },
		{ id: 10, email: 'user10@example.com', password: 'password10' }
	];

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
		customProcess={true}
		processComponent={CustomButton} 
		{data}
		on:rowSelect={(event) => {
			// on this event
			// you can get selected row data from <DynamicCrud />
			selectedRow = event.detail;
			console.log('Selected Row:', selectedRow);
		}}
	/>
</div>
