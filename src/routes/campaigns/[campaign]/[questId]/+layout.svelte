<script lang="ts">
	import { page } from '$app/stores';
	import type { TaskTreeItem } from '$learning/usecases/getProgression/aggregates/TaskTreeItem';
	import { getProgressionUseCase } from '$learning/usecases/getProgression/getProgressionUseCase';
	import { TaskStore } from '$learning/usecases/getProgression/stores/currentTask.svelte';
	import ProgressTree from '$learning/usecases/getProgression/views/ProgressTree.svelte';
	import { LastRun } from '$learning/usecases/runExercise/stores/LastRun.svelte';
	import { trpc } from '$lib/clients/trpc';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { onMount, type Snippet } from 'svelte';

	type Props = { children: Snippet };
	let { children }: Props = $props();

	onMount(() => {
		const unsubscribe = page.subscribe(({ params }) => {
			const taskId = params.taskId;
			const taskToLoad = TaskStore.allTasks.find((task) => task.id === taskId);
			TaskStore.currentTask = taskToLoad;
		});
		return unsubscribe;
	});

	const fetchTree = async () => {
		const questId = $page.params.questId;
		const res = await getProgressionUseCase({
			getApprenticeAttemptsOnQuest: () =>
				trpc($page).learning.getProgression.getApprenticeAttemptsOnQuest.query({ questId }),
			getUnorderedTasks: () =>
				trpc($page).learning.getProgression.getTasksFromQuest.query({ questId })
		}).execute({
			questId,
			apprenticeId: '-1' // provided by the server (authProcedure)
		});
		if (!res.isSuccess) return [];
		// Do not reassign the array, otherwise the proxy will be lost
		const taskItems = res.data.tasks;
		TaskStore.allTasks.length = 0;
		TaskStore.allTasks.push(...taskItems);
		return taskItems;
	};

	let fetchTaskTreeItems: Promise<TaskTreeItem[]> = $state(fetchTree());

	// Run each time the LastRun.time changes (i.e. when LastRun.update() is called)
	$effect(() => {
		LastRun.time;
		fetchTaskTreeItems = fetchTree();
	});
</script>

<div class="h-screen max-h-screen grid grid-rows-[auto_1fr] grid-cols-[auto_1fr]">
	<ProgressTree fetchItems={fetchTaskTreeItems} />
	<Navbar class="row-auto" />
	{@render children()}
</div>
