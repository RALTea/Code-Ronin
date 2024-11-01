<script lang="ts">
	import { page } from '$app/stores';
	import { TaskStore } from '$learning/usecases/getProgression/stores/currentTask.svelte';
	import type { TaskDetails } from '$learning/usecases/getTaskDetails/aggregates/TaskDetails';
	import { getTaskDetails } from '$learning/usecases/getTaskDetails/getTaskDetails';
	import ExercisePage from '$learning/views/ExercisePage.svelte';
	import { trpc } from '$lib/clients/trpc';

	let currentTask: Promise<TaskDetails | undefined> = $derived.by(async () => {
		const currentTaskId = $page.params.taskId;
		const taskToLoad = TaskStore.allTasks.find((task) => task.id === currentTaskId);
		TaskStore.currentTask = taskToLoad;
		if (!taskToLoad) return undefined;
		const res = await getTaskDetails({
			getTaskDetails: async () => {
				return trpc($page).learning.getTaskDetails.getTaskDetails.query({ taskId: taskToLoad.id });
			}
		}).execute({ taskId: currentTaskId });
		if (!res.isSuccess) return undefined;
		return res.data;
	});
</script>

{#if currentTask}
	<ExercisePage fetchTask={currentTask} />
{:else}
	<p class="p-4">No Task</p>
{/if}
