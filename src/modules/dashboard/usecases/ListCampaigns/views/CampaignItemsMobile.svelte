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
	import Dropdown from '$lib/components/forms/Dropdown.svelte';

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
		if (data.transferStatus?.success) {
			const message = data.transferStatus.error
				? `Transfer failed: ${data.transferStatus.error}`
				: 'Progress has been transferred from a Demo campaign';
			TransferModalStore.open(message);
		}
		goto(data.redirectUrl);
	};
</script>

<JoinCampaignModal
	isOpen={vm.joinCampaignModalOpen}
	onFail={notifyFail}
	{onSuccess}
	onCancel={() => vm.closeJoinCampaignModal()}
/>

{#if !vm.firstLoadCompleted}
	<p>Loading quests...</p>
{:else}
<ul class="space-y-4">
    <li>
      <button class="flex gap-4 items-center w-full" onclick={() => vm.openJoinCampaignModal()}>
        <PlusCircle size={48} class="p-2" />
        <p class="font-dm-sans font-bold text-xl">Join new campaign</p>
      </button>
    </li>
		{#each vm.campaigns as campaign}
			<li class="w-full">
				<button
					class="flex gap-4 items-center w-full"
					onclick={() => onItemSelected(campaign)}
				>
					<img src="/default-pfp.png" alt={campaign.name} class="h-12 w-12 rounded-md" />
					<p class="font-dm-sans font-bold text-xl">{campaign.name}</p>
					<p class="ms-auto font-space-mono">{campaign.completion}%</p>
				</button>
			</li>
		{/each}
	</ul>
{/if}
