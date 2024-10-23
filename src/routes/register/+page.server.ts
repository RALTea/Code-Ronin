import type { Actions } from './$types';
import { trpc } from '$lib/clients/trpc';
import { redirect } from '@sveltejs/kit';
import { TRPCClientError } from '@trpc/client';

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData();
		const data = Object.fromEntries([...form.entries()]) as {
			email: string;
			password: string;
			username: string;
		};

		try {
			const url = await trpc(event).authRouter.register.query(data);
			return redirect(303, url);
		} catch (e) {
			if (e instanceof TRPCClientError) {
				return { message: e.message };
			}
			return { message: 'An error occured' };
		}
	}
};
