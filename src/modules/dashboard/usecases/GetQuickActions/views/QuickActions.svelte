<script lang="ts">
	import PrimaryButton from '$lib/components/buttons/PrimaryButton.svelte';
	import type { QuestTree } from '../aggregates/QuestTree';
	import { QuickActionsVM } from './QuickActionsVM.svelte';

	type Props = {
		fetchTree: Promise<QuestTree>;
	};

	let { fetchTree }: Props = $props();

	const vm = new QuickActionsVM();

	$effect(() => {
		vm.onTreeChanged(fetchTree);
	});
</script>

<PrimaryButton>Continue {vm.quickActions?.nextItemLink}</PrimaryButton>
