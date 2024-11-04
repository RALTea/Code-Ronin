<script lang="ts">
	import IconChevronsLeft from '$lib/components/icons/IconChevronsLeft.svelte';
	import IconWrapper from '$lib/components/icons/IconWrapper.svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import type { TaskTreeItem } from '../aggregates/TaskTreeItem';
	import ProgressTreeItem from './ProgressTreeItem.svelte';

	type Props = {
		fetchItems: Promise<TaskTreeItem[]>;
	};
	let { fetchItems }: Props = $props();
	let treeItems: TaskTreeItem[] = $state([]);
	const maxWidth = 15; // rem
	const minWidth = 4; // rem

	let isCollapsed = $state(false);

	let navRef = $state<HTMLElement | undefined>(undefined);
	let currentWidth = tweened(maxWidth, { easing: cubicOut });
	let animating = $state(false);

	// Run each time the collapse state changes (i.e. when the toggle button is clicked)
	// The role of this effect is to update the width of the nav and the animation state
	$effect(() => {
		if (!navRef) return;
		isCollapsed;
		currentWidth.set(isCollapsed ? minWidth : maxWidth);
		currentWidth.subscribe((value) => {
			animating = value !== maxWidth;
		});
	});
	
	const toggleCollapse = () => {
		isCollapsed = !isCollapsed;
	};

	// Run each time the fetchItems prop changes
	// The role of this effect is to cache the fetched items, so the loading
	// skeleton is displayed only once (not shown on each navigation)
	$effect(() => {
		fetchItems
			.then((items) => {
				treeItems = items;
			})
			.catch(() => void 0); // Catch unauthorized error thrown from trpc when prerendering
	});

	// Pathes between Tasks states
	let treeElementsRefs: (HTMLLIElement | undefined)[] = $state([]);
	let treeElementsCenters: number[] = $derived.by(() =>
		treeElementsRefs.map((el) => {
			if (!el) return 0;
			const rect = el.getBoundingClientRect();
			return rect.top + rect.height / 2;
		})
	);

	// Skeleton data
	const fakeTasks: TaskTreeItem[] = [
		{ id: '1', name: '', nextTaskId: '2' },
		{ id: '2', name: '', nextTaskId: '3' },
		{ id: '3', name: '', nextTaskId: '4' },
		{ id: '4', name: '', nextTaskId: '5' },
		{ id: '5', name: '', nextTaskId: '6' },
		{ id: '6', name: '', nextTaskId: '7' },
		{ id: '7', name: '', nextTaskId: '8' },
		{ id: '8', name: '', nextTaskId: '9' },
		{ id: '9', name: '', nextTaskId: '10' },
		{ id: '10', name: '', nextTaskId: undefined }
	] as TaskTreeItem[];
</script>

{#snippet tree(treeItems: TaskTreeItem[])}
	{@const pulsing = treeItems.every((task) => task.name === '')}
	<ul class="p-4 py-8 space-y-12 {pulsing ? 'animate-pulse' : ''}">
		{#each treeItems as task, index}
			<ProgressTreeItem
				{task}
				{index}
				{animating}
				{isCollapsed}
				{treeElementsCenters}
				bind:refs={treeElementsRefs}
				isNextLocked={treeItems[index + 1]?.isLocked}
			/>
		{/each}
	</ul>
{/snippet}

<nav
	bind:this={navRef}
	style:width={`${$currentWidth}rem`}
	class="bg-bg-dark row-span-2 my-4 ml-4 rounded-lg shadow-[.0rem_.15rem_.2rem] shadow-lightless relative overflow-y-auto flex flex-col"
>
	{#if treeItems.length === 0}
		{#await fetchItems}
			<div class="opacity-50">
				{@render tree(fakeTasks)}
			</div>
		{:then items}
			{@render tree(items)}
		{:catch error}
			<p>{error.message}</p>
		{/await}
	{:else}
		{@render tree(treeItems)}
	{/if}

	<!-- Toggle collapse button -->
	<button
		class="mt-auto p-4 mr-auto {isCollapsed
			? 'rotate-180'
			: 'rotate-0'} transition-transform duration-300
		[&_svg]:stroke-lightless"
		onclick={toggleCollapse}
	>
		<IconWrapper size="8">
			<IconChevronsLeft />
		</IconWrapper>
	</button>
</nav>
