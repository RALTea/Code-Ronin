import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { createCaller } from '$lib/trpc/router';
import { createContext } from '$lib/trpc/context';

const unauthenticatedPaths = ['/login', '/'];
const unauthenticatedWildCards = ['/campaigns/demo'];

const isProtected = (path: string) => {
	if (unauthenticatedPaths.includes(path)) return false;
	for (const unauthenticatedPath of unauthenticatedWildCards) {
		if (path.startsWith(unauthenticatedPath)) return false;
	}
	return true;
};

export const load: LayoutServerLoad = async (event) => {
	const { locals, request } = event;
	const destination = new URL(request.url).pathname
	try {
		const session = await locals.auth();
		const me = await createCaller(await createContext(event)).auth.me();
		console.debug('Current user session', session?.user?.name)
		if ((!session?.user && !locals.user) && isProtected(destination)) {
			console.debug('Unauthenticated user redirect (both)')
			return redirect(303, '/login')
		}
		return { user: me, session };
	} catch {
		if (isProtected(destination)) {
			console.debug('Unauthenticated user redirect')
			return redirect(303, '/login')
		}
		return { user: null, session: null };
	}
};
