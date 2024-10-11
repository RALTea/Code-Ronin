<script lang="ts">
	import type { Snippet } from "svelte";

	type PrimaryButtonProps = {
		onclick?: () => void;
		className?: string;
		children?: Snippet;
	};
	let { onclick, className, children }: PrimaryButtonProps = $props();
</script>

<button
	{onclick}
	class="font-space-mono bg-bg-dark text-primary-light border-2 border-primary-light rounded-md {className}"
>
	<!-- Insted of <slot /> -->
	{@render children?.()}
</button>
