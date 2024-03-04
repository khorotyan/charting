<script lang="ts">
	export let mouseX = 0;
	export let mouseY = 0;
</script>

{#if mouseX && mouseY}
	<svg width="100%" height="100%">
		<line x1="0" y1={mouseY} x2="100%" y2={mouseY} stroke="grey" stroke-dasharray="5,5" />
		<line x1={mouseX} y1="0" x2={mouseX} y2="100%" stroke="grey" stroke-dasharray="5,5" />
	</svg>
{/if}
