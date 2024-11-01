<script lang="ts">
	import { page } from '$app/stores';
	import type { TaskTreeItem } from '$learning/usecases/getProgression/aggregates/TaskTreeItem';
	import { getProgressionUseCase } from '$learning/usecases/getProgression/getProgressionUseCase';
	import { TaskStore } from '$learning/usecases/getProgression/stores/currentTask.svelte';
	import ProgressTree from '$learning/usecases/getProgression/views/ProgressTree.svelte';
	import { trpc } from '$lib/clients/trpc';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { onMount, type Snippet } from 'svelte';

	let fetchTaskTreeItems: Promise<TaskTreeItem[]> = $state(Promise.resolve([] as TaskTreeItem[]));

	type Props = { children: Snippet };
	let { children }: Props = $props();

	onMount(() => {
		const unsubscribe = page.subscribe(({ params }) => {
			const taskId = params.taskId;
			const taskToLoad = TaskStore.allTasks.find((task) => task.id === taskId);
			TaskStore.currentTask = taskToLoad;
		});
		const questId = $page.params.questId;
		fetchTaskTreeItems = getProgressionUseCase({
			getApprenticeAttemptsOnQuest: () =>
				trpc($page).learning.getProgression.getApprenticeAttemptsOnQuest.query({ questId }),
			getUnorderedTasks: () =>
				trpc($page).learning.getProgression.getTasksFromQuest.query({ questId })
		})
			.execute({
				questId,
				apprenticeId: '-1' // provided by the server (authProcedure)
			})
			.then((res) => {
				if (!res.isSuccess) return [];
				// Do not reassign the array, otherwise the proxy will be lost
				const taskItems = res.data.tasks;
				TaskStore.allTasks.push(...taskItems);
				return taskItems;
			});
		return unsubscribe;
	});
</script>

<div class="h-screen max-h-screen grid grid-rows-[auto_1fr] grid-cols-[auto_1fr]">
	<ProgressTree items={fetchTaskTreeItems} />
	<Navbar class="row-auto" />
	{@render children()}
</div>
