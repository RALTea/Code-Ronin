<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { UserStore } from '$auth/stores/UserStore.svelte';
	import { env } from '$env/dynamic/public';
	import { TaskStore } from '$learning/usecases/getProgression/stores/currentTask.svelte';
	import type { TaskDetails } from '$learning/usecases/getTaskDetails/aggregates/TaskDetails';
	import type { FormattedExerciseAttemptResult } from '$learning/usecases/runExercise/aggregates/ExerciseAttemptResult';
	import { JudgeEvaluationRepository } from '$learning/usecases/runExercise/repositories/JudgeEvaluationRepository';
	import { LocalStorageAttemptRepository } from '$learning/usecases/runExercise/repositories/LocalStorageAttemptRepository';
	import { runExercise } from '$learning/usecases/runExercise/runExercise';
	import { LastRun } from '$learning/usecases/runExercise/stores/LastRun.svelte';
	import Bim from '$learning/usecases/runExercise/views/Bim.svelte';
	import InstructionsSkeleton from '$learning/usecases/runExercise/views/InstructionsSkeleton.svelte';
	import { trpc } from '$lib/clients/trpc';
	import Card from '$lib/components/cards/Card.svelte';
	import { onMount } from 'svelte';
	import { NotificationStack } from '../../notifications/stores/NotificationStack.svelte';
	import { SendNotificationUseCase } from '../../notifications/usecases/SendNotification/SendNotification';
	import Input from '../usecases/runExercise/views/Input.svelte';
	import Instructions from '../usecases/runExercise/views/Instructions.svelte';
	import Output from '../usecases/runExercise/views/Output.svelte';

	let result: FormattedExerciseAttemptResult | undefined = $state();
	let runningCode: boolean = $state(false);
	let inputCode: string = $state(`console.log('Hello world')`);
	let nextItemUrl: string = $state('');
	let bimVisible: boolean = $state(false);

	type Props = { fetchTask: Promise<TaskDetails | undefined> };
	let { fetchTask }: Props = $props();
	let animating = $state(true);
	let currentSelectedMode: 'Simplified' | 'Full' = $state('Simplified');
	let shownOutput: string | undefined = $derived(currentSelectedMode === 'Simplified' ? result?.formattedOutput : result?.output);

	onMount(() => {
		currentSelectedMode = localStorage.getItem('outputMode') as 'Simplified' | 'Full' || 'Simplified'
	});

	//
	$effect(() => {
		fetchTask.then((task) => {
			if (!task || !task.lastInput) {
				inputCode = `console.log('Hello world')`;
				return;
			};
			inputCode = task.lastInput.code;
		});
	});

	const runCode = () => {
		runningCode = true;
		const isDemo = $page.params.campaign === env.PUBLIC_DEMO_CAMPAIGN_NAME;
		const localStorageAttemptRepository = LocalStorageAttemptRepository();
		const judgeRepository = JudgeEvaluationRepository();
		const failHandlers = isDemo && !UserStore.user
			? [localStorageAttemptRepository.handleFail]
			: [trpc($page).learning.runExercises.handleFail.mutate];
		const successHandlers = isDemo && !UserStore.user
			? [localStorageAttemptRepository.handleSuccess]
			: [trpc($page).learning.runExercises.handleSuccess.mutate];
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
			successHandlers: successHandlers,
			failHandlers: failHandlers,
			getTaskDetails: async () => {
				const task = await fetchTask;
				return trpc($page).learning.runExercises.getTaskDetails.query({
					taskId: task?.id ?? '',
					campaignName: $page.params.campaign
				});
			}
		})
			.execute({
				apprenticeId: UserStore.user?.id ?? '-1',
				language: 'typescript5-vitest',
				taskId: $page.params.taskId
			})
			.then((res) => {
				if (!res.isSuccess) return console.error('Error running code:', res.message);
				result = res.data;
			})
			.catch((err) => {
				let message = 'Error running code';
				if (err instanceof Error) {
					message = err.message;
				}
				console.error(message, err);
				SendNotificationUseCase({
					addToStack: NotificationStack.addToStack
				}).execute({
					dto: { message, type: 'ERROR' }
				});
			})
			.finally(async () => {
				runningCode = false;
				if (result?.status === 'SUCCESS') {
					const task = await fetchTask;
					bimVisible = true;
					LastRun.update();
					if (!task || !task.nextTasksIds || task.nextTasksIds.length !== 1) return;
					nextItemUrl = `/campaigns/${$page.params.campaign}/${$page.params.questId}/${task?.nextTasksIds?.at(0) ?? ''}`;
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
	<aside
		class="prose prose-invert text-white h-full max-w-full row-span-2 prose-blockquote:border-primary-light prose-em:text-primary-light prose-em:font-bold"
	>
		{#await fetchTask}
			<InstructionsSkeleton animate bind:animating />
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
		<Output message={runningCode ? 'Loading...' : shownOutput} bind:mode={currentSelectedMode}/>
	</main>
</div>
