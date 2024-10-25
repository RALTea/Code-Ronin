import { type Action, type Actions, redirect, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registerDto } from '$auth/dto/RegisterDto';
import { TRPCClientError } from '@trpc/client';
import { trpc } from '$lib/clients/trpc';

export const load = async () => {
	const form = await superValidate(zod(registerDto));

	return { form };
};

const register: Action = async (event) => {
	const form = await superValidate(event, zod(registerDto));

	if (!form.valid) {
		return fail(400, { form });
	}

	let url;
	try {
		url = await trpc(event).authRouter.register.query(form.data);
	} catch (e) {
		console.log(e);
		if (e instanceof TRPCClientError) {
			return fail(400, { message: e.message });
		}
		return fail(400, { message: 'Something bad happen. Please retry later.' });
	}
	return redirect(303, url);
};

export const actions: Actions = { register };
