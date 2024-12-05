import type { Notification } from '../entities/Notification';

export type AddToStack = (notification: Notification) => void;
export type RemoveFromStack = (notification: Notification) => void;

type TestType = {
	addToStack: AddToStack;
	closeNotification: RemoveFromStack;
}

class NotificationStackStore implements TestType {
	notifications: Notification[] = $state([]);

	addToStack = (notification: Notification) => {
		this.notifications.push(notification);
	}
	closeNotification = (notification: Notification) => {
		this.notifications = this.notifications.filter((n) => n.id !== notification.id);
	}
	get stack() {
		return this.notifications;
	}
}

export const NotificationStack = new NotificationStackStore();