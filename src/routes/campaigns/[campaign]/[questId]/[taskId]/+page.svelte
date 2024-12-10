<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { TaskTreeItem } from '$learning/usecases/getProgression/aggregates/TaskTreeItem';
	import { TaskStore } from '$learning/usecases/getProgression/stores/currentTask.svelte';
	import type { TaskDetails } from '$learning/usecases/getTaskDetails/aggregates/TaskDetails';
	import { getTaskDetails } from '$learning/usecases/getTaskDetails/getTaskDetails';
	import ExercisePage from '$learning/views/ExercisePage.svelte';
	import { trpc } from '$lib/clients/trpc';

	let currentTask: Promise<(TaskTreeItem & TaskDetails) | undefined> = $state(
		(async () => undefined)()
	);

	$effect(() => {
		const currentTaskId = $page.params.taskId;
		const taskToLoad = TaskStore.allTasks?.find((task) => task?.id === currentTaskId);
		TaskStore.currentTask = taskToLoad;
		if (!taskToLoad) return undefined;
		currentTask = getTaskDetails({
			getTaskDetails: async () => {
				return trpc($page).learning.getTaskDetails.getTaskDetails.query({ taskId: taskToLoad.id });
			}
		})
			.execute({ taskId: currentTaskId })
			.then((res) => {
				if (!res.isSuccess) return undefined;
				return { ...taskToLoad, ...res.data };
			});
	});

	// Run each time the current task changes to check if it is locked
	$effect(() => {
		currentTask.then((task) => {
			if (!task) return;
			if (!task.isLocked) return;
			console.info('Task is locked, redirecting to previous task');
			goto(`/campaigns/${$page.params.campaign}/${$page.params.questId}`);
		});
	});
</script>

{#if currentTask}
	<ExercisePage fetchTask={currentTask} />
{:else}
	<p class="p-4">No Task</p>
{/if}
