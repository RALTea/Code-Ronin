<script lang="ts">
	import { page } from '$app/stores';
	import type { ExerciseAttemptResult } from '$learning/aggregates/ExerciseAttemptResult';
	import type { Task } from '$learning/domain/Task';
	import { JudgeEvaluationRepository } from '$learning/repositories/JudgeEvaluationRepository';
	import { runExercise } from '$learning/usecases/runExercise';
	import { trpc } from '$lib/clients/trpc';
	import Loading from '$lib/components/layout/Loading.svelte';
	import Input from './Input.svelte';
	import Instructions from './Instructions.svelte';
	import Output from './Output.svelte';

	let result: ExerciseAttemptResult | undefined = $state();
	let runningCode: boolean = $state(false);
	let inputCode: string = $state(`const printalphabet = () => {
    return "abcdefghijklmnopqrstuvwxyz"
}`);

	type Props = { task: Task };
	let { task }: Props = $props();

	const runCode = () => {
		runningCode = true;
		const judgeRepository = JudgeEvaluationRepository();
		runExercise({
			evaluateSolution: judgeRepository.evaluateSolution,
			getApprenticeSolution: async () => inputCode,
			getTestCases: async () => {
				const result = await trpc($page).runExercises.getTestFileFromGithub.query({
					campaignName: 'demo',
					fileName: 'Printalphabet.test.ts'
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

{#if task}
	<div class="grid grid-cols-1 md:grid-cols-2 grid-rows-2 pt-0 p-4 gap-4 h-full min-h-fit">
		<aside class="prose prose-invert text-white h-full max-w-full row-span-2">
			<Instructions {...task}></Instructions>
		</aside>
		<main class="flex-1 space-y-4 max-h-full">
			<Input bind:value={inputCode} {runCode} />
			<Output message={runningCode ? 'Loading...' : result?.message} />
		</main>
	</div>
{:else}
	<Loading absolute />
{/if}
