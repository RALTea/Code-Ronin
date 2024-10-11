<script lang="ts">
	import Card from "$lib/components/cards/Card.svelte";

  type InputProps = {
    value: string;
  };
  let { value = $bindable() }: InputProps = $props();
</script>

<Card class="p-4 pt-2 w-full">
  <h2 class="text-2xl font-bold mb-2">Input</h2>
  <textarea bind:value class="bg-bg-dark rounded-lg font-space-mono p-4 w-full h-48"></textarea>
</Card>