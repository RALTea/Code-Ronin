<script lang="ts">
	import Card from "$lib/components/cards/Card.svelte";
	import Navbar from "$lib/components/layout/Navbar.svelte";
	import { GetQuestsPathUseCase } from "../../modules/dashboard/usecases/GetQuestsPath/GetQuestsPath";
	import QuestTree from "../../modules/dashboard/usecases/GetQuestsPath/views/QuestTree.svelte";

  const loadQuests = $state(GetQuestsPathUseCase({
    listCampaignQuests: async () => [
      {id: "1", name: 'Quest 1', nextTaskIds: ['2'], previousTaskIds: []},
      {id: "2", name: 'Quest 2', nextTaskIds: ['3', '4'], previousTaskIds: ['1']},
      {id: "3", name: 'Quest 3', nextTaskIds: ['5', '6'], previousTaskIds: ['2']},
      {id: "4", name: 'Quest 4', nextTaskIds: ['7', '8'], previousTaskIds: ['2']},
      {id: "5", name: 'Quest 5', nextTaskIds: [], previousTaskIds: ['3']},
      {id: "6", name: 'Quest 6', nextTaskIds: [], previousTaskIds: ['3']},
      {id: "7", name: 'Quest 7', nextTaskIds: [], previousTaskIds: ['4']},
      {id: "8", name: 'Quest 8', nextTaskIds: [], previousTaskIds: ['4']},
    ],
  }).execute({ campaignName: "demo"}).then((res) => {
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
  <Card>
    <QuestTree {loadQuests} itemSize="32" />
  </Card>
</main>