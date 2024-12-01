<script lang="ts">
	type Props = {
		label: string;
		name: string;
		required?: boolean;
		value?: string;
		oninput?: (value: string) => void;
		class?: string;
	};

	let {
		label,
		name,
		required = false,
		value = '',
		oninput,
		class: className = ''
	}: Props = $props();
</script>

<div class="flex flex-col flex-1 {className}">
	<label for={name} class="block font-bold dark:text-zinc-300">
		{label}
	</label>
	<textarea
		{name}
		{required}
		oninput={(event) => oninput?.((event.target as HTMLTextAreaElement).value)}
		class="w-full px-4 py-2 text-black rounded-md focus-visible:outline-primary-dark"
	>{value}</textarea>
</div>
