import { giteaOauthClient } from '$lib/clients/gitea';

const createGiteaAuthorizationURL = () => {
	return giteaOauthClient.createAuthorizationURL({
		scopes: ['read:user']
	});
};

export default {
	createGiteaAuthorizationURL
};
