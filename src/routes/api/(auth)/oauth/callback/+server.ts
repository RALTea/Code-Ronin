import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { COOKEYS } from '$lib/utils/cookies.utils';
import { CheckBodyMiddleware } from '$lib/services/ZodBodyParser';
import { loginDto } from '$auth/dto/LoginDto';
import { InMemoryUserRepository } from '$auth/repositories/InMemoryUserRepository';
import { LoginUseCase } from '$auth/usecases/AuthenticateUser';
import { GiteaUserRepository } from '$auth/repositories/GiteaUserRepository';
import { giteaOauthClient } from '$lib/clients/gitea';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const queryParams = new URLSearchParams(url.search);
	const code = queryParams.get('code');

	const checkBodyMiddleware = await CheckBodyMiddleware<string>(code, loginDto);
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
				createUser: InMemoryUserRepository().createUser,
				getUserById: GiteaUserRepository().getUserById
			},
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
