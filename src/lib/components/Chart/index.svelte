<script lang="ts">
	import { fetchData } from './utils/fetchData';
	import { browser } from '$app/environment';
	import { drawChart } from './utils/drawChart';
	import { onDestroy, onMount } from 'svelte';

	export let symbol: string;

	type CandlestickData = {
		date: Date;
		open: number;
		high: number;
		low: number;
		close: number;
		volume: number;
	};

	// TODO: get rid of magic numbers
	let startingIndex = 0;
	let selectedDataLength = 30;
	let data: CandlestickData[] = [];
	let selectedData: CandlestickData[] = [];

	// only make the fetch calls in the browser
	$: if (browser) {
		symbol && handleFetchData();
	}

	async function handleFetchData() {
		data = await fetchData(symbol);

		// show only 1/6th of data
		// TODO: Later fetch data again when reaching close to the edges of data
		selectedDataLength = Math.floor(data.length / 6);
		startingIndex = Math.ceil(5 * selectedDataLength);
		selectedData = data.slice(startingIndex);

		drawChart(selectedData);
	}

	let chartElement: HTMLDivElement;
	let isDragging = false;
	let startX = 0;

	function handleMouseDown(event) {
		isDragging = true;
		startX = event.clientX;
	}

	function handleMouseMove(event) {
		if (!isDragging) return;
		const difference = event.clientX - startX;
		startX = event.clientX;

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
		console.log('startingIndex', startingIndex);

		drawChart(selectedData);

		// TODO: throttle
	}

	function handleMouseUp() {
		if (!isDragging) return;
		isDragging = false;
	}

	onMount(() => {
		chartElement.addEventListener('mousedown', handleMouseDown);
		chartElement.addEventListener('mousemove', handleMouseMove);
		chartElement.addEventListener('mouseup', handleMouseUp);
	});

	onDestroy(() => {
		if (chartElement) {
			chartElement.removeEventListener('mousedown', handleMouseDown);
			chartElement.removeEventListener('mousemove', handleMouseMove);
			chartElement.removeEventListener('mouseup', handleMouseUp);
		}
	});
</script>

<div id="chart" bind:this={chartElement} class="chart">
	<p>Chart for <b>{symbol}</b></p>
</div>

<style lang="scss">
	@import 'index.scss';
</style>
