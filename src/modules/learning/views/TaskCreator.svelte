<script lang="ts">
	import type { TaskTreeItem } from '$learning/usecases/getQuestData/aggregates/TaskTreeItem';
	import { TaskBuilder } from '$learning/usecases/getQuestData/services/TaskBuilder';
	import Checkbox from '$lib/components/forms/Checkbox.svelte';
	import Dropdown from '$lib/components/forms/Dropdown.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import TextArea from '$lib/components/forms/TextArea.svelte';
	import IconWrapper from '$lib/components/icons/IconWrapper.svelte';
	import { Eye, PencilLine } from 'lucide-svelte';
	import SvelteMarkdown from 'svelte-markdown';

	type Props = {
		taskList: TaskTreeItem[];
		onconfirm: (task: TaskTreeItem) => void;
	};
	let { taskList, onconfirm }: Props = $props();
	let dropDownItems = taskList.map((task) => ({ value: task.id, label: task.name }));
	let instructionsDisplayMode: 'edit' | 'preview' = $state('edit');

	let taskBuilder = TaskBuilder().setExp(0).setName('Added Task');

	const updateName = (val: string) => {
		console.debug(val);
		taskBuilder.setName(val);
		console.debug('task', taskBuilder.build());
	};

	const onConfirm = () => {
		onconfirm(taskBuilder.build());
	};
</script>

<div class="space-y-6">
	<Input label={'Task name'} oninput={updateName} name={'task_name'} class="" />
	<div class="flex gap-6">
		<Input
			label={'Exp'}
			options={{ type: 'number' }}
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
		onItemSelected={(val) => taskBuilder.setPreviousTaskId(val)}
	/>
	<Input
		label={'Test file name'}
		oninput={(val) => taskBuilder.addTestFile(val)}
		name={'test_file_name'}
		class=""
	/>
	<div>
		{#if instructionsDisplayMode === 'edit'}
			<TextArea
				label={'Instructions'}
				oninput={(val) => taskBuilder.setInstructions(val)}
				name={'instructions'}
				value={taskBuilder.build().instructions}
				class=""
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
	<button onclick={onConfirm} class="border-2 border-white rounded-md"> Create </button>
</div>
