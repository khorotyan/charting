<script lang="ts">
	import SymbolsList from './SymbolsList/index.svelte';
	import Chart from './Chart/index.svelte';

	let symbols = [
		{ symbol: 'AAPL', name: 'Apple Inc.' },
		{ symbol: 'TSLA', name: 'Tesla Inc.' },
		{ symbol: 'NFLX', name: 'Netflix Inc.' },
		{ symbol: 'BTCUSD', name: 'Bitcoin / U.S. Dollar' }
	];

	let selectedSymbol = 'AAPL';

	function handleSymbolSelection(symbol: string) {
		selectedSymbol = symbol;
	}
</script>

<div class="main">
	<main class="main__chart-container">
		<Chart symbol={selectedSymbol} />
	</main>
	<aside class="main__symbols-container">
		<SymbolsList {symbols} selectSymbol={handleSymbolSelection} />
	</aside>
</div>

<style lang="scss">
	@import 'main.scss';
</style>
