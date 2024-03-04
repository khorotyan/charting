<script lang="ts">
	import { fetchData } from './utils/fetchData';
	import { browser } from '$app/environment';
	import { drawChart } from './utils/drawChart';
	import { onDestroy, onMount } from 'svelte';
	import type { CandlestickData } from './types';
	import { createDragHandler } from './utils/dragHandler';
	import OverlayLines from './OverlayLines.svelte';

	export let symbol: string;
	export let name: string;

	// only make the fetch calls in the browser
	$: if (browser) {
		symbol && handleFetchData();
	}

	onMount(() => {
		handleOnMount();
	});

	onDestroy(() => {
		handleOnDestroy();
	});

	// TODO: get rid of magic numbers
	// startingIndex can be saved alongside the symbol name in local storage
	// for the user to be able to come back to the same chart and then having reset button for resetting
	let startingIndex = 0;
	let selectedDataLength = 30;
	let data: CandlestickData[] = [];
	let selectedData: CandlestickData[] = [];
	let chartElement: HTMLDivElement;

	// mouse position for vertical and horizontal lines
	let mouseX = 0;
	let mouseY = 0;

	function setData(difference: number) {
		// do not let the user to scroll too much to the left or right
		let newStartingIndex = startingIndex - Math.ceil(difference / 3);
		let rightmostIndex = data.length - selectedDataLength / 3;
		if (newStartingIndex > rightmostIndex) {
			newStartingIndex = rightmostIndex;
		}
		if (newStartingIndex < 0) {
			newStartingIndex = 0;
		}

		let newLength = Math.min(startingIndex + selectedDataLength, data.length);
		selectedData = data.slice(newStartingIndex, newLength);
		startingIndex = newStartingIndex;

		drawChart(selectedData);

		// TODO: Throttling made the user experience bad by looking laggy
		// very lowers didn't like 20ms, however that won't change much for performance
		// the best solution is to use d3 capabilities to not clear and draw again but instead making changes to the existing chart
	}

	// Note: we can't directly pass chartElement
	// function called on mount to make sure we have the value before using
	const { handleOnMount, handleOnDestroy } = createDragHandler({
		getChartElement: () => chartElement,
		setData
	});

	async function handleFetchData() {
		data = await fetchData(symbol);

		// show only 1/6th of data
		// TODO: Later fetch data again when reaching close to the edges of data
		selectedDataLength = Math.floor(data.length / 6);
		startingIndex = Math.ceil(5 * selectedDataLength);
		selectedData = data.slice(startingIndex);

		drawChart(selectedData);
	}

	function handleMouseMove(event: MouseEvent) {
		const rect = chartElement.getBoundingClientRect();
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;
	}

	function handleMouseLeave() {
		mouseX = 0;
		mouseY = 0;
	}
</script>

<div
	id="chart"
	class="chart"
	role="presentation"
	tabindex="-1"
	bind:this={chartElement}
	on:mousemove={handleMouseMove}
	on:mouseleave={handleMouseLeave}
>
	<p>{name} (<b>{symbol}</b>) • 1D</p>
	<OverlayLines {mouseX} {mouseY} />
</div>

<style lang="scss">
	@import 'index.scss';
</style>
