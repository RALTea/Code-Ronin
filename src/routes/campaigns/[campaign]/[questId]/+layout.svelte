<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { UserStore } from '$auth/stores/UserStore.svelte';
	import { env } from '$env/dynamic/public';
	import type { Attempt } from '$learning/domain/Attempt';
	import type { TaskTreeItem } from '$learning/usecases/getProgression/aggregates/TaskTreeItem';
	import { getProgressionUseCase } from '$learning/usecases/getProgression/getProgressionUseCase';
	import { TaskStore } from '$learning/usecases/getProgression/stores/currentTask.svelte';
	import ProgressDropdown from '$learning/usecases/getProgression/views/ProgressDropdown.svelte';
	import ProgressTree from '$learning/usecases/getProgression/views/ProgressTree.svelte';
	import { LastRun } from '$learning/usecases/runExercise/stores/LastRun.svelte';
	import { trpc } from '$lib/clients/trpc';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { isOnMobile } from '$lib/utils/svelte.utils';
	import { ArrowLeft } from 'lucide-svelte';
	import { onMount, type Snippet } from 'svelte';

	type Props = { children: Snippet };
	let { children }: Props = $props();
	let displayMobileMenu = $state(isOnMobile());

	onMount(() => {
		const onResize = () => {
			displayMobileMenu = isOnMobile();
		};
		window.addEventListener('resize', onResize);
		const unsubscribe = page.subscribe(({ params }) => {
			const taskId = params.taskId;
			const taskToLoad = TaskStore.allTasks?.find((task) => task?.id === taskId);
			TaskStore.currentTask = taskToLoad;
		});
		return () => {
			unsubscribe();
			window.removeEventListener('resize', onResize);
		};
	});

	const fetchTree = async () => {
		const questId = $page.params.questId;
		const isDemo = $page.params.campaign === 'demo';
		const res = await getProgressionUseCase({
			getApprenticeAttemptsOnQuest: async () => {
				if (!isDemo || UserStore.user) {
					return trpc($page).learning.getProgression.getApprenticeAttemptsOnQuest.query({
						questId
					});
				}
				if (browser) {
					const demoAttempts = JSON.parse(
						localStorage.getItem(env.PUBLIC_DEMO_CAMPAIGN_NAME) ?? '[]'
					) as Attempt[];
					// Do not care about the quest ID for dep.
					return demoAttempts.map((it) => ({ ...it, questId: '-1' }));
				}
				return [];
			},
			getUnorderedTasks: () =>
				isDemo
					? trpc($page).learning.getProgression.getTasksFromDemoQuest.query({ questId })
					: trpc($page).learning.getProgression.getTasksFromQuest.query({ questId })
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

<div class="h-screen max-h-screen md:grid-rows-[auto_1fr] flex-col md:grid md:grid-cols-[auto_1fr]">
	{#if !displayMobileMenu}
		<ProgressTree fetchItems={fetchTaskTreeItems} />
	{/if}
	<Navbar class="row-auto" />
	{#if displayMobileMenu}
		<div class="flex items-center px-4 gap-4">
			<a href='/dashboard' class="h-10 aspect-square flex items-center justify-center bg-bg-dark rounded-md">
				<ArrowLeft size="24" />
			</a>
			<ProgressDropdown fetchItems={fetchTaskTreeItems} />
		</div>
	{/if}
	{@render children()}
</div>
