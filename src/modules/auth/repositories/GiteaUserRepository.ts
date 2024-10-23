import type { IUserRepositoryGetByAccessToken } from '$auth/interfaces/IUserRepository'
import { env } from '$env/dynamic/private';
import type { GiteaUser } from '$auth/entities/GiteaUser';

export const GiteaUserRepository = (): IUserRepositoryGetByAccessToken => {
	const { GITEA_URL } = env;
	return {
		getGiteaUserWithAccessToken: async (accessToken: string) => {
			const response = await fetch(`${GITEA_URL}/api/v1/user`, {
				headers: { Authorization: `token ${accessToken}` }
			});
			return (await response.json()) as Promise<GiteaUser>;
		}
	}
}
