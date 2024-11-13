<script lang="ts">
	import type { Snippet } from 'svelte';

	type PrimaryButtonProps = {
		onclick?: () => void;
		className?: string;
		children?: Snippet;
		variant?: 'primary' | 'outline';
	};
	let { onclick, className, children, variant = 'primary' }: PrimaryButtonProps = $props();
</script>

<button
	{onclick}
	class="font-space-mono rounded-md {variant === 'primary' ? 'bg-bg-dark text-primary-light border-2 border-primary-light' : 'border border-zinc-800 hover:bg-zinc-900/50'} {className}"
>
	{@render children?.()}
</button>
