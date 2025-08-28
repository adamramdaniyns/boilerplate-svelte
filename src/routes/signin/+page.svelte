<script lang="ts">
	import AppForm from '../../components/AppForm.svelte';
	import { goto } from '$app/navigation';
	import { showToast } from '../../stores/toast';

	let username = '';
	let password = '';
	let isLoading = false;

	async function handleSubmit() {
		try {
			isLoading = true;
			await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username,
					password
				})
			});

			
			goto('/')
			showToast('Success', 'Logged in successfully', 'success');
		} catch (error) {
			console.error('Error during form submission:', error);
			showToast('Error', 'Failed to log in', 'error');
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen w-full bg-slate-50 md:grid md:grid-cols-2">
    <div class="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white">
        <div class="max-w-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 h-16 w-16 text-indigo-200"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
            <h1 class="text-4xl font-bold tracking-tight">Your App Name</h1>
            <p class="mt-4 text-lg text-indigo-200">
                Welcome back! Access your dashboard and manage your projects with ease.
            </p>
        </div>
    </div>

    <div class="flex flex-col items-center justify-center p-6 md:p-12">
        <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <h2 class="mb-2 text-3xl font-bold text-slate-800">Login</h2>
            <p class="mb-8 text-slate-500">Please sign in to your account.</p>

            <form class="space-y-6">
                <div>
                    <label for="username" class="block text-sm font-medium text-slate-600">Username</label>
                    <div class="relative mt-1">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-slate-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <input
                            id="username"
                            name="username"
                            bind:value={username}
                            type="text"
                            placeholder="Enter your username"
                            class="block w-full rounded-md border-slate-300 py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-slate-600">Password</label>
                    <div class="relative mt-1">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-slate-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </div>
                        <input
                            id="password"
                            name="password"
							bind:value={password}
                            type="password"
                            placeholder="Enter your password"
                            class="block w-full rounded-md border-slate-300 py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div class="flex items-center justify-between text-sm">
                    <div class="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <label for="remember-me" class="ml-2 block text-slate-600">Remember me</label>
                    </div>
                    <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                </div>

                <div>
                    <button
                        type="button"
						disabled={isLoading}
						onclick={() => handleSubmit()}
                        class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Login
                    </button>
                </div>
            </form>

            <p class="mt-8 text-center text-sm text-slate-500">
                Don't have an account?
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Sign up</a>
            </p>
        </div>
    </div>
</div>



