import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import type { CreateNotificationDto } from '../SendNotification/aggregates/CreateNotificationDto';
import { ParsingError } from './errors/ParsingError';
import * as INotificationParser from './services/INotificationParser';

type Input<T> = InputFactory<{ rawData: T }, { parser: INotificationParser.ParseRawData<T> }>;

type Output = OutputFactory<{
	notifications: CreateNotificationDto[];
}>;

export const ExtractNotificationsUseCase =
	<T>(): UseCase<Input<T>, Output> =>
	(deps) => {
		const { parser } = deps;
		return {
			execute: async (input) => {
				const { rawData } = input;
				try {
					const data = parser(rawData);
					return UseCaseResponseBuilder.success(200, {
						notifications: data
					});
				} catch (e) {
					if (e instanceof ParsingError) return UseCaseResponseBuilder.error(400, e.message);
					return UseCaseResponseBuilder.error(500, 'Failed to parse notifications');
				}
			}
		};
	};