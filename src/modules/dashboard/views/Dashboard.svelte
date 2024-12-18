<script lang="ts">
	import { page } from '$app/stores';
	import QuestTree from '$dashboard/usecases/GetQuestsPath/views/QuestTree.svelte';
	import CampaignItems from '$dashboard/usecases/ListCampaigns/views/CampaignItems.svelte';
	import Card from '$lib/components/cards/Card.svelte';
	import { DashboardVM } from './DashboardVM.svelte';

	const vm = new DashboardVM($page, $page.data.fetchCampaigns);
	const navbarTailwindHeight = 20 + 4 * 2;
	const navbarHeight = `${navbarTailwindHeight/4}rem`;
</script>

<main class="flex flex-col gap-4 px-4" style="height: calc(100svh - {navbarHeight});">
	<CampaignItems
		fetchCampaigns={$page.data.fetchCampaigns}
		onItemSelected={vm.onCampaignSelected}
		selectedCampaignName={vm.selectedCampaign}
	/>
	<section class="grid gap-4 grid-cols-[6fr_2fr] flex-1">
		<div class="flex flex-col gap-4 pb-4">
			<Card class="flex flex-col px-4 py-2 flex-[3] [&>div]:my-auto">
				<h1 class="text-2xl font-black font-dm-sans">Quests</h1>
				{#if vm.loadQuest}
					<!-- {#key vm.selectedCampaign} -->
						<QuestTree loadQuests={vm.loadQuest} lastQuestsUpdate={vm.lastQuestsUpdate} itemSize="32" />
					<!-- {/key} -->
				{/if}
			</Card>
			<Card class="px-4 py-2 flex-[2]">
				<h1 class="text-2xl font-black font-dm-sans">Last Achievements</h1>
			</Card>
		</div>
		<div class="pb-4 flex flex-col gap-4">
			<Card class="px-4 py-2">
				<h1 class="text-2xl font-black font-dm-sans">Quick Actions</h1>
			</Card>
			<Card class="px-4 py-2 flex-1">
				<h1 class="text-2xl font-black font-dm-sans">Campaign Leaderboard</h1>
			</Card>
		</div>
	</section>
</main>
