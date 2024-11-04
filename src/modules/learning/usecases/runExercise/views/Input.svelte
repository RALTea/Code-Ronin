<script lang="ts">
	import PrimaryButton from "$lib/components/buttons/PrimaryButton.svelte";
	import Card from "$lib/components/cards/Card.svelte";
	import { onMount } from "svelte";
	import MonacoEditor from "./MonacoEditor.svelte";

  type InputProps = {
    value: string;
    runCode: () => void;
  };
  let { value = $bindable(), runCode }: InputProps = $props();
  let card: HTMLElement | null = null;
  let cardHeight: number = $state(600);

  onMount(() => {
    setSize();
  });

  const setSize = () => {
    card = document.getElementById("input") as HTMLElement | null;
    if (!card) {
      throw new Error("Card not found");
    }
    cardHeight = card.clientHeight;
  }
</script>

<svelte:window on:resize={setSize} />
<Card class="p-4 pt-2 w-full row-span-1 h-full flex flex-col">
  <header class="flex justify-between mb-4 mt-2 items-center">
    <h2 class="text-2xl font-bold font-space-mono h-fit">Editor</h2>
    <PrimaryButton className="px-8 py-2 " onclick={runCode}>Run code</PrimaryButton>
  </header>
  <div id="input" class="flex-1 rounded-lg min-h-0">
    <!-- <textarea bind:value class="flex-1 bg-purple-400 rounded-lg font-space-mono p-4 w-full h-48"></textarea> -->
    <MonacoEditor height={cardHeight} bind:value={value} />
  </div>
</Card>