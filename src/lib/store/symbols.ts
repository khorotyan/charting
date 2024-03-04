import { writable } from 'svelte/store';
import type { Symbol } from '../models/symbol';
import { fetchSymbols } from '../services/symbolsService';

function createSymbolsStore() {
	const { subscribe, set } = writable<Symbol[]>([]);

	return {
		subscribe,
		initialize: async () => {
			try {
				const symbols = await fetchSymbols();
				set(symbols);
			} catch (error) {
				console.error('Failed to fetch symbols:', error);
				set([]);
			}
		}
	};
}

export const symbols = createSymbolsStore();
