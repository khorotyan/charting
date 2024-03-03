interface CreateDragHandlerOptions {
	setData: (difference: number) => void;
	getChartElement: () => HTMLDivElement;
}

export function createDragHandler({ getChartElement, setData }: CreateDragHandlerOptions) {
	let isDragging = false;
	let startX = 0;
	let chartElement: HTMLDivElement;

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		startX = event.clientX;
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging) return;

		const difference = event.clientX - startX;
		startX = event.clientX;

		setData(difference);
	}

	function handleMouseUp() {
		if (!isDragging) return;
		isDragging = false;
	}

	function handleOnMount() {
		chartElement = getChartElement();
		chartElement.addEventListener('mousedown', handleMouseDown);
		chartElement.addEventListener('mousemove', handleMouseMove);
		chartElement.addEventListener('mouseup', handleMouseUp);
	}

	function handleOnDestroy() {
		if (chartElement) {
			chartElement.removeEventListener('mousedown', handleMouseDown);
			chartElement.removeEventListener('mousemove', handleMouseMove);
			chartElement.removeEventListener('mouseup', handleMouseUp);
		}
	}

	return { handleOnMount, handleOnDestroy };
}
