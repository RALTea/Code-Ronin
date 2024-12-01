<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { user } from '$auth/stores/UserStore';
	import { TaskStore } from '$learning/usecases/getProgression/stores/currentTask.svelte';
	import type { TaskDetails } from '$learning/usecases/getTaskDetails/aggregates/TaskDetails';
	import type { ExerciseAttemptResult } from '$learning/usecases/runExercise/aggregates/ExerciseAttemptResult';
	import { JudgeEvaluationRepository } from '$learning/usecases/runExercise/repositories/JudgeEvaluationRepository';
	import { runExercise } from '$learning/usecases/runExercise/runExercise';
	import { LastRun } from '$learning/usecases/runExercise/stores/LastRun.svelte';
	import Bim from '$learning/usecases/runExercise/views/Bim.svelte';
	import InstructonSkeleton from '$learning/usecases/runExercise/views/InstructonSkeleton.svelte';
	import { trpc } from '$lib/clients/trpc';
	import Card from '$lib/components/cards/Card.svelte';
	import Input from '../usecases/runExercise/views/Input.svelte';
	import Instructions from '../usecases/runExercise/views/Instructions.svelte';
	import Output from '../usecases/runExercise/views/Output.svelte';

	let result: ExerciseAttemptResult | undefined = $state();
	let runningCode: boolean = $state(false);
	let inputCode: string = $state(`console.log('Hello world')`);
	let nextItemUrl: string = $state('');
	let bimVisible: boolean = $state(false);

	type Props = { fetchTask: Promise<TaskDetails | undefined> };
	let { fetchTask }: Props = $props();
	let animating = $state(true);


	// 
	$effect(() => {
		fetchTask.then((task) => {
			if (!task || !task.lastInput) return;
			inputCode = task.lastInput.code;
		});
	});

	const runCode = () => {
		runningCode = true;
		const judgeRepository = JudgeEvaluationRepository();
		runExercise({
			evaluateSolution: judgeRepository.evaluateSolution,
			getApprenticeSolution: async () => {
				return inputCode;
			},
			getTestCases: async () => {
				const task = await fetchTask;
				const fileName = task?.validation.testFileNames?.at(0) ?? '';
				const result = await trpc($page).learning.runExercises.getTestFileFromGithub.query({
					campaignName: $page.params.campaign,
					fileName: fileName
				});
				return result ?? '';
			},
			successHandlers: [trpc($page).learning.runExercises.handleSuccess.mutate],
			failHandlers: [trpc($page).learning.runExercises.handleFail.mutate],
			getTaskDetails: async () => {
				const task = await fetchTask;
				return trpc($page).learning.runExercises.getTaskDetails.query({ taskId: task?.id ?? '' });
			}
		})
			.execute({
				apprenticeId: $user?.id ?? '-1',
				language: 'typescript5-vitest',
				taskId: $page.params.taskId
			})
			.then((res) => {
				if (!res.isSuccess) return console.error('Error running code:', res.message);
				result = res.data;
			})
			.catch((err) => {
				console.error('Error running code:', err);
			})
			.finally(async () => {
				runningCode = false;
				if (result?.success) {
					const task = await fetchTask;
					if (!task || !task.nextTasksIds || task.nextTasksIds.length !== 1) return;
					nextItemUrl = `/campaigns/${$page.params.campaign}/${$page.params.questId}/${task?.nextTasksIds?.at(0) ?? ''}`;
					LastRun.update();
					bimVisible = true;
				}
			});
	};

	const onContinue = async () => {
		bimVisible = false;
	};
	const onBimOutroEnd = async () => {
		await goto(nextItemUrl);
		nextItemUrl = '';
	};
</script>

{#if bimVisible}
	<Bim {onContinue} onOutroEnd={onBimOutroEnd} />
{/if}

<div class="grid grid-cols-1 md:grid-cols-2 grid-rows-2 pt-0 p-4 gap-4 h-full min-h-fit">
	<aside class="prose prose-invert text-white h-full max-w-full row-span-2">
		{#await fetchTask}
			<InstructonSkeleton animate bind:animating />
		{:then task}
			<Card class={'p-4 h-full overflow-auto'}>
				{#if animating || TaskStore.allTasks.at(0) === undefined}
					<div></div>
				{:else if task}
					<Instructions instructions={task.instructions} />
				{:else}
					<p>No task</p>
				{/if}
			</Card>
		{/await}
	</aside>
	<main class="flex-1 space-y-4 max-h-full">
		<Input bind:value={inputCode} {runCode} />
		<Output message={runningCode ? 'Loading...' : result?.message} />
	</main>
</div>