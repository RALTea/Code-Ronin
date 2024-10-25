<script lang="ts">
	import type { Snippet } from 'svelte';

	type ErrorTextProps = {
		children: Snippet;
	};
	let { children }: ErrorTextProps = $props();
</script>

<span class="text-red-600 font-poppins-bold bottom-[50px] empty:hidden m-2">
	{@render children()}
</span>
