<script lang="ts">
	import type { TaskTreeItem } from '../aggregates/TaskTreeItem';

	type Props = {
		fetchItems: Promise<TaskTreeItem[]>;
	};
	let { fetchItems }: Props = $props();
	let treeItems: TaskTreeItem[] = $state([]);

	// Run each time the fetchItems prop changes
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

{#snippet bullet(task: TaskTreeItem, index: number, isNextLocked: boolean)}
	<li bind:this={treeElementsRefs[index]}>
		<a
			class="flex items-center gap-2 relative cursor-pointer {task.isLocked
				? 'cursor-not-allowed'
				: 'cursor-pointer'}"
			href={task.isLocked ? 'javascript:void(0)' : task.id}
		>
			<div
				class="absolute blur-md rounded-full z-20 {task.isCompleted
					? 'bg-primary-light'
					: 'bg-light'} {task.isMiniboss ? 'h-7 w-7 mx-[.125rem]' : 'h-4 w-4 min-w-4 mx-2'}"
			></div>
			<div
				class="rounded-full z-10 shadow-black {task.isCompleted
					? 'bg-primary-light'
					: 'bg-light'} {task.isMiniboss
					? 'h-7 w-7 mx-[.125rem] shadow-[inset_0_0px_.5rem_0_rgb(0_0_0)]'
					: 'h-4 w-4 min-w-4 m-2 shadow-[inset_0_0px_.15rem_0_rgb(0_0_0)]'}"
			></div>
			{#if task.name}
				<p class="font-space-mono {task.isLocked ? 'text-opacity-60 text-light' : ''}">
					{task.name}
				</p>
			{:else}
				<div class="flex flex-col w-full gap-2">
					<p class="w-full bg-light">.</p>
					<!-- <p class="w-full bg-light">.</p> -->
				</div>
			{/if}
			{#if task.nextTaskId}
				{@render path(task.isCompleted, index, isNextLocked, task.name === '')}
			{/if}
		</a>
	</li>
{/snippet}

{#snippet path(isCompleted: boolean, index: number, isNextLocked: boolean, isSkelleton = false)}
	{@const height = isSkelleton
		? '4.5rem'
		: `${treeElementsCenters[index + 1] - treeElementsCenters[index]}px`}
	<div
		class="left-[1rem] -translate-x-1/2 top-1/2 {isCompleted
			? 'bg-primary-light'
			: 'bg-light'} w-[.125rem] absolute z-0
			{isNextLocked ? 'bg-gradient-to-b from-light to-transparent' : ''}"
		style="height: {height}"
	></div>
{/snippet}

<nav
	class="bg-bg-dark w-60 row-span-2 my-4 rounded-lg shadow-[.0rem_.15rem_.2rem] shadow-lightless relative overflow-y-auto"
>
	{#if treeItems.length === 0}
		{#await fetchItems}
			<!-- <Loading absolute/> -->
			<div class="opacity-50">
				<ul class="space-y-12 py-8 p-4 animate-pulse">
					{#each fakeTasks as task, index}
						{@render bullet(task, index, fakeTasks[index + 1]?.isLocked)}
					{/each}
				</ul>
			</div>
		{:then items}
			<ul class="space-y-12 py-8 p-4">
				{#each items as task, index}
					{@render bullet(task, index, items[index + 1]?.isLocked)}
				{/each}
			</ul>
		{:catch error}
			<p>{error.message}</p>
		{/await}
	{:else}
		<ul class="space-y-12 py-8 p-4">
			{#each treeItems as task, index}
				{@render bullet(task, index, treeItems[index + 1]?.isLocked)}
			{/each}
		</ul>
	{/if}
</nav>
