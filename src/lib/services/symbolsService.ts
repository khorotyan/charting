import type { Symbol } from '../models/symbol';

export async function fetchSymbols(): Promise<Symbol[]> {
	const token = import.meta.env.VITE_IEXCLOUD_PUBLIC_KEY;
	const url = `https://cloud.iexapis.com/stable/stock/market/list/mostactive?token=${token}&listLimit=30`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error('Failed to fetch symbols');
	}

	return await response.json();
}
