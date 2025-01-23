import { isExpired } from '$lib/auth/expiration';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ url, locals }) => {
	const session = await locals.auth();
	console.debug("redirect to / from /auth")
	if (locals.user) throw redirect(303, '/dashboard');
	if (session?.user && !isExpired(session.expires)) throw redirect(303, '/dashboard');
	return { title: url.pathname.slice(1) };
};
