<script lang="ts">
	import { updated } from '$app/state';
	import Button from '@/components/ui/button/button.svelte';
	import DynamicCrud from '../components/DynamicCRUD.svelte';

	let fields: DefaultType = [
		{
			label: 'Email',
			type: 'email',
			placeholder: 'Enter your email',
			id: 'email',
			key: 'email',
			value: '',
			errorMessage: '',
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

	async function handleSubmit() {
		console.log(
			'Form submitted with values:',
			fields.map((field) => ({ [field.label]: field.value }))
		);

		return {
			success: true,
			data: fields,
			message: 'Login successful'
		};
	}

	const dummyDataUser = [
		{ id: 1, email: 'user1@example.com', password: 'password1' },
		{ id: 2, email: 'user2@example.com', password: 'password2' }
	];
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
		data={dummyDataUser}
		formTitle="Login Form"
		onCreateSubmit={handleSubmit}
		submitButtonText="Login"
	/>
</div>
