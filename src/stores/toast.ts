import { writable } from 'svelte/store';

export const toast = writable({
	isOpen: false,
	message: '',
	description: '',
	type: 'default'
});

export function showToast(
	message: string,
	description: string,
	type: 'success' | 'error' | 'info' = 'info'
) {
	toast.set({ isOpen: true, message, description, type });
	if (type !== 'error') {
		setTimeout(() => {
			toast.set({ isOpen: false, message: '', description: '', type });
		}, 3000);
	}
}
