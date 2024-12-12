import { NotificationTypeSchema } from '$notifications/entities/NotificationType';
import type { CreateNotificationDto } from '$notifications/usecases/SendNotification/aggregates/CreateNotificationDto';

type _URLNotificationParser = {
	parse: (data: string | URL) => CreateNotificationDto[];
};

export const URLNotificationParser: _URLNotificationParser = {
	parse: (data) => {
		const url = typeof data === 'string' ? new URL(data) : data;
		const notificationContent = url.searchParams.get('notif');
		const notificationType = url.searchParams.get('notifType');
		console.debug('URLNotificationParser', notificationContent, notificationType, url);
		if (!notificationContent || !notificationType) return [];
		
		const notification: CreateNotificationDto = {
			message: notificationContent,
			type: NotificationTypeSchema.safeParse(notificationType).data ?? 'INFO'
		};

		return [notification];
	}
};
