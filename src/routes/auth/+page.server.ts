import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { base64ToCode } from '$lib/utils/b64.utils';

export const load: PageServerLoad = ({ locals }) => {
	return {
		user: locals.user
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const { ADMIN_GITEA_TOKEN } = env;
		const form = await request.formData();

		const filename = form.get('filename') as string;
		const username = locals.user.username;

		const url = `http://34.163.181.139:2377/api/v1/repos/${username}/challenge-js/contents/${filename}`;
		const response = await fetch(url, {
			headers: { Authorization: `token ${ADMIN_GITEA_TOKEN}` }
		});

		const data = await response.json();

		const code = base64ToCode(data.content);

		const res = await fetch(`http://localhost:3000`, {
			method: 'POST',
			body: JSON.stringify({ code })
		});

		const coderes = await res.json();
		console.log(coderes);

		return { success: true, codeOutput: coderes };
	}
};
