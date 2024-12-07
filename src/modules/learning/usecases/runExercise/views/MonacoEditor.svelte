<script lang="ts">
	import { TaskStore } from '$learning/usecases/getProgression/stores/currentTask.svelte';
	import { hideEffect } from '$lib/utils/svelte.utils';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import { onDestroy, onMount } from 'svelte';

	type Props = {
		height?: number;
		value?: string;
	};
	let { height = 600, value = $bindable() }: Props = $props();
	$inspect('Monaco Value', value);
	$inspect('Monaco Current Task', TaskStore.currentTask);

	let editor: Monaco.editor.IStandaloneCodeEditor | undefined = undefined;
	let monaco: typeof Monaco | undefined;
	let theme: Monaco.editor.IStandaloneThemeData | undefined;
	let editorContainer: HTMLElement | undefined = $state();
	let initCompleted = $state(false);
	let observer: ResizeObserver | undefined;
	let isObserving = $state(false);

	onMount(async () => {
		monaco = (await import('$lib/monaco')).default;
		theme = (await import('./raltech-theme.json')) as Monaco.editor.IStandaloneThemeData;
		observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (!entry) return;
			initEditor();
			isObserving = true;
		});

		// initEditor();
		initCompleted = true;
	});

	onDestroy(() => {
		observer?.disconnect();
	});

	// Update the editor when the value changes
	$effect(() => {
		TaskStore.currentTask;
		hideEffect(() => {
			if (!monaco || !editor) return;
			monaco.editor.getModels().forEach((model) => {
				console.debug('Disposing model', model.uri.toString());
				try {
					model.dispose();
				} catch (e) {
					console.error('Error disposing model', e);
				}
			});
			const model = monaco.editor.createModel(value ?? 'console.log("Hello, world!")', 'typescript');
			if (!model) return;
			editor.setModel(model);
		})
	});

	$effect(() => {
		initCompleted;
		if (isObserving) return;
		if (!observer) return;
		observer.observe(editorContainer!);
	});

	$effect(() => {
		height;
		initCompleted;

		initEditor();
	});

	const initEditor = () => {
		if (!monaco || !theme || !editorContainer || !isObserving) {
			return;
		}
		console.debug('initEditor');

		monaco.editor.getModels().forEach((model) => {
			console.debug('Disposing model', model.uri.toString());
			model.dispose();
		});
		editor?.dispose();

		monaco.editor.defineTheme('monokai', theme as any);
		monaco.editor.setTheme('monokai');

		// Your monaco instance is ready, let's display some code!
		editor = monaco.editor.create(editorContainer, {
			fontSize: 14
		});

		hideEffect(() => {
			if (!editor) return;
			const model = monaco?.editor.createModel(
				$state.snapshot(value) ?? 'console.log("Hello, world!")',
				'typescript'
			);
			if (!model) return;
			editor.onDidChangeModelContent(() => {
				value = editor?.getValue();
			});
			editor.setModel(model);
		});
	};

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => {
			console.debug('Disposing model', model.uri.toString());
			model.dispose();
			console.error('Error disposing model', e);
		});
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
