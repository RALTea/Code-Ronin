<script lang="ts">
	import Card from '$lib/components/cards/Card.svelte';

  type OutputProps = {
    stdout?: string;
    stderr?: string;
  };
  let { stdout, stderr }: OutputProps = $props();
</script>

<Card class="p-4 pt-2 w-full">
	<h2 class="text-2xl font-bold mb-2">Output</h2>
	{#if stdout || stderr}
		<pre class="bg-bg-dark rounded-lg font-space-mono p-4">{stdout || stderr}</pre>
	{:else}
		<p class="bg-bg-dark rounded-lg font-space-mono p-4">Run your code and get the output here</p>
	{/if}
</Card>
