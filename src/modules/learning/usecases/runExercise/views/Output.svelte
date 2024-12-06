<script lang="ts">
	import PrimaryButton from '$lib/components/buttons/PrimaryButton.svelte';
	import Card from '$lib/components/cards/Card.svelte';

	type Mode = 'Simplified' | 'Full';
	type OutputProps = {
		message?: string;
		mode: Mode;
	};
	let { message, mode = $bindable() }: OutputProps = $props();

	const toggleMode = () => {
		const newMode = mode === 'Simplified' ? 'Full' : 'Simplified';
		mode = newMode;
		localStorage.setItem('outputMode', newMode);
	};
</script>

<Card class="p-4 pt-2 w-full row-span-1 h-full flex flex-col">
	<div class="flex justify-between items-center mb-4 mt-2">
		<h2 class="text-2xl font-bold font-space-mono">Output</h2>
		<PrimaryButton class="py-2 px-4 flex" onclick={toggleMode}>
			<span>Mode:</span>
			<span> {mode}</span>
		</PrimaryButton>
	</div>

	{#if message}
		<pre class="flex-1 bg-bg-dark rounded-lg font-space-mono p-4 overflow-auto">{message}</pre>
	{:else}
		<p class="flex-1 bg-bg-dark rounded-lg font-jetbrains-mono p-4">
			Run your code and get the output here
		</p>
	{/if}
</Card>
