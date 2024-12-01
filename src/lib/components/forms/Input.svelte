<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

	type Props = {
		type?: HTMLInputTypeAttribute;
		placeholder?: string;
		name?: string;
		label?: string;
		maxlength?: number;
		required?: boolean;
		theme?: 'dark' | 'light';
		options?: HTMLInputAttributes;
		class?: string;
		oninput?: (value: string) => void;
	};

	let {
		type = 'text',
		placeholder = '',
		name = '',
		label = '',
		maxlength = 100,
		required = false,
		theme = 'dark',
		options = {},
		class: className = "",
		oninput
	}: Props = $props();

	const id = $state(name);
	const lightThemeClasses = 'border-2 border-black';

	function handleInput(event: Event) {
		console.log('event', event);
		oninput?.((event.target as HTMLInputElement).value);
	}
</script>

<div class="flex flex-col flex-1 {className}">
	<label for={id} class="block font-bold dark:text-zinc-300">
		{label}
	</label>
	<input
		{type}
		{name}
		{id}
		{placeholder}
		{maxlength}
		{required}
		{...options}
		oninput={handleInput}
		class="w-full px-4 py-2 text-black rounded-md focus-visible:outline-primary-dark {theme ===
		'light'
			? lightThemeClasses
			: ''}"
	/>
</div>
