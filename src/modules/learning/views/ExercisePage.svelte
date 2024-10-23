<script lang="ts">
	import type { ExerciseAttemptResult } from '$learning/aggregates/ExerciseAttemptResult';
	import type { Task } from '$learning/domain/Task';
	import { InMemoryTaskRepository } from '$learning/repositories/InMemoryTaskRepository';
	import { JudgeEvaluationRepository } from '$learning/repositories/JudgeEvaluationRepository';
	import { runExercise } from '$learning/usecases/runExercise';
	import { onMount } from 'svelte';
	import Input from './Input.svelte';
	import Instructions from './Instructions.svelte';
	import Output from './Output.svelte';

	const taskRepository = InMemoryTaskRepository();
	let task: Task | undefined = $state();
	let result: ExerciseAttemptResult | undefined = $state();
	let runningCode: boolean = $state(false);
	let inputCode: string = $state('console.log("hello")');
	$inspect(inputCode);

	onMount(async () => {
		task = await taskRepository.getTaskById('1');
	});

	const runCode = () => {
		console.debug('Running code');
		runningCode = true;
		const judgeRepository = JudgeEvaluationRepository();
		runExercise({
			data: { apprenticeId: '1', language: 'typescript5' },
			deps: {
				evaluateSolution: judgeRepository.evaluateSolution,
				fetchApprenticeSolution: async () => inputCode
			}
		})
			.execute()
			.then((res) => {
				console.debug('Result:', res);
				result = res;
			})
			.finally(() => {
				runningCode = false;
			});
	};
</script>

{#if task}
	<div class="grid grid-cols-1 md:grid-cols-2 grid-rows-2 p-4 gap-4 max-h-screen">
		<aside class="prose prose-invert text-white h-full max-w-full row-span-2">
			<Instructions {...task}></Instructions>
		</aside>
		<main class="flex-1 space-y-4 max-h-full">
			<Input bind:value={inputCode} {runCode} />
			<Output message={runningCode ? 'Loading...' : result?.message} />
		</main>
	</div>
{:else}
	<p>Task not loaded</p>
{/if}
