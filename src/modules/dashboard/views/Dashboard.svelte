<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import QuestTree from '$dashboard/usecases/GetQuestsPath/views/QuestTree.svelte';
	import QuickActions from '$dashboard/usecases/GetQuickActions/views/QuickActions.svelte';
	import CampaignItems from '$dashboard/usecases/ListCampaigns/views/CampaignItems.svelte';
	import Card from '$lib/components/cards/Card.svelte';
	import { VERSION } from 'svelte/compiler';
	import { DashboardVM } from './DashboardVM.svelte';

	const vm = new DashboardVM($page, $page.data.fetchCampaigns, $page.data.anonymousSession);
	const navbarTailwindHeight = 20 + 4 * 2;
	const navbarHeight = `${navbarTailwindHeight / 4}rem`;
</script>

<main class="flex flex-col gap-4 px-4" style="height: calc(100svh - {navbarHeight});">
	<CampaignItems
		fetchCampaigns={vm.fetchCampaigns}
		onItemSelected={vm.onCampaignSelected}
		selectedCampaignName={vm.selectedCampaign?.name ?? ''}
	/>
	<section class="grid gap-4 grid-cols-[6fr_2fr] flex-1">
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
			<Card class="px-4 py-2 flex-[2] flex flex-col">
				<h1 class="text-2xl font-black font-dm-sans">Last Achievements</h1>
				<p class="font-space-mono flex-1 flex items-center justify-center">Coming soon !</p>
			</Card>
		</div>
		<div class="pb-4 flex flex-col gap-4">
			<Card class="px-4 py-2 flex flex-col gap-4">
				<h1 class="text-2xl font-black font-dm-sans">Quick Actions</h1>
				{#if vm.quickActionsTree}
					<QuickActions fetchTree={vm.quickActionsTree} campaignSlug={vm.selectedCampaign?.slug ?? ''} />
				{/if}
			</Card>
			<Card class="px-4 py-2 flex-1 flex flex-col">
				<h1 class="text-2xl font-black font-dm-sans">Campaign Leaderboard</h1>
				<p class="font-space-mono flex-1 flex items-center justify-center">Coming soon !</p>
			</Card>
		</div>
	</section>
</main>
