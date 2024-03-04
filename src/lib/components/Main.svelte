<script lang="ts">
	import SymbolsList from './SymbolsList/index.svelte';
	import Chart from './Chart/index.svelte';
	import { symbols } from '$lib/store/symbols';
	import { selectedSymbol } from '$lib/store/selectedSymbol';
	import { onMount } from 'svelte';

	onMount(async () => {
		try {
			await symbols.initialize();
			selectedSymbol.set($symbols[0]);
		} catch (err) {
			console.log(err);
		}
	});
</script>

<div class="main">
	<main class="main__chart-container">
		{#if $selectedSymbol}
			<Chart symbol={$selectedSymbol.symbol} name={$selectedSymbol.companyName} />
		{/if}
	</main>
	<aside class="main__symbols-container">
		<SymbolsList />
	</aside>
</div>

<style lang="scss">
	@import 'main.scss';
</style>
