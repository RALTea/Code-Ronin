import type { User } from '$auth/entities/User';
import { UseCaseResponseBuilder, type InputFactory, type OutputFactory, type UseCase } from '$lib/interfaces/UseCase';
import * as IGetSelfDataRepository from './repositories/IGetSelfDataRepository';

type Input = InputFactory<{
	userIdentifier: string;
}, {
	getSelfData: IGetSelfDataRepository.GetSelfData;
}>;
type Output = OutputFactory<User>;

export const GetSelfDataUseCase: UseCase<Input, Output> = (deps) => {
	const { getSelfData } = deps;
	return {
		execute: async (data) => {
			const { userIdentifier } = data;
			const user = await getSelfData(userIdentifier);
			return UseCaseResponseBuilder.success(200, user);
		},
	};
}