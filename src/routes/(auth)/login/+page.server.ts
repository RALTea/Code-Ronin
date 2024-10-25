import type { PageServerLoad } from './$types';
import OAuth2CreateAuthorizationURLService from '$auth/services/OAuth2CreateAuthorizationURL';

export const load: PageServerLoad = async ({ locals }) => {
	const giteaAuthorizationURL = await OAuth2CreateAuthorizationURLService.createGiteaAuthorizationURL();
	return {
		url: giteaAuthorizationURL.toString(),
		user: locals.user
	};
};