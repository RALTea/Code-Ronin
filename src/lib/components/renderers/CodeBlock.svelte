<script lang="ts">
	import { Copy } from 'lucide-svelte';
	import IconWrapper from '../icons/IconWrapper.svelte';

	type Props = {
		text: string;
		lang: string;
	};
	const { text, lang }: Props = $props();
	let lastTimeCopied = $state(0);

	const addToClipboard = () => {
		navigator.clipboard.writeText(text);
		lastTimeCopied = Date.now();
		setTimeout(() => {
			lastTimeCopied = 0;
		}, 2000);
	};
</script>

<div class="relative">
	<pre class={`${lang}`}>{@render copyBtn()}<code>{text}</code></pre>
</div>

{#snippet copyBtn()}
	<button
		class="absolute top-2 right-2 text-primary-light h-8 min-w-8 bg-bg-dark flex items-center justify-center rounded-md border border-bg-light hover:bg-bg-medium"
		onclick={addToClipboard}
	>
		{#if Date.now() - lastTimeCopied < 1000}
			<p class="text-sm px-2">Copied</p>
		{:else}
			<IconWrapper size="4" className="flex">
				<Copy />
			</IconWrapper>
		{/if}
	</button>
{/snippet}
