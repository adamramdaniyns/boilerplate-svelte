import { writable } from 'svelte/store';

export const user = writable({
	username: '',
	email: '',
	// Add other user properties as needed
});