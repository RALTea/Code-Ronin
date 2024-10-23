import type { Actions, PageServerLoad } from './$types';
import { ADMIN_GITEA_TOKEN } from '$env/static/private';
import { base64ToCode } from '$lib/utils/b64.utils';
import OAuth2CreateAuthorizationURLService from '$auth/services/OAuth2CreateAuthorizationURL';
import { PUBLIC_GITEA_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ locals }) => {
	const giteaAuthorizationURL = await OAuth2CreateAuthorizationURLService.createGiteaAuthorizationURL();
	return {
		url: giteaAuthorizationURL.toString(),
		user: locals.user
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const form = await request.formData();

		const filename = form.get('filename') as string;
		const username = locals.user.username;

		const url = `${PUBLIC_GITEA_URL}/api/v1/repos/${username}/challenge-js/contents/${filename}`;
		const response = await fetch(url, {
			headers: { Authorization: `token ${ADMIN_GITEA_TOKEN}` }
		});

		const data = await response.json();

		const code = base64ToCode(data.content);

		const res = await fetch(`/api/run-code`, {
			method: 'POST',
			body: JSON.stringify({ code })
		});

		const coderes = await res.json();
		console.log(coderes);

		return { success: true, codeOutput: coderes };
	}
};
