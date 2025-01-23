<script lang="ts">
	import "./syntax-highlighting.css";
	import SvelteMarkdown from 'svelte-markdown';
	import { fade } from 'svelte/transition';
	import highlight from 'highlight.js';
	import CodeBlock from '$lib/components/renderers/CodeBlock.svelte';
	import CodeInline from '$lib/components/renderers/CodeInline.svelte';

	type InstructionsProps = {
		instructions: string;
	};
	let { instructions }: InstructionsProps = $props();
	let contentWrapperRef: HTMLDivElement | undefined = $state(undefined);

	$effect(() => {
		if (!contentWrapperRef) return;
		const codeBlocks = contentWrapperRef.querySelectorAll<HTMLElement>('pre code');
		codeBlocks.forEach((block) => {
			highlight.highlightElement(block);
		});
	});
</script>

<div
	bind:this={contentWrapperRef}
	in:fade={{ duration: 150, delay: 150 }}
	class="course prose-li:marker:text-primary-light"
>
	<SvelteMarkdown source={instructions} renderers={{ code: CodeBlock as any, codespan: CodeInline as any }} />
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

	.course :global(:not(pre) > code) {
		@apply bg-bg-medium px-1 py-0.5 rounded-sm font-space-mono font-thin border border-bg-dark text-zinc-300;

		&::before,
		&::after {
			@apply hidden;
		}
	}
</style>
