import { writable } from 'svelte/store';

// Create a store that persists to sessionStorage
function createPersistentStore(key: string, defaultValue: string | null = null) {
	// Get initial value from sessionStorage if available
	const storedValue = typeof window !== 'undefined' ? sessionStorage.getItem(key) : null;
	const initialValue = storedValue ? storedValue : defaultValue;
	
	const store = writable<string | null>(initialValue);
	
	// Subscribe to store changes and update sessionStorage
	if (typeof window !== 'undefined') {
		store.subscribe(value => {
			if (value === null) {
				sessionStorage.removeItem(key);
			} else {
				sessionStorage.setItem(key, value);
			}
		});
	}
	
	return store;
}

export const prefillContentOnce = createPersistentStore('prefillContentOnce', null);
