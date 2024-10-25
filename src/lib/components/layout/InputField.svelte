<script lang="ts">
	import type { AddCss } from '$lib/utils/svelte.utils';
	import type { InputConstraint } from 'sveltekit-superforms';

	type InputFieldProps = {
		title: string;
		value: string;
		name: string;
		type: 'date' | 'text' | 'password' | 'radio' | 'checkbox';
		placeholder: string;
	} & AddCss &
		InputConstraint;

	let {
		title,
		value = $bindable(),
		name = '',
		type = 'text',
		placeholder = '',
		class: className = '',
		...props
	}: InputFieldProps = $props();

	const typeAction = (node: HTMLInputElement) => {
		node.type = type;
	};
</script>

<fieldset class="flex gap-1 flex-col">
	<p class="text-primary font-poppins-regular mt-2">{title}</p>
	<input
		use:typeAction
		{...props}
		{name}
		{placeholder}
		bind:value
		class="font-space-mono bg-bg-dark text-white p-2 border-2 border-lightless rounded w-full focus-visible:outline-none focus-visible:border-primary-medium {className}"
	/>
</fieldset>
