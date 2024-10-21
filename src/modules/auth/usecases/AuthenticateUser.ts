import type { GiteaLoginDto } from '$auth/dto/GiteaLoginDto';
import type { UseCaseResponse } from '$lib/interfaces/UseCase';
import { giteaOauthClient } from '$lib/clients/gitea';
import { env } from '$env/dynamic/private';
import type { IUserRepository } from '$auth/interfaces/IUserRepository';
import { JWTAuthTokenProvider } from '$auth/services/JWTAuthTokenProvider';
import { GiteaUserRepository } from '$auth/repositories/GiteaUserRepository';

type RegisterUseCaseOutput = string;

export const AuthenticateUser = async (
	body: GiteaLoginDto,
	repository: IUserRepository
): Promise<UseCaseResponse<RegisterUseCaseOutput>> => {
	try {
		const { GITEA_CLIENT_SECRET } = env;
		const { access_token } = await giteaOauthClient.validateAuthorizationCode(body, {
			credentials: GITEA_CLIENT_SECRET ?? 'NoGiteaSecret',
			authenticateWith: 'request_body'
		});

		const giteaUserRepository = GiteaUserRepository();
		const user = await giteaUserRepository.getUserById(access_token);
		if (!user) {
			return {
				isSuccess: false,
				status: 500,
				message: 'User not found !'
			}
		}
		await repository.addUser(user);
		const jwtTokenProvider = JWTAuthTokenProvider();
		const token = jwtTokenProvider.generateToken(user);

		return {
			isSuccess: true,
			status: 500,
			data: token
		};
	} catch (error) {
		console.log(error);
		return {
			isSuccess: false,
			status: 500,
			message: 'Something went wrong !'
		};
	}
};
