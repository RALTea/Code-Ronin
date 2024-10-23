import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { trpc } from '$lib/clients/trpc';

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData();
		const data = Object.fromEntries([...form.entries()]) as {
			email: string;
			password: string;
			username: string;
		};

		const test = await trpc(event).authRouter.register.query(data);
		console.log(test);
		throw redirect(303, test.toString());
	}
};
