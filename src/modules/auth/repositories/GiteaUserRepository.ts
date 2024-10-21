import type { User } from '$auth/entities/User';
import type { IUserRepositoryGetById } from '$auth/interfaces/IUserRepository'
import { env } from '$env/dynamic/private';

export const GiteaUserRepository = (): IUserRepositoryGetById => {
	const { GITEA_URL } = env;
	return {
		getUserById: async (accessToken: string) => {
			const response = await fetch(`${GITEA_URL}/api/v1/user`, {
				headers: { Authorization: `token ${accessToken}` }
			});
			return (await response.json()) as Promise<User>;
		}
	}
}
