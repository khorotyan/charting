<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let symbol: string;

	type CandlestickData = {
		date: Date;
		open: number;
		high: number;
		low: number;
		close: number;
		volume: number;
	};

	let data: CandlestickData[] = [];

	onMount(() => {
		fetchData(symbol);
	});

	// TODO: Handle 'any' types
	async function fetchData(symbol: string): Promise<void> {
		const token = import.meta.env.VITE_IEXCLOUD_PUBLIC_KEY;
		const url = `https://cloud.iexapis.com/stable/stock/${symbol}/chart/6m?token=${token}`;

		try {
			const response = await fetch(url);
			const result = await response.json();

			// modify data to be in the right format
			data = result.map(
				(d: any): CandlestickData => ({
					date: new Date(d.date),
					open: d.open,
					high: d.high,
					low: d.low,
					close: d.close,
					volume: d.volume
				})
			);

			drawChart();
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	function drawChart(): void {
		const margin = { top: 20, right: 50, bottom: 70, left: 40 };
		const width = 800 - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;
		const volumeHeight = 80; // max height for volume bars

		// clear any previous chart
		d3.select('#chart').select('svg').remove();

		const svg = d3
			.select('#chart')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const xScale = d3
			.scaleBand()
			.domain(data.map((d) => d.date as unknown as string))
			.range([0, width])
			.padding(0.2);

		const yScale = d3
			.scaleLinear()
			.domain([
				d3.min(data, (d: CandlestickData) => d.low) ?? 0,
				d3.max(data, (d: CandlestickData) => d.high) ?? 0
			])
			.range([height, 0]);

		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(xScale as any).tickFormat(d3.timeFormat('%Y-%m-%d') as any));

		svg.append('g').call(d3.axisLeft(yScale));

		// draw candlesticks
		data.forEach((d) => {
			const x = xScale(d.date as unknown as string) ?? 0;
			const barWidth = xScale.bandwidth();
			svg
				.append('line') // high-low line
				.attr('x1', x + barWidth / 2)
				.attr('x2', x + barWidth / 2)
				.attr('y1', yScale(d.high))
				.attr('y2', yScale(d.low))
				.attr('stroke', d.close > d.open ? '#26a69a' : '#ef5350');

			svg
				.append('rect') // open-close rectangle
				.attr('x', x)
				.attr('width', barWidth)
				.attr('y', yScale(Math.max(d.open, d.close)))
				.attr('height', Math.abs(yScale(d.open) - yScale(d.close)))
				.attr('fill', d.close > d.open ? '#26a69a' : '#ef5350');
		});

		// draw volume bars
		const volumeScale = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.volume) ?? 0])
			.range([height, height - volumeHeight])
			.clamp(true);

		data.forEach((d) => {
			const volumeValue = d.volume > 0 ? d.volume : 1;
			const barHeight = height - volumeScale(volumeValue);

			svg
				.append('rect')
				.attr('x', xScale(d.date as unknown as string) ?? 0)
				.attr('width', xScale.bandwidth())
				.attr('y', height - barHeight)
				.attr('height', barHeight)
				.attr('fill', d.close > d.open ? '#26a69a' : '#ef5350')
				.attr('fill-opacity', 0.5);
		});
	}
</script>

<div id="chart" class="chart">
	<h2>Chart for {symbol}</h2>
</div>

<style lang="scss">
	@import 'index.scss';
</style>
