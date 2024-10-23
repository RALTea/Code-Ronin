import type { LoginDto } from '$auth/dto/LoginDto';
import type { IUserRepository } from '$auth/interfaces/IUserRepository';
import { GITEA_CLIENT_SECRET } from '$env/static/private';
import type {
	InputFactory,
	OutputFactory,
	UseCase,
	UseCaseResponse
} from '$lib/interfaces/UseCase';
import type { IAuthProvider } from '$auth/interfaces/IAuthProvider';
import type { IAuthTokenProvider } from '$auth/interfaces/IAuthTokenProvider';

type Input = InputFactory<
	LoginDto,
	{
		authProvider: IAuthProvider;
		tokenProvider: IAuthTokenProvider;
		userRepository: IUserRepository;
	}
>;

type Output = OutputFactory<UseCaseResponse<string>>;

export const LoginUseCase: UseCase<Input, Output> = ({ dependencies, data }: Input) => {
	const { authProvider, userRepository, tokenProvider } = dependencies;
	return {
		execute: async () => {
			try {
				const { access_token } = await authProvider.validateAuthorizationCode(data.code, {
					credentials: GITEA_CLIENT_SECRET,
					authenticateWith: 'request_body',
				});

				const giteaUser = await userRepository.getGiteaUserWithAccessToken(access_token);

				const apprentice = await userRepository.getApprenticeByGiteaId(giteaUser.id);

				if (apprentice) {
					const token = tokenProvider.generateToken(apprentice);
					return {
						isSuccess: true,
						status: 200,
						data: token
					};
				}

				const createdUser = await userRepository.createUser({
					giteaUserId: giteaUser.id,
					username: giteaUser.login,
					email: giteaUser.email,
					profilePicture: giteaUser.avatar_url,
					role: "USER"
				});

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
