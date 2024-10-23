import type { IUserRepository } from '$auth/interfaces/IUserRepository';
import type { GiteaUser } from '$auth/entities/GiteaUser';
import { PUBLIC_GITEA_URL } from '$env/static/public';

type _GiteaUserRepository = Pick<IUserRepository, "getGiteaUserWithAccessToken">;

export const GiteaUserRepository = (): _GiteaUserRepository => {
	return {
		getGiteaUserWithAccessToken: async (accessToken: string) => {
			const response = await fetch(`${PUBLIC_GITEA_URL}/api/v1/user`, {
				headers: { Authorization: `token ${accessToken}` }
			});
			return (await response.json()) as Promise<GiteaUser>;
		}
	}
}
