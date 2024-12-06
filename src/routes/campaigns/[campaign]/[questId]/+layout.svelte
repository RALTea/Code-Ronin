<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import type { Attempt } from '$learning/domain/Attempt';
	import type { ApprenticeAttempt } from '$learning/usecases/getProgression/aggregates/ApprenticeAttempt';
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
			const taskToLoad = TaskStore.allTasks?.find((task) => task?.id === taskId);
			TaskStore.currentTask = taskToLoad;
		});
		return unsubscribe;
	});

	const fetchTree = async () => {
		const questId = $page.params.questId;
		console.debug('fetchTree', questId);
		const isDemo = $page.params.campaign === 'demo';
		const res = await getProgressionUseCase({
			getApprenticeAttemptsOnQuest: async () => {
				if (!isDemo)
					return trpc($page).learning.getProgression.getApprenticeAttemptsOnQuest.query({
						questId
					});
				const demoAttempts = JSON.parse(
					localStorage.getItem(env.PUBLIC_DEMO_CAMPAIGN_NAME) ?? '[]'
				) as Attempt[];
				console.debug('demoAttempts', demoAttempts);
				// Do not care about the quest ID for dep.
				return demoAttempts.map((it) => ({ ...it, questId: '-1' }));
			},
			getUnorderedTasks: () =>
				isDemo
					? trpc($page).learning.getProgression.getTasksFromDemoQuest.query({ questId })
					: trpc($page).learning.getProgression.getTasksFromQuest.query({ questId })
		}).execute({
			questId,
			apprenticeId: '-1' // provided by the server (authProcedure)
		});
		console.debug('Fetch tree result: ', res);
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
