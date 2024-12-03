<script lang="ts">
	import { AddTaskToTreeUseCase } from '$admin/usecases/addTaskToTree/addTaskToTree';
	import {
		mapCreateTaskDtoToTaskTreeItem,
		type CreateTaskDto
	} from '$admin/usecases/createTask/aggregates/CreateTaskDto';
	import { CreateTaskUseCase } from '$admin/usecases/createTask/createTask.js';
	import TaskCreator from '$admin/usecases/createTask/views/TaskCreator.svelte';
	import { GetQuestDataUseCase } from '$admin/usecases/getQuestData/getQuestData';
	import TaskTree from '$admin/views/TaskTree.svelte';
	import { page } from '$app/stores';
	import { trpc } from '$lib/clients/trpc.js';
	import IconWrapper from '$lib/components/icons/IconWrapper.svelte';
	import { clickOutside } from '$lib/directives/clickOutside';
	import { Plus } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	let { data = $bindable() } = $props();

	let tasks = $state(data.questData.tasks);
	$inspect('tasks in page (data)', tasks.at(1));

	let taskCreatorOpened = $state(false);

	const openTaskCreator = () => {
		taskCreatorOpened = true;
	};

	const closeTaskCreator = () => {
		taskCreatorOpened = false;
	};

	const addNewTask = async (taskDto: CreateTaskDto) => {
		console.debug('adding task', taskDto);
		const payload = { ...taskDto, questId: data.questData.id };
		const createTaskUseCase = await CreateTaskUseCase({
			saveTask: async () => trpc($page).admin.createTask.createTask.query(payload)
		}).execute(payload);
		if (!createTaskUseCase.isSuccess) {
			console.error('Failed to create task', createTaskUseCase.message);
			return;
		}

		const getQuestDataUseCase = GetQuestDataUseCase({
			fetchQuestData: async () => {
				const questData = data.questData;
				const newTask = mapCreateTaskDtoToTaskTreeItem(taskDto);
				const newTree = await AddTaskToTreeUseCase().execute({
					tree: questData.tasks,
					task: newTask
				});
				if (!newTree.isSuccess) {
					console.error('Failed to add task to tree', newTree.message);
					return questData;
				}
				questData.tasks = newTree.data;
				return questData;
			}
		});
		const newQuestData = await getQuestDataUseCase.execute({ questId: data.questData.id });
		if (!newQuestData.isSuccess) {
			console.error('Failed to get quest data', newQuestData.message);
			return;
		}
		tasks = newQuestData.data.tasks;
		closeTaskCreator();
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
