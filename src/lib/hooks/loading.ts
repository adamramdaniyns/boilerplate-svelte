import { writable } from "svelte/store";

export const isLoading = writable(false);
export const messageLoading = writable('');

function setLoading(loading: boolean, message: string = '') {
    isLoading.set(loading);
    messageLoading.set(message);
}

export { setLoading };