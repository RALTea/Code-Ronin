<script lang="ts">
	import { page } from '$app/stores';
	import type { TaskTreeItem } from '$learning/progression/aggregate/TaskTreeItem';
	import { getProgressionUseCase } from '$learning/progression/getProgressionUseCase';
	import ProgressTree from '$learning/progression/views/ProgressTree.svelte';
	import { TaskStore } from '$learning/stores/currentTask.svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { onMount, type Snippet } from 'svelte';

	let fetchTaskTreeItems: Promise<TaskTreeItem[]> = $state(Promise.resolve([] as TaskTreeItem[]));

	type Props = { children: Snippet };
	let { children }: Props = $props();
  let currentTaskId = $derived($page.params.id);

	onMount(() => {
		const unsubscribe = page.subscribe(({params}) => {
			const taskId = params.task;
			console.debug('updating current task from subscribe', taskId);
      const taskToLoad = TaskStore.allTasks.find((task) => task.id === taskId);
			TaskStore.currentTask = taskToLoad;
		});
		fetchTaskTreeItems = getProgressionUseCase({
			getUnorderedTasks: async () => {
				return [
					{
						id: '1',
						name: 'Task 1',
						exp: 1,
						instructions: '# Task nb 1\n\n## Do Something',
						isMiniboss: true,
						nextTaskId: '2',
						isLocked: false,
						isCompleted: true
					},
					{
						id: '2',
						name: 'Task 2',
						exp: 1,
						instructions: '# Task nb 2\n\n## Do Something',
						isMiniboss: false,
						nextTaskId: '3',
						isLocked: true,
						isCompleted: false
					},
					{
						id: '3',
						name: 'Task 3',
						exp: 1,
						instructions: '# Task nb 3\n\n## Do Something',
						isMiniboss: false,
						nextTaskId: undefined,
						isLocked: true,
						isCompleted: false
					}
				];
			}
		})
			.execute()
			.then((res) => {
        // Do not reassign the array, otherwise the proxy will be lost
        TaskStore.allTasks.push(...res as TaskTreeItem[]); 
				return res as TaskTreeItem[];
			});
		return unsubscribe;
	});
</script>

<div class="h-screen max-h-screen grid grid-rows-[auto_1fr] grid-cols-[auto_1fr]">
	<ProgressTree items={fetchTaskTreeItems} />
	<Navbar class="row-auto" />
  {@render children()}
</div>
