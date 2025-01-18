<script lang="ts">
	import { fly } from "svelte/transition";

	type Props = {
		raw: string;
	};
	const { raw }: Props = $props();

	const code = $derived(raw.replace(/`/g, ''));
	let modalVisible = $state(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(code);
		modalVisible = true;
		setTimeout(() => {
			modalVisible = false;
		}, 5000);
	};
</script>

<div class="inline relative">
	{#if modalVisible}
		<div
      transition:fly={{y: 10, duration: 200}}
			class="absolute bottom-full left-1/2 px-2 mb-2 rounded-md border border-bg-dark -translate-x-1/2 bg-bg-medium"
			class:hidden={!modalVisible}
		>
			Copied
		</div>
	{/if}
	<button class="text-left" onclick={copyToClipboard}>
		<code>{code}</code>
	</button>
</div>
