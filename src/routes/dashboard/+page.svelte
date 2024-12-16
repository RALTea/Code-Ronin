<script lang="ts">
	import { trpc } from "$lib/clients/trpc";
	import Card from "$lib/components/cards/Card.svelte";
	import Navbar from "$lib/components/layout/Navbar.svelte";
	import { GetQuestsPathUseCase } from "$dashboard/usecases/GetQuestsPath/GetQuestsPath";
	import QuestTree from "$dashboard/usecases/GetQuestsPath/views/QuestTree.svelte";
  import { page } from "$app/stores";

  const loadQuests = $state(GetQuestsPathUseCase({
    listCampaignQuests: () => trpc($page).dashboard.getQuestsPath.listQuestsFromCampaign.query({ campaignName: "Awakening" }).catch((e) => {
      // console.error("listQuestsFromCampaign", e);
      return [];
    }),
    listCompletedQuestsForCampaign: () => trpc($page).dashboard.getQuestsPath.listCompletedQuestsForCampaign.query({ campaignName: "Awakening" }).catch(e => {
      // console.error("listCompletedQuestsForCampaign", e);
      return [];
    }), 
    // listCampaignQuests: async () => [
    //   {id: "1", name: 'Quest 1', nextQuestIds: ['2'], previousQuestIds: []},
    //   {id: "2", name: 'Quest 2', nextQuestIds: ['3', '4'], previousQuestIds: ['1']},
    //   {id: "3", name: 'Quest 3', nextQuestIds: ['5', '6'], previousQuestIds: ['2']},
    //   {id: "4", name: 'Quest 4', nextQuestIds: ['7', '8'], previousQuestIds: ['2']},
    //   {id: "5", name: 'Quest 5', nextQuestIds: [], previousQuestIds: ['3']},
    //   {id: "6", name: 'Quest 6', nextQuestIds: [], previousQuestIds: ['3']},
    //   {id: "7", name: 'Quest 7', nextQuestIds: [], previousQuestIds: ['4']},
    //   {id: "8", name: 'Quest 8', nextQuestIds: [], previousQuestIds: ['4']},
    // ],
    // listCompletedQuestsForCampaign: async () => [
    //   {id: "1", name: 'Quest 1', nextQuestIds: ['2'], previousQuestIds: []},
    //   {id: "2", name: 'Quest 2', nextQuestIds: ['3', '4'], previousQuestIds: ['1']},
    // ],
  }).execute({ campaignName: "demo", userId: "-1"}).then((res) => {
    if (res.isSuccess) {
      console.debug("loadQuests", res.data);
      return res.data
    };
    return [];
  }));

</script>

<Navbar />
<main class="px-4">
  <h1>My dashboard</h1>
  <Card class="flex justify-center flex-col px-4 py-2">
    <h1 class="font-dm-sans font-black text-2xl">Quests</h1>
    <QuestTree {loadQuests} itemSize="32" />
  </Card>
</main>