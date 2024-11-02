import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, request }) => {
	const destination = new URL(request.url).pathname
	if (!locals.user && destination !== '/login') {
		console.debug('Unauthenticated user redirect')
		return redirect(303, '/login')
	}
	return { user: locals.user };
};
