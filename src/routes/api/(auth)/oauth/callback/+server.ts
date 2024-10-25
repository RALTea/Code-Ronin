import { redirect, type RequestHandler } from '@sveltejs/kit';
import { COOKEYS } from '$lib/utils/cookies.utils';
import { CheckBodyMiddleware } from '$lib/services/ZodBodyParser';
import { type LoginDto, loginDto } from '$auth/dto/LoginDto';
import { LoginUseCase } from '$auth/usecases/AuthenticateUser';
import { GiteaUserRepository } from '$auth/repositories/GiteaUserRepository';
import { JWTAuthTokenProvider } from '$auth/services/JWTAuthTokenProvider';
import { SQLiteUserRepository } from '$auth/repositories/SQLiteUserRepository';
import { ApiResponse } from '$lib/utils/svelte.utils';
import { UseCaseResponseBuilder } from '$lib/interfaces/UseCase';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const queryParams = new URLSearchParams(url.search);
	if (queryParams.has('error')) {
		const useCaseError = UseCaseResponseBuilder.error(
			401,
			'You need to grant permission to code-ronin to access your gite account.'
		);
		return ApiResponse.send(useCaseError);
	}

	const params = Object.fromEntries([...queryParams.entries()]);

	const checkBodyMiddleware = await CheckBodyMiddleware<LoginDto>(params, loginDto);
	if (!checkBodyMiddleware.isSuccess) {
		return ApiResponse.send(checkBodyMiddleware);
	}

	const loginUseCase = await LoginUseCase({
		userRepository: SQLiteUserRepository(),
		tokenProvider: JWTAuthTokenProvider(),
		getUser: GiteaUserRepository().getUser
	}).execute(checkBodyMiddleware.data);

	if (!loginUseCase.isSuccess) {
		return ApiResponse.send(loginUseCase);
	}

	cookies.set(COOKEYS.JWT_TOKEN, loginUseCase.data, { path: '/' });
	return redirect(303, '/');
};
