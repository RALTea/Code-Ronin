import { UserStore } from '$auth/stores/UserStore.svelte';
import type { ApprenticeProfileSummary } from '$learning/application/dtos/ApprenticeProfileSummary';
import { LastRun } from '$learning/usecases/runExercise/stores/LastRun.svelte';
import { trpc } from '$lib/clients/trpc';
import { NotificationStack } from '$notifications/stores/NotificationStack.svelte';
import { SendNotificationUseCase } from '$notifications/usecases/SendNotification/SendNotification';
import type { TRPCClientInit } from 'trpc-sveltekit';

export class NavbarVM {
	constructor(private readonly trpcClientInit: TRPCClientInit) {}
	medalsIndex = [0, 1, 2];
	emptyMedal = '/medals/Item=default.png';
	defaultApprenticeSummary: ApprenticeProfileSummary = {
		name: 'Anonymous',
		title: 'Developer',
		avatar: '/default-pfp.png',
		exp: 0
	};

	apprenticeId: string | undefined = $derived(UserStore.user?.id);
	apprenticeSummary: Promise<ApprenticeProfileSummary | undefined> = $derived.by(async () => {
		LastRun.time;
		UserStore.user;
		if (!this.apprenticeId) return this.defaultApprenticeSummary;
		return trpc(this.trpcClientInit)
			.learning.getApprenticeProfileSummary.getApprenticeInfos.query({
				apprenticeId: this.apprenticeId
			})
			.catch(() => {
				SendNotificationUseCase({
					addToStack: NotificationStack.addToStack
				}).execute({
					dto: {
						message: 'Failed to fetch apprentice summary',
						type: 'ERROR'
					}
				});
				return this.defaultApprenticeSummary;
			});
	});
}
