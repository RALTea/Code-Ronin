import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import type { Notification } from '../../entities/Notification';
import * as NotificationStack from '../../stores/NotificationStack.svelte';

type Input = InputFactory<
	{ notification: Notification },
	{ removeNotification: NotificationStack.RemoveFromStack }
>;

type Output = OutputFactory<void>;

export const CloseNotificationUseCase: UseCase<Input, Output> = (deps) => {
	const { removeNotification } = deps;
	return {
		async execute(data) {
			const { notification } = data;
			removeNotification(notification);

			return UseCaseResponseBuilder.success(200, void 0);
		}
	};
};
