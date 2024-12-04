<script lang="ts">
	import type { TaskData } from '$admin/domain/TaskData';
	import type { TaskTreeItem } from '$admin/domain/TaskTreeItem';
	import type { TestType } from '$admin/domain/TestType';
	import type { CreateTaskDto } from '$admin/usecases/createTask/aggregates/CreateTaskDto';
	import { TaskBuilder } from '$admin/usecases/createTask/services/TaskBuilder';
	import Checkbox from '$lib/components/forms/Checkbox.svelte';
	import Dropdown from '$lib/components/forms/Dropdown.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import TextArea from '$lib/components/forms/TextArea.svelte';
	import IconWrapper from '$lib/components/icons/IconWrapper.svelte';
	import { Eye, PencilLine } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import { get } from 'svelte/store';

	type Props = {
		taskList: TaskTreeItem[];
		editingTask?: TaskData;
		onconfirm: (task: CreateTaskDto) => void;
	};
	let { taskList, onconfirm, editingTask }: Props = $props();
	let dropDownItems = [
		{ value: '', label: '[None]' },
		...taskList
			.map((task) => ({ value: task.id, label: task.name }))
			.filter((task) => task.value !== editingTask?.id),
	];

	const testTypesDropdownItems: { value: TestType; label: string }[] = [
		{ value: 'tests', label: 'tests' },
		{ value: 'stdout', label: 'stdout' },
		{ value: 'stderr', label: 'stderr' }
	];
	let instructionsDisplayMode: 'edit' | 'preview' = $state('edit');

	let taskBuilder = TaskBuilder().setExp(0).setName('Added Task');
	let currentTask = $state(taskBuilder.build());

	onMount(() => {
		if (!editingTask) return;
		console.debug('Editing task', editingTask);
		taskBuilder
			.setId(editingTask.id)
			.setName(editingTask.name)
			.setInstructions(editingTask.instructions)
			.setIsMiniboss(editingTask.isMiniboss)
			.setTestFile(editingTask.validation.testFileName ?? '')
			.setExp(editingTask.exp)
			.setExpectedStderr(editingTask.validation.expectedStderr ?? '')
			.setExpectedStdout(editingTask.validation.expectedStdout ?? '');
		(editingTask.previousTaskIds ?? []).forEach((taskId) => taskBuilder.addPreviousTaskId(taskId));
		(editingTask.nextTaskIds ?? []).forEach((taskId) => taskBuilder.addNextTaskId(taskId));
		currentTask = taskBuilder.build();
	});

	const updateName = (val: string) => {
		taskBuilder.setName(val);
	};

	const onConfirm = () => {
		onconfirm(taskBuilder.build());
	};

	const onInstructionsChanged = (val: string) => {
		taskBuilder.setInstructions(val);
		if (editingTask) {
			currentTask.instructions = val;
		}
	};

	const onPreviousTaskSelected = (val: string) => {
		taskBuilder
			.build()
			.previousTaskIds?.forEach((taskId) => taskBuilder.removePreviousTaskId(taskId));
		if (val === '') return;
		taskBuilder.addPreviousTaskId(val);
	};

	const getOriginalTestType = () => {
		return testTypesDropdownItems.find((item) => {
			return editingTask ? (editingTask.testType === item.value) : (item.value === 'tests'); 
		})
	}

	const getOriginalPreviousTask = () => {
		return dropDownItems.find((item) => {
			return editingTask ? (editingTask.previousTaskIds?.includes(item.value)) : false;
		})
	}
</script>

<div class="space-y-6">
	<Input
		options={{ value: currentTask.name }}
		label={'Task name'}
		oninput={updateName}
		name={'task_name'}
		class=""
	/>
	<div class="flex gap-6">
		<Input
			label={'Exp'}
			options={{ type: 'number', value: currentTask.exp }}
			oninput={(val) => taskBuilder.setExp(Number(val) ?? 0)}
		/>
		<Checkbox
			label={'Is Miniboss'}
			name="is_miniboss"
			onclick={(val) => taskBuilder.setIsMiniboss(val)}
			checked={false}
			class="mt-6 dark"
		/>
	</div>
	<Dropdown
		items={dropDownItems}
		label={'Unlocked by :'}
		class={'dark'}
		onItemSelected={onPreviousTaskSelected}
		defaultItem={getOriginalPreviousTask()}
	/>
	<div class="flex gap-4 items-center">
		<Input
			label={'Test file name'}
			oninput={(val) => taskBuilder.setTestFile(val)}
			name={'test_file_name'}
			options={{ value: currentTask.validation.testFileName }}
			class="flex-1"
		/>
		<Dropdown
			items={testTypesDropdownItems}
			label={'Test type'}
			class={'dark flex-1'}
			defaultItem={getOriginalTestType()}
			onItemSelected={(val) => taskBuilder.setTestType(val as TestType)}
		/>
	</div>
	<div>
		{#if instructionsDisplayMode === 'edit'}
			<TextArea
				label={'Instructions'}
				oninput={(val) => onInstructionsChanged(val)}
				name={'instructions'}
				value={editingTask ? currentTask.instructions : taskBuilder.build().instructions}
				class=""
				options={{ rows: 10 }}
			/>
		{:else}
			<div class="prose prose-invert">
				<SvelteMarkdown source={taskBuilder.build().instructions} />
			</div>
		{/if}
		<div class="flex gap-4 py-2">
			<button
				class="border-2 border-lightless rounded-md p-2"
				onclick={() => (instructionsDisplayMode = 'edit')}
			>
				<IconWrapper size="6"><PencilLine /></IconWrapper>
			</button>
			<button
				class="border-2 border-lightless rounded-md p-2"
				onclick={() => (instructionsDisplayMode = 'preview')}
			>
				<IconWrapper size="6"><Eye /></IconWrapper>
			</button>
		</div>
	</div>
	<button onclick={onConfirm} class="border-2 border-white rounded-md px-4 py-2"
		>{editingTask ? 'Save' : 'Create'}</button
	>
</div>
