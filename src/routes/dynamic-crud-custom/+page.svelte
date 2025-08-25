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
			create: true, // custom component for create action
			update: true, // custom component for update action
			delete: true, // custom component for delete action
			detail: true // custom component for detail action
		}}
		onUpdate={(id) => {
			// default action for update
			// fill the fields with the data of the selected row
			const selectedRow = dummyDataUser.find((user) => user.id === id);
			if (selectedRow) {
				fields = fields.map((field) => ({
					...field,
					value: String(selectedRow[field.key as keyof typeof selectedRow] ?? '')
				}));
			}

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
