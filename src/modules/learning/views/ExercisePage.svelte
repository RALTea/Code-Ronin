<script lang="ts">
	import type { ExerciseAttemptResult } from '$learning/aggregates/ExerciseAttemptResult';
	import type { Task } from '$learning/domain/Task';
	import { InMemoryTaskRepository } from '$learning/repositories/InMemoryTaskRepository';
	import { JudgeEvaluationRepository } from '$learning/repositories/JudgeEvaluationRepository';
	import { runExercise } from '$learning/usecases/runExercise';
	import PrimaryButton from '$lib/components/buttons/PrimaryButton.svelte';
	import { onMount } from 'svelte';
	import Input from './Input.svelte';
	import Instructions from './Instructions.svelte';
	import Output from './Output.svelte';

	const taskRepository = InMemoryTaskRepository();
	let task: Task | undefined = $state();
	let result: ExerciseAttemptResult | undefined = $state();
	let runningCode: boolean = $state(false);
	let inputCode: string = $state('');
	$inspect(inputCode)

	onMount(async () => {
		task = await taskRepository.getTaskById('1');
	});

	const runCode = () => {
		console.debug('Running code');
		runningCode = true;
		const judgeRepository = JudgeEvaluationRepository();
		runExercise({
			data: { apprenticeId: '1', language: 'javascript' },
			deps: {
				evaluateSolution: judgeRepository.evaluateSolution,
				fetchApprenticeSolution: async () => inputCode,
			}
		})
			.execute()
			.then((res) => {
				console.debug('Result:', res);
				result = res;
			}).finally(() => {
				runningCode = false;
			});
	};
</script>

<h1 class="text-red-500">Hello Code Ronin</h1>
{#if task}
	<div class="flex p-8 gap-8">
		<aside class="prose prose-invert text-white flex-1 p-4">
			<Instructions {...task}></Instructions>
		</aside>
		<main class="flex-1 p-4 space-y-8">
			<Input bind:value={inputCode}/>
			<Output stdout={runningCode ? 'Loading...' : result?.stdout} stderr={result?.stderr}/>
			<PrimaryButton className="px-8 py-2 mt-4" onclick={runCode}>Run code</PrimaryButton>
		</main>
	</div>
{:else}
	<p>Task not loaded</p>
{/if}
