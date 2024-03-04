<script lang="ts">
	import { symbols } from '$lib/store/symbols';
	import { selectedSymbol } from '$lib/store/selectedSymbol';
	import type { Symbol } from '$lib/models/symbol';

	function selectSymbol(item: Symbol) {
		selectedSymbol.set(item);
	}
</script>

<div class="symbols-list">
	<div class="symbols-list__header">
		<span>Symbol</span>
		<span>Last</span>
		<span>Chg</span>
		<span>Chg%</span>
	</div>
	<ul class="symbols-list__list">
		{#each $symbols as item}
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li
				class="symbols-list__item {item.change >= 0 ? 'positive' : 'negative'}"
				on:click={() => selectSymbol(item)}
			>
				<span>{item.symbol}</span>
				<span>{item.latestPrice}</span>
				<span>{item.change.toFixed(2)}</span>
				<span>{(item.changePercent * 100).toFixed(2)}%</span>
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	@import 'index.scss';
</style>
