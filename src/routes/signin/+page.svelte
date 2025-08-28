<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import AppForm from '../../components/AppForm.svelte';
	import { goto } from '$app/navigation';

	let fields: DefaultType[] = [
		{
			label: 'Username',
			type: 'text',
			placeholder: 'Enter your username',
			id: 'username',
			value: '',
            key: 'username',
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

	async function handleSubmit(values: { username: string; password: string }) {
		try {
			await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: values.username,
					password: values.password
				})
			});

			
			goto('/')
			return {
				success: true,
				message: 'Login Success'
			};
		} catch (error) {
			console.error('Error during form submission:', error);
			return {
				success: false,
				message: 'An error occurred during login. Please try again.'
			};
		}
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
	<div class="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
		<AppForm {fields} formTitle="Login Form" onSubmit={handleSubmit} submitButtonText="Login" />
	</div>
</div>



