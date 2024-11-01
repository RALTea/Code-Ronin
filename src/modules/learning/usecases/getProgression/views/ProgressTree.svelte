<script lang="ts">
	import Loading from '$lib/components/layout/Loading.svelte';
	import type { TaskTreeItem } from '../aggregates/TaskTreeItem';

	type Props = {
		fetchItems: Promise<TaskTreeItem[]>;
	};
	let { fetchItems }: Props = $props();
	let treeElements: (HTMLLIElement | undefined)[] = $state([]);
	let treeElementsCenters: number[] = $derived.by(() =>
		treeElements.map((el) => {
			if (!el) return 0;
			const rect = el.getBoundingClientRect();
			return rect.top + rect.height / 2;
		})
	);
</script>

{#snippet bullet(task: TaskTreeItem, index: number, isNextLocked: boolean)}
	<li bind:this={treeElements[index]}>
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
			<p class="font-space-mono {task.isLocked ? 'text-opacity-60 text-light' : ''}">{task.name}</p>
			{#if task.nextTaskId}
				{@render path(task.isCompleted, index, isNextLocked)}
			{/if}
		</a>
	</li>
{/snippet}

{#snippet path(isCompleted: boolean, index: number, isNextLocked: boolean)}
	<div
		class="left-[1rem] -translate-x-1/2 top-1/2 {isCompleted
			? 'bg-primary-light'
			: 'bg-light'} w-[.125rem] absolute z-0
			{isNextLocked ? 'bg-gradient-to-b from-light to-transparent' : ''}"
		style="height: {treeElementsCenters[index + 1] - treeElementsCenters[index]}px"
	></div>
{/snippet}

<nav
	class="bg-bg-dark w-60 row-span-2 my-4 rounded-lg shadow-[.0rem_.15rem_.2rem] shadow-lightless"
>
	{#await fetchItems}
		<Loading />
	{:then items}
		<ul class="space-y-12 py-8 p-4">
			{#each items as task, index}
				{@render bullet(task, index, items[index + 1]?.isLocked)}
			{/each}
		</ul>
	{:catch error}
		<p>{error.message}</p>
	{/await}
</nav>
