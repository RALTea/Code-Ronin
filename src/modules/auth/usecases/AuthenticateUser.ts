import type {
	IUserRepositoryCreateUser,
	IUserRepositoryGetByEmail,
	IUserRepositoryGetUser
} from '$auth/interfaces/IUserRepository';
import type { InputFactory, OutputFactory, UseCase } from '$lib/interfaces/UseCase';
import type { IAuthTokenProvider } from '$auth/interfaces/IAuthTokenProvider';
import type { LoginDto } from '$auth/dto/LoginDto';

type Input = InputFactory<
	LoginDto,
	{
		tokenProvider: IAuthTokenProvider;
		userRepository: IUserRepositoryCreateUser & IUserRepositoryGetByEmail;
		getUser: IUserRepositoryGetUser['getUser'];
	}
>;

type Output = OutputFactory<string>;

export const LoginUseCase: UseCase<Input, Output> = (dependencies) => {
	const { userRepository, tokenProvider, getUser } = dependencies;
	return {
		execute: async (data) => {
			try {
				const user = await getUser(data.code);
				const userInDb = await userRepository.getApprenticeByGiteaEmail(user.email);

				if (userInDb) {
					const token = tokenProvider.generateToken(userInDb);
					return {
						isSuccess: true,
						status: 200,
						data: token
					};
				}

				const createdUser = await userRepository.createUser(user);
				const token = tokenProvider.generateToken(createdUser);

				return {
					isSuccess: true,
					status: 200,
					data: token
				};
			} catch (error) {
				console.log('Error :', error);
				return {
					isSuccess: false,
					status: 400,
					message: "Quelque chose c'est mal passé veuillez réessayer plus tard."
				};
			}
		}
	};
};
