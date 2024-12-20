<script lang="ts">
	import PrimaryButton from '$lib/components/buttons/PrimaryButton.svelte';
	import { ArrowRight } from 'lucide-svelte';
	import type { QuestTree } from '../aggregates/QuestTree';
	import { QuickActionsVM } from './QuickActionsVM.svelte';

	type Props = {
		fetchTree: Promise<QuestTree>;
		campaignSlug: string;
	};

	let { fetchTree, campaignSlug }: Props = $props();

	const vm = new QuickActionsVM();

	$effect(() => {
		vm.onTreeChanged(fetchTree, campaignSlug);
	});
</script>

{#if vm.quickActions?.nextItemLink}
	<PrimaryButton
		type={{
			href: vm.quickActions?.nextItemLink
		}}
		class="px-4 py-1 w-fit flex gap-2 items-center"
	>
		Continue
		<ArrowRight size="16"/>
	</PrimaryButton>
	{:else}
	<p class="text-center font-bold font-space-mono py-4">🌟 Campaign Complete ! 🌟</p>
{/if}
