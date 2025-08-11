import { writable } from 'svelte/store';

export const toast = writable({
    isOpen: false,
    message: '',
    description: '',
    type: 'info'
});

export function showToast(message: string, description: string, type: 'success' | 'error' | 'info' = 'info') {
    toast.set({ isOpen: true, message, description, type });
    setTimeout(() => {
        toast.set({ isOpen: false, message: '', description: '', type });
    }, 3000);
}