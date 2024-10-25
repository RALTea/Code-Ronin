import { ADMIN_GITEA_TOKEN } from '$env/static/private';
import type { InputFactory, OutputFactory, UseCase } from '$lib/interfaces/UseCase';
import type { IAuthProvider } from '$auth/interfaces/IAuthProvider';
import { PUBLIC_GITEA_URL } from '$env/static/public';
import type { RegisterDto } from '$auth/dto/RegisterDto';
import type { IUserRepositoryGetByEmail } from '$auth/interfaces/IUserRepository';

type Input = InputFactory<
	RegisterDto,
	{
		userRepository: IUserRepositoryGetByEmail;
		authProvider: IAuthProvider;
	}
>;

type Output = OutputFactory<URL>;

export const RegisterUseCase: UseCase<Input, Output> = (dependencies) => {
	const { authProvider, userRepository } = dependencies;
	return {
		execute: async (data) => {
			try {
				const user = await userRepository.getApprenticeByGiteaEmail(data.email);
				if (user) {
					return {
						isSuccess: false,
						status: 400,
						message: 'You cannot login with this email.'
					};
				}

				await fetch(`${PUBLIC_GITEA_URL}/api/v1/admin/users`, {
					method: 'POST',
					headers: {
						Authorization: `token ${ADMIN_GITEA_TOKEN}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						...data,
						must_change_password: false,
						send_notify: false
					})
				});

				const url = await authProvider.createAuthorizationURL({
					scopes: ['read:user']
				});

				return {
					isSuccess: true,
					status: 200,
					data: url
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
