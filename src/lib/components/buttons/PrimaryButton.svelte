<script lang="ts">
	import type { Snippet } from 'svelte';

	type Type =
		| {
				onclick: () => void;
				buttonType?: 'button' | 'submit' | 'reset';
		  }
		| {
				href: string;
		  };

	type PrimaryButtonProps = {
		class?: string;
		children?: Snippet;
		variant?: 'primary' | 'outline';
		type: Type;
	};
	let {
		class: className,
		children,
		variant = 'primary',
		type: options = {
			onclick: () => {}
		}
	}: PrimaryButtonProps = $props();
</script>

{#if 'href' in options}
	<a
		href={options.href}
		class="font-space-mono rounded-md {variant === 'primary'
			? 'bg-bg-dark text-primary-light border-2 border-primary-light'
			: 'border border-zinc-800 hover:bg-zinc-900/50'} {className}"
	>
		{@render children?.()}
	</a>
{:else}
	<button
		onclick={options.onclick}
		type={options.buttonType}
		class="font-space-mono rounded-md {variant === 'primary'
			? 'bg-bg-dark text-primary-light border-2 border-primary-light'
			: 'border border-zinc-800 hover:bg-zinc-900/50'} {className}"
	>
		{@render children?.()}
	</button>
{/if}
