import type { Apprentice } from '$auth/entities/Apprentice';
import { env } from '$env/dynamic/private';
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { COOKEYS } from '$lib/utils/cookies.utils';
import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import jwt from 'jsonwebtoken';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handleCookies: Handle = ({ event, resolve }) => {
	const jwtToken = event.cookies.get(COOKEYS.JWT_TOKEN);

	try {
		const payload = jwt.verify(jwtToken ?? '', env.JWT_SECRET ?? '') as unknown as Apprentice;
		event.locals.user = payload;
	} catch {
		event.locals.user = null;
	}

	return resolve(event);
};

// export const debugRoute: Handle = ({ event, resolve }) => {
// 	console.debug('Server hook: ', event.url.pathname);
// 	return resolve(event);
// };

// Sveltekit hook
export const handle: Handle = sequence(
	// debugRoute,
	handleCookies,
	createTRPCHandle({
		router,
		createContext,
		onError: ({ error: trpcError, type, path }) => {
			const httpCode = getHTTPStatusCodeFromError(trpcError);
			const trpcCode = trpcError.code;
			console.error(`[${httpCode} | ${trpcCode}] - TRPC - ${type}@${path}`);
		}
	})
);

// Sveltekit hook
// export const handleError: HandleServerError = async ({ error }) => {

// };
