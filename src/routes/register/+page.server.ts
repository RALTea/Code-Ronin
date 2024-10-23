import type { Actions } from './$types';
import { trpc } from '$lib/clients/trpc';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData();
		const data = Object.fromEntries([...form.entries()]) as {
			email: string;
			password: string;
			username: string;
		};

		const url = await trpc(event).authRouter.register.query(data);
		throw redirect(303, url);
	}
};
