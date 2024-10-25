<script lang="ts">
	import PrimaryButton from '$lib/components/buttons/PrimaryButton.svelte';
	import Card from '$lib/components/cards/Card.svelte';

	type InputProps = {
		value: string;
		runCode: () => void;
	};
	let { value = $bindable(), runCode }: InputProps = $props();
</script>

<Card class="p-4 pt-2 w-full row-span-1 h-full flex flex-col">
	<header class="flex justify-between mb-4 items-center">
		<h2 class="text-2xl font-bold font-space-mono h-fit">Editor</h2>
		<PrimaryButton className="px-8 py-2 " onclick={runCode}>Run code</PrimaryButton>
	</header>
	<textarea bind:value class="flex-1 bg-bg-dark rounded-lg font-space-mono p-4 w-full h-48"
	></textarea>
</Card>
