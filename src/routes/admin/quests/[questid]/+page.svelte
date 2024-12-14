<script lang="ts">
	import type { TaskData } from '$admin/domain/TaskData.js';
	import { AddTaskToTreeUseCase } from '$admin/usecases/addTaskToTree/addTaskToTree';
	import {
		mapCreateTaskDtoToTaskTreeItem,
		type CreateTaskDto
	} from '$admin/usecases/createTask/aggregates/CreateTaskDto';
	import { CreateTaskUseCase } from '$admin/usecases/createTask/createTask.js';
	import TaskCreator from '$admin/usecases/createTask/views/TaskCreator.svelte';
	import { EditTaskUseCase } from '$admin/usecases/editTask/editTask.js';
	import { GetQuestDataUseCase } from '$admin/usecases/getQuestData/getQuestData';
	import { GetTaskDataUseCase } from '$admin/usecases/getTaskData/getTaskData.js';
	import TaskTree from '$admin/views/TaskTree.svelte';
	import { page } from '$app/stores';
	import { trpc } from '$lib/clients/trpc.js';
	import IconWrapper from '$lib/components/icons/IconWrapper.svelte';
	import { clickOutside } from '$lib/directives/clickOutside';
	import { Plus } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	let { data = $bindable() } = $props();

	let tasks = $state(data.questData.tasks);

	let taskCreatorOpened = $state(false);
	let editingTask: TaskData | undefined = $state(undefined);

	const openTaskCreator = () => {
		taskCreatorOpened = true;
	};

	const closeTaskCreator = () => {
		editingTask = undefined;
		taskCreatorOpened = false;
	};

	const getTaskData = async (taskId: string) => {
		const taskData = await GetTaskDataUseCase({
			getTaskData: async () => trpc($page).admin.getTask.execute.query({ taskId })
		}).execute({ taskId });
		if (!taskData.isSuccess) {
			console.error('Failed to get task data', taskData.message);
			return;
		}
		editingTask = taskData.data;
		openTaskCreator();
	};

	const onConfirm = async (task: CreateTaskDto) => {
		if (editingTask) {
			await saveEdit(task);
			return;
		}
		await addNewTask(task);
	};

	const saveEdit = async (task: CreateTaskDto) => {
		const editUC = await EditTaskUseCase({
			saveTaskData: async () => trpc($page).admin.editTask.saveTaskData.query(task),
			saveValidation: async () => trpc($page).admin.editTask.saveValidation.query(task)
		}).execute({ taskData: task });
		if (!editUC.isSuccess) {
			console.error('Failed to edit task', editUC.message);
			return;
		}
		const questData = await trpc($page).admin.getQuestData.load.query({
			questId: data.questData.id
		});
		if (!questData.isSuccess) {
			console.error('Failed to get quest data', questData.message);
			return;
		}
		tasks = questData.data.tasks;
		closeTaskCreator();
	};

	const addNewTask = async (taskDto: CreateTaskDto) => {
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
		class="bg-white/0 duration-1000 transition-all backdrop-blur-sm fixed top-0 left-0 w-screen h-screen z-10"
	></div>
{/if}
{#if taskCreatorOpened}
	<div
		class="fixed top-0 right-0 w-1/2 h-screen bg-black/50 z-20 backdrop-blur-md p-8 overflow-auto"
		transition:fly={{ x: 1000 }}
		use:clickOutside={'mousedown'}
		onclickOutside={closeTaskCreator}
	>
		<TaskCreator taskList={tasks.flat()} onconfirm={onConfirm} {editingTask} />
	</div>
{/if}
<TaskTree {tasks} ontaskselected={getTaskData} />
