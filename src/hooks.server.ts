import { handle as AuthHandle } from '$lib/auth/auth';
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { createTRPCHandle } from 'trpc-sveltekit';

// export const handleCookies: Handle = async ({ event, resolve }) => {
// 	const session = await event.locals.auth();
// 	if (!session?.user) return resolve(event);
// 	const user = await createCaller(await createContext(event)).auth.me();

// 	const jwtToken = event.cookies.get(COOKEYS.JWT_TOKEN);
// 	return resolve(event);
// };

export const debugRoute: Handle = ({ event, resolve }) => {
	console.debug('Server hook: ', event.url.pathname);
	return resolve(event);
};

// Sveltekit hook
export const handle: Handle = sequence(
	debugRoute,
	AuthHandle,
	// handleCookies,
	createTRPCHandle({
		router,
		createContext,
		onError: ({ error: trpcError, type, path }) => {
			const httpCode = getHTTPStatusCodeFromError(trpcError);
			const trpcCode = trpcError.code;
			console.error(`[${httpCode} | ${trpcCode}] - TRPC - ${type}@${path}`);
			// if (env.DEBUG === "1") {
			// 	console.error(trpcError);
			// }
		}
	})
);

// Sveltekit hook
// export const handleError: HandleServerError = async ({ error }) => {

// };
