<script lang="ts">
	import AppForm from '../../components/AppForm.svelte';

	let fields: DefaultType[] = [
		{
			label: 'Email',
			type: 'email',
			placeholder: 'Enter your email',
			id: 'email',
			value: '',
            key: 'email',
			errorMessage: ''
		},
		{
			label: 'Password',
			type: 'password',
			placeholder: 'Enter your password',
			id: 'password',
			value: '',
			key: 'password',
			errorMessage: ''
		}
	];

	async function handleSubmit() {
		console.log(
			'Form submitted with values:',
			fields.map((field) => ({ [field.label]: field.value }))
		);
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
	<div class="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
		<AppForm {fields} formTitle="Login Form" onSubmit={handleSubmit} submitButtonText="Login" />
	</div>
</div>



