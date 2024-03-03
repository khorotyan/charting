import type { CandlestickData } from '../types';

// TODO: create fetch functions for stocks, forex, crypto, ... and pass 'type' to fetchData to understand which one is called
// TODO: Remove 'any' types
export async function fetchData(symbol: string): Promise<CandlestickData[]> {
	const token = import.meta.env.VITE_IEXCLOUD_PUBLIC_KEY;
	const url = `https://cloud.iexapis.com/stable/stock/${symbol}/chart/36m?token=${token}`;

	try {
		const response = await fetch(url);
		const result = await response.json();

		// modify data to be in the right format
		return result.map(
			(d: any): CandlestickData => ({
				date: new Date(d.date),
				open: d.open,
				high: d.high,
				low: d.low,
				close: d.close,
				volume: d.volume
			})
		);
	} catch (error) {
		console.error('Error fetching data:', error);
		return [];
	}
}
