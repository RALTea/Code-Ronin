import type { IUserRepository } from '$auth/interfaces/IUserRepository';
import { PUBLIC_GITEA_URL } from '$env/static/public';
import { giteaOauthClient } from '$lib/clients/gitea';
import { GITEA_CLIENT_SECRET } from '$env/static/private';

type _GiteaUserRepository = Pick<IUserRepository, 'getGiteaUserWithAccessToken' | 'getUser'>;

export const GiteaUserRepository = (): _GiteaUserRepository => {
	return {
		getUser: async (identifier) => {
			const { access_token } = await giteaOauthClient.validateAuthorizationCode(identifier ?? '', {
				credentials: GITEA_CLIENT_SECRET,
				authenticateWith: 'request_body'
			});
			const giteaUserRepository = GiteaUserRepository();

			return giteaUserRepository.getGiteaUserWithAccessToken(access_token);
		},
		getGiteaUserWithAccessToken: async (accessToken: string) => {
			const response = await fetch(`${PUBLIC_GITEA_URL}/api/v1/user`, {
				headers: { Authorization: `token ${accessToken}` }
			});

			const data = await response.json();
			return {
				giteaUserId: data.id,
				username: data.login,
				email: data.email,
				profilePicture: data.avatar_url,
				role: 'USER'
			};
		}
	};
};
