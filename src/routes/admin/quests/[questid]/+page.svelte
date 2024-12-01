<script lang="ts">
	import { clickOutside } from '$lib/directives/clickOutside';
	import type { TaskTreeItem } from '$learning/usecases/getQuestData/aggregates/TaskTreeItem';
	import TaskTree from '$learning/usecases/getQuestData/views/TaskTree.svelte';
	import TaskCreator from '$learning/views/TaskCreator.svelte';
	import IconWrapper from '$lib/components/icons/IconWrapper.svelte';
	import { Plus } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { TaskBuilder } from '$learning/usecases/getQuestData/services/TaskBuilder.js';
	import { GetQuestDataUseCase } from '$learning/usecases/getQuestData/getQuestData.js';

	let { data = $bindable()} = $props();
	// const { name, tasks } = data.questData;
	let tasks = $state(data.questData.tasks);
	$inspect("tasks in page (data)", tasks.at(1))

	let taskCreatorOpened = $state(false);

	const openTaskCreator = () => {
		// taskCreatorOpened = true;
		const newTask = TaskBuilder().setPreviousTaskId(tasks[1][0].id).build();
		addNewTask(newTask);
	};

	const closeTaskCreator = () => {
		taskCreatorOpened = false;
	};

	const addNewTask = async (task: TaskTreeItem) => {
		console.debug('adding task', task);
		await getQuestData(task);
		closeTaskCreator();
	};

	const getQuestData = async (newTask: TaskTreeItem) => {
		const getQuestDataUseCase = GetQuestDataUseCase({
			fetchQuestData: async () => {
				const questData = data.questData;
				questData.tasks = [questData.tasks.flat()];
				questData.tasks[0].push(newTask);
				return questData;
			}
		});
		const newQuestData = await getQuestDataUseCase.execute({questId: data.questData.id});
		if (!newQuestData.isSuccess) {
			console.error('Failed to get quest data', newQuestData.message);
			return;
		}
		tasks = newQuestData.data.tasks;
	};

</script>

<button
	onclick={openTaskCreator}
	class="flex items-center gap-2 bg-lightless rounded-full px-2 py-1"
	disabled={taskCreatorOpened}
>
	<IconWrapper size="8">
		<Plus />
	</IconWrapper>
	<p>Add Task</p>
</button>

{#if taskCreatorOpened}
	<div
		class="fixed top-0 right-0 w-1/2 h-screen bg-black/50 z-20 backdrop-blur-md p-8"
		transition:fly={{ x: 1000 }}
		use:clickOutside
		onclickOutside={closeTaskCreator}
	>
		<TaskCreator taskList={tasks.flat()} onconfirm={addNewTask} />
	</div>
{/if}
<TaskTree {tasks} />
