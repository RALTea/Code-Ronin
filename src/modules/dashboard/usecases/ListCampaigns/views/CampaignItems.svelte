<script lang="ts">
	import Card from '$lib/components/cards/Card.svelte';
	import Progress from '$lib/components/forms/Progress.svelte';
	import { AppNotificationService } from '$notifications/services/AppNotificationService';
	import { PlusCircle } from 'lucide-svelte';
	import JoinCampaignModal from '../../JoinNewCampaign/views/JoinCampaignModal.svelte';
	import { goto } from '$app/navigation';
	import type { CampaignInfos } from '../aggregates/CampaignInfos';
	import type { DashboardCampaignItem } from '../aggregates/DashboardCampaignItem';
	import { CampaignItemsVM } from './CampaignItemsVM.svelte';
	import type { Campaign } from '$dashboard/usecases/JoinNewCampaign/aggregates/Campaign';
	import { TransferModalStore } from '$dashboard/usecases/JoinNewCampaign/stores/TransferModalStore.svelte';

	type Props = {
		fetchCampaigns: Promise<DashboardCampaignItem[]>;
		onItemSelected: (campaign: CampaignInfos) => void;
		selectedCampaignName: string;
	};
	let { fetchCampaigns, onItemSelected, selectedCampaignName }: Props = $props();

	const vm = new CampaignItemsVM(fetchCampaigns);

	const notifyFail = (message: string) => {
		AppNotificationService.send({ message, type: 'ERROR' });
	};

	const onSuccess = (data: {
		campaign: Campaign;
		redirectUrl: string;
		transferStatus: { success: boolean; error?: string };
	}) => {
		vm.closeJoinCampaignModal();
		console.debug({ data });
		if (data.transferStatus?.success) {
			const message = data.transferStatus.error
				? `Transfer failed: ${data.transferStatus.error}`
				: 'Progress has been transferred from a Demo campaign';
			TransferModalStore.open(message);
		}
		goto(data.redirectUrl);
	};
</script>

{#if vm.joinCampaignModalOpen}
	<JoinCampaignModal onFail={notifyFail} {onSuccess} onCancel={() => vm.closeJoinCampaignModal()} />
{/if}

{#if !vm.firstLoadCompleted}
	<p>Loading quests...</p>
{:else}
	<div class="flex gap-4">
		{#each vm.campaigns as campaign}
			{@const isHighlighted = campaign.name === selectedCampaignName}
			<button onclick={() => onItemSelected(campaign)} class="md:basis-1/4 lg:basis-1/5">
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
		<button
			onclick={() => {
				vm.openJoinCampaignModal();
			}}
			class="md:basis-1/4 lg:basis-1/5"
		>
			<Card class="basis-1/4 p-4 space-y-6 border-2 border-transparent h-full">
				<div class="flex flex-col items-center justify-center h-full">
					<PlusCircle class="h-12 w-12 text-zinc-200" />
					<h2 class="font-dm-sans text-md font-thin text-zinc-200">Join Campaign</h2>
				</div>
			</Card>
		</button>
	</div>
{/if}
