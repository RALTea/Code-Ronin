import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { COOKEYS } from '$lib/utils/cookies.utils';
import { CheckBodyMiddleware } from '$lib/services/ZodBodyParser';
import { type LoginDto, loginDto } from '$auth/dto/LoginDto';
import { LoginUseCase } from '$auth/usecases/AuthenticateUser';
import { GiteaUserRepository } from '$auth/repositories/GiteaUserRepository';
import { giteaOauthClient } from '$lib/clients/gitea';
import { JWTAuthTokenProvider } from '$auth/services/JWTAuthTokenProvider';
import { SQLiteUserRepository } from '$auth/repositories/SQLiteUserRepository';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const queryParams = new URLSearchParams(url.search);
	const params = Object.fromEntries([...queryParams.entries()]);

	const checkBodyMiddleware = await CheckBodyMiddleware<LoginDto>(params, loginDto);
	if (!checkBodyMiddleware.isSuccess) {
		return json(
			{
				message: checkBodyMiddleware.message,
				status: checkBodyMiddleware.status,
				data: null
			},
			{ status: checkBodyMiddleware.status }
		);
	}

	const giteaLoginUseCase = await LoginUseCase({
		data: checkBodyMiddleware.data,
		dependencies: {
			userRepository: {
				createUser: SQLiteUserRepository().createUser,
				getApprenticeByGiteaId: SQLiteUserRepository().getApprenticeByGiteaId,
				getGiteaUserWithAccessToken: GiteaUserRepository().getGiteaUserWithAccessToken
			},
			tokenProvider: JWTAuthTokenProvider(),
			authProvider: giteaOauthClient
		}
	}).execute();

	if (!giteaLoginUseCase.isSuccess) {
		return json(
			{
				message: giteaLoginUseCase.message,
				status: giteaLoginUseCase.status,
				data: null
			},
			{ status: giteaLoginUseCase.status }
		);
	}

	cookies.set(COOKEYS.JWT_TOKEN, giteaLoginUseCase.data, { path: '/' });
	return redirect(303, '/');
};
