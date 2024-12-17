<script lang="ts">
	import { page } from '$app/stores';
	import QuestTree from '$dashboard/usecases/GetQuestsPath/views/QuestTree.svelte';
	import CampaignItems from '$dashboard/usecases/ListCampaigns/views/CampaignItems.svelte';
	import Card from '$lib/components/cards/Card.svelte';
	import { DashboardVM } from './DashboardVM.svelte';

	const vm = new DashboardVM($page, $page.data.fetchCampaigns);
</script>

<main class="px-4 flex flex-col gap-4">
	<CampaignItems
		fetchCampaigns={$page.data.fetchCampaigns}
		onItemSelected={vm.onCampaignSelected}
    selectedCampaignName={vm.selectedCampaign}
	/>
	<Card class="flex justify-center flex-col px-4 py-2">
		<h1 class="font-dm-sans font-black text-2xl">Quests</h1>
		{#if vm.loadQuest}
			{#key vm.selectedCampaign}
				<QuestTree loadQuests={vm.loadQuest} itemSize="32" />
			{/key}
		{/if}
	</Card>
</main>
