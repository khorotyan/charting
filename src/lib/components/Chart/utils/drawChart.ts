import * as d3 from 'd3';
import type { CandlestickData } from '../types';

// TODO: Remove 'any' types and handle incorrect type assertions
export function drawChart(data: CandlestickData[]): void {
	const margin = { top: 20, right: 50, bottom: 70, left: 40 };
	const width = 1000 - margin.left - margin.right;
	const height = 500 - margin.top - margin.bottom;
	const volumeHeight = 80; // max height for volume bars

	// clear any previous chart
	d3.select('#chart').select('svg.main-chart').remove();

	const svg = d3
		.select('#chart')
		.append('svg')
		.attr('class', 'main-chart')
		.style('position', 'absolute')
		.style('top', '0')
		.style('left', '0')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);

	const xScale = d3
		.scaleBand()
		.domain(data.map((d) => d.date as unknown as string))
		.range([0, width])
		.padding(0.2);

	// calculate 'y' range and extend it by 12% on both sides
	const minYValue = d3.min(data, (d: CandlestickData) => d.low) ?? 0;
	const maxYValue = d3.max(data, (d: CandlestickData) => d.high) ?? 0;
	const range = maxYValue - minYValue;
	const yPadding = range * 0.12;
	const extendedMinYValue = minYValue - yPadding;
	const extendedMaxYValue = maxYValue + yPadding;

	const yScale = d3.scaleLinear().domain([extendedMinYValue, extendedMaxYValue]).range([height, 0]);

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
