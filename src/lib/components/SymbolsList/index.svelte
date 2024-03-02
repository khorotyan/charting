<script lang="ts">
	export let symbols: { symbol: string; name: string }[] = [];
	export let selectSymbol: (symbol: string) => void;
</script>

<div class="symbols-list">
	<ul class="symbols-list__list">
		{#each symbols as { symbol }}
			<li class="symbols-list__item">
				<button class="symbols-list__button" on:click={() => selectSymbol(symbol)}>{symbol}</button>
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	@import 'index.scss';
</style>
