<script lang="ts">
	import Card from '$lib/components/cards/Card.svelte';
	import Progress from '$lib/components/forms/Progress.svelte';
	import type { DashboardCampaignItem } from '../aggregates/DashboardCampaignItemSchema';
	import { CampaignItemsVM } from './CampaignItemsVM.svelte';

	type Props = {
		fetchCampaigns: Promise<DashboardCampaignItem[]>;
		onItemSelected: (campaignName: string) => void;
		selectedCampaignName: string;
	};
	let { fetchCampaigns, onItemSelected, selectedCampaignName }: Props = $props();

	const vm = new CampaignItemsVM(fetchCampaigns);
</script>

{#if !vm.firstLoadCompleted}
	<p>Loading quests...</p>
{:else}
	<div class="flex gap-4">
		{#each vm.campaigns as campaign}
			{@const isHighlighted = campaign.name === selectedCampaignName}
			<button onclick={() => onItemSelected(campaign.name)}>
				<Card
					class="basis-1/4 p-4 space-y-6 border-2 {isHighlighted
						? 'border-primary-light'
						: 'border-transparent'}"
				>
					<div class="flex items-center gap-4">
						<img
							src="/default-pfp.png"
							alt={`${campaign.name} logo`}
							class="h-12 w-12 rounded-md"
						/>
						<h1 class="font-dm-sans text-2xl font-black">{campaign.name}</h1>
					</div>
					<div class="flex gap-2 items-center">
						<div class="h-2 flex-1">
							<Progress max={100} value={campaign.completion} class="" />
						</div>
						<p class="font-space-mono">{campaign.completion}%</p>
					</div>
				</Card>
			</button>
		{/each}
	</div>
{/if}
