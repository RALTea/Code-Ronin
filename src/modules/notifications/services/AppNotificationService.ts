import { NotificationStack } from '$notifications/stores/NotificationStack.svelte';
import type { CreateNotificationDto } from '$notifications/usecases/SendNotification/aggregates/CreateNotificationDto';
import { SendNotificationUseCase } from '$notifications/usecases/SendNotification/SendNotification';

export const AppNotificationService = {
	send: (notif: CreateNotificationDto) => {
		SendNotificationUseCase({
			addToStack: NotificationStack.addToStack
		}).execute({
			dto: notif
		});
	}
};
