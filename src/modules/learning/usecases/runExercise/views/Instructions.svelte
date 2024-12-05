<script lang="ts">
	import "./syntax-highlighting.css";
	import SvelteMarkdown from 'svelte-markdown';
	import { fade } from 'svelte/transition';
	import highlight from 'highlight.js';

	type InstructionsProps = {
		instructions: string;
	};
	let { instructions }: InstructionsProps = $props();
	let contentWrapperRef: HTMLDivElement | undefined = $state(undefined);

	$effect(() => {
		if (!contentWrapperRef) return;
		const codeBlocks = contentWrapperRef.querySelectorAll<HTMLElement>('pre code');
		codeBlocks.forEach((block) => {
			highlight.highlightBlock(block);
		});
	});
</script>

<div
	bind:this={contentWrapperRef}
	in:fade={{ duration: 150, delay: 150 }}
	class="course prose-li:marker:text-primary-light"
>
	<SvelteMarkdown source={instructions} />
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
