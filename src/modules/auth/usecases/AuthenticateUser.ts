import type { LoginDto } from '$auth/dto/LoginDto';
import type { IUserRepository } from '$auth/interfaces/IUserRepository';
import { JWTAuthTokenProvider } from '$auth/services/JWTAuthTokenProvider';
import { GITEA_CLIENT_SECRET } from '$env/static/private';
import type { InputFactory, UseCase, UseCaseResponse } from '$lib/interfaces/UseCase';
import type { IAuthProvider } from '$auth/interfaces/IAuthProvider';

type Input = InputFactory<
	LoginDto,
	{
		authProvider: IAuthProvider;
		// TODO: Check this changes
		userRepository: IUserRepository;
	}
>;
// TODO: en utilisant la output factory, on se retrouve avec Promise<Promise<Result>>
type Output = UseCaseResponse<string>;

export const LoginUseCase: UseCase<Input, Output> = ({ dependencies, data }: Input) => {
	const { authProvider, userRepository } = dependencies;

	return {
		execute: async () => {
			const { access_token } = await authProvider.validateAuthorizationCode(data, {
				credentials: GITEA_CLIENT_SECRET,
				authenticateWith: 'request_body'
			});

			const user = await userRepository.getUserById(access_token);
			if (!user) {
				return {
					isSuccess: false,
					status: 401,
					message: 'User not found'
				};
			}
			await userRepository.createUser(user);
			// TODO: Inject as dependency
			const token = JWTAuthTokenProvider().generateToken(user);

			return {
				isSuccess: true,
				status: 200,
				data: token
			};
		}
	};
};
