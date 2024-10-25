import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = ({ url, locals }) => {
	if (locals.user) throw redirect(303, '/');
	return { title: url.pathname.slice(1) };
};