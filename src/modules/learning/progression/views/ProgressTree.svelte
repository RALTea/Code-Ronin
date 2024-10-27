<script lang="ts">
	import Loading from '$lib/components/layout/Loading.svelte';
	import type { TaskTreeItem } from '../aggregate/TaskTreeItem';

	type Props = {
		items: Promise<TaskTreeItem[]>;
	};
	let { items }: Props = $props();
</script>

{#snippet bullet(task: TaskTreeItem)}
	<li class="">
    <a class="flex items-center gap-2 relative cursor-pointer" href="/campaigns/demo/{task.id}">
      <div class="absolute blur-md rounded-full z-20 {task.isCompleted ? 'bg-primary-light' : 'bg-light'} {task.isMiniboss ? 'h-7 w-7 mx-[.125rem]' : 'h-4 w-4 mx-2'}"></div>
      <div class="rounded-full z-10 shadow-black {task.isCompleted ? 'bg-primary-light' : 'bg-light'} {task.isMiniboss ? 'h-7 w-7 mx-[.125rem] shadow-[inset_0_0px_.5rem_0_rgb(0_0_0)]' : 'h-4 w-4 m-2 shadow-[inset_0_0px_.15rem_0_rgb(0_0_0)]'}"></div>
      <p class="font-space-mono">{task.name}</p>
      {#if task.nextTaskId}
        {@render path(task.isCompleted)}
      {/if}
    </a>
	</li>
{/snippet}

{#snippet path(isCompleted: boolean)}
	<div class="left-[1rem] -translate-x-1/2 top-1/2 h-20 {isCompleted ? 'bg-primary-light' : 'bg-light'} w-[.125rem] absolute z-0"></div>
{/snippet}

<nav
	class="bg-bg-dark w-40 row-span-2 my-4 rounded-lg shadow-[.0rem_.15rem_.2rem] shadow-lightless"
>
	{#await items}
		<Loading />
	{:then items}
		<ul class="space-y-12 py-8 p-4">
			{#each items as task}
				{@render bullet(task)}
			{/each}
		</ul>
	{:catch error}
		<p>{error.message}</p>
	{/await}
</nav>
