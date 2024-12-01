import { createContext } from '$lib/trpc/context';
import { createCaller } from '$lib/trpc/router';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const questDataUCResult = await createCaller(await createContext(event)).learning.getQuestData.load({
		questId: event.params.questid
	});
	if (!questDataUCResult.isSuccess) {
		return error(questDataUCResult.status, questDataUCResult.message);
	}
	return {
		questData: questDataUCResult.data
	}
};