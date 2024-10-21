import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { COOKEYS } from '$lib/utils/cookies.utils';
import { CheckBodyMiddleware } from '$lib/services/ZodBodyParser';
import { GiteaLoginDtoSchema } from '$auth/dto/GiteaLoginDto';
import { AuthenticateUser } from '$auth/usecases/AuthenticateUser';
import { InMemoryUserRepository } from '$auth/repositories/InMemoryUserRepository';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const queryParams = new URLSearchParams(url.search);
	const code = queryParams.get('code');

	const checkBodyMiddleware = await CheckBodyMiddleware<string>(code, GiteaLoginDtoSchema);
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

	const giteaLoginUseCase = await AuthenticateUser(
		checkBodyMiddleware.data,
		InMemoryUserRepository()
	);
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
