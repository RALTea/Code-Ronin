<script lang="ts">
	import { page } from '$app/stores';
	import { TaskStore } from '$learning/usecases/getProgression/stores/currentTask.svelte';
	import ExercisePage from '$learning/views/ExercisePage.svelte';

	let currentTask = $derived.by(() => {
		const currentTaskId = $page.params.task;
		const taskToLoad = TaskStore.allTasks.find((task) => task.id === currentTaskId);
		TaskStore.currentTask = taskToLoad;
		return taskToLoad;
	});
</script>

{#if currentTask}
	<ExercisePage task={currentTask} />
{:else}
	<p class="p-4">No Task</p>
{/if}
