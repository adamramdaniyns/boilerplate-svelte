<script lang="ts">
	import DynamicCrud from '../components/DynamicCRUD.svelte';

	let fields: DefaultType[] = [
		{
			label: 'Email',
			type: 'email',
			placeholder: 'Enter your email',
			id: 'email',
			key: 'email',
			value: '',
			errorMessage: '',
			options: {
				canFilter: true,
			},
			validation: {
				required: false,
			}
		},
		{
			label: 'Password',
			type: 'password',
			placeholder: 'Enter your password',
			id: 'password',
			key: 'password',
			value: '',
			errorMessage: '',
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
		{ id: 10, email: 'user10@example.com', password: 'password10' },
	];

	const fetchData = async (page?: number, limit?: number, filter?: Filter) => {
		const currentPage = page ?? 1;
		const currentLimit = limit ?? 5;
		console.log(filter);
		
		// Simulate fetching data from an API
		await new Promise((resolve) => setTimeout(resolve, 1000));
		// Here you would typically fetch data from your API
		// For example: const response = await fetch('/api/users');
		// const data = await response.json();
		data = dummyDataUser.slice((currentPage - 1) * currentLimit, currentPage * currentLimit); // Assign fetched data to the data variable
		return {
			rows: data,
			totalRows: dummyDataUser.length,
			limit: currentLimit,
			page: currentPage
		};
	};
</script>

<div class="p-4">
	<DynamicCrud
		{fields}
		customComponent={{
			create: false, // custom component for create action
			update: false, // custom component for update action
			delete: false, // custom component for delete action
			detail: false // custom component for detail action
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
		onGetData={fetchData}
		formTitle="Login Form"
		onCreateSubmit={handleSubmit}
		submitButtonText="Login"
	/>
</div>
