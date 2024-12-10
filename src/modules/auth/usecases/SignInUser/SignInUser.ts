import type { CreateUserDto } from '$auth/dtos/CreateUserDto';
import { UseCaseResponseBuilder, type InputFactory, type OutputFactory, type UseCase } from '$lib/interfaces/UseCase';
import * as ISignInUserRepository from './repositories/ISignInUserRepository';

type Input = InputFactory<{
	dto: CreateUserDto;
}, {
	thirdPartySignInService?: ISignInUserRepository.ThridPartySignInService;
	createUserIfNotExists?: ISignInUserRepository.CreateUserIfNotExists;
}>;
type Output = OutputFactory<{
	created: boolean;
}>;

export const SignInUserUseCase: UseCase<Input, Output> = (deps) => {
	const { thirdPartySignInService, createUserIfNotExists } = deps;
	return {
		execute: async (data) => {
			const { dto } = data;
			await thirdPartySignInService?.();
			const aNewUserHasBeenCreated = await createUserIfNotExists?.(dto);
			return UseCaseResponseBuilder.success(200, {
				created: aNewUserHasBeenCreated ?? false
			})
		},
	};
}