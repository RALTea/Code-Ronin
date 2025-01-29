<script lang="ts">
	import Dropdown from '$lib/components/forms/Dropdown.svelte';
	import { page } from '$app/stores';
	import type { TaskTreeItem } from '../aggregates/TaskTreeItem';
	import { goto } from '$app/navigation';

	type DropdownItem = { value: string; label: string };
	type Props = {
		fetchItems: Promise<TaskTreeItem[]>;
	};
	let { fetchItems }: Props = $props();
	let treeItems: TaskTreeItem[] = $state([]);
	let defaultItem: DropdownItem = $derived.by(() => {
		const noItem: DropdownItem = { value: '', label: 'Click to select a task' };
		const item = treeItems.find((i) => i.id === $page.params.taskId);
		return item ? { value: item.id, label: item.name } : noItem;
	});

	// Transform tree items for dropdown
	let dropdownItems = $derived.by(() =>
		treeItems.map((item) => ({
			value: item.id,
			label: item.name
		}))
	);

	// Handle item selection
	const onItemSelected = (taskId: string) => {
		const questId = $page.params.questId;
		const campaign = $page.params.campaign;
		goto(`/campaigns/${campaign}/${questId}/${taskId}`);
		// goto(`/campaigns/${$page.params.campaign}`);
	};

	// Fetch items on mount
	$effect(() => {
		fetchItems.then((items) => (treeItems = items)).catch(() => (treeItems = []));
	});
</script>

<Dropdown
	items={dropdownItems}
	{onItemSelected}
	defaultItem={defaultItem}
	class="w-full my-4 dark"
	customStyles={{
		button: 'bg-bg-dark w-full flex gap-1 items-center w-full rounded-md h-10 px-2 font-space-mono',
    list: 'w-screen -ml-4 rounded-none',
		item: 'bg-bg-dark w-full py-4'
	}}
/>
