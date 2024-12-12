<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import type { TaskTreeItem } from '../aggregates/TaskTreeItem';

	type Props = {
		task: TaskTreeItem;
		index: number;
		refs: (HTMLLIElement | undefined)[];
		isCollapsed: boolean;
		animating: boolean;
		isNextLocked: boolean;
		treeElementsCenters: number[];
	};

	let {
		task,
		index,
		refs = $bindable(),
		isCollapsed,
		animating,
		isNextLocked,
		treeElementsCenters
	}: Props = $props();
</script>

<li bind:this={refs[index]} class="min-h-12 max-h-12">
	<a
		class="flex items-center gap-2 relative cursor-pointer {task.isLocked
			? 'cursor-not-allowed'
			: 'cursor-pointer'}"
		href={task.isLocked
			? 'javascript:void(0)'
			: `/campaigns/${$page.params.campaign}/${$page.params.questId}/${task.id}`}
	>
		<div
			class="absolute self-start blur-md rounded-full z-20 {task.isCompleted
				? 'bg-primary-light'
				: 'bg-light'} {task.isMiniboss ? 'h-7 w-7 mx-[.125rem]' : 'h-4 w-4 min-w-4 m-2'}"
		></div>
		<div
			class="rounded-full self-start z-10 shadow-black {task.isCompleted
				? 'bg-primary-light'
				: 'bg-light'} {task.isMiniboss
				? 'h-7 w-7 mx-[.125rem] shadow-[inset_0_0px_.5rem_0_rgb(0_0_0)]'
				: 'h-4 w-4 min-w-4 m-2 shadow-[inset_0_0px_.15rem_0_rgb(0_0_0)]'}"
		></div>
		{#if task.name && !isCollapsed && !animating}
			<p
				in:fade={{ delay: 100 }}
				class="font-space-mono line-clamp-2 text-ellipsis {task.isLocked
					? 'text-opacity-60 text-light'
					: ''}"
			>
				{task.name}
			</p>
		{:else if task.name === ''}
			<div class="flex flex-col w-full gap-2">
				<p class="w-full bg-light">.</p>
			</div>
		{/if}
		{#if task.nextTaskId}
			{@render path(task.isCompleted, index, isNextLocked, task.name === '')}
		{/if}
	</a>
</li>

{#snippet path(isCompleted: boolean, index: number, isNextLocked: boolean, isSkelleton = false)}
	{@const height = isSkelleton
		? '5.5rem'
		: `${treeElementsCenters[index + 1] - treeElementsCenters[index]}px`}
	<div
		class="left-[1rem] -translate-x-1/2 top-1/2 {isCompleted
			? 'bg-primary-light'
			: 'bg-light'} w-[.125rem] absolute z-0
			{isNextLocked ? 'bg-gradient-to-b from-light to-transparent' : ''}"
		style="height: {height}"
	></div>
{/snippet}
