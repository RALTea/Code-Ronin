<script lang="ts">
	import { page } from '$app/stores';
	import QuestTree from '$dashboard/usecases/GetQuestsPath/views/QuestTree.svelte';
	import QuickActions from '$dashboard/usecases/GetQuickActions/views/QuickActions.svelte';
	import CampaignItems from '$dashboard/usecases/ListCampaigns/views/CampaignItems.svelte';
	import CampaignItemsMobile from '$dashboard/usecases/ListCampaigns/views/CampaignItemsMobile.svelte';
	import Card from '$lib/components/cards/Card.svelte';
	import { isOnMobile } from '$lib/utils/svelte.utils';
	import { DashboardVM } from './DashboardVM.svelte';

	const vm = new DashboardVM($page, $page.data.fetchCampaigns, $page.data.anonymousSession);
	const navbarTailwindHeight = 20 + 4 * 2;
	const navbarHeight = `${navbarTailwindHeight / 4}rem`;
	let displayMobile = $state(isOnMobile());
</script>

<main class="flex flex-col gap-4 px-4" style="height: calc(100svh - {navbarHeight});">
	{#if displayMobile}
		<CampaignItemsMobile
			fetchCampaigns={vm.fetchCampaigns}
			onItemSelected={vm.onCampaignSelected}
			selectedCampaignName={vm.selectedCampaign?.name ?? ''}
		/>
	{:else}
		<CampaignItems
			fetchCampaigns={vm.fetchCampaigns}
			onItemSelected={vm.onCampaignSelected}
			selectedCampaignName={vm.selectedCampaign?.name ?? ''}
		/>
	{/if}
	<section class="grid md:gap-4 grid-cols-1 md:grid-cols-[6fr_2fr] flex-1">
		<div class="flex flex-col gap-4 pb-4">
			<Card class="flex flex-col px-4 py-2 flex-[3] [&>div]:h-full">
				<h1 class="text-2xl font-black font-dm-sans">Quests</h1>
				{#if vm.loadQuests}
					<QuestTree
						campaignSlug={vm.selectedCampaign?.slug ?? ''}
						loadQuests={vm.loadQuests}
						itemSize="32"
					/>
				{/if}
			</Card>
			<Card class="px-4 py-2 flex-[2] flex-col md:flex hidden">
				<h1 class="text-2xl font-black font-dm-sans">Last Achievements</h1>
				<p class="flex flex-1 justify-center items-center font-space-mono">Coming soon !</p>
			</Card>
		</div>
		<div class="flex flex-col gap-4 pb-4">
			<Card class="flex flex-col gap-4 px-4 py-2">
				<h1 class="text-2xl font-black font-dm-sans">Quick Actions</h1>
				{#if vm.quickActionsTree}
					<QuickActions
						fetchTree={vm.quickActionsTree}
						campaignSlug={vm.selectedCampaign?.slug ?? ''}
					/>
				{/if}
			</Card>
			<Card class="hidden flex-col flex-1 px-4 py-2 md:flex">
				<h1 class="text-2xl font-black font-dm-sans">Campaign Leaderboard</h1>
				<p class="flex flex-1 justify-center items-center font-space-mono">Coming soon !</p>
			</Card>
		</div>
	</section>
</main>
