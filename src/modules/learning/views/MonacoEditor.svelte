<script lang="ts">
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import { onDestroy, onMount } from 'svelte';

	type Props = {
		height?: number;
		value?: string;
	};
	let { height = 600, value = $bindable() }: Props = $props();

	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco | undefined;
	let theme: Monaco.editor.IStandaloneThemeData | undefined;
	let editorContainer: HTMLElement | undefined = $state();
	let initCompleted = $state(false);

	onMount(async () => {
		monaco = (await import('$lib/monaco')).default;
		theme = (await import('./raltech-theme.json')) as Monaco.editor.IStandaloneThemeData;
		console.debug('Mounting Monaco');
		initEditor();
		initCompleted = true;
	});

	$effect(() => {
		height = height || 600;
		initCompleted;
		initEditor();
	});

	const initEditor = () => {
		if (!monaco || !theme || !editorContainer) {
			return;
		}

		monaco.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();

		console.debug('Effect Monaco');
		monaco.editor.defineTheme('monokai', theme as any);
		monaco.editor.setTheme('monokai');

		// Your monaco instance is ready, let's display some code!
		editor = monaco.editor.create(editorContainer, {
			fontSize: 14
		});
		const model = monaco.editor.createModel(value ?? 'console.log("Hello, world!")', 'typescript');
		editor.setModel(model);
		editor.onDidChangeModelContent(() => {
			value = editor.getValue();
		});
	};

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();
	});

	const roundedClass = 'rounded-lg [&>div]:rounded-lg [&>div>div]:rounded-lg';
</script>

<div class="h-full">
	{#if !initCompleted}
		<div class="w-full h-full bg-bg-dark rounded-lg p-4">Loading...</div>
	{:else}
		<div
			class="container rounded-lg {roundedClass}"
			style="height: {height}px;"
			bind:this={editorContainer}
		></div>
	{/if}
</div>

<style lang="postcss">
	.container {
		width: 100%;
	}
</style>
