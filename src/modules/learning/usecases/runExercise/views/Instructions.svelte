<script lang="ts">
	import Card from '$lib/components/cards/Card.svelte';
	import SvelteMarkdown from 'svelte-markdown';

	type InstructionsProps = {
		instructions: string;
	};
	let { instructions }: InstructionsProps = $props();
</script>

<div class="course h-full">
	<Card class={'p-4 h-full overflow-auto'}>
		<SvelteMarkdown source={instructions} />
	</Card>
</div>

<style lang="postcss">
	.course :global(h1),
	.course :global(h2),
	.course :global(h3),
	.course :global(h4),
	.course :global(h5),
	.course :global(h6) {
		@apply font-space-mono;
	}

	.course :global(h1) {
		@apply text-primary-light text-3xl;
	}

	.course :global(p) {
	}
</style>
