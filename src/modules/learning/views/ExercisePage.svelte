<script lang="ts">
	import { page } from '$app/stores';
	import type { TaskDetails } from '$learning/usecases/getTaskDetails/aggregates/TaskDetails';
	import type { ExerciseAttemptResult } from '$learning/usecases/runExercise/aggregates/ExerciseAttemptResult';
	import { JudgeEvaluationRepository } from '$learning/usecases/runExercise/repositories/JudgeEvaluationRepository';
	import { runExercise } from '$learning/usecases/runExercise/runExercise';
	import { trpc } from '$lib/clients/trpc';
	import Loading from '$lib/components/layout/Loading.svelte';
	import Input from '../usecases/runExercise/views/Input.svelte';
	import Instructions from '../usecases/runExercise/views/Instructions.svelte';
	import Output from '../usecases/runExercise/views/Output.svelte';

	let result: ExerciseAttemptResult | undefined = $state();
	let runningCode: boolean = $state(false);
	let inputCode: string = $state(`const printalphabet = () => {
    return "abcdefghijklmnopqrstuvwxyz"
}`);

	type Props = { fetchTask: Promise<TaskDetails | undefined> };
	let { fetchTask }: Props = $props();

	const runCode = () => {
		runningCode = true;
		const judgeRepository = JudgeEvaluationRepository();
		runExercise({
			evaluateSolution: judgeRepository.evaluateSolution,
			getApprenticeSolution: async () => {
				return inputCode
			},
			getTestCases: async () => {
				const task = await fetchTask;
				const fileName = task?.validation.testFileNames?.at(0) ?? '';
				const result = await trpc($page).learning.runExercises.getTestFileFromGithub.query({
					campaignName: $page.params.campaign,
					fileName: fileName,
				});
				return result ?? '';
			}
		})
			.execute({ apprenticeId: '1', language: 'typescript5-vitest', taskId: '1' })
			.then((res) => {
				if (!res.isSuccess) return console.error('Error running code:', res.message);
				result = res.data;
			})
			.catch((err) => {
				console.error('Error running code:', err);
			})
			.finally(() => {
				runningCode = false;
			});
	};
</script>

<div class="grid grid-cols-1 md:grid-cols-2 grid-rows-2 pt-0 p-4 gap-4 h-full min-h-fit">
	<aside class="prose prose-invert text-white h-full max-w-full row-span-2">
		{#await fetchTask}
			<Loading absolute />
		{:then task}
			{#if task}
				<Instructions instructions={task.instructions}></Instructions>
			{:else}
				<p>No Task</p>
			{/if}
		{/await}
	</aside>
	<main class="flex-1 space-y-4 max-h-full">
		<Input bind:value={inputCode} {runCode} />
		<Output message={runningCode ? 'Loading...' : result?.message} />
	</main>
</div>
