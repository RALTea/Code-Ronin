import type { Apprentice } from '$auth/entities/Apprentice';
import { COOKEYS } from '$lib/utils/cookies.utils';
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';
import { env } from '$env/dynamic/private';

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

export const handle: Handle = sequence(
	handleCookies,
	createTRPCHandle({ router, createContext })
);