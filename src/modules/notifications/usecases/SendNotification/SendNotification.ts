import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import type { CreateNotificationDto } from './aggregates/CreateNotificationDto';
// import * as IStackRepository from './repositories/IStackRepository';
import * as NotificationStack from '../../stores/NotificationStack.svelte';
import type { Notification } from '../../entities/Notification';

type Input = InputFactory<
	{
		dto: CreateNotificationDto;
	},
	{
		addToStack: NotificationStack.AddToStack;
	}
>;

type Output = OutputFactory<Notification[]>;

export const SendNotificationUseCase: UseCase<Input, Output> = (deps) => {
	const { addToStack } = deps;
	return {
		async execute(data) {
			const { dto } = data;
			const id = crypto.randomUUID();
			addToStack({ ...dto, id });

			return UseCaseResponseBuilder.success(200, []);
		}
	};
};
