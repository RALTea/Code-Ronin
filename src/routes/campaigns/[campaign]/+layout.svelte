<script lang="ts">
	import { page } from '$app/stores';
	import type { TaskTreeItem } from '$learning/usecases/getProgression/aggregate/TaskTreeItem';
	import { getProgressionUseCase } from '$learning/usecases/getProgression/getProgressionUseCase';
	import ProgressTree from '$learning/usecases/getProgression/views/ProgressTree.svelte';
	import { TaskStore } from '$learning/usecases/getProgression/stores/currentTask.svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { onMount, type Snippet } from 'svelte';

	let fetchTaskTreeItems: Promise<TaskTreeItem[]> = $state(Promise.resolve([] as TaskTreeItem[]));

	type Props = { children: Snippet };
	let { children }: Props = $props();

	onMount(() => {
		const unsubscribe = page.subscribe(({params}) => {
			const taskId = params.task;
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
						instructions: '# Print Alphabet\n\nCreate function "printAlphabet" that prints the alphabet',
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
