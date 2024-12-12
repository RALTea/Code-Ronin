import { createContext } from '$lib/trpc/context';
import { createCaller } from '$lib/trpc/router';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const trpc = createCaller(await createContext(event));
	try {
		await trpc.auth.amIAdmin();
	} catch {
		const params = new URLSearchParams({
			notif: 'You have to be an administrator to access this section',
			notifType: 'ERROR'
		});
		redirect(303, `/?${params.toString()}`);
	}
	const questDataUCResult = await trpc.admin.getQuestData.load({
		questId: event.params.questid
	});
	if (!questDataUCResult.isSuccess) {
		return error(questDataUCResult.status, questDataUCResult.message);
	}
	return {
		questData: questDataUCResult.data
	};
};
